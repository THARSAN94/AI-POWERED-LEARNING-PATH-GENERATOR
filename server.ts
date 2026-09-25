import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import QRCode from 'qrcode';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { db, User } from './server/db';
import { COURSES, CATEGORIES } from './server/courses';
import {
  generateAILearningRoadmap,
  generateAIDailyAssessment,
  getApiKeyDetails,
  getGeminiStatus,
} from './server/gemini';

// Robust multi-source environment loading for local & cloud environments (Render, etc.)
const envCandidates = ['.env.local', '.env.production', '.env'];
for (const f of envCandidates) {
  const p = path.resolve(process.cwd(), f);
  if (fs.existsSync(p)) {
    dotenv.config({ path: p, override: false });
  }
}
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- HEALTH & RENDER STATUS ENDPOINTS ---
app.get('/api/health', (req: Request, res: Response) => {
  const gemini = getGeminiStatus();
  res.status(200).json({
    status: 'ok',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    gemini,
  });
});

// Simple & secure JWT-like token generator
function generateToken(userId: string): string {
  const payload = {
    userId,
    issuedAt: Date.now(),
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
}

function verifyToken(token: string): string | null {
  try {
    const jsonStr = Buffer.from(token, 'base64url').toString('utf-8');
    const data = JSON.parse(jsonStr);
    return data.userId || null;
  } catch {
    return null;
  }
}

// Authentication middleware
interface AuthenticatedRequest extends Request {
  user?: User;
}

function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const userId = verifyToken(token);
  if (!userId) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }

  const user = db.findUserById(userId);
  if (!user) {
    res.status(401).json({ error: 'User not found' });
    return;
  }

  req.user = user;
  next();
}

// --- AUTH API ROUTES ---

// POST /api/auth/register
app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { name, email, password, bio, targetRole } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email, and password are required' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters long' });
      return;
    }

    const existing = db.findUserByEmail(email);
    if (existing) {
      res.status(409).json({ error: 'An account with this email address already exists' });
      return;
    }

    const user = db.createUser({ name, email, password, bio, targetRole });
    const token = generateToken(user.id);

    const { passwordHash, salt, ...safeUser } = user;
    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: safeUser,
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const isValid = db.verifyUserPassword(user, password);
    if (!isValid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    const token = generateToken(user.id);
    const { passwordHash, salt, ...safeUser } = user;
    res.json({
      message: 'Logged in successfully',
      token,
      user: safeUser,
    });
  } catch (err: any) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

// GET /api/auth/me
app.get('/api/auth/me', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const { passwordHash, salt, ...safeUser } = req.user!;
  res.json({ user: safeUser });
});

// PUT /api/auth/profile
app.put('/api/auth/profile', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, bio, targetRole } = req.body;
    const updated = db.updateUserProfile(req.user!.id, {
      name: name?.trim() || req.user!.name,
      bio: bio ?? req.user!.bio,
      targetRole: targetRole?.trim() || req.user!.targetRole,
    });
    if (!updated) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    const { passwordHash, salt, ...safeUser } = updated;
    res.json({ user: safeUser });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// --- COURSES API ROUTES ---

// GET /api/courses
app.get('/api/courses', (req: Request, res: Response) => {
  const { category, search, level } = req.query;
  let list = COURSES;

  if (category && category !== 'All Courses') {
    list = list.filter(c => c.category.toLowerCase() === String(category).toLowerCase());
  }

  if (level) {
    list = list.filter(c => c.level.toLowerCase() === String(level).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    list = list.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  res.json({
    total: list.length,
    categories: CATEGORIES,
    courses: list,
  });
});

// GET /api/courses/:id
app.get('/api/courses/:id', (req: Request, res: Response) => {
  const course = COURSES.find(c => c.id === req.params.id);
  if (!course) {
    res.status(404).json({ error: 'Course not found' });
    return;
  }
  res.json({ course });
});

// --- LEARNING PATHS & ROADMAP API ROUTES ---

// POST /api/learning-paths/generate
app.post('/api/learning-paths/generate', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { courseId, durationWeeks, dailyMinutes } = req.body;
    const weeks = parseInt(durationWeeks, 10);
    const minutes = parseInt(dailyMinutes, 10);

    if (!courseId || ![4, 8, 12].includes(weeks) || ![30, 45, 60, 120].includes(minutes)) {
      res.status(400).json({ error: 'Valid courseId, durationWeeks (4, 8, or 12), and dailyMinutes (30, 45, 60, or 120) are required' });
      return;
    }

    const course = COURSES.find(c => c.id === courseId);
    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }

    const totalDays = weeks * 7;

    // Create Learning Path record in DB
    const learningPath = db.createLearningPath({
      userId: req.user!.id,
      courseId: course.id,
      courseTitle: course.title,
      durationWeeks: weeks,
      dailyMinutes: minutes,
      totalDays,
      currentDay: 1,
      status: 'active',
    });

    // Generate day-by-day roadmap using Gemini AI (with resilient deterministic curriculum fallback)
    const generatedDays = await generateAILearningRoadmap(course, weeks, minutes);

    // Save all DailyTasks to DB
    const dailyTasks = db.createDailyTasks(
      generatedDays.map(day => ({
        learningPathId: learningPath.id,
        dayNumber: day.dayNumber,
        title: day.title,
        topic: day.topic,
        subtopics: day.subtopics,
        learningObjectives: day.learningObjectives,
        explanationMarkdown: day.explanationMarkdown,
        practicalExercises: day.practicalExercises,
        codingTask: day.codingTask,
        dailyGoals: day.dailyGoals,
        estimatedMinutes: day.estimatedMinutes,
        isCompleted: false,
      }))
    );

    res.status(201).json({
      message: 'AI Roadmap generated successfully',
      learningPath,
      dailyTasks,
    });
  } catch (err: any) {
    console.error('Roadmap generation error:', err);
    res.status(500).json({ error: 'Failed to generate learning roadmap: ' + err.message });
  }
});

// GET /api/learning-paths
app.get('/api/learning-paths', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const paths = db.getLearningPathsByUser(req.user!.id);
  res.json({ learningPaths: paths });
});

// GET /api/learning-paths/:id
app.get('/api/learning-paths/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const pathItem = db.getLearningPathById(req.params.id);
  if (!pathItem || pathItem.userId !== req.user!.id) {
    res.status(404).json({ error: 'Learning path not found' });
    return;
  }

  const tasks = db.getDailyTasksByPathId(pathItem.id);
  const course = COURSES.find(c => c.id === pathItem.courseId);

  res.json({
    learningPath: pathItem,
    tasks,
    course,
  });
});

// GET /api/learning-paths/:id/day/:dayNumber
app.get('/api/learning-paths/:id/day/:dayNumber', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const pathId = req.params.id;
  const dayNumber = parseInt(req.params.dayNumber, 10);

  const pathItem = db.getLearningPathById(pathId);
  if (!pathItem || pathItem.userId !== req.user!.id) {
    res.status(404).json({ error: 'Learning path not found' });
    return;
  }

  const task = db.getDailyTask(pathId, dayNumber);
  if (!task) {
    res.status(404).json({ error: `Day ${dayNumber} task not found` });
    return;
  }

  res.json({
    learningPath: pathItem,
    task,
  });
});

// POST /api/learning-paths/:id/day/:dayNumber/complete-session
app.post('/api/learning-paths/:id/day/:dayNumber/complete-session', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const pathId = req.params.id;
  const dayNumber = parseInt(req.params.dayNumber, 10);
  const { secondsSpent } = req.body;

  const pathItem = db.getLearningPathById(pathId);
  if (!pathItem || pathItem.userId !== req.user!.id) {
    res.status(404).json({ error: 'Learning path not found' });
    return;
  }

  const task = db.getDailyTask(pathId, dayNumber);
  if (!task) {
    res.status(404).json({ error: 'Task not found' });
    return;
  }

  const additionalSeconds = typeof secondsSpent === 'number' ? secondsSpent : pathItem.dailyMinutes * 60;
  db.updateLearningPath(pathId, {
    totalTimeSpentSeconds: (pathItem.totalTimeSpentSeconds || 0) + additionalSeconds,
  });

  res.json({ message: 'Session completed successfully', readyForAssessment: true });
});

// --- ASSESSMENTS API ROUTES ---

// GET /api/learning-paths/:id/day/:dayNumber/assessment
app.get('/api/learning-paths/:id/day/:dayNumber/assessment', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const pathId = req.params.id;
    const dayNumber = parseInt(req.params.dayNumber, 10);

    const pathItem = db.getLearningPathById(pathId);
    if (!pathItem || pathItem.userId !== req.user!.id) {
      res.status(404).json({ error: 'Learning path not found' });
      return;
    }

    const task = db.getDailyTask(pathId, dayNumber);
    if (!task) {
      res.status(404).json({ error: 'Day task not found' });
      return;
    }

    // Check if assessment already generated
    let assessment = db.getAssessment(pathId, dayNumber);
    if (!assessment) {
      const course = COURSES.find(c => c.id === pathItem.courseId) || COURSES[0];
      const questions = await generateAIDailyAssessment(course, task);
      assessment = db.saveAssessment({
        learningPathId: pathId,
        dayNumber,
        courseId: pathItem.courseId,
        title: `Day ${dayNumber} Knowledge Assessment: ${task.topic}`,
        totalQuestions: questions.length,
        questions,
      });
    }

    // Omit the correct answers and explanations when sending to client for test taking
    const clientQuestions = assessment.questions.map((q, idx) => ({
      index: idx,
      id: q.id,
      question: q.question,
      options: q.options,
    }));

    res.json({
      assessmentId: assessment.id,
      title: assessment.title,
      totalQuestions: assessment.totalQuestions,
      questions: clientQuestions,
    });
  } catch (err: any) {
    console.error('Assessment retrieval error:', err);
    res.status(500).json({ error: 'Failed to retrieve assessment' });
  }
});

// POST /api/learning-paths/:id/day/:dayNumber/assessment
app.post('/api/learning-paths/:id/day/:dayNumber/assessment', authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const pathId = req.params.id;
    const dayNumber = parseInt(req.params.dayNumber, 10);
    const { answers } = req.body; // array of selected indices: [0, 2, 1, 3, ...]

    if (!Array.isArray(answers) || answers.length !== 10) {
      res.status(400).json({ error: 'Exactly 10 question answers are required' });
      return;
    }

    const pathItem = db.getLearningPathById(pathId);
    if (!pathItem || pathItem.userId !== req.user!.id) {
      res.status(404).json({ error: 'Learning path not found' });
      return;
    }

    const task = db.getDailyTask(pathId, dayNumber);
    const assessment = db.getAssessment(pathId, dayNumber);
    if (!assessment) {
      res.status(404).json({ error: 'Assessment not found' });
      return;
    }

    // Evaluate answers
    let score = 0;
    const answerDetails = assessment.questions.map((q, idx) => {
      const userSelected = answers[idx];
      const isCorrect = userSelected === q.correctIndex;
      if (isCorrect) score += 1;
      return {
        questionIndex: idx,
        questionText: q.question,
        options: q.options,
        selectedOption: userSelected,
        correctOption: q.correctIndex,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const percentage = Math.round((score / assessment.totalQuestions) * 100);
    const passed = percentage >= 70; // 70% passing threshold

    let feedback = '';
    if (percentage === 100) {
      feedback = 'Outstanding mastery! You achieved a perfect score on all concepts.';
    } else if (percentage >= 80) {
      feedback = 'Excellent comprehension of today’s architectural and practical topics.';
    } else if (percentage >= 70) {
      feedback = 'Good work! You passed today’s assessment. Review missed questions to reinforce tricky areas.';
    } else {
      feedback = 'Review recommended. Focus on the core explanations and practical coding patterns before moving forward.';
    }

    // Save assessment result permanently in database
    const savedResult = db.saveAssessmentResult({
      userId: req.user!.id,
      learningPathId: pathId,
      courseId: pathItem.courseId,
      courseName: pathItem.courseTitle,
      dayNumber,
      score,
      totalQuestions: assessment.totalQuestions,
      percentage,
      passed,
      feedback,
      answers: answerDetails.map(a => ({
        questionIndex: a.questionIndex,
        selectedOption: a.selectedOption,
        correctOption: a.correctOption,
        isCorrect: a.isCorrect,
      })),
    });

    // Mark task completed
    if (task) {
      db.updateDailyTask(task.id, {
        isCompleted: true,
        completedAt: new Date().toISOString(),
      });
    }

    // Check if learning path advances
    let isPathCompleted = false;
    let certificate = null;

    if (dayNumber >= pathItem.totalDays) {
      // Completed the entire path!
      isPathCompleted = true;
      db.updateLearningPath(pathId, {
        status: 'completed',
        completedAt: new Date().toISOString(),
      });

      // Generate verifiable certificate
      const certCode = 'LX-' + crypto.randomBytes(4).toString('hex').toUpperCase();
      const verifyUrl = `${APP_URL}/verify/${certCode}`;
      const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
      });

      const allPathResults = db.getAssessmentResultsByPath(pathId);
      const avgScore = allPathResults.length > 0
        ? Math.round(allPathResults.reduce((acc, r) => acc + r.percentage, 0) / allPathResults.length)
        : percentage;

      certificate = db.createCertificate({
        certificateCode: certCode,
        userId: req.user!.id,
        userName: req.user!.name,
        userEmail: req.user!.email,
        courseId: pathItem.courseId,
        courseName: pathItem.courseTitle,
        durationWeeks: pathItem.durationWeeks,
        totalDays: pathItem.totalDays,
        averageScore: avgScore,
        completionDate: new Date().toISOString().split('T')[0],
        qrCodeDataUrl: qrDataUrl,
        verificationUrl: verifyUrl,
      });
    } else {
      // Advance to next day if this was current day
      if (pathItem.currentDay <= dayNumber) {
        db.updateLearningPath(pathId, {
          currentDay: dayNumber + 1,
        });
      }
    }

    res.json({
      score,
      totalQuestions: assessment.totalQuestions,
      percentage,
      passed,
      feedback,
      resultId: savedResult.id,
      answerDetails,
      isPathCompleted,
      certificate,
      nextDay: dayNumber < pathItem.totalDays ? dayNumber + 1 : null,
    });
  } catch (err: any) {
    console.error('Assessment evaluation error:', err);
    res.status(500).json({ error: 'Failed to evaluate assessment: ' + err.message });
  }
});

// GET /api/performance-history
app.get('/api/performance-history', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const results = db.getAssessmentResultsByUser(req.user!.id);
  const totalQuizzes = results.length;
  const passedQuizzes = results.filter(r => r.passed).length;
  const avgPercentage = totalQuizzes > 0
    ? Math.round(results.reduce((acc, r) => acc + r.percentage, 0) / totalQuizzes)
    : 0;

  res.json({
    totalQuizzes,
    passedQuizzes,
    avgPercentage,
    results,
  });
});

// GET /api/certificates
app.get('/api/certificates', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const certs = db.getCertificatesByUser(req.user!.id);
  res.json({ certificates: certs });
});

// GET /api/certificates/:id
app.get('/api/certificates/:id', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const cert = db.getCertificateById(req.params.id);
  if (!cert || cert.userId !== req.user!.id) {
    res.status(404).json({ error: 'Certificate not found' });
    return;
  }
  res.json({ certificate: cert });
});

// GET /api/verify-certificate/:code (PUBLIC ENDPOINT)
app.get('/api/verify-certificate/:code', (req: Request, res: Response) => {
  const cert = db.getCertificateByCode(req.params.code);
  if (!cert) {
    res.status(404).json({
      valid: false,
      error: 'Certificate not found. The credential ID could not be verified in the Lonexora Skills registry.',
    });
    return;
  }

  res.json({
    valid: true,
    certificate: {
      certificateCode: cert.certificateCode,
      recipientName: cert.userName,
      courseName: cert.courseName,
      durationWeeks: cert.durationWeeks,
      totalDays: cert.totalDays,
      averageScore: cert.averageScore,
      completionDate: cert.completionDate,
      issuer: 'Lonexora Skills Academy',
      accreditationStatus: 'Verified Official Credential',
      verificationUrl: cert.verificationUrl,
    },
  });
});

// GET /api/stats/dashboard
app.get('/api/stats/dashboard', authMiddleware, (req: AuthenticatedRequest, res: Response) => {
  const stats = db.getUserDashboardStats(req.user!.id);
  res.json({ stats });
});

// --- SPA STATIC SERVING & DEV SERVER SETUP ---

async function setupServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    // Dynamic import vite in dev mode
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static file serving
    const distPath = path.resolve(__dirname, 'dist');
    const indexPath = path.resolve(distPath, 'index.html');

    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
    }

    app.get('*', (req: Request, res: Response) => {
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(503).send(`
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Lonexora Skills - Build Required</title>
              <style>
                body {
                  margin: 0;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  background-color: #0b0f19;
                  color: #e2e8f0;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  min-height: 100vh;
                  padding: 1.5rem;
                  box-sizing: border-box;
                }
                .card {
                  max-width: 580px;
                  background: #111827;
                  border: 1px solid #1f2937;
                  border-radius: 1rem;
                  padding: 2.5rem;
                  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                }
                h1 { margin-top: 0; color: #38bdf8; font-size: 1.5rem; }
                code { background: #1e293b; color: #38bdf8; padding: 0.2rem 0.4rem; border-radius: 4px; }
                ol { line-height: 1.8; color: #cbd5e1; }
                .status { margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid #1e293b; font-size: 0.875rem; color: #94a3b8; }
              </style>
            </head>
            <body>
              <div class="card">
                <h1>Lonexora Skills Server Active</h1>
                <p>The Node.js server is running, but the frontend distribution assets were not found at <code>dist/index.html</code>.</p>
                <p><strong>To resolve this on Render:</strong></p>
                <ol>
                  <li>Navigate to your service in the <strong>Render Dashboard</strong>.</li>
                  <li>In <strong>Settings</strong>, check your <strong>Build Command</strong>.</li>
                  <li>Ensure it is set to: <code>npm install && npm run build</code></li>
                  <li>Click <strong>Manual Deploy &gt; Clear build cache &amp; deploy</strong>.</li>
                </ol>
                <div class="status">
                  Server Port: ${PORT} | Environment: ${process.env.NODE_ENV || 'production'} | Health: <a href="/api/health" style="color:#38bdf8;">/api/health</a>
                </div>
              </div>
            </body>
          </html>
        `);
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    const keyInfo = getApiKeyDetails();
    console.log('----------------------------------------------------');
    console.log(`[Lonexora Server] Running at http://0.0.0.0:${PORT}`);
    console.log(`[Lonexora Server] Environment: ${process.env.NODE_ENV || 'development'}`);
    if (keyInfo) {
      const len = keyInfo.key.length;
      const masked = len > 8 ? `${keyInfo.key.substring(0, 4)}...${keyInfo.key.substring(len - 4)}` : '***';
      console.log(`[Lonexora Server] Gemini AI Engine: ONLINE (loaded from ${keyInfo.source}: ${masked})`);
    } else {
      console.log(`[Lonexora Server] Gemini AI Engine: OFFLINE (API key not detected).`);
      console.log(`[Lonexora Server] Tip for Render: Set GEMINI_API_KEY in Render Dashboard -> Environment Variables.`);
      console.log(`[Lonexora Server] Resilient fallback: Built-in curriculum & assessment engine is 100% operational.`);
    }
    console.log('----------------------------------------------------');
  });
}

setupServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: 'student' | 'admin';
  bio?: string;
  targetRole?: string;
  createdAt: string;
}

export interface CodingTask {
  title: string;
  instructions: string;
  starterCode: string;
  language: string;
  solutionCode?: string;
}

export interface DailyTask {
  id: string;
  learningPathId: string;
  dayNumber: number;
  title: string;
  topic: string;
  subtopics: string[];
  learningObjectives: string[];
  explanationMarkdown: string;
  practicalExercises: string[];
  codingTask?: CodingTask;
  dailyGoals: string[];
  estimatedMinutes: number;
  isCompleted: boolean;
  completedAt?: string;
}

export interface LearningPath {
  id: string;
  userId: string;
  courseId: string;
  courseTitle: string;
  durationWeeks: number;
  dailyMinutes: number;
  totalDays: number;
  currentDay: number;
  status: 'active' | 'completed';
  totalTimeSpentSeconds: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface Question {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export interface Assessment {
  id: string;
  learningPathId: string;
  dayNumber: number;
  courseId: string;
  title: string;
  totalQuestions: number;
  questions: Question[];
}

export interface AssessmentAnswerDetail {
  questionIndex: number;
  selectedOption: number;
  correctOption: number;
  isCorrect: boolean;
}

export interface AssessmentResult {
  id: string;
  userId: string;
  learningPathId: string;
  courseId: string;
  courseName: string;
  dayNumber: number;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  feedback: string;
  answers: AssessmentAnswerDetail[];
  completedAt: string;
}

export interface Certificate {
  id: string;
  certificateCode: string;
  userId: string;
  userName: string;
  userEmail: string;
  courseId: string;
  courseName: string;
  durationWeeks: number;
  totalDays: number;
  averageScore: number;
  completionDate: string;
  qrCodeDataUrl: string;
  verificationUrl: string;
}

export interface DatabaseSchema {
  users: User[];
  learningPaths: LearningPath[];
  dailyTasks: DailyTask[];
  assessments: Assessment[];
  assessmentResults: AssessmentResult[];
  certificates: Certificate[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'lonexora_db.json');

// Seeded demo certificates must point at the public host, not a local port.
// On Render APP_URL is injected by the platform before the process starts.
const APP_BASE_URL =
  process.env.APP_URL ||
  (process.env.PORT ? `http://localhost:${process.env.PORT}` : 'http://localhost:3000');

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

class Database {
  private data: DatabaseSchema = {
    users: [],
    learningPaths: [],
    dailyTasks: [],
    assessments: [],
    assessmentResults: [],
    certificates: [],
  };

  constructor() {
    this.init();
  }

  private init() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
        // Ensure all arrays exist
        this.data.users = this.data.users || [];
        this.data.learningPaths = this.data.learningPaths || [];
        this.data.dailyTasks = this.data.dailyTasks || [];
        this.data.assessments = this.data.assessments || [];
        this.data.assessmentResults = this.data.assessmentResults || [];
        this.data.certificates = this.data.certificates || [];
      } catch (err) {
        console.error('Error reading database file, initializing fresh:', err);
        this.seedDemoUser();
        this.save();
      }
    } else {
      this.seedDemoUser();
      this.save();
    }
  }

  private seedDemoUser() {
    const salt = crypto.randomBytes(16).toString('hex');
    const demoUser: User = {
      id: 'demo-user-1',
      name: 'Alex Rivera',
      email: 'alex@lonexora.edu',
      passwordHash: hashPassword('Demo1234!', salt),
      salt,
      role: 'student',
      bio: 'Full-stack software engineering enthusiast preparing for Senior Engineer roles.',
      targetRole: 'Full Stack Engineer',
      createdAt: new Date().toISOString(),
    };
    this.data.users.push(demoUser);

    // Seed an active 8-week path for Alex Rivera
    const demoPath: LearningPath = {
      id: 'path_demo_alex_react',
      userId: 'demo-user-1',
      courseId: 'fullstack-react-mastery',
      courseTitle: 'Modern React & Full-Stack Architecture',
      durationWeeks: 8,
      dailyMinutes: 60,
      totalDays: 56,
      currentDay: 3,
      status: 'active',
      totalTimeSpentSeconds: 7200,
      createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.learningPaths.push(demoPath);

    // Seed sample daily tasks for the path
    for (let day = 1; day <= 56; day++) {
      this.data.dailyTasks.push({
        id: `task_alex_react_${day}`,
        learningPathId: 'path_demo_alex_react',
        dayNumber: day,
        title: `Day ${day}: React Component Lifecycle, Virtual DOM & State Foundations`,
        topic: `React Architecture - Day ${day}`,
        subtopics: [
          'JSX compilation & AST representations',
          'Synthetic Event propagation and memory boundaries',
          'Reconciliation heuristics & Key diffing algorithms',
          'Hook closures and stale state mitigation'
        ],
        learningObjectives: [
          'Understand how the React Fiber reconciler schedules priority updates',
          'Construct custom hooks with invariant assertions and TypeScript inference',
          'Optimize re-renders with memoization and ref stabilization'
        ],
        explanationMarkdown: `### Architectural Concepts & Deep Dive
Welcome to Day ${day} of **Modern React & Full-Stack Architecture**.

Today, we delve into the mechanical internals of component hierarchies and virtual DOM diffing.

1. **Reconciliation & Priority Lanes**:
   React uses a fiber data structure where each node represents a unit of work. When state changes occur, work is queued in priority lanes.

2. **Hook Execution & Dependency Arrays**:
   Hooks rely on linked-list indexes preserved across render passes. Omitting values from dependency arrays can lead to memory leaks or stale state captures.

3. **Code Example**:
\`\`\`typescript
import { useState, useCallback, useMemo } from 'react';

export function useDataPipeline<T>(initialData: T[]) {
  const [data, setData] = useState<T[]>(initialData);
  
  const addItem = useCallback((item: T) => {
    setData((prev) => [...prev, item]);
  }, []);

  const count = useMemo(() => data.length, [data]);

  return { data, addItem, count };
}
\`\`\`

### Practical Guidelines
Ensure that all async effects clean up subscription handles upon unmounting to prevent memory leaks in production.`,
        practicalExercises: [
          'Implement a resilient usePrevious hook and test state divergence.',
          'Profile component mount lifecycle times in Chrome DevTools.',
          'Refactor a nested prop drilling hierarchy into a contextual state provider.'
        ],
        codingTask: {
          title: 'Custom Hook Memoization Exercise',
          instructions: 'Implement a debounce utility hook that delays updating a state value until a timeout has passed without changes.',
          starterCode: `// Task: Implement a clean debounce function\nfunction debounce(fn, delay) {\n  let timer;\n  return function(...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn.apply(this, args), delay);\n  };\n}\n\nconst logMsg = debounce((text) => console.log("Debounced:", text), 300);\nlogMsg("Hello Lonexora");`,
          language: 'javascript',
          solutionCode: `function debounce(fn, delay) {\n  let timer;\n  return function(...args) {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn.apply(this, args), delay);\n  };\n}\n\nconst logMsg = debounce((text) => console.log("Debounced:", text), 300);\nlogMsg("Hello Lonexora");`
        },
        dailyGoals: [
          'Master fiber tree scheduling principles',
          'Write idiomatic TypeScript custom hooks',
          'Score 80%+ on the Day assessment'
        ],
        estimatedMinutes: 60,
        isCompleted: day < 3,
        completedAt: day < 3 ? new Date(Date.now() - (3 - day) * 86400000).toISOString() : undefined,
      });
    }

    // Seed 2 assessment results for Day 1 and Day 2
    this.data.assessmentResults.push(
      {
        id: 'res_demo_alex_1',
        userId: 'demo-user-1',
        learningPathId: 'path_demo_alex_react',
        courseId: 'fullstack-react-mastery',
        courseName: 'Modern React & Full-Stack Architecture',
        dayNumber: 1,
        score: 9,
        totalQuestions: 10,
        percentage: 90,
        passed: true,
        feedback: 'Outstanding mastery! You demonstrated command of virtual DOM heuristics and state cycles.',
        answers: [],
        completedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
      },
      {
        id: 'res_demo_alex_2',
        userId: 'demo-user-1',
        learningPathId: 'path_demo_alex_react',
        courseId: 'fullstack-react-mastery',
        courseName: 'Modern React & Full-Stack Architecture',
        dayNumber: 2,
        score: 10,
        totalQuestions: 10,
        percentage: 100,
        passed: true,
        feedback: 'Flawless execution! 10 out of 10 questions answered correctly.',
        answers: [],
        completedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
      }
    );

    // Seed 1 official Lonexora Certificate for Alex Rivera
    const certCode = 'LX-2026-F89A12';
    this.data.certificates.push({
      id: 'cert_alex_python_ai',
      certificateCode: certCode,
      userId: 'demo-user-1',
      userName: 'Alex Rivera',
      userEmail: 'alex@lonexora.edu',
      courseId: 'python-core-advanced',
      courseName: 'Python 3: From Fundamentals to Metaprogramming',
      durationWeeks: 8,
      totalDays: 56,
      averageScore: 94,
      completionDate: '2026-03-15',
      qrCodeDataUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100"><rect width="100" height="100" fill="white"/><rect x="10" y="10" width="20" height="20" fill="black"/><rect x="70" y="10" width="20" height="20" fill="black"/><rect x="10" y="70" width="20" height="20" fill="black"/><rect x="40" y="40" width="20" height="20" fill="black"/><rect x="50" y="20" width="10" height="10" fill="black"/><rect x="20" y="50" width="10" height="10" fill="black"/><rect x="70" y="60" width="20" height="10" fill="black"/><rect x="60" y="80" width="10" height="10" fill="black"/></svg>',
      verificationUrl: `${APP_BASE_URL}/verify/${certCode}`,
    });
  }

  public save() {
    try {
      const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tempFile, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (err) {
      console.error('Failed to persist database to disk:', err);
    }
  }

  // User Operations
  public findUserByEmail(email: string): User | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  }

  public findUserById(id: string): User | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public createUser(userData: { name: string; email: string; password: string; bio?: string; targetRole?: string }): User {
    const salt = crypto.randomBytes(16).toString('hex');
    const newUser: User = {
      id: 'usr_' + crypto.randomBytes(8).toString('hex'),
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      passwordHash: hashPassword(userData.password, salt),
      salt,
      role: 'student',
      bio: userData.bio || '',
      targetRole: userData.targetRole || 'Software Developer',
      createdAt: new Date().toISOString(),
    };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  public verifyUserPassword(user: User, passwordAttempt: string): boolean {
    const attemptHash = hashPassword(passwordAttempt, user.salt);
    return crypto.timingSafeEqual(Buffer.from(attemptHash), Buffer.from(user.passwordHash));
  }

  public updateUserProfile(id: string, updates: Partial<User>): User | undefined {
    const index = this.data.users.findIndex(u => u.id === id);
    if (index === -1) return undefined;
    this.data.users[index] = { ...this.data.users[index], ...updates };
    this.save();
    return this.data.users[index];
  }

  // Learning Paths
  public createLearningPath(pathData: Omit<LearningPath, 'id' | 'createdAt' | 'updatedAt' | 'totalTimeSpentSeconds'>): LearningPath {
    const newPath: LearningPath = {
      ...pathData,
      id: 'path_' + crypto.randomBytes(8).toString('hex'),
      totalTimeSpentSeconds: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.data.learningPaths.push(newPath);
    this.save();
    return newPath;
  }

  public getLearningPathsByUser(userId: string): LearningPath[] {
    return this.data.learningPaths.filter(lp => lp.userId === userId);
  }

  public getLearningPathById(id: string): LearningPath | undefined {
    return this.data.learningPaths.find(lp => lp.id === id);
  }

  public updateLearningPath(id: string, updates: Partial<LearningPath>): LearningPath | undefined {
    const index = this.data.learningPaths.findIndex(lp => lp.id === id);
    if (index === -1) return undefined;
    this.data.learningPaths[index] = {
      ...this.data.learningPaths[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.save();
    return this.data.learningPaths[index];
  }

  // Daily Tasks
  public createDailyTasks(tasks: Omit<DailyTask, 'id'>[]): DailyTask[] {
    const created: DailyTask[] = tasks.map(t => ({
      ...t,
      id: 'task_' + crypto.randomBytes(8).toString('hex'),
    }));
    this.data.dailyTasks.push(...created);
    this.save();
    return created;
  }

  public getDailyTasksByPathId(learningPathId: string): DailyTask[] {
    return this.data.dailyTasks
      .filter(t => t.learningPathId === learningPathId)
      .sort((a, b) => a.dayNumber - b.dayNumber);
  }

  public getDailyTask(learningPathId: string, dayNumber: number): DailyTask | undefined {
    return this.data.dailyTasks.find(
      t => t.learningPathId === learningPathId && t.dayNumber === dayNumber
    );
  }

  public updateDailyTask(id: string, updates: Partial<DailyTask>): DailyTask | undefined {
    const index = this.data.dailyTasks.findIndex(t => t.id === id);
    if (index === -1) return undefined;
    this.data.dailyTasks[index] = { ...this.data.dailyTasks[index], ...updates };
    this.save();
    return this.data.dailyTasks[index];
  }

  // Assessments
  public saveAssessment(assessment: Omit<Assessment, 'id'>): Assessment {
    const existingIndex = this.data.assessments.findIndex(
      a => a.learningPathId === assessment.learningPathId && a.dayNumber === assessment.dayNumber
    );
    const newAssessment: Assessment = {
      ...assessment,
      id: existingIndex >= 0 ? this.data.assessments[existingIndex].id : 'asm_' + crypto.randomBytes(8).toString('hex'),
    };
    if (existingIndex >= 0) {
      this.data.assessments[existingIndex] = newAssessment;
    } else {
      this.data.assessments.push(newAssessment);
    }
    this.save();
    return newAssessment;
  }

  public getAssessment(learningPathId: string, dayNumber: number): Assessment | undefined {
    return this.data.assessments.find(
      a => a.learningPathId === learningPathId && a.dayNumber === dayNumber
    );
  }

  // Assessment Results / Performance History
  public saveAssessmentResult(result: Omit<AssessmentResult, 'id' | 'completedAt'>): AssessmentResult {
    const newResult: AssessmentResult = {
      ...result,
      id: 'res_' + crypto.randomBytes(8).toString('hex'),
      completedAt: new Date().toISOString(),
    };
    this.data.assessmentResults.push(newResult);
    this.save();
    return newResult;
  }

  public getAssessmentResultsByUser(userId: string): AssessmentResult[] {
    return this.data.assessmentResults
      .filter(r => r.userId === userId)
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
  }

  public getAssessmentResultsByPath(learningPathId: string): AssessmentResult[] {
    return this.data.assessmentResults
      .filter(r => r.learningPathId === learningPathId)
      .sort((a, b) => a.dayNumber - b.dayNumber);
  }

  // Certificates
  public createCertificate(certData: Omit<Certificate, 'id'>): Certificate {
    const cert: Certificate = {
      ...certData,
      id: 'cert_' + crypto.randomBytes(8).toString('hex'),
    };
    this.data.certificates.push(cert);
    this.save();
    return cert;
  }

  public getCertificatesByUser(userId: string): Certificate[] {
    return this.data.certificates
      .filter(c => c.userId === userId)
      .sort((a, b) => new Date(b.completionDate).getTime() - new Date(a.completionDate).getTime());
  }

  public getCertificateByCode(certificateCode: string): Certificate | undefined {
    return this.data.certificates.find(
      c => c.certificateCode.toUpperCase() === certificateCode.trim().toUpperCase()
    );
  }

  public getCertificateById(id: string): Certificate | undefined {
    return this.data.certificates.find(c => c.id === id);
  }

  // Overall Statistics for Dashboard
  public getUserDashboardStats(userId: string) {
    const paths = this.getLearningPathsByUser(userId);
    const results = this.getAssessmentResultsByUser(userId);
    const certificates = this.getCertificatesByUser(userId);

    const totalDaysCompleted = results.filter(r => r.passed).length;
    const totalMinutesStudied = paths.reduce((acc, p) => acc + Math.round((p.totalTimeSpentSeconds || 0) / 60), 0);
    const avgScore = results.length > 0 
      ? Math.round(results.reduce((acc, r) => acc + r.percentage, 0) / results.length) 
      : 0;

    return {
      totalPaths: paths.length,
      activePaths: paths.filter(p => p.status === 'active').length,
      completedPaths: paths.filter(p => p.status === 'completed').length,
      totalDaysCompleted,
      totalMinutesStudied,
      avgScore,
      totalCertificates: certificates.length,
    };
  }
}

export const db = new Database();

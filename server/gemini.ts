import { GoogleGenAI, Type } from '@google/genai';
import { Course } from './courses';
import { DailyTask, Question } from './db';

let aiInstance: GoogleGenAI | null = null;
let lastUsedKey: string | null = null;

export interface ApiKeyDetails {
  key: string;
  source: string;
}

export function getApiKeyDetails(): ApiKeyDetails | null {
  const candidates: [string, string | undefined][] = [
    ['GEMINI_API_KEY', process.env.GEMINI_API_KEY],
    ['GOOGLE_API_KEY', process.env.GOOGLE_API_KEY],
    ['GOOGLE_GENAI_API_KEY', process.env.GOOGLE_GENAI_API_KEY],
    ['VITE_GEMINI_API_KEY', process.env.VITE_GEMINI_API_KEY],
    ['API_KEY', process.env.API_KEY],
  ];

  for (const [name, rawValue] of candidates) {
    if (rawValue && typeof rawValue === 'string') {
      // Clean quotes, carriage returns, trailing whitespace
      const cleaned = rawValue
        .replace(/^["']|["']$/g, '')
        .replace(/\\r/g, '')
        .trim();

      if (
        cleaned.length > 5 &&
        !cleaned.includes('MY_GEMINI_API_KEY') &&
        !cleaned.includes('your_api_key') &&
        cleaned !== 'undefined' &&
        cleaned !== 'null'
      ) {
        return { key: cleaned, source: name };
      }
    }
  }

  return null;
}

export function getGeminiStatus(): {
  configured: boolean;
  source: string | null;
  maskedKey: string | null;
} {
  const details = getApiKeyDetails();
  if (!details) {
    return { configured: false, source: null, maskedKey: null };
  }
  const len = details.key.length;
  const masked = len > 8 ? `${details.key.substring(0, 4)}...${details.key.substring(len - 4)}` : '***';
  return {
    configured: true,
    source: details.source,
    maskedKey: masked,
  };
}

export function getAI(): GoogleGenAI | null {
  const details = getApiKeyDetails();
  if (!details) {
    return null;
  }

  if (!aiInstance || lastUsedKey !== details.key) {
    aiInstance = new GoogleGenAI({
      apiKey: details.key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    lastUsedKey = details.key;
  }
  return aiInstance;
}

export interface GeneratedDayPlan {
  dayNumber: number;
  title: string;
  topic: string;
  subtopics: string[];
  learningObjectives: string[];
  explanationMarkdown: string;
  practicalExercises: string[];
  codingTask?: {
    title: string;
    instructions: string;
    starterCode: string;
    language: string;
    solutionCode: string;
  };
  dailyGoals: string[];
  estimatedMinutes: number;
}

export async function generateAILearningRoadmap(
  course: Course,
  durationWeeks: number,
  dailyMinutes: number
): Promise<GeneratedDayPlan[]> {
  const totalDays = durationWeeks * 7;
  const ai = getAI();

  if (ai) {
    try {
      const prompt = `You are the Master Curriculum Director at Lonexora Skills.
Create a detailed, high-impact day-by-day learning curriculum for the course: "${course.title}".
Category: ${course.category}
Prerequisites: ${course.prerequisites.join(', ')}
Total Duration: ${durationWeeks} weeks (${totalDays} days).
Daily Study Budget: ${dailyMinutes} minutes per day.

Generate a structured curriculum with exactly ${totalDays} daily modules.
For each day, provide:
1. dayNumber: integer from 1 to ${totalDays}
2. title: concise catchy day title
3. topic: main core subject
4. subtopics: list of 3-5 specific subtopics
5. learningObjectives: list of 3 actionable learning objectives
6. explanationMarkdown: comprehensive, highly educational tutorial markdown text (minimum 250 words) with concepts, architecture explanations, code snippets, syntax breakdown, and best practices.
7. practicalExercises: list of 3 hands-on practical exercises
8. codingTask: object with { title, instructions, starterCode, language, solutionCode }
9. dailyGoals: 2-3 concrete goals for today
10. estimatedMinutes: ${dailyMinutes}

Ensure progressive difficulty from Day 1 fundamentals to advanced real-world implementations by Day ${totalDays}.
Respond strictly in JSON array format.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                dayNumber: { type: Type.INTEGER },
                title: { type: Type.STRING },
                topic: { type: Type.STRING },
                subtopics: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                learningObjectives: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                explanationMarkdown: { type: Type.STRING },
                practicalExercises: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                codingTask: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    instructions: { type: Type.STRING },
                    starterCode: { type: Type.STRING },
                    language: { type: Type.STRING },
                    solutionCode: { type: Type.STRING },
                  },
                  required: ['title', 'instructions', 'starterCode', 'language'],
                },
                dailyGoals: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                estimatedMinutes: { type: Type.INTEGER },
              },
              required: [
                'dayNumber',
                'title',
                'topic',
                'subtopics',
                'learningObjectives',
                'explanationMarkdown',
                'practicalExercises',
                'dailyGoals',
                'estimatedMinutes',
              ],
            },
          },
        },
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text) as GeneratedDayPlan[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Normalize day numbers
          return parsed.map((p, idx) => ({
            ...p,
            dayNumber: idx + 1,
            estimatedMinutes: dailyMinutes,
          }));
        }
      }
    } catch (err: any) {
      const msg = err?.message || String(err);
      if (msg.includes('API_KEY_INVALID') || msg.includes('API key not valid')) {
        console.error('[Lonexora AI] Gemini API Key is invalid or expired. Check your Render environment variables or .env file.');
      } else if (msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota')) {
        console.warn('[Lonexora AI] Gemini API rate limit reached. Seamlessly serving curriculum via the Lonexora Curriculum Engine.');
      } else {
        console.warn('[Lonexora AI] Gemini roadmap generation notice:', msg);
      }
    }
  }

  // Resilient fallback curriculum generator:
  return generateDeterministicCurriculum(course, totalDays, dailyMinutes);
}

export async function generateAIDailyAssessment(
  course: Course,
  dayTask: DailyTask
): Promise<Question[]> {
  const ai = getAI();

  if (ai) {
    try {
      const prompt = `You are the Chief Assessment Officer at Lonexora Skills.
Generate exactly 10 rigorous, high-quality multiple choice assessment questions for Day ${dayTask.dayNumber} of course "${course.title}".
Topic: ${dayTask.topic}
Subtopics: ${dayTask.subtopics.join(', ')}
Key objectives covered: ${dayTask.learningObjectives.join(', ')}

Requirements:
- Exactly 10 questions.
- Each question must test comprehension, practical application, syntax awareness, or debugging.
- Exactly 4 options per question.
- Exactly 1 correct answer (index 0, 1, 2, or 3).
- Provide a clear, educational explanation for why the answer is correct and why other choices are misconceptions.
- Output JSON array of objects.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                question: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                correctIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
              },
              required: ['id', 'question', 'options', 'correctIndex', 'explanation'],
            },
          },
        },
      });

      const text = response.text;
      if (text) {
        const parsed = JSON.parse(text) as Question[];
        if (Array.isArray(parsed) && parsed.length === 10) {
          return parsed.map((q, idx) => ({
            id: `q_${dayTask.dayNumber}_${idx + 1}`,
            question: q.question,
            options: [q.options[0], q.options[1], q.options[2], q.options[3]] as [string, string, string, string],
            correctIndex: Math.max(0, Math.min(3, q.correctIndex)),
            explanation: q.explanation,
          }));
        }
      }
    } catch (err: any) {
      const msg = err?.message || String(err);
      if (msg.includes('API_KEY_INVALID') || msg.includes('API key not valid')) {
        console.error('[Lonexora AI] Gemini API Key is invalid or expired. Check your Render environment variables or .env file.');
      } else if (msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota')) {
        console.warn('[Lonexora AI] Gemini API rate limit reached. Serving questions via the curated assessment engine.');
      } else {
        console.warn('[Lonexora AI] Gemini assessment generation notice:', msg);
      }
    }
  }

  return generateCuratedQuestions(course, dayTask);
}

// Robust curriculum generator ensures 100% reliability for all 50+ courses
function generateDeterministicCurriculum(
  course: Course,
  totalDays: number,
  dailyMinutes: number
): GeneratedDayPlan[] {
  const language = detectLanguage(course.category, course.title);
  const stages = [
    { name: 'Core Foundations & Mental Model', pct: 0.2 },
    { name: 'Practical Implementation & Syntax Mastery', pct: 0.3 },
    { name: 'Advanced Techniques & Performance Tuning', pct: 0.3 },
    { name: 'Production Architecture, Security & Capstone', pct: 0.2 },
  ];

  const days: GeneratedDayPlan[] = [];

  for (let day = 1; day <= totalDays; day++) {
    const progressPct = day / totalDays;
    let stageIndex = 0;
    if (progressPct <= 0.2) stageIndex = 0;
    else if (progressPct <= 0.5) stageIndex = 1;
    else if (progressPct <= 0.8) stageIndex = 2;
    else stageIndex = 3;

    const stage = stages[stageIndex];
    const subtopicPool = getSubtopicPool(course.title, course.category, stageIndex, day);
    const title = `Day ${day}: ${subtopicPool.headline}`;

    days.push({
      dayNumber: day,
      title,
      topic: subtopicPool.topic,
      subtopics: subtopicPool.subtopics,
      learningObjectives: [
        `Understand the architectural principles of ${subtopicPool.topic}`,
        `Implement idiomatic code patterns and error handling in ${language}`,
        `Apply best practices to solve real-world engineering constraints`
      ],
      explanationMarkdown: generateExplanation(course, day, totalDays, subtopicPool, language),
      practicalExercises: [
        `Write a clean function implementing ${subtopicPool.topic} with proper validation.`,
        `Profile execution and identify potential bottlenecks or edge cases.`,
        `Write unit tests verifying edge cases and boundary conditions.`
      ],
      codingTask: {
        title: `${subtopicPool.topic} Exercise`,
        instructions: `Implement the requested logic for ${subtopicPool.topic}. Verify that the function handles inputs properly and returns the expected result.`,
        starterCode: getStarterCode(language, subtopicPool.topic),
        language: language.toLowerCase(),
        solutionCode: getSolutionCode(language, subtopicPool.topic)
      },
      dailyGoals: [
        `Master key concepts behind ${subtopicPool.topic}`,
        `Complete all coding exercises within ${dailyMinutes} minutes`,
        `Score at least 70% on the Day ${day} assessment`
      ],
      estimatedMinutes: dailyMinutes,
    });
  }

  return days;
}

function detectLanguage(category: string, title: string): string {
  const t = title.toLowerCase();
  if (t.includes('mongo') || t.includes('nosql')) return 'JavaScript';
  if (t.includes('python') || t.includes('django') || t.includes('fastapi') || t.includes('data science') || t.includes('machine learning')) return 'Python';
  if (t.includes('react') || t.includes('javascript') || t.includes('node') || t.includes('next.js') || t.includes('vue')) return 'JavaScript';
  if (t.includes('typescript')) return 'TypeScript';
  if (t.includes('java ') || t.includes('spring')) return 'Java';
  if (t.includes('go ') || t.includes('golang')) return 'Go';
  if (t.includes('rust')) return 'Rust';
  if (t.includes('c++')) return 'C++';
  if (t.includes('c#') || t.includes('.net')) return 'CSharp';
  if (t.includes('sql') || t.includes('postgres')) return 'SQL';
  if (t.includes('docker') || t.includes('kubernetes') || t.includes('linux') || t.includes('bash')) return 'Bash';
  return 'JavaScript';
}

function getSubtopicPool(title: string, category: string, stageIndex: number, day: number) {
  const stageLabels = ['Foundations', 'Implementation', 'Optimization', 'Architecture'];
  return {
    headline: `${title.split(' ')[0]} ${stageLabels[stageIndex]} - Module ${day}`,
    topic: `${title} - Part ${day}: ${stageLabels[stageIndex]}`,
    subtopics: [
      `Conceptual Deep Dive into ${title} Module ${day}`,
      `State flow, memory lifecycles, and concurrency`,
      `Design patterns and anti-patterns to avoid`,
      `Production logging, metrics, and debugging`
    ]
  };
}

function generateExplanation(
  course: Course,
  day: number,
  totalDays: number,
  subtopicPool: { topic: string; subtopics: string[] },
  language: string
): string {
  const isMongo = course.title.toLowerCase().includes('mongo') || course.title.toLowerCase().includes('nosql');
  const runtimeContext = isMongo
    ? 'In MongoDB and document databases, document schema boundaries, indexing cardinality, and write concerns determine throughput.'
    : `In ${language}, managing variable scopes, async event dispatching, and memory boundaries determines scalability.`;

  const getSubtopicExplanation = (sub: string, i: number) => {
    if (isMongo) {
      if (i === 0) return 'Flexible document schema design, BSON limits, embedding vs referencing tradeoffs.';
      if (i === 1) return 'Write concerns (w: majority), read preferences, and ACID transaction isolation guarantees.';
      if (i === 2) return 'Avoid unbounded arrays and large embedded subdocuments; adopt the bucket or subset pattern.';
      return 'Index optimization with explain("executionStats"), compound index ESR rule, and memory cache tuning.';
    }
    const descs = [
      'Anatomy of foundational architecture, runtime lifecycle, and core interfaces.',
      'Concurrency control, state flow management, and resource allocation.',
      'Defensive error handling, production-proven patterns, and anti-pattern avoidance.',
      'Diagnostics, performance profiling, structured logging, and metrics instrumentation.'
    ];
    return descs[i % descs.length];
  };

  const codeExample = isMongo
    ? `// Production-ready MongoDB document query & aggregation pattern
async function getAggregatedMetrics(db, customerId) {
  const collection = db.collection('orders');
  const results = await collection.aggregate([
    { $match: { customerId: customerId, status: "completed" } },
    { $group: { _id: "$category", totalSpend: { $sum: "$amount" }, count: { $sum: 1 } } },
    { $sort: { totalSpend: -1 } }
  ]).toArray();
  return results;
}`
    : `// Production-ready pattern for ${subtopicPool.topic}
function executeOperation(config) {
  if (!config) {
    throw new Error("Invalid configuration supplied");
  }
  console.log("Processing ${subtopicPool.topic} pipeline...");
  return { status: "success", timestamp: Date.now() };
}`;

  return `### Overview & Context
Welcome to **Day ${day} of ${totalDays}** in **${course.title}**. Today's focus is on mastering **${subtopicPool.topic}**.

### Key Architectural Concepts
When engineering enterprise-grade applications, understanding how the underlying runtime behaves is paramount.

1. **State & Execution Lifecycle**:
   Every operation passes through discrete execution phases. ${runtimeContext}
   
2. **Key Subtopics for Today**:
${subtopicPool.subtopics.map((s, idx) => `   - **${s}**: ${getSubtopicExplanation(s, idx)}`).join('\n')}

3. **Code Example**:
\`\`\`${isMongo ? 'javascript' : language.toLowerCase()}
${codeExample}
\`\`\`

### Common Pitfalls & Anti-Patterns
- Never ignore unhandled rejections or error conditions in asynchronous workflows.
- Avoid premature optimization before establishing clear p99 baseline benchmarks.
- Maintain idempotent interfaces for distributed consistency and safe retry handling.

### Daily Summary
By completing today's tasks and the interactive code sandbox below, you solidify the practical intuition required for technical interviews and production codebases.`;
}

function getStarterCode(language: string, topic: string): string {
  if (language === 'Python') {
    return `# Task: Implement the solution for ${topic}\ndef solve_problem(data):\n    # TODO: Write your implementation here\n    pass\n\n# Test execution\nprint(solve_problem([10, 20, 30]))`;
  }
  if (language === 'Java') {
    return `public class Solution {\n    public static void main(String[] args) {\n        System.out.println("Executing ${topic} solution...");\n    }\n}`;
  }
  return `// Task: Implement the solution for ${topic}\nfunction solveProblem(input) {\n  // TODO: Write your implementation here\n  return input;\n}\n\nconsole.log(solveProblem({ status: "ready" }));`;
}

function getSolutionCode(language: string, topic: string): string {
  if (language === 'Python') {
    return `def solve_problem(data):\n    return sum(data) / len(data) if data else 0\n\nprint(solve_problem([10, 20, 30]))`;
  }
  return `function solveProblem(input) {\n  return { ...input, processed: true, timestamp: Date.now() };\n}\n\nconsole.log(solveProblem({ status: "ready" }));`;
}

function generateCuratedQuestions(course: Course, dayTask: DailyTask): Question[] {
  const qList: Question[] = [];
  const topic = dayTask.topic;

  const templates = [
    {
      q: `What is the primary architectural purpose of ${topic}?`,
      opts: [
        `To encapsulate domain logic and maintain predictable state transitions`,
        `To eliminate all memory allocation at runtime`,
        `To enforce synchronous thread blocking across services`,
        `To bypass network validation layers entirely`
      ],
      ans: 0,
      exp: `Encapsulating domain logic and keeping state transitions predictable is the fundamental architectural goal of ${topic}.`
    },
    {
      q: `In the context of ${course.title}, which principle is considered an anti-pattern?`,
      opts: [
        `Strict parameter validation and early returns`,
        `Directly mutating shared global state without synchronization`,
        `Writing unit tests for boundary conditions`,
        `Using structured error handling with specific error types`
      ],
      ans: 1,
      exp: `Mutating shared global state without proper synchronization causes race conditions and nondeterministic bugs.`
    },
    {
      q: `When optimizing performance for ${dayTask.subtopics[0] || topic}, what is the recommended first step?`,
      opts: [
        `Rewriting the entire subsystem in assembly code`,
        `Profiling to measure CPU, memory, and I/O bottlenecks objectively`,
        `Disabling garbage collection and process monitoring`,
        `Doubling hardware capacity before analyzing code metrics`
      ],
      ans: 1,
      exp: `Measurement and profiling must always precede optimization to identify true bottlenecks.`
    },
    {
      q: `What is the time complexity trade-off when indexing or caching data in this domain?`,
      opts: [
        `O(1) lookups at the expense of higher memory overhead and slower write operations`,
        `O(n!) search time with zero memory consumption`,
        `Infinite write speed with degraded read latencies`,
        `Exponential computation with linear disk storage`
      ],
      ans: 0,
      exp: `Indexing and caching achieve fast O(1) or O(log n) lookups at the cost of additional memory and slightly slower writes.`
    },
    {
      q: `Which status code or response format is most appropriate when validation fails for input parameters?`,
      opts: [
        `200 OK with an empty body`,
        `400 Bad Request with descriptive validation details`,
        `500 Internal Server Error`,
        `404 Not Found`
      ],
      ans: 1,
      exp: `Client-side validation errors should return 400 Bad Request with actionable context for the caller.`
    },
    {
      q: `What does idempotency mean in the context of operations for ${course.title}?`,
      opts: [
        `An operation that can be executed multiple times without changing the result beyond the initial execution`,
        `An operation that requires continuous user re-authentication`,
        `An operation that only runs on Saturday evenings`,
        `An operation that produces random values on every invocation`
      ],
      ans: 0,
      exp: `Idempotency ensures that making the same request multiple times has the exact same state effect as making it once.`
    },
    {
      q: `Why is asynchronous non-blocking I/O favored for high-throughput backends?`,
      opts: [
        `It allows a single thread/process to handle thousands of concurrent requests without blocking on I/O waits`,
        `It requires no memory allocation`,
        `It makes testing impossible`,
        `It prevents any database operations from succeeding`
      ],
      ans: 0,
      exp: `Non-blocking I/O delegates slow disk and network waits so the CPU can continuously process other incoming requests.`
    },
    {
      q: `When dealing with security in ${dayTask.subtopics[1] || topic}, how should secrets and credentials be handled?`,
      opts: [
        `Hardcoded into source control for convenient team access`,
        `Injected at runtime via secure environment variables or vault secrets managers`,
        `Stored in plaintext public static files`,
        `Sent via unencrypted query parameters`
      ],
      ans: 1,
      exp: `Secrets must never be committed to git; they should be injected via secure environment variables or a secrets manager.`
    },
    {
      q: `What is the main benefit of writing automated tests for Day ${dayTask.dayNumber}'s exercises?`,
      opts: [
        `Preventing regression and verifying that code fulfills contracts under edge conditions`,
        `Increasing the lines of code to meet manager vanity quotas`,
        `Slowing down deployment cycles intentionally`,
        `Replacing the need for compiler checks`
      ],
      ans: 0,
      exp: `Automated tests prevent regression and guarantee that code upholds contracts as requirements evolve.`
    },
    {
      q: `Which best practice should be applied to finalize Day ${dayTask.dayNumber}'s implementation?`,
      opts: [
        `Ignore linting errors and push directly to production`,
        `Conduct static analysis, adhere to naming conventions, and document interfaces`,
        `Delete all log output and error messages`,
        `Disable timeout guards on external requests`
      ],
      ans: 1,
      exp: `Static analysis, consistent naming, and clear interface documentation are key attributes of production-ready engineering.`
    }
  ];

  for (let i = 0; i < 10; i++) {
    const t = templates[i % templates.length];
    qList.push({
      id: `q_${dayTask.dayNumber}_${i + 1}`,
      question: t.q,
      options: t.opts as [string, string, string, string],
      correctIndex: t.ans,
      explanation: t.exp,
    });
  }

  return qList;
}

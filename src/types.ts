export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'admin';
  bio?: string;
  targetRole?: string;
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  icon: string;
  estimatedHours: number;
  featured?: boolean;
  tags: string[];
  prerequisites: string[];
  syllabusOverview: string[];
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

export interface AssessmentQuestionClient {
  index: number;
  id: string;
  question: string;
  options: [string, string, string, string];
}

export interface AssessmentDetailItem {
  questionIndex: number;
  questionText: string;
  options: [string, string, string, string];
  selectedOption: number;
  correctOption: number;
  isCorrect: boolean;
  explanation: string;
}

export interface AssessmentSubmissionResult {
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  feedback: string;
  resultId: string;
  answerDetails: AssessmentDetailItem[];
  isPathCompleted: boolean;
  certificate?: Certificate | null;
  nextDay: number | null;
}

export interface AssessmentResultItem {
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
  answers: Array<{
    questionIndex: number;
    selectedOption: number;
    correctOption: number;
    isCorrect: boolean;
  }>;
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

export interface DashboardStats {
  totalPaths: number;
  activePaths: number;
  completedPaths: number;
  totalDaysCompleted: number;
  totalMinutesStudied: number;
  avgScore: number;
  totalCertificates: number;
}

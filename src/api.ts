import {
  User,
  Course,
  LearningPath,
  DailyTask,
  AssessmentQuestionClient,
  AssessmentSubmissionResult,
  AssessmentResultItem,
  Certificate,
  DashboardStats,
} from './types';

let currentToken: string | null = localStorage.getItem('lx_token');

export function setToken(token: string | null) {
  currentToken = token;
  if (token) {
    localStorage.setItem('lx_token', token);
  } else {
    localStorage.removeItem('lx_token');
  }
}

export function getToken(): string | null {
  return currentToken;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (currentToken) {
    headers['Authorization'] = `Bearer ${currentToken}`;
  }

  const res = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return data as T;
}

export const api = {
  // Auth
  async register(params: { name: string; email: string; password: string; bio?: string; targetRole?: string }) {
    const data = await request<{ message: string; token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    setToken(data.token);
    return data;
  },

  async login(params: { email: string; password: string }) {
    const data = await request<{ message: string; token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    setToken(data.token);
    return data;
  },

  async getMe() {
    return request<{ user: User }>('/api/auth/me');
  },

  async updateProfile(params: { name: string; bio?: string; targetRole?: string }) {
    return request<{ user: User }>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(params),
    });
  },

  logout() {
    setToken(null);
  },

  // Courses
  async getCourses(params?: { category?: string; search?: string; level?: string }) {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'All Courses') query.append('category', params.category);
    if (params?.search) query.append('search', params.search);
    if (params?.level) query.append('level', params.level);
    const qs = query.toString() ? `?${query.toString()}` : '';
    return request<{ total: number; categories: string[]; courses: Course[] }>(`/api/courses${qs}`);
  },

  async getCourse(id: string) {
    return request<{ course: Course }>(`/api/courses/${id}`);
  },

  // Learning Paths
  async generateRoadmap(params: { courseId: string; durationWeeks: number; dailyMinutes: number }) {
    return request<{ message: string; learningPath: LearningPath; dailyTasks: DailyTask[] }>('/api/learning-paths/generate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  async getLearningPaths() {
    return request<{ learningPaths: LearningPath[] }>('/api/learning-paths');
  },

  async getLearningPath(id: string) {
    return request<{ learningPath: LearningPath; tasks: DailyTask[]; course?: Course }>(`/api/learning-paths/${id}`);
  },

  async getDayTask(pathId: string, dayNumber: number) {
    return request<{ learningPath: LearningPath; task: DailyTask }>(`/api/learning-paths/${pathId}/day/${dayNumber}`);
  },

  async completeSession(pathId: string, dayNumber: number, secondsSpent: number) {
    return request<{ message: string; readyForAssessment: boolean }>(`/api/learning-paths/${pathId}/day/${dayNumber}/complete-session`, {
      method: 'POST',
      body: JSON.stringify({ secondsSpent }),
    });
  },

  // Assessments
  async getAssessment(pathId: string, dayNumber: number) {
    return request<{
      assessmentId: string;
      title: string;
      totalQuestions: number;
      questions: AssessmentQuestionClient[];
    }>(`/api/learning-paths/${pathId}/day/${dayNumber}/assessment`);
  },

  async submitAssessment(pathId: string, dayNumber: number, answers: number[]) {
    return request<AssessmentSubmissionResult>(`/api/learning-paths/${pathId}/day/${dayNumber}/assessment`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  },

  // Performance History
  async getPerformanceHistory() {
    return request<{
      totalQuizzes: number;
      passedQuizzes: number;
      avgPercentage: number;
      results: AssessmentResultItem[];
    }>('/api/performance-history');
  },

  // Certificates
  async getCertificates() {
    return request<{ certificates: Certificate[] }>('/api/certificates');
  },

  async getCertificate(id: string) {
    return request<{ certificate: Certificate }>(`/api/certificates/${id}`);
  },

  // Public Certificate Verification
  async verifyCertificate(code: string) {
    return request<{
      valid: boolean;
      error?: string;
      certificate?: {
        certificateCode: string;
        recipientName: string;
        courseName: string;
        durationWeeks: number;
        totalDays: number;
        averageScore: number;
        completionDate: string;
        issuer: string;
        accreditationStatus: string;
        verificationUrl: string;
      };
    }>(`/api/verify-certificate/${encodeURIComponent(code)}`);
  },

  // Stats
  async getDashboardStats() {
    return request<{ stats: DashboardStats }>('/api/stats/dashboard');
  },
};

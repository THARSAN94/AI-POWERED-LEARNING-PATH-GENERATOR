import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api';
import { LearningPath, DashboardStats, AssessmentResultItem, Certificate } from '../types';
import {
  BookOpen,
  Award,
  Play,
  CheckCircle2,
  TrendingUp,
  ChevronRight
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (view: string, data?: any) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentResults, setRecentResults] = useState<AssessmentResultItem[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [pathsRes, statsRes, historyRes, certsRes] = await Promise.all([
          api.getLearningPaths(),
          api.getDashboardStats(),
          api.getPerformanceHistory(),
          api.getCertificates(),
        ]);
        setPaths(pathsRes.learningPaths);
        setStats(statsRes.stats);
        setRecentResults(historyRes.results.slice(0, 5));
        setCertificates(certsRes.certificates);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 bg-[#08090D]">
        <div className="h-7 w-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-slate-400">Loading personalized dashboard...</p>
      </div>
    );
  }

  const activePath = paths.find(p => p.status === 'active') || paths[0];

  return (
    <div className="min-h-screen bg-[#08090D] py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1.5">
              <span>Personalized Dashboard</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{user?.targetRole || 'Software Engineer'}</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Welcome back, {user?.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Track your daily learning progress, launch timed sessions, review assessment results, and view earned certificates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('courses')}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm shadow-blue-600/20 transition-all"
            >
              <BookOpen className="h-4 w-4" />
              <span>Explore Tracks</span>
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className="px-4 py-2.5 text-xs font-medium text-slate-300 hover:text-white bg-[#12141D] hover:bg-[#181B26] border border-white/[0.08] rounded-lg transition-colors"
            >
              Profile Settings
            </button>
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="surface-card p-5 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">Enrolled Paths</span>
              <BookOpen className="h-4 w-4 text-blue-400" />
            </div>
            <p className="text-2xl font-bold font-mono text-white tabular-nums">{stats?.totalPaths || paths.length}</p>
            <p className="text-[11px] text-slate-500 mt-1">{stats?.activePaths || 0} active in progress</p>
          </div>

          <div className="surface-card p-5 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">Days Completed</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">{stats?.totalDaysCompleted || 0}</p>
            <p className="text-[11px] text-slate-500 mt-1">Structured modules passed</p>
          </div>

          <div className="surface-card p-5 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">Assessment Average</span>
              <TrendingUp className="h-4 w-4 text-sky-400" />
            </div>
            <p className="text-2xl font-bold font-mono text-sky-400 tabular-nums">{stats?.avgScore || 0}%</p>
            <p className="text-[11px] text-slate-500 mt-1">Across 10-MCQ quizzes</p>
          </div>

          <div className="surface-card p-5 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">Certificates Earned</span>
              <Award className="h-4 w-4 text-amber-400" />
            </div>
            <p className="text-2xl font-bold font-mono text-amber-400 tabular-nums">{stats?.totalCertificates || certificates.length}</p>
            <p className="text-[11px] text-slate-500 mt-1">Official verified credentials</p>
          </div>
        </div>

        {/* Active Learning Path Spotlight */}
        {activePath ? (
          <div className="surface-card p-6 sm:p-8 rounded-2xl relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
                  <span>Current Active Roadmap</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="font-mono tabular-nums">{activePath.durationWeeks} Weeks</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="font-mono tabular-nums">{activePath.dailyMinutes} min/day</span>
                </div>

                <h2 className="font-display text-2xl font-bold text-white">
                  {activePath.courseTitle}
                </h2>

                <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                  Next milestone: <strong>Day {activePath.currentDay} of {activePath.totalDays}</strong>. Interactive lessons, coding tasks, and 10-question evaluation.
                </p>

                {/* Progress Bar with Tabular Figures */}
                {(() => {
                  const completedDays = activePath.status === 'completed'
                    ? activePath.totalDays
                    : Math.max(0, activePath.currentDay - 1);
                  const pct = Math.round((completedDays / activePath.totalDays) * 100);

                  return (
                    <div className="space-y-1.5 pt-2 max-w-xl">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">
                          Day <span className="font-mono font-semibold text-white">{activePath.currentDay}</span> of{' '}
                          <span className="font-mono">{activePath.totalDays}</span>
                        </span>
                        <span className="font-mono font-semibold text-blue-400 tabular-nums">
                          {pct}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-white/[0.06] overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(4, pct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })()}
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                <button
                  onClick={() => onNavigate('daily-session', { pathId: activePath.id, dayNumber: activePath.currentDay })}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02]"
                >
                  <Play className="h-4 w-4 fill-white" />
                  <span>Start Day {activePath.currentDay} Session</span>
                </button>
                <button
                  onClick={() => onNavigate('roadmap', { pathId: activePath.id })}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 text-xs font-medium text-slate-300 hover:text-white bg-[#12141D] hover:bg-[#181B26] border border-white/[0.08] rounded-lg transition-colors"
                >
                  <span>View Full Syllabus ({activePath.totalDays} Days)</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="surface-card p-8 rounded-xl text-center">
            <h3 className="font-display text-lg font-bold text-white mb-2">No Active Learning Paths</h3>
            <p className="text-xs text-slate-400 mb-6 max-w-md mx-auto">
              Select a course from our catalog to synthesize your customized day-by-day learning roadmap.
            </p>
            <button
              onClick={() => onNavigate('courses')}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm shadow-blue-600/20 transition-colors"
            >
              Browse 50+ Engineering Courses
            </button>
          </div>
        )}

        {/* Two Column Grid: Enrolled Roadmaps & Recent Assessments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Enrolled Paths */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="font-display text-base font-bold text-white">Your Learning Paths ({paths.length})</h3>
              <button
                onClick={() => onNavigate('courses')}
                className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <span>Add Track</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {paths.length === 0 ? (
              <div className="surface-card p-6 rounded-xl text-center text-xs text-slate-400">
                You have not enrolled in any learning paths yet.
              </div>
            ) : (
              <div className="space-y-3">
                {paths.map((p) => {
                  const completedDays = p.status === 'completed'
                    ? p.totalDays
                    : Math.max(0, p.currentDay - 1);
                  const pct = Math.round((completedDays / p.totalDays) * 100);
                  return (
                    <div
                      key={p.id}
                      onClick={() => onNavigate('roadmap', { pathId: p.id })}
                      className="surface-card surface-card-hover p-4 rounded-xl cursor-pointer flex items-center justify-between gap-4"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1">
                          <span>{p.durationWeeks} Weeks</span>
                          <span aria-hidden="true">·</span>
                          <span>{p.dailyMinutes}m/day</span>
                          <span aria-hidden="true">·</span>
                          <span className={p.status === 'completed' ? 'text-emerald-400 font-medium' : 'text-blue-400'}>
                            {p.status === 'completed' ? 'Completed' : 'In Progress'}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-white truncate hover:text-blue-400 transition-colors">
                          {p.courseTitle}
                        </h4>
                        <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                          <span className="font-mono tabular-nums">{completedDays} / {p.totalDays} Days</span>
                          <div className="h-1.5 w-28 rounded-full bg-white/[0.06] overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="font-mono text-slate-300 tabular-nums">{pct}%</span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-500 shrink-0" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Assessments Record */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <h3 className="font-display text-base font-bold text-white">Recent 10-Question Assessments</h3>
              <button
                onClick={() => onNavigate('performance')}
                className="text-xs font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <span>View All History</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {recentResults.length === 0 ? (
              <div className="surface-card p-6 rounded-xl text-center text-xs text-slate-400">
                No assessments taken yet. Launch your first daily session to take a 10-question evaluation!
              </div>
            ) : (
              <div className="space-y-3">
                {recentResults.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => onNavigate('performance')}
                    className="surface-card surface-card-hover p-4 rounded-xl cursor-pointer flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1">
                        <span className="font-mono">Day {r.dayNumber}</span>
                        <span aria-hidden="true">·</span>
                        <span>{new Date(r.completedAt).toLocaleDateString()}</span>
                        <span aria-hidden="true">·</span>
                        <span className={r.passed ? 'text-emerald-400 font-medium' : 'text-amber-400 font-medium'}>
                          {r.passed ? 'Passed' : 'Needs Review'}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-white truncate">
                        {r.courseName}
                      </h4>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{r.feedback}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className={`font-mono text-base font-bold tabular-nums ${r.passed ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {r.score}/10
                      </p>
                      <p className="text-[10px] font-mono text-slate-400 tabular-nums">{r.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Certificates Ribbon */}
        {certificates.length > 0 && (
          <div className="surface-card p-6 rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
                  <Award className="h-4 w-4" />
                  <span>Credential Vault</span>
                </div>
                <h3 className="font-display text-lg font-bold text-white">Earned Lonexora Skills Certificates</h3>
              </div>
              <button
                onClick={() => onNavigate('certificates')}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
              >
                <span>Manage & Download Credentials</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificates.map((c) => (
                <div
                  key={c.id}
                  onClick={() => onNavigate('certificates')}
                  className="bg-[#12141D] hover:bg-[#181B26] border border-amber-500/30 p-4 rounded-xl cursor-pointer flex items-center justify-between transition-colors"
                >
                  <div className="min-w-0 pr-4">
                    <p className="text-xs font-bold text-white truncate">{c.courseName}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                      Issued {c.completionDate} · Grade {c.averageScore}%
                    </p>
                    <p className="font-mono text-[10px] text-amber-400 mt-1">ID: {c.certificateCode}</p>
                  </div>
                  <span className="text-xs text-blue-400 font-medium shrink-0 flex items-center gap-1">
                    View <ChevronRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

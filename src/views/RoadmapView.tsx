import React, { useEffect, useState } from 'react';
import { LearningPath, DailyTask, Course } from '../types';
import { api } from '../api';
import {
  Play,
  CheckCircle2,
  Lock,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Award,
  BookOpen
} from 'lucide-react';

interface RoadmapViewProps {
  pathId: string;
  onNavigate: (view: string, data?: any) => void;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ pathId, onNavigate }) => {
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [course, setCourse] = useState<Course | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [filterWeek, setFilterWeek] = useState<number | 'all'>('all');

  useEffect(() => {
    async function loadRoadmap() {
      try {
        setLoading(true);
        const res = await api.getLearningPath(pathId);
        setLearningPath(res.learningPath);
        setTasks(res.tasks);
        setCourse(res.course);
        setExpandedDay(res.learningPath.currentDay);
      } catch (err) {
        console.error('Failed to load roadmap:', err);
      } finally {
        setLoading(false);
      }
    }
    loadRoadmap();
  }, [pathId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 bg-[#08090D]">
        <div className="h-7 w-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-slate-400">Loading AI roadmap...</p>
      </div>
    );
  }

  if (!learningPath) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 bg-[#08090D] text-slate-300">
        <p className="text-sm font-semibold mb-3">Learning path not found.</p>
        <button
          onClick={() => onNavigate('dashboard')}
          className="text-xs text-blue-400 hover:underline"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const completedDaysCount = tasks.filter(t => t.isCompleted).length;
  const progressPercent = Math.round((completedDaysCount / learningPath.totalDays) * 100);
  const totalWeeks = learningPath.durationWeeks;
  const filteredTasks = filterWeek === 'all'
    ? tasks
    : tasks.filter(t => Math.ceil(t.dayNumber / 7) === filterWeek);

  return (
    <div className="min-h-screen bg-[#08090D] py-10 text-slate-100">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 border-b border-white/[0.06] pb-3">
          <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">
            Dashboard
          </button>
          <span>/</span>
          <span className="text-slate-200 font-medium">Curriculum Roadmap</span>
        </div>

        {/* Roadmap Header Card */}
        <div className="surface-card p-6 sm:p-8 rounded-2xl shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
                <span>AI-Engineered Syllabus</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="font-mono tabular-nums">{learningPath.durationWeeks} Weeks ({learningPath.totalDays} Days)</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="font-mono tabular-nums">{learningPath.dailyMinutes} Min/Day</span>
              </div>

              <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {learningPath.courseTitle}
              </h1>

              {course && (
                <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                  {course.description}
                </p>
              )}
            </div>

            {/* Launch Current Day Button */}
            <div className="shrink-0 flex flex-col items-start sm:items-end gap-2">
              <button
                onClick={() => onNavigate('daily-session', { pathId: learningPath.id, dayNumber: learningPath.currentDay })}
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm shadow-blue-600/20 transition-all hover:scale-[1.02]"
              >
                <Play className="h-4 w-4 fill-white" />
                <span>
                  {learningPath.currentDay === 1
                    ? 'Start Day 1'
                    : `Resume Day ${learningPath.currentDay}`}
                </span>
              </button>
              <span className="text-[11px] text-slate-500 font-mono">
                Countdown starts on click
              </span>
            </div>
          </div>

          {/* Progress Bar & Metrics */}
          <div className="mt-8 pt-6 border-t border-white/[0.06] grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Completed: <strong className="text-white font-mono">{completedDaysCount}</strong> of <span className="font-mono">{learningPath.totalDays}</span> Days</span>
                <span className="font-mono font-semibold text-blue-400 tabular-nums">{progressPercent}%</span>
              </div>
              <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(2, progressPercent)}%` }}
                />
              </div>
            </div>

            <div className="flex items-center sm:justify-end gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Award className="h-4 w-4 text-amber-400" />
                <span>Certificate at Day {learningPath.totalDays}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Week Filter Controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setFilterWeek('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              filterWeek === 'all'
                ? 'bg-white/10 text-white border border-white/20'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.03] border border-transparent'
            }`}
          >
            All Days ({learningPath.totalDays})
          </button>
          {Array.from({ length: totalWeeks }, (_, idx) => idx + 1).map((w) => (
            <button
              key={w}
              onClick={() => setFilterWeek(w)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                filterWeek === w
                  ? 'bg-white/10 text-white border border-white/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.03] border border-transparent'
              }`}
            >
              Week {w} (Days {(w - 1) * 7 + 1}–{w * 7})
            </button>
          ))}
        </div>

        {/* Daily Modules List */}
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const isCompleted = task.isCompleted;
            const isCurrent = task.dayNumber === learningPath.currentDay;
            const isLocked = task.dayNumber > learningPath.currentDay;
            const isExpanded = expandedDay === task.dayNumber;

            return (
              <div
                key={task.id}
                className={`surface-card rounded-xl transition-all ${
                  isCurrent
                    ? 'border-blue-500/50 bg-[#0F121C]'
                    : isCompleted
                    ? 'border-emerald-500/30'
                    : 'border-white/[0.06] opacity-75'
                }`}
              >
                {/* Header row */}
                <div
                  onClick={() => setExpandedDay(isExpanded ? null : task.dayNumber)}
                  className="p-5 flex items-center justify-between cursor-pointer gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className={`h-9 w-9 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : isCurrent
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/[0.04] text-slate-500 border border-white/[0.06]'
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : isLocked ? (
                        <Lock className="h-3.5 w-3.5" />
                      ) : (
                        `D${task.dayNumber}`
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-0.5">
                        <span className="font-mono text-slate-300">Day {task.dayNumber}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono">{task.estimatedMinutes} mins</span>
                        {isCurrent && (
                          <span className="text-blue-400 font-medium">· Current Milestone</span>
                        )}
                        {isCompleted && (
                          <span className="text-emerald-400 font-medium">· Mastered</span>
                        )}
                      </div>
                      <h4 className="text-sm font-semibold text-white truncate">
                        {task.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {!isLocked && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate('daily-session', { pathId: learningPath.id, dayNumber: task.dayNumber });
                        }}
                        className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                          isCurrent
                            ? 'bg-blue-600 hover:bg-blue-500 text-white'
                            : 'bg-[#181B26] hover:bg-[#222736] text-slate-300 border border-white/[0.08]'
                        }`}
                      >
                        <Play className="h-3 w-3 fill-current" />
                        <span>{isCompleted ? 'Review' : 'Start'}</span>
                      </button>
                    )}
                    <button className="text-slate-500 hover:text-white p-1">
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-white/[0.06] text-xs space-y-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        Learning Objectives:
                      </p>
                      <ul className="space-y-1.5 text-slate-300">
                        {task.learningObjectives.map((obj, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-blue-400 mt-0.5">•</span>
                            <span>{obj}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                        Topics Covered:
                      </p>
                      <div className="flex items-center gap-2 text-slate-300 text-xs flex-wrap">
                        {task.subtopics.map((sub, i) => (
                          <React.Fragment key={i}>
                            {i > 0 && <span className="text-slate-600">/</span>}
                            <span>{sub}</span>
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500">
                        Includes study materials, live coding sandbox, and 10-MCQ assessment.
                      </span>
                      <button
                        onClick={() => onNavigate('daily-session', { pathId: learningPath.id, dayNumber: task.dayNumber })}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm shadow-blue-600/20 transition-colors"
                      >
                        <span>Launch Session</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

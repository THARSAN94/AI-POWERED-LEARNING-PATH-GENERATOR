import React, { useState, useEffect } from 'react';
import { DailyTask, LearningPath } from '../types';
import { api } from '../api';
import { StudyNotesViewer } from '../components/StudyNotesViewer';
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  Clock,
  CheckCircle2,
  Code2,
  Terminal,
  ArrowRight,
  BookOpen,
  Award,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';

interface DailySessionViewProps {
  pathId: string;
  dayNumber: number;
  onNavigate: (view: string, data?: any) => void;
}

export const DailySessionView: React.FC<DailySessionViewProps> = ({ pathId, dayNumber, onNavigate }) => {
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [task, setTask] = useState<DailyTask | null>(null);
  const [loading, setLoading] = useState(true);

  // Timer states - starts ONLY when user clicks "Start Day X"
  const [timerStarted, setTimerStarted] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [initialDurationSeconds, setInitialDurationSeconds] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<Record<number, boolean>>({});

  // Interactive Code Playground states
  const [codeEditorValue, setCodeEditorValue] = useState('');
  const [codeOutput, setCodeOutput] = useState<string | null>(null);
  const [isRunningCode, setIsRunningCode] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  // Session completion
  const [submittingSession, setSubmittingSession] = useState(false);

  useEffect(() => {
    async function loadDay() {
      try {
        setLoading(true);
        const res = await api.getDayTask(pathId, dayNumber);
        setLearningPath(res.learningPath);
        setTask(res.task);

        const totalSecs = (res.task.estimatedMinutes || res.learningPath.dailyMinutes || 60) * 60;
        setInitialDurationSeconds(totalSecs);
        setSecondsRemaining(totalSecs);

        if (res.task.codingTask) {
          setCodeEditorValue(res.task.codingTask.starterCode);
        }
      } catch (err) {
        console.error('Failed to load day task:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDay();
  }, [pathId, dayNumber]);

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerStarted && timerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => Math.max(0, prev - 1));
      }, 1000);
    } else if (secondsRemaining === 0 && timerStarted) {
      setTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerStarted, timerRunning, secondsRemaining]);

  const handleStartTimer = () => {
    setTimerStarted(true);
    setTimerRunning(true);
  };

  const handlePauseResume = () => {
    setTimerRunning(!timerRunning);
  };

  const handleResetTimer = () => {
    setSecondsRemaining(initialDurationSeconds);
    setTimerRunning(false);
  };

  const handleAddFiveMinutes = () => {
    setSecondsRemaining((prev) => prev + 300);
  };

  const toggleExercise = (index: number) => {
    setCompletedExercises((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleRunCode = () => {
    setIsRunningCode(true);
    setCodeOutput(null);
    setTimeout(() => {
      try {
        const logs: string[] = [];
        const originalLog = console.log;
        console.log = (...args: any[]) => {
          logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
        };

        try {
          const fn = new Function(codeEditorValue);
          fn();
          setCodeOutput(logs.length > 0 ? logs.join('\n') : 'Code executed cleanly with 0 runtime errors.');
        } catch (execErr: any) {
          setCodeOutput(`Runtime Error:\n${execErr.message}${logs.length > 0 ? '\n' + logs.join('\n') : ''}`);
        } finally {
          console.log = originalLog;
        }
      } catch (e: any) {
        setCodeOutput(`Execution Error: ${e.message}`);
      } finally {
        setIsRunningCode(false);
      }
    }, 350);
  };

  const handleProceedToAssessment = async () => {
    try {
      setSubmittingSession(true);
      const secondsSpent = initialDurationSeconds - secondsRemaining;
      await api.completeSession(pathId, dayNumber, Math.max(60, secondsSpent));
      onNavigate('daily-assessment', { pathId, dayNumber });
    } catch (err: any) {
      console.error('Failed to finalize session:', err);
      onNavigate('daily-assessment', { pathId, dayNumber });
    } finally {
      setSubmittingSession(false);
    }
  };

  if (loading || !task || !learningPath) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 bg-[#08090D]">
        <div className="h-7 w-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-slate-400">Loading Day {dayNumber} syllabus...</p>
      </div>
    );
  }

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const timerProgress = initialDurationSeconds > 0
    ? Math.round(((initialDurationSeconds - secondsRemaining) / initialDurationSeconds) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#08090D] text-slate-100 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Breadcrumbs */}
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">
              Dashboard
            </button>
            <span>/</span>
            <button onClick={() => onNavigate('roadmap', { pathId })} className="hover:text-white transition-colors">
              {learningPath.courseTitle}
            </button>
            <span>/</span>
            <span className="text-slate-200 font-medium font-mono">Day {dayNumber} of {learningPath.totalDays}</span>
          </div>

          <button
            onClick={() => onNavigate('roadmap', { pathId })}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
          >
            ← View Roadmap
          </button>
        </div>

        {/* TIMER BAR & SESSION CONTROL DECK */}
        <div className="sticky top-16 z-30 rounded-xl border border-white/[0.1] bg-[#0E1017]/95 p-4 sm:p-5 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">
                <span>Day {dayNumber} Curriculum</span>
                <span aria-hidden="true" className="text-slate-600">·</span>
                <span className="font-mono tabular-nums">{learningPath.dailyMinutes} min session</span>
              </div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-white tracking-tight">
                {task.title}
              </h2>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center gap-3">
              {!timerStarted ? (
                <button
                  onClick={handleStartTimer}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm shadow-blue-600/20 transition-all hover:scale-[1.02]"
                >
                  <Play className="h-4 w-4 fill-white" />
                  <span>Start Day {dayNumber} Timer</span>
                </button>
              ) : (
                <div className="flex items-center gap-2.5">
                  {/* Digital Clock Display */}
                  <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#08090D] border border-white/[0.08]">
                    <div className={`h-2 w-2 rounded-full ${timerRunning ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                    <span className="font-mono text-base font-bold tabular-nums text-white">
                      {formatTime(secondsRemaining)}
                    </span>
                  </div>

                  {/* Pause / Resume */}
                  <button
                    onClick={handlePauseResume}
                    className="p-2 text-slate-300 hover:text-white bg-[#181B26] hover:bg-[#222736] rounded-lg border border-white/[0.08] transition-colors"
                    title={timerRunning ? 'Pause Timer' : 'Resume Timer'}
                  >
                    {timerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current" />}
                  </button>

                  {/* +5 Minutes */}
                  <button
                    onClick={handleAddFiveMinutes}
                    className="px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-[#181B26] hover:bg-[#222736] rounded-lg border border-white/[0.08] transition-colors flex items-center gap-1"
                    title="Add 5 Minutes"
                  >
                    <Plus className="h-3 w-3" />
                    <span>5m</span>
                  </button>

                  {/* Reset */}
                  <button
                    onClick={handleResetTimer}
                    className="p-2 text-slate-400 hover:text-white bg-[#181B26] hover:bg-[#222736] rounded-lg border border-white/[0.08] transition-colors"
                    title="Reset Timer"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* Assessment CTA */}
              <button
                onClick={handleProceedToAssessment}
                disabled={submittingSession}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm shadow-emerald-600/20 transition-all disabled:opacity-50 whitespace-nowrap"
              >
                <span>Take 10-MCQ Assessment</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Timer progress track */}
          {timerStarted && (
            <div className="mt-3 pt-3 border-t border-white/[0.06]">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                <span>Progress: <span className="font-mono tabular-nums">{timerProgress}%</span></span>
                <span>{secondsRemaining === 0 ? 'Goal Completed!' : `${Math.ceil(secondsRemaining / 60)} minutes left`}</span>
              </div>
              <div className="h-1.5 w-full bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${timerProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* TWO-ZONE STAGE & CONTROL DECK */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Stage (8 cols): Concepts & Interactive Code Sandbox */}
          <div className="lg:col-span-8 space-y-8">
            {/* Core Explanation & Structured Notes */}
            <StudyNotesViewer
              markdown={task.explanationMarkdown}
              courseTitle={learningPath?.courseTitle}
              dayNumber={task.dayNumber}
              totalDays={learningPath?.totalDays}
              topic={task.topic}
              subtopics={task.subtopics}
            />

            {/* Interactive In-Browser Code Sandbox */}
            {task.codingTask && (
              <div className="surface-card rounded-xl overflow-hidden shadow-xl">
                {/* Editor Header */}
                <div className="px-5 py-3.5 bg-[#08090D] border-b border-white/[0.08] flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Code2 className="h-4 w-4 text-blue-400" />
                    <span className="text-xs font-bold text-white">{task.codingTask.title}</span>
                    <span className="text-[10px] text-slate-400 uppercase font-mono px-1.5 py-0.5 rounded bg-white/[0.06]">
                      {task.codingTask.language}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {task.codingTask.solutionCode && (
                      <button
                        onClick={() => setShowSolution(!showSolution)}
                        className="px-2.5 py-1 text-[11px] font-medium text-slate-400 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] rounded-md transition-colors flex items-center gap-1"
                      >
                        {showSolution ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        <span>{showSolution ? 'Hide Solution' : 'View Solution'}</span>
                      </button>
                    )}
                    <button
                      onClick={handleRunCode}
                      disabled={isRunningCode}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-md shadow-sm shadow-blue-600/20 transition-all disabled:opacity-50"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      <span>{isRunningCode ? 'Executing...' : 'Run Code'}</span>
                    </button>
                  </div>
                </div>

                {/* Instructions */}
                <div className="p-4 bg-[#0B0D14] border-b border-white/[0.06] text-xs text-slate-300">
                  <p className="font-semibold text-slate-200 mb-1">Coding Instructions:</p>
                  <p className="text-slate-400 leading-relaxed">{task.codingTask.instructions}</p>
                </div>

                {/* Code Textarea */}
                <div className="p-4 bg-[#08090D]">
                  <textarea
                    rows={10}
                    value={codeEditorValue}
                    onChange={(e) => setCodeEditorValue(e.target.value)}
                    spellCheck={false}
                    className="w-full bg-transparent font-mono text-xs text-blue-200 focus:outline-none resize-y leading-relaxed"
                  />
                </div>

                {/* Output Console */}
                {codeOutput && (
                  <div className="border-t border-white/[0.08] p-4 bg-black/70 font-mono text-xs">
                    <div className="flex items-center gap-1.5 text-slate-400 mb-2">
                      <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="font-semibold text-slate-300">Terminal Output:</span>
                    </div>
                    <pre className="text-emerald-400 whitespace-pre-wrap">{codeOutput}</pre>
                  </div>
                )}

                {/* Solution Dropdown */}
                {showSolution && task.codingTask.solutionCode && (
                  <div className="border-t border-white/[0.08] p-4 bg-[#08090D] font-mono text-xs">
                    <p className="text-[11px] font-semibold text-amber-400 mb-2 font-sans">Official Reference Solution:</p>
                    <pre className="text-slate-300 bg-[#12141D] p-3 rounded-lg overflow-x-auto">
                      {task.codingTask.solutionCode}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Control Deck (4 cols): Objectives, Exercises, Subtopics, Quiz prompt */}
          <div className="lg:col-span-4 space-y-6">
            {/* Daily Objectives */}
            <div className="surface-card p-5 rounded-xl space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Today's Objectives
              </h3>
              <ul className="space-y-2 text-xs text-slate-300">
                {task.learningObjectives.map((goal, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{goal}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Practical Exercises with Interactive Checkbox */}
            <div className="surface-card p-5 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                  Practical Exercises
                </h3>
                <span className="font-mono text-[11px] text-slate-400 tabular-nums">
                  {Object.values(completedExercises).filter(Boolean).length} / {task.practicalExercises.length} Done
                </span>
              </div>

              <div className="space-y-2.5">
                {task.practicalExercises.map((exercise, idx) => {
                  const isDone = !!completedExercises[idx];
                  return (
                    <div
                      key={idx}
                      onClick={() => toggleExercise(idx)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all flex items-start gap-3 ${
                        isDone
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200'
                          : 'border-white/[0.08] bg-[#08090D] text-slate-300 hover:border-white/20'
                      }`}
                    >
                      <div
                        className={`h-4 w-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                          isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-600'
                        }`}
                      >
                        {isDone && <CheckCircle2 className="h-3.5 w-3.5" />}
                      </div>
                      <span className="text-xs leading-relaxed">{exercise}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Subtopics Checklist */}
            <div className="surface-card p-5 rounded-xl space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Topics & Modules
              </h3>
              <div className="space-y-1.5">
                {task.subtopics.map((sub, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-[#08090D] border border-white/[0.06] text-xs text-slate-300">
                    {sub}
                  </div>
                ))}
              </div>
            </div>

            {/* Assessment Callout */}
            <div className="surface-card p-5 rounded-xl text-center space-y-3 border-emerald-500/30">
              <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-display text-sm font-bold text-white">Day {dayNumber} Assessment</h4>
                <p className="text-xs text-slate-400 mt-1">
                  10 multiple-choice questions covering today's concepts. 70% passing threshold.
                </p>
              </div>
              <button
                onClick={handleProceedToAssessment}
                disabled={submittingSession}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 py-2.5 px-4 text-xs font-semibold text-white shadow-sm shadow-emerald-600/20 transition-all"
              >
                <span>Launch 10-MCQ Quiz</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

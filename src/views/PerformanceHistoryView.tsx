import React, { useState, useEffect } from 'react';
import { AssessmentResultItem } from '../types';
import { api } from '../api';
import {
  FileCheck2,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Search,
  ChevronRight
} from 'lucide-react';

interface PerformanceHistoryViewProps {
  onNavigate: (view: string, data?: any) => void;
}

export const PerformanceHistoryView: React.FC<PerformanceHistoryViewProps> = ({ onNavigate }) => {
  const [results, setResults] = useState<AssessmentResultItem[]>([]);
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [passedQuizzes, setPassedQuizzes] = useState(0);
  const [avgPercentage, setAvgPercentage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCourseFilter, setSelectedCourseFilter] = useState('All');

  useEffect(() => {
    async function loadHistory() {
      try {
        setLoading(true);
        const res = await api.getPerformanceHistory();
        setResults(res.results);
        setTotalQuizzes(res.totalQuizzes);
        setPassedQuizzes(res.passedQuizzes);
        setAvgPercentage(res.avgPercentage);
      } catch (err) {
        console.error('Failed to load performance history:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  const coursesList = Array.from(new Set(results.map(r => r.courseName)));

  const filteredResults = results.filter((r) => {
    const matchesCourse = selectedCourseFilter === 'All' || r.courseName === selectedCourseFilter;
    const matchesSearch = !search ||
      r.courseName.toLowerCase().includes(search.toLowerCase()) ||
      `day ${r.dayNumber}`.toLowerCase().includes(search.toLowerCase());
    return matchesCourse && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 bg-[#08090D]">
        <div className="h-7 w-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-slate-400">Loading performance records from permanent database...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08090D] text-slate-100 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">
              <span>Permanent Database Ledger</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>10-Question Daily Assessments</span>
            </div>
            <h1 className="font-display text-3xl font-bold text-white tracking-tight">
              Performance History & Analytics
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Inspect your verified evaluation results across all learning days. Every score, answer evaluation, and date is stored permanently in the database.
            </p>
          </div>

          <button
            onClick={() => onNavigate('dashboard')}
            className="px-4 py-2.5 text-xs font-medium text-slate-300 hover:text-white bg-[#12141D] hover:bg-[#181B26] border border-white/[0.08] rounded-lg transition-colors"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Aggregate Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="surface-card p-5 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">Assessments Completed</span>
              <FileCheck2 className="h-4 w-4 text-blue-400" />
            </div>
            <p className="font-mono text-3xl font-bold text-white tabular-nums">{totalQuizzes}</p>
            <p className="text-[11px] text-slate-500 mt-1">10-question evaluation sessions</p>
          </div>

          <div className="surface-card p-5 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">Passing Rate</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="font-mono text-3xl font-bold text-emerald-400 tabular-nums">
              {totalQuizzes > 0 ? Math.round((passedQuizzes / totalQuizzes) * 100) : 0}%
            </p>
            <p className="text-[11px] text-slate-500 mt-1">{passedQuizzes} of {totalQuizzes} passed</p>
          </div>

          <div className="surface-card p-5 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">Cumulative Accuracy</span>
              <TrendingUp className="h-4 w-4 text-sky-400" />
            </div>
            <p className="font-mono text-3xl font-bold text-sky-400 tabular-nums">{avgPercentage}%</p>
            <p className="text-[11px] text-slate-500 mt-1">Across all daily milestones</p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by course or day..."
              className="w-full rounded-lg border border-white/[0.08] bg-[#0E1017] pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          {coursesList.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Course:</span>
              <select
                value={selectedCourseFilter}
                onChange={(e) => setSelectedCourseFilter(e.target.value)}
                className="rounded-lg border border-white/[0.08] bg-[#0E1017] px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="All">All Courses</option>
                {coursesList.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Table of Assessment Records */}
        {filteredResults.length === 0 ? (
          <div className="surface-card p-12 rounded-xl text-center text-xs text-slate-400 space-y-3">
            <FileCheck2 className="h-8 w-8 text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-white">No Assessment Records Found</p>
            <p>Start a daily learning session and take the 10-question evaluation at the end of the day to record your scores.</p>
            <button
              onClick={() => onNavigate('courses')}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm"
            >
              Explore Courses
            </button>
          </div>
        ) : (
          <div className="surface-card rounded-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#08090D] text-slate-400 border-b border-white/[0.06] font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-5">Course Title</th>
                    <th className="py-3.5 px-4">Day</th>
                    <th className="py-3.5 px-4">Date Recorded</th>
                    <th className="py-3.5 px-4">Score</th>
                    <th className="py-3.5 px-4">Percentage</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-5">Feedback</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-slate-300">
                  {filteredResults.map((item) => (
                    <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-5 font-semibold text-white">
                        {item.courseName}
                      </td>
                      <td className="py-4 px-4 font-mono text-slate-300 font-medium">
                        Day {item.dayNumber}
                      </td>
                      <td className="py-4 px-4 text-slate-400 whitespace-nowrap font-mono">
                        {new Date(item.completedAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="py-4 px-4 font-mono tabular-nums font-bold text-white">
                        {item.score} <span className="text-slate-500 font-normal">/ {item.totalQuestions}</span>
                      </td>
                      <td className="py-4 px-4 font-mono tabular-nums">
                        <span
                          className={`font-bold ${
                            item.percentage >= 70 ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        >
                          {item.percentage}%
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                            item.passed ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        >
                          {item.passed ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                          <span>{item.passed ? 'Passed' : 'Needs Review'}</span>
                        </span>
                      </td>
                      <td className="py-4 px-5 text-slate-400 text-xs max-w-xs truncate">
                        {item.feedback}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => onNavigate('daily-session', { pathId: item.learningPathId, dayNumber: item.dayNumber })}
                          className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors whitespace-nowrap"
                        >
                          Review Day →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Course } from '../types';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import {
  Search,
  BookOpen,
  ArrowRight,
  Clock,
  Calendar,
  X,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface CourseLibraryViewProps {
  onNavigate: (view: string, data?: any) => void;
  onSelectCourseToConfigure: (course: Course) => void;
}

export const CourseLibraryView: React.FC<CourseLibraryViewProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Courses');
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  // Modal for duration & daily time configuration
  const [activeCourseModal, setActiveCourseModal] = useState<Course | null>(null);
  const [durationWeeks, setDurationWeeks] = useState<number>(8); // 4, 8, 12
  const [dailyMinutes, setDailyMinutes] = useState<number>(60); // 30, 45, 60, 120
  const [generating, setGenerating] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        const res = await api.getCourses({
          category: selectedCategory,
          search: searchQuery,
          level: selectedLevel !== 'All' ? selectedLevel : undefined,
        });
        setCourses(res.courses);
        setCategories(res.categories);
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(fetchCourses, 150);
    return () => clearTimeout(timer);
  }, [selectedCategory, selectedLevel, searchQuery]);

  const handleOpenConfigurator = (course: Course) => {
    if (!user) {
      onNavigate('login');
      return;
    }
    setActiveCourseModal(course);
    setGenerationError(null);
  };

  const handleGenerateRoadmap = async () => {
    if (!activeCourseModal || !user) return;
    try {
      setGenerating(true);
      setGenerationError(null);
      const res = await api.generateRoadmap({
        courseId: activeCourseModal.id,
        durationWeeks,
        dailyMinutes,
      });
      setActiveCourseModal(null);
      onNavigate('roadmap', { pathId: res.learningPath.id });
    } catch (err: any) {
      setGenerationError(err.message || 'Roadmap generation failed. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090D] py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="border-b border-white/[0.08] pb-8">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-2">
            <span>Lonexora Course Directory</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>54 Production Engineering Tracks</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Curriculum Catalog & Path Configurator
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-2xl leading-relaxed">
            Select any technical track across Web, Backend, Systems, Cloud, AI, and Cybersecurity. Choose your target duration and daily study budget to synthesize a day-by-day roadmap.
          </p>
        </div>

        {/* Filter & Search Controls */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tracks (e.g. React, Java, Docker, Python, PostgreSQL, Rust, AWS)..."
                className="w-full rounded-lg border border-white/[0.08] bg-[#0E1017] pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="rounded-lg border border-white/[0.08] bg-[#0E1017] px-3.5 py-2.5 text-xs text-slate-300 focus:border-blue-500 focus:outline-none"
              >
                <option value="All">All Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Interactive Segmented Filter Controls */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-white/10 text-white border border-white/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.03] border border-transparent'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-400 border-b border-white/[0.06] pb-3">
          <span>
            Available tracks: <strong className="text-white font-mono tabular-nums">{courses.length}</strong>
          </span>
          <span className="text-[11px] text-slate-500 hidden sm:inline">Select track to generate personalized AI syllabus</span>
        </div>

        {/* Course Cards Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="h-7 w-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-400">Loading catalog...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="py-20 text-center surface-card p-8 rounded-xl">
            <p className="text-sm font-semibold text-white mb-1">No courses matched your search criteria</p>
            <p className="text-xs text-slate-400 mb-4">Try clearing filters or adjusting search terms</p>
            <button
              onClick={() => {
                setSelectedCategory('All Courses');
                setSelectedLevel('All');
                setSearchQuery('');
              }}
              className="px-4 py-2 text-xs font-medium text-blue-400 hover:text-blue-300 border border-blue-500/30 rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                className="surface-card surface-card-hover group rounded-xl p-6 flex flex-col justify-between"
              >
                <div>
                  {/* Clean unboxed metadata */}
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                    <span className="text-slate-300 font-medium">{course.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{course.level}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">~{course.estimatedHours} hrs</span>
                  </div>

                  <h3 className="text-base font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors leading-snug">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed mb-5 line-clamp-3">
                    {course.description}
                  </p>

                  {/* Prerequisites unboxed */}
                  {course.prerequisites && course.prerequisites.length > 0 && (
                    <div className="mb-4 text-[11px] text-slate-500">
                      <span className="text-slate-400">Prereq: </span>
                      <span>{course.prerequisites.join(', ')}</span>
                    </div>
                  )}

                  {/* Unboxed tags */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-6 flex-wrap">
                    {course.tags.slice(0, 4).map((tag, idx) => (
                      <React.Fragment key={tag}>
                        {idx > 0 && <span className="text-slate-600">/</span>}
                        <span>{tag}</span>
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-xs text-slate-400">4, 8, or 12 Weeks</span>
                  <button
                    onClick={() => handleOpenConfigurator(course)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm shadow-blue-600/20 transition-all"
                  >
                    <span>Generate Roadmap</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Roadmap Configurator Modal */}
      {activeCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-2xl border border-white/[0.1] bg-[#0E1017] p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setActiveCourseModal(null)}
              className="absolute right-4 top-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.05]"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">
              <span>Path Configuration</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{activeCourseModal.category}</span>
            </div>

            <h3 className="font-display text-xl font-bold text-white mb-2 leading-snug">
              {activeCourseModal.title}
            </h3>

            <p className="text-xs text-slate-400 mb-6 leading-relaxed">
              Define your target program duration and daily focus time. The curriculum engine will synthesize your sequential Day 1 to Day N syllabus.
            </p>

            {generationError && (
              <div className="mb-5 rounded-lg border border-rose-500/30 bg-rose-950/20 p-3 text-xs text-rose-300">
                {generationError}
              </div>
            )}

            <div className="space-y-5 mb-8">
              {/* Duration Options */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2 flex items-center justify-between">
                  <span>Program Duration</span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {durationWeeks * 7} Learning Days
                  </span>
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { weeks: 4, days: 28, label: '4 Weeks', pace: 'Accelerated' },
                    { weeks: 8, days: 56, label: '8 Weeks', pace: 'Recommended' },
                    { weeks: 12, days: 84, label: '12 Weeks', pace: 'Deep Dive' },
                  ].map((option) => (
                    <button
                      key={option.weeks}
                      type="button"
                      onClick={() => setDurationWeeks(option.weeks)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        durationWeeks === option.weeks
                          ? 'border-blue-500 bg-blue-500/10 text-white'
                          : 'border-white/[0.08] bg-[#12141D] text-slate-300 hover:border-white/20'
                      }`}
                    >
                      <p className="font-semibold text-xs text-white">{option.label}</p>
                      <p className="text-[11px] font-mono text-blue-400 mt-0.5">{option.days} Days</p>
                      <p className="text-[10px] text-slate-400 mt-1">{option.pace}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Daily Learning Time */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-2 flex items-center justify-between">
                  <span>Daily Study Commitment</span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {dailyMinutes >= 60 ? `${dailyMinutes / 60} hr/day` : `${dailyMinutes} min/day`}
                  </span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { mins: 30, label: '30 min' },
                    { mins: 45, label: '45 min' },
                    { mins: 60, label: '1 hour' },
                    { mins: 120, label: '2 hours' },
                  ].map((m) => (
                    <button
                      key={m.mins}
                      type="button"
                      onClick={() => setDailyMinutes(m.mins)}
                      className={`py-2 px-3 rounded-lg border text-center transition-all text-xs ${
                        dailyMinutes === m.mins
                          ? 'border-blue-500 bg-blue-500/10 text-white font-medium'
                          : 'border-white/[0.08] bg-[#12141D] text-slate-400 hover:text-white hover:border-white/20'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/[0.08]">
              <button
                type="button"
                onClick={() => setActiveCourseModal(null)}
                disabled={generating}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGenerateRoadmap}
                disabled={generating}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md shadow-blue-600/20 disabled:opacity-50 transition-all"
              >
                {generating ? (
                  <>
                    <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Synthesizing Curriculum...</span>
                  </>
                ) : (
                  <>
                    <span>Generate AI Roadmap</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { Course } from '../types';
import { useAuth } from '../context/AuthContext';
import {
  ArrowRight,
  BookOpen,
  Award,
  ShieldCheck,
  QrCode,
  Check,
  ChevronRight
} from 'lucide-react';

interface LandingViewProps {
  onNavigate: (view: string, data?: any) => void;
  featuredCourses: Course[];
}

export const LandingView: React.FC<LandingViewProps> = ({ onNavigate, featuredCourses }) => {
  const { user, demoLogin } = useAuth();

  return (
    <div className="min-h-screen bg-[#08090D] text-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32 border-b border-white/[0.06] bg-tech-grid">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src="/src/assets/images/hero_learning_platform_1790181525117.jpg"
            alt="Lonexora Skills High-Tech Learning Platform"
            className="w-full h-full object-cover object-center opacity-25"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08090D] via-[#08090D]/85 to-[#08090D]/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#08090D] via-[#08090D]/80 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Unboxed metadata kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-4">
              <span>Lonexora Technical Academy</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>50+ Engineering Courses</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Verifiable Credentials</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6 leading-[1.1] text-balance">
              Personalized AI Learning Roadmaps for Tech Mastery
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed mb-10 max-w-2xl">
              Select from over 50 technical courses across Java, Python, React, Cloud, DevOps, and AI. Define your schedule (4, 8, or 12 weeks) and daily commitment. Generate a sequential Day 1 to Day N syllabus with live countdown timers, interactive coding sandboxes, and daily 10-question assessments.
            </p>

            <div className="flex flex-wrap items-center gap-3.5">
              {user ? (
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md shadow-blue-600/20 transition-all hover:-translate-y-0.5"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                <>
                  <button
                    onClick={() => onNavigate('register')}
                    className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md shadow-blue-600/20 transition-all hover:-translate-y-0.5"
                  >
                    <span>Start Learning</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <button
                    onClick={async () => {
                      await demoLogin();
                      onNavigate('dashboard');
                    }}
                    className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-medium text-slate-200 hover:text-white bg-[#12141D] hover:bg-[#181B26] border border-white/[0.08] rounded-lg transition-all"
                  >
                    <span>Try Demo Account</span>
                  </button>
                </>
              )}
              <button
                onClick={() => onNavigate('courses')}
                className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-medium text-slate-300 hover:text-white border border-white/[0.06] hover:border-white/20 rounded-lg transition-colors"
              >
                <BookOpen className="h-4 w-4 text-slate-400" />
                <span>Browse Catalog</span>
              </button>
            </div>

            {/* Proof Metrics - Claim-to-Proof Adjacency */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 mt-12 border-t border-white/[0.08]">
              <div>
                <p className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">54</p>
                <p className="text-xs text-slate-400 mt-1">Specialized Tracks</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold font-mono text-blue-400 tabular-nums">100%</p>
                <p className="text-xs text-slate-400 mt-1">Daily AI Syllabus</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">10 MCQ</p>
                <p className="text-xs text-slate-400 mt-1">Daily Knowledge Tests</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold font-mono text-amber-400 tabular-nums">Verifiable</p>
                <p className="text-xs text-slate-400 mt-1">Official Credentials</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Architecture & Stages */}
      <section className="py-20 border-b border-white/[0.06] bg-[#0A0C12]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">Structured Methodology</span>
            <h2 className="font-display text-3xl font-bold text-white mt-2 text-balance">
              The Daily Engineering Retention Model
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Every day is constructed to guarantee deliberate practice, measurable comprehension, and verifiable progression.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="surface-card p-6 flex flex-col justify-between rounded-xl">
              <div>
                <span className="font-mono text-xs font-semibold text-blue-400">01.</span>
                <h3 className="text-base font-semibold text-white mt-3 mb-2">Scope & Pace Selection</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Select from 50+ courses. Choose 4, 8, or 12 weeks duration, and 30, 45, 60, or 120 minutes daily learning time.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/[0.06] text-[11px] text-slate-500">
                Tailored to your current level
              </div>
            </div>

            <div className="surface-card p-6 flex flex-col justify-between rounded-xl">
              <div>
                <span className="font-mono text-xs font-semibold text-blue-400">02.</span>
                <h3 className="text-base font-semibold text-white mt-3 mb-2">AI Syllabus Synthesis</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Generates an unalterable day-by-day curriculum from Day 1 to Day N with core subtopics, objectives, and code exercises.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/[0.06] text-[11px] text-slate-500">
                Persistent database record
              </div>
            </div>

            <div className="surface-card p-6 flex flex-col justify-between rounded-xl">
              <div>
                <span className="font-mono text-xs font-semibold text-blue-400">03.</span>
                <h3 className="text-base font-semibold text-white mt-3 mb-2">Timed Daily Session</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The countdown starts only upon explicit activation. Read structured concepts and write code in the live sandbox.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/[0.06] text-[11px] text-slate-500">
                In-browser live evaluation
              </div>
            </div>

            <div className="surface-card p-6 flex flex-col justify-between rounded-xl">
              <div>
                <span className="font-mono text-xs font-semibold text-emerald-400">04.</span>
                <h3 className="text-base font-semibold text-white mt-3 mb-2">10-Question Assessment</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Score at least 70% to complete the day. Every question includes deep conceptual architectural feedback.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-white/[0.06] text-[11px] text-emerald-400/90 font-medium">
                Cryptographic graduation cert
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses Showcase */}
      <section className="py-20 border-b border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">Curriculum Catalog</span>
              <h2 className="font-display text-3xl font-bold text-white mt-1">Featured High-Demand Tracks</h2>
              <p className="text-sm text-slate-400 mt-2">Explore 50+ specialized engineering tracks ready for roadmap generation.</p>
            </div>
            <button
              onClick={() => onNavigate('courses')}
              className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              <span>View All 50+ Courses</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.slice(0, 6).map((course) => (
              <div
                key={course.id}
                onClick={() => onNavigate('course-detail', course)}
                className="surface-card surface-card-hover group cursor-pointer p-6 rounded-xl flex flex-col justify-between"
              >
                <div>
                  {/* Clean unboxed metadata with bullet separators */}
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                    <span className="text-slate-300 font-medium">{course.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{course.level}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">~{course.estimatedHours} hrs</span>
                  </div>

                  <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors mb-2 leading-snug">
                    {course.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed mb-6 line-clamp-3">
                    {course.description}
                  </p>
                </div>

                <div>
                  {/* Unboxed tags */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-5 flex-wrap">
                    {course.tags.slice(0, 4).map((tag, idx) => (
                      <React.Fragment key={tag}>
                        {idx > 0 && <span className="text-slate-600">/</span>}
                        <span>{tag}</span>
                      </React.Fragment>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
                    <span className="text-slate-400">4, 8, or 12 Weeks</span>
                    <span className="font-medium text-blue-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                      Configure <ChevronRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificate Spotlight */}
      <section className="py-20 border-b border-white/[0.06] bg-[#0A0C12]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="surface-card p-8 sm:p-12 lg:p-14 rounded-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3">
                  <Award className="h-4 w-4" />
                  <span>Credential Standard</span>
                </div>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight mb-4 text-balance">
                  Official Lonexora Skills Certificates with Scannable QR Proof
                </h2>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  Upon completing every daily learning session and achieving passing scores on all 10-question assessments, you earn a distinguished certificate. Each credential contains a unique verification ID and a cryptographically verifiable QR code that anyone or prospective employer can inspect in real-time.
                </p>

                <div className="space-y-3 mb-8 text-xs text-slate-300">
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Public verification URL for LinkedIn, portfolios, & CVs</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Tamper-proof permanent database storage</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Printable high-resolution ceremonial award format</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => onNavigate('verify')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-[#181B26] hover:bg-[#202535] border border-white/[0.1] rounded-lg transition-colors"
                  >
                    <QrCode className="h-4 w-4 text-blue-400" />
                    <span>Open Verification Portal</span>
                  </button>
                  <button
                    onClick={() => onNavigate('courses')}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm shadow-blue-600/20 transition-colors"
                  >
                    <span>Start Your First Path</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Certificate visual mock */}
              <div className="relative mx-auto w-full max-w-md">
                <div className="rounded-xl border border-amber-500/40 bg-[#08090D] p-6 certificate-frame relative">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-4">
                    <div>
                      <p className="font-display text-sm font-bold text-white tracking-tight">LONEXORA SKILLS</p>
                      <p className="text-[10px] text-slate-400">Academy of Advanced Computing</p>
                    </div>
                    <img
                      src="/src/assets/images/certificate_seal_badge_1790181537015.jpg"
                      alt="Lonexora Official Seal"
                      className="h-11 w-11 rounded-full object-cover border border-amber-500/40 shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <p className="text-[10px] text-slate-400 uppercase tracking-widest text-center mt-2">Certificate of Technical Mastery</p>
                  <h4 className="font-display text-lg font-bold text-center text-white my-2">Alex Rivera</h4>
                  <p className="text-xs text-slate-300 text-center mb-4">
                    Has successfully mastered the curriculum and completed all daily assessments for
                  </p>
                  <div className="bg-[#12141D] border border-white/[0.08] rounded-lg p-3 text-center mb-4">
                    <p className="text-xs font-bold text-blue-300">Python 3: From Fundamentals to Metaprogramming</p>
                    <p className="text-[10px] font-mono text-slate-400 mt-0.5">8 Weeks · 56 Days · Grade 94%</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.08] text-[10px] text-slate-400">
                    <div>
                      <p className="font-mono text-slate-300">ID: LX-2026-F89A12</p>
                      <p className="text-emerald-400 font-medium">Valid Credential</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-blue-400 font-medium">
                      <QrCode className="h-4 w-4" />
                      <span>Scan to verify</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-24 text-center">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-white tracking-tight mb-4">
            Begin Your Structured Engineering Trajectory
          </h2>
          <p className="text-sm text-slate-400 mb-8 max-w-xl mx-auto">
            Create an account, pick your target domain, define your pace, and start Day 1 immediately.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3.5">
            <button
              onClick={() => onNavigate('register')}
              className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md shadow-blue-600/20 transition-all hover:-translate-y-0.5"
            >
              Register Free
            </button>
            <button
              onClick={() => onNavigate('courses')}
              className="px-6 py-3 text-sm font-medium text-slate-300 hover:text-white bg-[#12141D] hover:bg-[#181B26] border border-white/[0.08] rounded-lg transition-colors"
            >
              Explore 50+ Courses
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

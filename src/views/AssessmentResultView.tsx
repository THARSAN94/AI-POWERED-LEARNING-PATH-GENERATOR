import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { AssessmentSubmissionResult } from '../types';
import {
  Award,
  CheckCircle2,
  XCircle,
  ArrowRight,
  TrendingUp,
  FileCheck2,
  ChevronRight
} from 'lucide-react';

interface AssessmentResultViewProps {
  pathId: string;
  dayNumber: number;
  result: AssessmentSubmissionResult;
  onNavigate: (view: string, data?: any) => void;
}

export const AssessmentResultView: React.FC<AssessmentResultViewProps> = ({
  pathId,
  dayNumber,
  result,
  onNavigate,
}) => {
  useEffect(() => {
    if (result.passed) {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // Confetti optional
      }
    }
  }, [result.passed]);

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="min-h-screen bg-[#08090D] text-slate-100 py-10">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Results Hero Card */}
        <div
          className={`surface-card p-6 sm:p-8 rounded-2xl text-center space-y-4 ${
            result.passed ? 'border-emerald-500/30' : 'border-amber-500/30'
          }`}
        >
          <div
            className={`inline-flex h-14 w-14 items-center justify-center rounded-xl border mb-2 ${
              result.passed
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}
          >
            {result.passed ? <CheckCircle2 className="h-7 w-7" /> : <TrendingUp className="h-7 w-7" />}
          </div>

          <div className="space-y-1">
            <span
              className={`text-xs font-semibold uppercase tracking-wider ${
                result.passed ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {result.passed ? 'Assessment Passed (Threshold >= 70%)' : 'Review Recommended'}
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Day {dayNumber} Evaluation Result
            </h1>
          </div>

          {/* Scores Display with Tabular Figures */}
          <div className="flex items-center justify-center gap-8 py-4">
            <div>
              <p className="font-mono text-4xl sm:text-5xl font-bold text-white tabular-nums">
                {result.score} <span className="text-xl sm:text-2xl font-normal text-slate-500">/ {result.totalQuestions}</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">Questions Correct</p>
            </div>
            <div className="h-12 w-px bg-white/[0.08]" />
            <div>
              <p
                className={`font-mono text-4xl sm:text-5xl font-bold tabular-nums ${
                  result.percentage >= 70 ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {result.percentage}%
              </p>
              <p className="text-xs text-slate-400 mt-1">Accuracy Score</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            {result.feedback}
          </p>

          <p className="text-[11px] text-slate-500">
            Recorded permanently in your database performance ledger.
          </p>

          {/* Path Completed Ribbon */}
          {result.isPathCompleted && result.certificate && (
            <div className="mt-6 p-5 rounded-xl border border-amber-500/30 bg-[#12141D] text-center space-y-3">
              <div className="flex items-center justify-center gap-2 text-amber-400 font-bold text-sm">
                <Award className="h-5 w-5" />
                <span>Curriculum Mastered! Official Certificate Issued</span>
              </div>
              <p className="text-xs text-slate-300">
                You have finished all daily modules and assessments for this course. Your certificate with scannable QR verification code is ready!
              </p>
              <button
                onClick={() => onNavigate('certificates', { certId: result.certificate?.id })}
                className="px-5 py-2 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
              >
                View Lonexora Skills Certificate
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            {result.nextDay ? (
              <button
                onClick={() => onNavigate('daily-session', { pathId, dayNumber: result.nextDay })}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm shadow-blue-600/20 transition-all hover:scale-[1.02]"
              >
                <span>Advance to Day {result.nextDay}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : null}

            <button
              onClick={() => onNavigate('roadmap', { pathId })}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-slate-300 hover:text-white bg-[#12141D] hover:bg-[#181B26] border border-white/[0.08] rounded-lg transition-colors"
            >
              <span>View Full Roadmap</span>
            </button>

            <button
              onClick={() => onNavigate('performance')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-slate-300 hover:text-white border border-white/[0.08] hover:border-white/20 rounded-lg transition-colors"
            >
              <FileCheck2 className="h-4 w-4" />
              <span>Performance Ledger</span>
            </button>
          </div>
        </div>

        {/* Detailed Question-by-Question Answers & Explanations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <h3 className="font-display text-base font-bold text-white">Question Review & Architecture Breakdown</h3>
            <span className="font-mono text-xs text-slate-400 tabular-nums">10 Questions</span>
          </div>

          <div className="space-y-4">
            {result.answerDetails.map((item, idx) => (
              <div
                key={idx}
                className={`surface-card p-5 rounded-xl space-y-3.5 ${
                  item.isCorrect ? 'border-emerald-500/30' : 'border-rose-500/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono font-bold text-slate-400">Question {idx + 1}:</span>
                    <span
                      className={`inline-flex items-center gap-1 font-semibold ${
                        item.isCorrect ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {item.isCorrect ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Correct</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Incorrect</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm font-semibold text-white leading-relaxed">
                  {item.questionText}
                </p>

                {/* Options display */}
                <div className="grid grid-cols-1 gap-2 pt-1">
                  {item.options.map((opt, optIdx) => {
                    const isUserChoice = item.selectedOption === optIdx;
                    const isCorrectChoice = item.correctOption === optIdx;

                    let rowStyle = 'border-white/[0.06] bg-[#08090D] text-slate-400';
                    if (isCorrectChoice) {
                      rowStyle = 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200 font-medium';
                    } else if (isUserChoice && !item.isCorrect) {
                      rowStyle = 'border-rose-500/40 bg-rose-500/10 text-rose-200 line-through';
                    }

                    return (
                      <div
                        key={optIdx}
                        className={`p-3 rounded-lg border text-xs flex items-center justify-between gap-2 ${rowStyle}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-bold text-xs">{optionLetters[optIdx]}.</span>
                          <span>{opt}</span>
                        </div>
                        {isCorrectChoice && (
                          <span className="text-[10px] uppercase font-mono font-bold text-emerald-400">
                            Correct Answer
                          </span>
                        )}
                        {isUserChoice && !isCorrectChoice && (
                          <span className="text-[10px] uppercase font-mono font-bold text-rose-400">
                            Your Choice
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* In-depth explanation */}
                <div className="p-3.5 rounded-lg bg-[#08090D] border border-white/[0.06] text-xs text-slate-300">
                  <p className="font-semibold text-blue-400 mb-1">Architectural Concept:</p>
                  <p className="text-slate-400 leading-relaxed">{item.explanation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

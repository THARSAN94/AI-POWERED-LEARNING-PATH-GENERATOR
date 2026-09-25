import React, { useState, useEffect } from 'react';
import { AssessmentQuestionClient, AssessmentSubmissionResult } from '../types';
import { api } from '../api';
import {
  Award,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Check
} from 'lucide-react';

interface DailyAssessmentViewProps {
  pathId: string;
  dayNumber: number;
  onNavigate: (view: string, data?: any) => void;
  onAssessmentCompleted: (result: AssessmentSubmissionResult) => void;
}

export const DailyAssessmentView: React.FC<DailyAssessmentViewProps> = ({
  pathId,
  dayNumber,
  onNavigate,
  onAssessmentCompleted,
}) => {
  const [assessmentTitle, setAssessmentTitle] = useState('');
  const [questions, setQuestions] = useState<AssessmentQuestionClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAssessment() {
      try {
        setLoading(true);
        setError(null);
        const res = await api.getAssessment(pathId, dayNumber);
        setAssessmentTitle(res.title);
        setQuestions(res.questions);
      } catch (err: any) {
        setError(err.message || 'Failed to load assessment questions.');
      } finally {
        setLoading(false);
      }
    }
    loadAssessment();
  }, [pathId, dayNumber]);

  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    const answeredCount = Object.keys(selectedAnswers).length;
    if (answeredCount < questions.length) {
      const confirmIncomplete = window.confirm(
        `You have answered ${answeredCount} of 10 questions. Unanswered questions will be counted as incorrect. Submit now?`
      );
      if (!confirmIncomplete) return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const answersArray = questions.map((_, idx) =>
        selectedAnswers[idx] !== undefined ? selectedAnswers[idx] : -1
      );

      const result = await api.submitAssessment(pathId, dayNumber, answersArray);
      onAssessmentCompleted(result);
    } catch (err: any) {
      setError(err.message || 'Failed to submit assessment.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 bg-[#08090D]">
        <div className="h-7 w-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs text-slate-400">Loading Day {dayNumber} 10-question evaluation...</p>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 bg-[#08090D] text-slate-300">
        <AlertCircle className="h-8 w-8 text-rose-400 mb-3" />
        <p className="text-sm font-semibold mb-2">{error || 'No questions available.'}</p>
        <button
          onClick={() => onNavigate('daily-session', { pathId, dayNumber })}
          className="text-xs text-blue-400 hover:underline"
        >
          Return to Daily Session
        </button>
      </div>
    );
  }

  const currentQ = questions[currentQuestionIndex];
  const answeredTotal = Object.keys(selectedAnswers).length;
  const currentSelected = selectedAnswers[currentQuestionIndex];
  const optionLabels = ['A', 'B', 'C', 'D'];

  return (
    <div className="min-h-screen bg-[#08090D] text-slate-100 py-10">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400 mb-1">
              <Award className="h-4 w-4" />
              <span>Day {dayNumber} Knowledge Assessment</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="font-mono">10 MCQs</span>
            </div>
            <h1 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
              {assessmentTitle}
            </h1>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Progress:</span>
            <span className="font-mono font-bold text-emerald-400 tabular-nums">{answeredTotal} / 10 Answered</span>
          </div>
        </div>

        {/* 10-Question Navigator Strip */}
        <div className="flex items-center justify-between gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {questions.map((_, idx) => {
            const isAnswered = selectedAnswers[idx] !== undefined;
            const isCurrent = idx === currentQuestionIndex;
            return (
              <button
                key={idx}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`h-9 w-9 rounded-lg flex items-center justify-center font-mono text-xs font-bold transition-all shrink-0 ${
                  isCurrent
                    ? 'border-2 border-blue-500 bg-blue-600 text-white shadow-sm'
                    : isAnswered
                    ? 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                    : 'border border-white/[0.08] bg-[#0E1017] text-slate-400 hover:border-white/20'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Question Card */}
        <div className="surface-card p-6 sm:p-8 rounded-xl shadow-xl space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400 border-b border-white/[0.06] pb-4">
            <span className="font-mono font-semibold text-blue-400">Question {currentQuestionIndex + 1} of 10</span>
            <span className="text-[11px] text-slate-500">Passing criteria: 70% (7/10)</span>
          </div>

          <h3 className="text-base sm:text-lg font-semibold text-white leading-relaxed">
            {currentQ.question}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((option, optIdx) => {
              const isSelected = currentSelected === optIdx;
              return (
                <button
                  key={optIdx}
                  type="button"
                  onClick={() => handleSelectOption(optIdx)}
                  className={`w-full p-4 rounded-lg border text-left transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-500/10 text-white shadow-sm'
                      : 'border-white/[0.08] bg-[#08090D] text-slate-300 hover:border-white/20 hover:bg-white/[0.02]'
                  }`}
                >
                  <div
                    className={`h-6 w-6 rounded flex items-center justify-center text-xs font-mono font-bold shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/[0.06] text-slate-400 border border-white/[0.08]'
                    }`}
                  >
                    {optionLabels[optIdx]}
                  </div>
                  <span className="text-xs sm:text-sm leading-relaxed mt-0.5">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Nav Controls */}
          <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-300 hover:text-white disabled:opacity-30 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Previous</span>
            </button>

            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-semibold text-white bg-[#181B26] hover:bg-[#222736] border border-white/[0.08] rounded-lg transition-all"
              >
                <span>Next Question</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm shadow-emerald-600/20 transition-all disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Grading Assessment...</span>
                  </>
                ) : (
                  <>
                    <span>Submit 10 Questions</span>
                    <Check className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

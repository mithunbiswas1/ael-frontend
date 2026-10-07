// src/app/(pages)/courses/[slug]/quiz/_components/QuizQuestionCard.jsx
"use client";

import {
  ChevronLeft,
  ChevronRight,
  Award,
  CheckSquare,
  Square,
  Check,
  X,
} from "lucide-react";

export default function QuizQuestionCard({
  currentQuestionIdx,
  totalQuestions,
  currentQ,
  selectedAnswers,
  handleSelectOption,
  handlePrev,
  handleNext,
  handleSubmit,
  isBn,
}) {
  if (!currentQ) return null;

  const qId = currentQ.id || currentQ._id || String(currentQuestionIdx);
  const qType = currentQ.type || "single"; // "single" | "multiple" | "true_false"
  const questionText = isBn
    ? currentQ.questionBn || currentQ.question
    : currentQ.question;
  const currentAnswer = selectedAnswers[qId];

  // Answered count calculation across all questions
  const answeredCount = Object.keys(selectedAnswers).filter((k) => {
    const val = selectedAnswers[k];
    if (Array.isArray(val)) return val.length > 0;
    return val !== undefined && val !== null && val !== "";
  }).length;

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-8 shadow-xs">
      {/* Question Counter Progress & Type Badge */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-4 mb-6 gap-2 text-xs font-bold text-slate-600">
        <div className="flex items-center gap-2">
          <span className="text-primary font-black uppercase tracking-wider">
            {isBn
              ? `প্রশ্ন ${currentQuestionIdx + 1} / ${totalQuestions}`
              : `Question ${currentQuestionIdx + 1} of ${totalQuestions}`}
          </span>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${qType === "multiple"
                ? "bg-purple-50 text-purple-700 border border-purple-200"
                : qType === "true_false"
                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                  : "bg-blue-50 text-blue-700 border border-blue-200"
              }`}
          >
            {qType === "multiple"
              ? isBn
                ? "একাধিক উত্তর"
                : "Multiple Choice"
              : qType === "true_false"
                ? isBn
                  ? "সত্য / মিথ্যা"
                  : "True / False"
                : isBn
                  ? "একক নির্বাচন"
                  : "Single Choice"}
          </span>
        </div>

        <span className="text-slate-500 font-semibold text-[11px]">
          {isBn
            ? `${totalQuestions}টির মধ্যে ${answeredCount}টির উত্তর দেওয়া হয়েছে`
            : `${answeredCount} of ${totalQuestions} answered`}
        </span>
      </div>

      {/* Question Text */}
      <div className="mb-6">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
          {questionText}
        </h2>
        {qType === "multiple" && (
          <p className="mt-1 text-xs text-purple-700 font-medium">
            {isBn
              ? " প্রযোজ্য সকল সঠিক উত্তর নির্বাচন করুন (একাধিক নির্বাচন গ্রহণযোগ্য)"
              : " Select all correct options that apply"}
          </p>
        )}
      </div>

      {/* Options List */}
      <div className="space-y-3 mb-8">
        {qType === "true_false" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentQ.options?.map((opt, optIdx) => {
              const optId = opt.id || opt._id || String(optIdx);
              const isSelected = String(currentAnswer) === String(optId);
              const optText = isBn ? opt.textBn || opt.text : opt.text;
              const isTrue =
                opt.text?.toLowerCase().includes("true") ||
                opt.textBn?.includes("সত্য");

              return (
                <button
                  key={optId}
                  type="button"
                  onClick={() => handleSelectOption(qId, optId, qType)}
                  className={`p-4 rounded-xl border text-sm font-bold transition-all flex items-center justify-between cursor-pointer ${isSelected
                      ? "border-primary bg-primary/10 text-primary shadow-xs ring-2 ring-primary/20"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-black ${isTrue
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                        }`}
                    >
                      {isTrue ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    </span>
                    <span>{optText}</span>
                  </div>
                  <div
                    className={`h-4 w-4 rounded-full border-2 flex items-center justify-center ${isSelected
                        ? "border-primary bg-primary text-white"
                        : "border-slate-300"
                      }`}
                  >
                    {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          currentQ.options?.map((opt, optIdx) => {
            const optId = opt.id || opt._id || String(optIdx);
            const isSelected =
              qType === "multiple"
                ? Array.isArray(currentAnswer) && currentAnswer.includes(optId)
                : String(currentAnswer) === String(optId);
            const optText = isBn ? opt.textBn || opt.text : opt.text;

            return (
              <button
                key={optId}
                type="button"
                onClick={() => handleSelectOption(qId, optId, qType)}
                className={`w-full text-left p-3.5 sm:p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-start gap-3 cursor-pointer ${isSelected
                    ? "border-primary bg-blue-50/70 text-slate-900 shadow-2xs ring-1 ring-primary/30"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
              >
                <span className="shrink-0 mt-0.5">
                  {qType === "multiple" ? (
                    isSelected ? (
                      <CheckSquare className="h-4 w-4 text-primary" />
                    ) : (
                      <Square className="h-4 w-4 text-slate-300" />
                    )
                  ) : (
                    <span
                      className={`h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold border ${isSelected
                          ? "bg-primary text-white border-primary"
                          : "border-slate-300 bg-slate-100 text-slate-600"
                        }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                  )}
                </span>
                <span className="leading-relaxed flex-1">{optText}</span>
              </button>
            );
          })
        )}
      </div>

      {/* Navigation & Submit Buttons */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-6 gap-2">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentQuestionIdx === 0}
          className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 sm:px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>{isBn ? "পূর্ববর্তী" : "Previous"}</span>
        </button>

        {currentQuestionIdx === totalQuestions - 1 ? (
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 sm:px-6 py-2.5 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
          >
            <Award className="h-4 w-4" />
            <span>{isBn ? "কুইজ জমা দিন" : "Submit Quiz"}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1 rounded-lg bg-primary px-3.5 sm:px-5 py-2 text-xs font-bold text-white hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
          >
            <span>{isBn ? "পরবর্তী" : "Next"}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

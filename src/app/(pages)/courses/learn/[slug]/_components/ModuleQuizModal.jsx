// src/app/(pages)/courses/learn/[slug]/_components/ModuleQuizModal.jsx
"use client";

import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Award,
  ArrowRight,
  RotateCcw,
  Unlock,
} from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { useDictionary } from "@/context/DictionaryContext";

export default function ModuleQuizModal({
  isOpen,
  onClose,
  moduleData,
  moduleIndex = 0,
  onQuizPassed,
  onProceedToNextModule,
}) {
  const { locale } = useDictionary();
  const isBn = locale === "bn";

  const quiz = moduleData?.quiz;
  const questions = quiz?.questions || [];
  const passingScore = quiz?.passingScore || 70;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!quiz || questions.length === 0) return null;

  const currentQ = questions[currentIdx];
  const totalQuestions = questions.length;

  const handleSelectOption = (optIdx) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentIdx]: optIdx,
    }));
  };

  const handleNext = () => {
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentIdx(0);
  };

  // Calculate score
  let correctCount = 0;
  questions.forEach((q, idx) => {
    if (selectedAnswers[idx] === q.correctAnswer) {
      correctCount += 1;
    }
  });

  const scorePercent = Math.round((correctCount / totalQuestions) * 100);
  const isPassed = scorePercent >= passingScore;

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
    if (isPassed && onQuizPassed) {
      onQuizPassed(moduleIndex, scorePercent);
    }
  };

  const quizTitle = isBn
    ? quiz.titleBn || quiz.title || `মডিউল ${moduleIndex + 1} মূল্যায়ন কুইজ`
    : quiz.title || `Module ${moduleIndex + 1} Assessment Quiz`;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      title={`${quizTitle}`}
    >
      <div className="p-4 sm:p-6 space-y-6">
        {!isSubmitted ? (
          <>
            {/* Progress Bar & Question Counter */}
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 border-b border-slate-100 pb-3">
              <span>
                {isBn
                  ? `প্রশ্ন ${currentIdx + 1} / ${totalQuestions}`
                  : `Question ${currentIdx + 1} of ${totalQuestions}`}
              </span>
              <span className="rounded bg-primary/10 text-primary px-2.5 py-0.5 font-bold">
                {Object.keys(selectedAnswers).length}/{totalQuestions}{" "}
                {isBn ? "উত্তর প্রদান" : "Answered"}
              </span>
            </div>

            {/* Current Question */}
            <div className="space-y-4">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                {isBn ? currentQ.questionBn || currentQ.question : currentQ.question}
              </h3>

              {/* Options */}
              <div className="space-y-2.5">
                {(isBn && currentQ.optionsBn?.length === 4
                  ? currentQ.optionsBn
                  : currentQ.options
                ).map((optText, optIdx) => {
                  const isSelected = selectedAnswers[currentIdx] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-3.5 rounded-lg border text-xs sm:text-sm font-medium transition-colors flex items-center justify-between gap-3 ${
                        isSelected
                          ? "border-primary bg-primary/5 text-primary font-bold"
                          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded text-xs font-bold ${
                            isSelected
                              ? "bg-primary text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{optText || `Option ${optIdx + 1}`}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePrev}
                disabled={currentIdx === 0}
              >
                {isBn ? "পূর্ববর্তী" : "Previous"}
              </Button>

              <div className="flex items-center gap-2">
                {currentIdx < totalQuestions - 1 ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleNext}
                  >
                    <span>{isBn ? "পরবর্তী প্রশ্ন" : "Next Question"}</span>
                    <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(selectedAnswers).length === 0}
                    className="gap-1.5 font-bold"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{isBn ? "কুইজ জমা দিন" : "Submit Quiz"}</span>
                  </Button>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Quiz Results View */
          <div className="text-center space-y-5 py-2">
            <div
              className={`mx-auto flex h-16 w-16 items-center justify-center rounded-xl border ${
                isPassed
                  ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                  : "bg-rose-50 text-rose-600 border-rose-200"
              }`}
            >
              {isPassed ? (
                <Award className="h-9 w-9 text-emerald-600" />
              ) : (
                <XCircle className="h-9 w-9 text-rose-600" />
              )}
            </div>

            <div>
              <span
                className={`inline-block rounded px-3 py-1 text-xs font-bold uppercase mb-2 ${
                  isPassed
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-rose-100 text-rose-800"
                }`}
              >
                {isPassed
                  ? isBn
                    ? "🎉 উত্তীর্ণ হয়েছেন! পরবর্তী মডিউল আনলক হয়েছে"
                    : "🎉 Passed! Next Module Unlocked"
                  : isBn
                    ? "❌ কৃতকার্য হননি (ন্যূনতম ৭০% প্রয়োজন)"
                    : "❌ Passing Score Not Met (70% Required)"}
              </span>

              <h3 className="text-2xl font-black text-slate-900">{scorePercent}%</h3>
              <p className="text-xs text-slate-500 mt-1">
                {isBn
                  ? `${totalQuestions}টির মধ্যে ${correctCount}টি সঠিক উত্তর প্রদান করেছেন।`
                  : `You answered ${correctCount} of ${totalQuestions} questions correctly.`}
              </p>
            </div>

            {/* Answer Key & Explanations */}
            <div className="max-h-60 overflow-y-auto space-y-3 text-left border border-slate-200 rounded-lg p-3 bg-slate-50">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                {isBn ? "প্রশ্নোত্তর ও ব্যাখ্যা:" : "Question Review & Solutions:"}
              </h4>
              {questions.map((q, idx) => {
                const isUserCorrect = selectedAnswers[idx] === q.correctAnswer;
                const correctOptText =
                  isBn && q.optionsBn?.[q.correctAnswer]
                    ? q.optionsBn[q.correctAnswer]
                    : q.options?.[q.correctAnswer];

                return (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded border border-slate-200 text-xs space-y-1.5"
                  >
                    <div className="flex items-start gap-2">
                      {isUserCorrect ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                      )}
                      <p className="font-semibold text-slate-900">
                        {idx + 1}. {isBn ? q.questionBn || q.question : q.question}
                      </p>
                    </div>

                    <p className="text-[11px] text-slate-600 pl-6">
                      <span className="font-semibold text-emerald-700">
                        {isBn ? "সঠিক উত্তর:" : "Correct Answer:"}
                      </span>{" "}
                      {correctOptText}
                    </p>

                    {(q.explanation || q.explanationBn) && (
                      <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded border border-slate-100 pl-3">
                        💡 {isBn ? q.explanationBn || q.explanation : q.explanation}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              {!isPassed ? (
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleReset}
                  className="gap-1.5"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{isBn ? "পুনরায় কুইজ দিন" : "Retake Quiz"}</span>
                </Button>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onClose}
                  >
                    {isBn ? "বন্ধ করুন" : "Close"}
                  </Button>

                  {onProceedToNextModule && (
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        onClose();
                        onProceedToNextModule(moduleIndex);
                      }}
                      className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      <Unlock className="h-3.5 w-3.5" />
                      <span>{isBn ? "পরবর্তী মডিউলে যান" : "Proceed to Next Module"}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}

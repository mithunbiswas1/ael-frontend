// src/app/(pages)/courses/learn/[slug]/_components/ClassroomQuizView.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  Award,
  ArrowRight,
  RotateCcw,
  Unlock,
  Lock,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useDictionary } from "@/context/DictionaryContext";

export default function ClassroomQuizView({
  courseId,
  moduleData,
  moduleIndex = 0,
  totalModules = 1,
  displayNumber = "1.4",
  previousSubmission = null,
  onQuizSubmitted,
  onProceedToNextModule,
  onPrevLesson,
  hasPrevLesson = true,
  isCoursePaid = false,
  hasFullAccess = true,
  coursePrice = 0,
}) {
  const { locale } = useDictionary();
  const isBn = locale === "bn";

  const quiz = moduleData?.quiz;
  const questions = quiz?.questions || [];
  const passingScore = quiz?.passingScore || 70;
  const isFinalExam = moduleIndex >= totalModules - 1;

  const [currentQIdx, setCurrentQIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sync state whenever moduleData or previousSubmission changes
  useEffect(() => {
    if (
      previousSubmission &&
      typeof previousSubmission.scorePercent === "number" &&
      previousSubmission.attemptedAt
    ) {
      setIsSubmitted(true);
      setSelectedAnswers(previousSubmission.submittedAnswers || {});
    } else {
      setIsSubmitted(false);
      setSelectedAnswers({});
      setCurrentQIdx(0);
    }
  }, [moduleIndex, previousSubmission]);

  if (!quiz || questions.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 text-center bg-slate-50">
        <div className="max-w-md p-6 bg-white rounded-xl border border-slate-200">
          <HelpCircle className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-xs font-semibold text-slate-600">
            {isBn
              ? "এই মডিউলে কোনো কুইজ পাওয়া যায়নি।"
              : "No quiz found for this module."}
          </p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQIdx];
  const totalQuestions = questions.length;

  const handleSelectOption = (optIdx) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQIdx]: optIdx,
    }));
  };

  const handleNextQ = () => {
    if (currentQIdx < totalQuestions - 1) {
      setCurrentQIdx((prev) => prev + 1);
    }
  };

  const handlePrevQ = () => {
    if (currentQIdx > 0) {
      setCurrentQIdx((prev) => prev - 1);
    }
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentQIdx(0);
  };

  // Calculate score
  let correctCount = 0;
  questions.forEach((q, idx) => {
    if (selectedAnswers[idx] === q.correctAnswer) {
      correctCount += 1;
    }
  });

  const scorePercent =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const isPassed = scorePercent >= passingScore;

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
    if (onQuizSubmitted) {
      onQuizSubmitted({
        moduleIndex,
        scorePercent,
        isPassed,
        submittedAnswers: selectedAnswers,
      });
    }
  };

  const quizTitle = isBn
    ? quiz.titleBn || quiz.title || `মডিউল ${moduleIndex + 1} মূল্যায়ন কুইজ`
    : quiz.title || `Module ${moduleIndex + 1} Assessment Quiz`;

  const moduleTitle = isBn
    ? moduleData.moduleTitleBn || moduleData.moduleTitle
    : moduleData.moduleTitle;

  // Question options
  const currentOptions =
    isBn && currentQ?.optionsBn?.length === currentQ?.options?.length
      ? currentQ.optionsBn
      : currentQ?.options || [];

  return (
    <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50">
      {/* Top Banner / Header Bar */}
      <div className="border-b border-slate-200 bg-white px-5 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2 py-1 rounded">
            {displayNumber}
          </span>
          <div className="truncate">
            <h1 className="text-sm sm:text-base font-bold text-slate-900 truncate">
              {quizTitle}
            </h1>
            <p className="text-[11px] text-slate-500 truncate mt-0.5">
              {moduleTitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] bg-slate-100 border border-slate-200 px-2.5 py-1 rounded font-semibold text-slate-700">
            {isBn ? `পাস মার্ক: ${passingScore}%` : `Pass: ${passingScore}%`}
          </span>
          <span className="text-[11px] bg-primary/10 border border-primary/20 text-primary px-2.5 py-1 rounded font-bold">
            {totalQuestions} {isBn ? "প্রশ্ন" : "Questions"}
          </span>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 p-4 sm:p-8 max-w-4xl mx-auto w-full">
        {!isSubmitted ? (
          /* Active Interactive Quiz Card */
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Progress Bar & Counter */}
            <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex items-center justify-between text-xs font-semibold text-slate-600">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900">
                  {isBn
                    ? `প্রশ্ন ${currentQIdx + 1} / ${totalQuestions}`
                    : `Question ${currentQIdx + 1} of ${totalQuestions}`}
                </span>
              </div>
              <span className="text-[11px] text-primary font-bold bg-primary/10 px-2 py-0.5 rounded">
                {Object.keys(selectedAnswers).length}/{totalQuestions}{" "}
                {isBn ? "উত্তর সম্পন্ন" : "Answered"}
              </span>
            </div>

            {/* Question Body */}
            <div className="p-6 sm:p-8 space-y-6">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {isBn ? currentQ.questionBn || currentQ.question : currentQ.question}
              </h2>

              {/* Options List */}
              <div className="space-y-3">
                {currentOptions.map((optText, optIdx) => {
                  const isSelected = selectedAnswers[currentQIdx] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer ${isSelected
                        ? "border-primary bg-primary/5 text-primary font-bold shadow-2xs ring-1 ring-primary/40"
                        : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors ${isSelected
                            ? "bg-primary text-white"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                            }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="leading-relaxed">
                          {optText || `Option ${optIdx + 1}`}
                        </span>
                      </div>

                      {isSelected && (
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {hasPrevLesson && currentQIdx === 0 ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onPrevLesson}
                    className="gap-1 text-slate-600"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span>{isBn ? "পূর্ববর্তী পাঠে ফিরুন" : "Back to Video"}</span>
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handlePrevQ}
                    disabled={currentQIdx === 0}
                    className="gap-1"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span>{isBn ? "পূর্ববর্তী প্রশ্ন" : "Previous Question"}</span>
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {currentQIdx < totalQuestions - 1 ? (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleNextQ}
                    className="gap-1.5"
                  >
                    <span>{isBn ? "পরবর্তী প্রশ্ন" : "Next Question"}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
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
          </div>
        ) : (
          /* In-Place Evaluation & Review View (Instant grading, solutions & retake) */
          <div className="space-y-6">
            {/* Score Summary Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 text-center space-y-4 shadow-xs">
              <div
                className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border ${isPassed
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
                {(() => {
                  const isEnrollRequiredForNext = isCoursePaid && !hasFullAccess;
                  return (
                    <span
                      className={`inline-block rounded-full px-3.5 py-1 text-xs font-bold uppercase mb-2 ${isPassed
                        ? isEnrollRequiredForNext
                          ? "bg-amber-100 text-amber-900 border border-amber-300"
                          : "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : "bg-rose-100 text-rose-800 border border-rose-200"
                        }`}
                    >
                      {isPassed
                        ? isFinalExam
                          ? isBn
                            ? "🎉 উত্তীর্ণ হয়েছেন! ভেরিফাইড সার্টিফিকেট জেনারেট হয়েছে"
                            : "🎉 Passed! Verified Certificate Generated"
                          : isEnrollRequiredForNext
                            ? isBn
                              ? "🎉 ১ম মডিউল উত্তীর্ণ! মডিউল ২ দেখতে সম্পূর্ণ কোর্সে ভর্তি আবশ্যক"
                              : "🎉 Module 1 Passed! Complete Enrollment to Access Module 2"
                            : isBn
                              ? `🎉 উত্তীর্ণ হয়েছেন! মডিউল ${moduleIndex + 2} আনলক হয়েছে`
                              : `🎉 Passed! Module ${moduleIndex + 2} Unlocked`
                        : isBn
                          ? `❌ কৃতকার্য হননি (ন্যূনতম ${passingScore}% প্রয়োজন)`
                          : `❌ Passing Score Not Met (${passingScore}% Required)`}
                    </span>
                  );
                })()}

                <h3 className="text-3xl font-black text-slate-900">{scorePercent}%</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {isBn
                    ? `${totalQuestions}টির মধ্যে ${correctCount}টি প্রশ্নের সঠিক উত্তর দিয়েছেন।`
                    : `You answered ${correctCount} of ${totalQuestions} questions correctly.`}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResetQuiz}
                  className="gap-1.5"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{isBn ? "পুনরায় কুইজ দিন" : "Retake Quiz"}</span>
                </Button>

                {isPassed && isFinalExam && (
                  <Link
                    href="/user-dashboard/certificates"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
                  >
                    <span>{isBn ? "সার্টিফিকেট দেখুন" : "View Certificate"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}

                {isPassed && !isFinalExam && onProceedToNextModule && (
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={() => onProceedToNextModule(moduleIndex)}
                    className={`gap-1.5 font-bold ${isCoursePaid && !hasFullAccess
                      ? "bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
                      : "bg-emerald-600 hover:bg-emerald-700 text-white"
                      }`}
                  >
                    {isCoursePaid && !hasFullAccess ? (
                      <>
                        <Lock className="h-3.5 w-3.5" />
                        <span>
                          {isBn
                            ? `মডিউল ২ আনলক করতে ভর্তি হন (৳ ${coursePrice})`
                            : `Enroll to Unlock Module 2 (৳ ${coursePrice})`}
                        </span>
                      </>
                    ) : (
                      <>
                        <Unlock className="h-3.5 w-3.5" />
                        <span>
                          {isBn
                            ? `মডিউল ${moduleIndex + 2}-এ যান`
                            : `Proceed to Module ${moduleIndex + 2}`}
                        </span>
                      </>
                    )}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                )}

                {hasPrevLesson && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onPrevLesson}
                    className="gap-1 text-slate-600"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span>{isBn ? "পূর্ববর্তী পাঠে ফিরুন" : "Back to Video"}</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Answer Key & Explanations Review List */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  {isBn ? "প্রশ্নোত্তর ও সমাধান পর্যালোচনা:" : "Question Review & Solutions:"}
                </h4>
                <span className="text-[11px] text-slate-500">
                  {isBn ? "(আপনার উত্তর বনাম সঠিক উত্তর)" : "(Your answer vs Correct answer)"}
                </span>
              </div>

              <div className="space-y-4">
                {questions.map((q, idx) => {
                  const userSelectedIdx = selectedAnswers[idx];
                  const isUserCorrect = userSelectedIdx === q.correctAnswer;
                  const userSelectedOptText =
                    userSelectedIdx !== undefined
                      ? isBn && q.optionsBn?.[userSelectedIdx]
                        ? q.optionsBn[userSelectedIdx]
                        : q.options?.[userSelectedIdx]
                      : isBn ? "(উত্তর দেওয়া হয়নি)" : "(Not answered)";

                  const correctOptText =
                    isBn && q.optionsBn?.[q.correctAnswer]
                      ? q.optionsBn[q.correctAnswer]
                      : q.options?.[q.correctAnswer];

                  return (
                    <div
                      key={idx}
                      className="p-4 bg-slate-50/60 rounded-xl border border-slate-200 text-xs space-y-2.5 transition-colors"
                    >
                      <div className="flex items-start gap-2.5">
                        {isUserCorrect ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                        )}
                        <p className="font-bold text-slate-900 text-xs sm:text-sm">
                          {idx + 1}. {isBn ? q.questionBn || q.question : q.question}
                        </p>
                      </div>

                      <div className="pl-6 space-y-1.5">
                        <p
                          className={`text-xs ${isUserCorrect ? "text-emerald-700 font-semibold" : "text-rose-600 font-medium"
                            }`}
                        >
                          <span className="font-bold">
                            {isBn ? "আপনার উত্তর:" : "Your Answer:"}
                          </span>{" "}
                          {userSelectedOptText}
                        </p>

                        {!isUserCorrect && (
                          <p className="text-xs text-emerald-700 font-bold">
                            <span>{isBn ? "সঠিক উত্তর:" : "Correct Answer:"}</span>{" "}
                            {correctOptText}
                          </p>
                        )}
                      </div>

                      {(q.explanation || q.explanationBn) && (
                        <div className="text-[11px] text-slate-700 bg-amber-50/70 border border-amber-200/80 p-2.5 rounded-lg pl-3 mt-2 leading-relaxed">
                          <span className="font-semibold">{isBn ? "ব্যাখ্যা:" : "Explanation:"}</span>{" "}
                          {isBn ? q.explanationBn || q.explanation : q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

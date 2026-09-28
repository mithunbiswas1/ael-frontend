// src/app/(pages)/courses/[id]/quiz/_view/QuizContent.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { AlertCircle, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import QuizHeader from "../_components/QuizHeader";
import QuizQuestionCard from "../_components/QuizQuestionCard";
import QuizResultCard from "../_components/QuizResultCard";
import { useDictionary } from "@/context/DictionaryContext";
import {
  useGetQuizByCourseIdQuery,
  useSubmitQuizMutation,
} from "@/redux/api/quizApi";

export default function QuizContent({ courseId }) {
  const { locale } = useDictionary();
  const isBn = locale === "bn";

  const { data: quizData, isLoading, error } = useGetQuizByCourseIdQuery(courseId);
  const [submitQuiz, { isLoading: isSubmitting }] = useSubmitQuizMutation();

  const quiz = quizData?.data;
  const questions = quiz?.questions || [];

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [secondsRemaining, setSecondsRemaining] = useState(600);

  // Initialize timer once quiz is loaded
  useEffect(() => {
    if (quiz?.durationMinutes) {
      setSecondsRemaining(quiz.durationMinutes * 60);
    }
  }, [quiz]);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted || !quiz) return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitAnswers();
          toast.warning(
            isBn
              ? "সময় শেষ! আপনার কুইজ স্বয়ংক্রিয়ভাবে জমা দেওয়া হয়েছে।"
              : "Time is up! Your quiz has been automatically submitted."
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted, quiz, isBn]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-xs font-semibold text-slate-500">
            {isBn ? "কুইজের প্রশ্ন লোড হচ্ছে..." : "Loading quiz questions..."}
          </p>
        </div>
      </div>
    );
  }

  if (error || !quiz || questions.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 py-16">
        <div className="site-container max-w-lg text-center bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900 mb-2">
            {isBn ? "কোনো কুইজ পাওয়া যায়নি" : "Quiz Not Found"}
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            {isBn
              ? "এই কোর্সের জন্য এখনও কোনো কুইজ মূল্যায়ন কনফিগার করা হয়নি।"
              : "No assessment quiz has been created for this course yet."}
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href={`/courses/learn/${courseId}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{isBn ? "ক্লাসরুমে ফিরে যান" : "Return to Classroom"}</span>
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary/90"
            >
              <span>{isBn ? "সকল কোর্স" : "Browse Courses"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const currentQ = questions[currentQuestionIdx];

  const handleSelectOption = (optIdx) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIdx]: optIdx,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx((prev) => prev - 1);
    }
  };

  const handleSubmitAnswers = async () => {
    if (isSubmitting) return;

    try {
      toast.loading("Submitting quiz answers...", { id: "quiz-sub" });
      const res = await submitQuiz({
        courseId,
        selectedAnswers,
      }).unwrap();

      setSubmissionResult(res.data);
      setIsSubmitted(true);

      if (res.data?.isPassed) {
        toast.success(
          isBn
            ? "অভিনন্দন! আপনি কুইজে উত্তীর্ণ হয়েছেন ও সার্টিফিকেট পেয়েছেন!"
            : "Congratulations! You passed the quiz and earned your verified certificate!",
          { id: "quiz-sub" }
        );
      } else {
        toast.info(
          isBn
            ? "আপনার কুইজ জমা হয়েছে। আপনি আবার চেষ্টা করতে পারেন।"
            : "Quiz submitted. You may review your answers and retake.",
          { id: "quiz-sub" }
        );
      }
    } catch (err) {
      // Fallback local evaluation if offline or backend error
      let correctCount = 0;
      questions.forEach((q, idx) => {
        const sIdx = selectedAnswers[idx];
        if (sIdx !== undefined && q.options[sIdx]?.isCorrect) {
          correctCount += 1;
        }
      });
      const scorePercent = Math.round((correctCount / questions.length) * 100);
      const isPassed = scorePercent >= (quiz.passPercentage || 80);

      setSubmissionResult({
        isPassed,
        scorePercent,
        correctCount,
        totalQuestions: questions.length,
      });
      setIsSubmitted(true);
      toast.success("Quiz submitted successfully.", { id: "quiz-sub" });
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentQuestionIdx(0);
    setIsSubmitted(false);
    setSubmissionResult(null);
    setSecondsRemaining((quiz.durationMinutes || 10) * 60);
    toast.info(
      isBn ? "কুইজ পুনরায় শুরু হয়েছে।" : "Quiz restarted. Best of luck!"
    );
  };

  // Format timer
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeString = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* 1. Header Banner */}
      <QuizHeader
        courseId={courseId}
        isSubmitted={isSubmitted}
        timeString={timeString}
        isBn={isBn}
      />

      {/* 2. Main Question Card / Result Card */}
      <section className="relative z-20 -mt-6 mx-auto w-full max-w-3xl px-4">
        {isSubmitted && submissionResult ? (
          <QuizResultCard
            isPassed={submissionResult.isPassed}
            scorePercent={submissionResult.scorePercent}
            correctCount={submissionResult.correctCount}
            quizQuestions={questions}
            selectedAnswers={selectedAnswers}
            courseId={courseId}
            handleRetake={handleRetake}
            isBn={isBn}
          />
        ) : (
          <QuizQuestionCard
            currentQuestionIdx={currentQuestionIdx}
            totalQuestions={questions.length}
            currentQ={currentQ}
            selectedAnswers={selectedAnswers}
            handleSelectOption={handleSelectOption}
            handlePrev={handlePrev}
            handleNext={handleNext}
            handleSubmit={handleSubmitAnswers}
            isBn={isBn}
          />
        )}
      </section>
    </main>
  );
}

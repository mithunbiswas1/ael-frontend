// src/app/(pages)/courses/[id]/quiz/_view/QuizContent.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { AlertCircle, ArrowLeft, ArrowRight, Loader2, Lock, CheckCircle2 } from "lucide-react";
import QuizHeader from "../_components/QuizHeader";
import QuizQuestionCard from "../_components/QuizQuestionCard";
import QuizResultCard from "../_components/QuizResultCard";
import { useDictionary } from "@/context/DictionaryContext";
import {
  useGetQuizByCourseIdQuery,
  useSubmitQuizMutation,
} from "@/redux/api/quizApi";
import { useGetMyLearningCoursesQuery } from "@/redux/api/courseApi";

export default function QuizContent({ courseId: legacyId, courseSlug }) {
  const courseId = courseSlug || legacyId;
  const { locale } = useDictionary();
  const isBn = locale === "bn";

  const { data: quizData, isLoading, error } = useGetQuizByCourseIdQuery(courseId);
  const [submitQuiz, { isLoading: isSubmitting }] = useSubmitQuizMutation();
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const { data: learningData, isLoading: isLearningLoading } = useGetMyLearningCoursesQuery(
    undefined,
    { skip: !isLoggedIn }
  );

  const quiz = quizData?.data;
  const questions = quiz?.questions || [];

  const enrolledItem = Array.isArray(learningData?.data)
    ? learningData.data.find(
        (c) =>
          String(c.courseId) === String(courseId) ||
          String(c.slug) === String(courseId) ||
          String(c._id) === String(courseId)
      )
    : null;

  const isAdmin = ["super_admin", "admin", "instructor", "course_admin", "manager"].includes(user?.role);
  const progressPercent = enrolledItem?.enrollment?.progressPercent ?? (isAdmin ? 100 : 0);
  const isEligibleForQuiz = isAdmin || progressPercent >= 100;

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

  if (isLoading || isLearningLoading) {
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

  // Verification Gate: Examination opens ONLY after 100% video/lesson completion
  if (!isEligibleForQuiz) {
    return (
      <main className="min-h-screen bg-slate-50 py-16">
        <div className="site-container max-w-lg text-center bg-white p-8 rounded-2xl border border-amber-200/80 shadow-md">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200 text-amber-600">
            <Lock className="h-8 w-8" />
          </div>
          <span className="inline-block rounded-full bg-amber-100 text-amber-800 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider mb-2">
            {isBn ? "পরীক্ষা লক করা আছে" : "EXAMINATION LOCKED"}
          </span>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            {isBn ? "১০০% ভিডিও পাঠ সম্পন্ন করা আবশ্যক" : "100% Lesson Completion Required"}
          </h2>
          <p className="text-xs text-slate-600 mb-6 leading-relaxed">
            {isBn
              ? `সরকারি বিস্ফোরক পরিদপ্তর ও লোয়াব নীতিমালার ভিত্তিতে সার্টিফিকেশন পরীক্ষায় অংশ নিতে কোর্সের সকল ভিডিও পাঠ ১০০% শেষ করতে হবে। আপনার বর্তমান অগ্রগতি: ${progressPercent}%।`
              : `According to regulatory standards, the final certification exam unlocks only after completing 100% of the course lectures. Your current progress: ${progressPercent}%.`}
          </p>

          <div className="mb-6 rounded-xl bg-slate-50 border border-slate-200 p-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span>{isBn ? "কোর্সের অগ্রগতি" : "Course Progress"}</span>
              <span className="text-primary">{progressPercent}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={`/courses/learn/${courseId}`}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-lg bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary/90 shadow-sm"
            >
              <span>{isBn ? "ক্লাসরুমে গিয়ে পাঠ শেষ করুন" : "Continue in Classroom"}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center justify-center gap-1.5 w-full sm:w-auto rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <span>{isBn ? "সকল কোর্স" : "Browse Courses"}</span>
            </Link>
          </div>
        </div>
      </main>
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

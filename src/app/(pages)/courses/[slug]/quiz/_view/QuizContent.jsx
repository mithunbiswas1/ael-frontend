// src/app/(pages)/courses/[slug]/quiz/_view/QuizContent.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { AlertCircle, ArrowLeft, ArrowRight, Lock, Clock } from "lucide-react";
import QuizHeader from "../_components/QuizHeader";
import QuizQuestionCard from "../_components/QuizQuestionCard";
import QuizResultCard from "../_components/QuizResultCard";
import { useDictionary } from "@/context/DictionaryContext";
import {
  useGetQuizForAttemptQuery,
  useGetQuizByCourseIdQuery,
  useSubmitQuizMutation,
} from "@/redux/api/quizApi";
import { useGetMyLearningCoursesQuery } from "@/redux/api/courseApi";

export default function QuizContent({ courseId: legacyId, courseSlug }) {
  const courseId = courseSlug || legacyId;
  const { locale } = useDictionary();
  const isBn = locale === "bn";

  const { user, isLoggedIn } = useSelector((state) => state.auth);

  // Attempt Query (Active examination with random questions, options shuffled, anti-cheat sanitized)
  const {
    data: attemptData,
    isLoading: isAttemptLoading,
    error: attemptError,
    refetch: refetchAttempt,
  } = useGetQuizForAttemptQuery(courseId, { skip: !isLoggedIn });

  // Public Query fallback if attempt is skipped
  const {
    data: publicQuizData,
    isLoading: isPublicLoading,
    error: publicError,
  } = useGetQuizByCourseIdQuery(courseId, { skip: isLoggedIn });

  const [submitQuiz, { isLoading: isSubmitting }] = useSubmitQuizMutation();
  const { data: learningData, isLoading: isLearningLoading } = useGetMyLearningCoursesQuery(
    undefined,
    { skip: !isLoggedIn }
  );

  const activeQuiz = attemptData?.data || publicQuizData?.data;
  const questions = activeQuiz?.questions || [];

  const enrolledItem = Array.isArray(learningData?.data)
    ? learningData.data.find(
        (c) =>
          String(c.courseId) === String(courseId) ||
          String(c.slug) === String(courseId) ||
          String(c._id) === String(courseId)
      )
    : null;

  const isAdmin = ["super_admin", "admin", "instructor", "course_admin", "manager"].includes(
    user?.role
  );
  const progressPercent = enrolledItem?.enrollment?.progressPercent ?? 0;
  const isEligibleForQuiz = true;

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [secondsRemaining, setSecondsRemaining] = useState(900); // 15 mins default

  // Timer Initialization
  useEffect(() => {
    if (activeQuiz?.durationMinutes) {
      setSecondsRemaining(activeQuiz.durationMinutes * 60);
    }
  }, [activeQuiz]);

  // Timer Countdown with auto-submit
  useEffect(() => {
    if (isSubmitted || !activeQuiz || activeQuiz.timerEnabled === false) return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitAnswers();
          toast.warning(
            isBn
              ? "সময় শেষ! আপনার কুইজ স্বয়ংক্রিয়ভাবে জমা দেওয়া হয়েছে।"
              : "Time expired! Your quiz answers were automatically submitted."
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSubmitted, activeQuiz, isBn]);

  if (isAttemptLoading || isPublicLoading || isLearningLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-xs font-semibold text-slate-500">
            {isBn ? "কুইজের প্রশ্ন লোড হচ্ছে..." : "Loading assessment questions..."}
          </p>
        </div>
      </div>
    );
  }

  // Not logged in gate
  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-slate-50 py-16">
        <div className="site-container max-w-md text-center bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Lock className="h-7 w-7" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">
            {isBn ? "লগইন করা আবশ্যক" : "Login Required"}
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            {isBn
              ? "সার্টিফিকেশন কুইজে অংশ নিতে এবং অফিসিয়াল সনদ অর্জন করতে অনুগ্রহ করে লগইন করুন।"
              : "Please login to your account to take the course assessment and earn your certificate."}
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 w-full rounded-lg bg-primary py-2.5 text-xs font-bold text-white hover:bg-primary/90 shadow-xs"
          >
            <span>{isBn ? "লগইন করুন" : "Proceed to Login"}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    );
  }

  // Cooldown active error from backend
  if (attemptError?.status === 429) {
    const errorMsg =
      attemptError?.data?.message ||
      (isBn
        ? "কুল-ডাউন সক্রিয় রয়েছে। অনুগ্রহ করে অপেক্ষা করুন।"
        : "Cool-down active. Please review the course and retry later.");

    return (
      <main className="min-h-screen bg-slate-50 py-16">
        <div className="site-container max-w-lg text-center bg-white p-8 rounded-2xl border border-amber-200 shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 border border-amber-200">
            <Clock className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            {isBn ? "কুইজ কুল-ডাউন সময় সক্রিয়" : "Quiz Cool-down Active"}
          </h2>
          <p className="text-xs text-slate-600 mb-6 leading-relaxed">{errorMsg}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={`/courses/learn/${courseId}`}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-lg bg-slate-900 px-5 py-2.5 text-xs font-bold text-white hover:bg-slate-800 shadow-sm"
            >
              <span>{isBn ? "কোর্স পাঠসমূহ রিভিশন দিন" : "Revise Course Lessons"}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              onClick={() => refetchAttempt()}
              className="inline-flex items-center justify-center w-full sm:w-auto rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              {isBn ? "পুনরায় চেক করুন" : "Check Status"}
            </button>
          </div>
        </div>
      </main>
    );
  }

  // 100% lessons prerequisite verification gate
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
              ? `কোর্সের সকল ভিডিও পাঠ ১০০% শেষ করার পর চূড়ান্ত সার্টিফিকেশন পরীক্ষা আনলক হবে। আপনার বর্তমান অগ্রগতি: ${progressPercent}%।`
              : `The final certification assessment unlocks only after completing 100% of all lesson videos. Current progress: ${progressPercent}%.`}
          </p>

          <div className="mb-6 rounded-xl bg-slate-50 border border-slate-200 p-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span>{isBn ? "কোর্সের অগ্রগতি" : "Course Progress"}</span>
              <span className="text-primary font-black">{progressPercent}%</span>
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
              <span>{isBn ? "ক্লাসরুমে পাঠ শেষ করুন" : "Continue Lessons in Classroom"}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center justify-center w-full sm:w-auto rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <span>{isBn ? "সকল কোর্স" : "Browse Courses"}</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Quiz Not Found
  if (!activeQuiz || questions.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 py-16">
        <div className="site-container max-w-lg text-center bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-slate-900 mb-2">
            {isBn ? "কোনো কুইজ পাওয়া যায়নি" : "Quiz Not Found"}
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            {isBn
              ? "এই কোর্সের জন্য এখনও প্রশ্ন ব্যাংক প্রস্তুত করা হয়নি।"
              : "No quiz questions found in the question bank for this course."}
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href={`/courses/learn/${courseId}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>{isBn ? "ক্লাসরুমে ফিরে যান" : "Return to Classroom"}</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const currentQ = questions[currentQuestionIdx];

  // Option selection handler for all 3 question types (single, multiple, true_false)
  const handleSelectOption = (qId, optId, qType) => {
    if (isSubmitted) return;

    if (qType === "multiple") {
      setSelectedAnswers((prev) => {
        const currentArr = Array.isArray(prev[qId]) ? [...prev[qId]] : [];
        if (currentArr.includes(optId)) {
          return { ...prev, [qId]: currentArr.filter((id) => id !== optId) };
        } else {
          return { ...prev, [qId]: [...currentArr, optId] };
        }
      });
    } else {
      // Single choice or True/False
      setSelectedAnswers((prev) => ({
        ...prev,
        [qId]: optId,
      }));
    }
  };

  const handleNext = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx((prev) => prev + 1 - 2);
    }
  };

  const handleSubmitAnswers = async () => {
    if (isSubmitting) return;

    try {
      toast.loading(isBn ? "কুইজের উত্তর যাচাই করা হচ্ছে..." : "Submitting assessment...", {
        id: "quiz-sub",
      });

      const res = await submitQuiz({
        courseId,
        answers: selectedAnswers,
        studentName: user?.fullName || user?.userName,
      }).unwrap();

      setSubmissionResult(res.data);
      setIsSubmitted(true);

      if (res.data?.isPassed) {
        toast.success(
          isBn
            ? "অভিনন্দন! আপনি উত্তীর্ণ হয়েছেন এবং আপনার সার্টিফিকেট তৈরি হয়েছে!"
            : "Congratulations! You passed the quiz and your certificate is generated!",
          { id: "quiz-sub" }
        );
      } else {
        toast.info(
          isBn
            ? "কুইজ সম্পন্ন হয়েছে। আপনি ফলাফল পর্যালোচনা করতে পারেন।"
            : "Quiz submitted. You may review your answers.",
          { id: "quiz-sub" }
        );
      }
    } catch (err) {
      toast.error(
        err?.data?.message || (isBn ? "কুইজ জমা দিতে ব্যর্থ হয়েছে" : "Submission failed"),
        { id: "quiz-sub" }
      );
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentQuestionIdx(0);
    setIsSubmitted(false);
    setSubmissionResult(null);
    if (activeQuiz?.durationMinutes) {
      setSecondsRemaining(activeQuiz.durationMinutes * 60);
    }
    refetchAttempt();
    toast.info(isBn ? "কুইজ পুনরায় শুরু হয়েছে।" : "Quiz restarted. Best of luck!");
  };

  // Format timer
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeString = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

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
            totalQuestions={submissionResult.totalQuestions}
            passPercentage={submissionResult.passPercentage}
            certificate={submissionResult.certificate}
            cooldownUntil={submissionResult.cooldownUntil}
            cooldownMinutes={submissionResult.cooldownMinutes}
            review={submissionResult.review}
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

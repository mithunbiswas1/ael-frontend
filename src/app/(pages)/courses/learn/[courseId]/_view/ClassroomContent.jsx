// src/app/(pages)/courses/learn/[courseId]/_view/ClassroomContent.jsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import {
  Award,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Lock,
  LogIn,
  BookOpen,
  Sparkles,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import ClassroomHeader from "../_components/ClassroomHeader";
import ClassroomVideoPlayer from "../_components/ClassroomVideoPlayer";
import ClassroomPlaylistSidebar from "../_components/ClassroomPlaylistSidebar";
import AuthModal from "@/components/shared/AuthModal";
import { useDictionary } from "@/context/DictionaryContext";
import {
  useGetCourseByIdQuery,
  useGetMyLearningCoursesQuery,
  useEnrollCourseMutation,
} from "@/redux/api/courseApi";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";

export default function ClassroomContent({ courseId }) {
  const router = useRouter();
  const { locale } = useDictionary();
  const isBn = locale === "bn";

  const { user, isLoggedIn } = useSelector((state) => state.auth);

  const { data: courseData, isLoading, error } = useGetCourseByIdQuery(courseId);
  const course = courseData?.data;

  // Check enrollment from subscriber learning query if logged in
  const {
    data: learningData,
    isLoading: isLearningLoading,
    refetch: refetchLearning,
  } = useGetMyLearningCoursesQuery(undefined, { skip: !isLoggedIn });

  const [enrollCourse, { isLoading: isEnrolling }] = useEnrollCourseMutation();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Determine if user has access to this classroom
  const hasAccess = useMemo(() => {
    if (!isLoggedIn) return false;

    // Admin & manager roles have preview access to all courses
    const adminRoles = ["super_admin", "admin", "course_admin", "manager"];
    if (adminRoles.includes(user?.role)) return true;

    // Subscriber role has access
    if (user?.role === "subscriber") return true;

    // Check my learning courses
    const myCourses = Array.isArray(learningData?.data) ? learningData.data : [];
    const inLearning = myCourses.some(
      (c) =>
        (c.courseId && String(c.courseId) === String(courseId)) ||
        (c._id && String(c._id) === String(course?._id)) ||
        (c.id && String(c.id) === String(courseId))
    );
    if (inLearning) return true;

    // Check user.enrolledCourses on auth user object
    const userEnrolled = Array.isArray(user?.enrolledCourses)
      ? user.enrolledCourses
      : [];
    const inUserEnrolled = userEnrolled.some((e) => {
      const eId = typeof e === "string" ? e : e?.courseId || e?._id;
      return (
        String(eId) === String(courseId) ||
        (course?.courseId && String(eId) === String(course.courseId)) ||
        (course?._id && String(eId) === String(course._id))
      );
    });

    return inUserEnrolled;
  }, [isLoggedIn, user, learningData, courseId, course]);

  // Handle direct free enroll for logged-in users
  const handleDirectEnroll = async () => {
    const targetCid = course?.courseId || courseId;
    try {
      await enrollCourse(targetCid).unwrap();
      toast.success(
        isBn
          ? "অভিনন্দন! কোর্সে সফলভাবে এনরোল সম্পন্ন হয়েছে।"
          : "Enrolled successfully! Welcome to the course."
      );
      if (refetchLearning) refetchLearning();
    } catch (err) {
      toast.error(
        err?.data?.message ||
          (isBn ? "এনরোল করতে সমস্যা হয়েছে।" : "Failed to enroll in course.")
      );
    }
  };

  // Extract lessons dynamically from the course's MongoDB curriculum
  const lessons = useMemo(() => {
    if (!course?.curriculum || course.curriculum.length === 0) {
      // If course has no curriculum modules yet, provide default structured lesson from course
      return [
        {
          id: "1",
          title: course?.title || "Safety Orientation & Guidelines",
          titleBn: course?.titleBn || "নিরাপত্তা পরিচিতি ও সরকারি নির্দেশিকা",
          duration: course?.duration || "10 mins",
          durationBn: course?.durationBn || "১০ মিনিট",
          videoUrl: course?.videoUrl || "/sample-course-video.mp4",
          description: course?.description || "Course safety lesson.",
          descriptionBn: course?.descriptionBn || "কোর্স নিরাপত্তা পাঠ।",
          notes: "Adhere to Bangladesh standard explosive regulations.",
          notesBn: "বাংলাদেশ বিস্ফোরক বিধিমালা ২০০৪ মেনে চলুন।",
        },
      ];
    }

    return course.curriculum.flatMap((mod, mIdx) =>
      (mod.lessons || []).map((l, lIdx) => ({
        ...l,
        id: l._id,
        moduleTitle: mod.moduleTitle,
        moduleTitleBn: mod.moduleTitleBn,
        videoUrl: l.videoUrl || course.videoUrl || "/sample-course-video.mp4",
      }))
    );
  }, [course]);

  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [completedLessonIds, setCompletedLessonIds] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("notes");
  const [showQuizModal, setShowQuizModal] = useState(false);

  if (isLoading || (isLoggedIn && isLearningLoading)) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-white">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-xs font-semibold text-slate-400">
            {isBn ? "কোর্স ক্লাসরুম লোড হচ্ছে..." : "Loading course classroom..."}
          </p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-950 text-white p-4">
        <div className="max-w-md text-center p-8 rounded-2xl bg-slate-900 border border-slate-800">
          <AlertCircle className="h-12 w-12 text-rose-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white mb-2">
            {isBn ? "কোর্স খুঁজে পাওয়া যায়নি" : "Course Not Found"}
          </h2>
          <p className="text-xs text-slate-400 mb-6">
            {isBn
              ? "এই কোর্সের কোনো পাঠ বা কনটেন্ট খুঁজে পাওয়া যায়নি। অনুগ্রহ করে ক্যাটালগে ফিরে যান।"
              : "No curriculum or lessons found for this course in the database."}
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary/90"
          >
            <span>{isBn ? "সকল কোর্সে ফিরে যান" : "Return to Courses"}</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Guard 1: User is not logged in -> Cannot access classroom without login
  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white p-4">
        <div className="w-full max-w-md text-center p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Lock className="h-8 w-8" />
          </div>

          <span className="inline-block rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-[11px] font-bold text-amber-400 mb-3">
            {isBn ? "🔒 ক্লাসরুম অ্যাক্সেস সংরক্ষিত" : "🔒 Protected Classroom"}
          </span>

          <h2 className="text-xl font-bold text-white mb-2">
            {isBn ? "ক্লাসরুমে প্রবেশের জন্য লগইন করুন" : "Please Log In to Enter Classroom"}
          </h2>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            {isBn
              ? "এই কোর্সের পূর্ণাঙ্গ ভিডিও লেকচার, স্টাডি হ্যান্ডআউট এবং অনলাইন কুইজ পেতে আপনার অ্যাকাউন্টে লগইন থাকা প্রয়োজন। নতুন হলে এখনই রেজিস্ট্রেশন করুন।"
              : "Access to video lectures, study handouts, and assessment quizzes requires an active learner account. Sign in or register to continue."}
          </p>

          <div className="space-y-3">
            <Button
              type="button"
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => setShowAuthModal(true)}
              className="gap-2 font-bold shadow-lg"
            >
              <LogIn className="h-4 w-4" />
              <span>{isBn ? "লগইন / রেজিস্ট্রেশন করুন" : "Log In / Register Now"}</span>
            </Button>

            <Link
              href={`/courses/${courseId}`}
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 px-4 py-3 text-xs font-semibold text-slate-300 transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              <span>{isBn ? "কোর্স সিলেবাস ও বিবরণ দেখুন" : "View Course Outline & Details"}</span>
            </Link>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <Link
              href="/courses"
              className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
            >
              ← {isBn ? "সকল কোর্সে ফিরে যান" : "Browse all available courses"}
            </Link>
          </div>
        </div>

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          defaultTab="login"
          onSuccess={() => {
            setShowAuthModal(false);
            if (!course?.isPaid || course?.price === 0) {
              handleDirectEnroll();
            } else {
              router.push(`/checkout?courseId=${course?.courseId || courseId}`);
            }
          }}
        />
      </div>
    );
  }

  // Guard 2: Logged-in user is not enrolled in this course (and not an admin)
  if (!hasAccess) {
    const isFree = !course?.isPaid || course?.price === 0;

    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white p-4">
        <div className="w-full max-w-md text-center p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-secondary/10 blur-2xl pointer-events-none" />

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary/10 border border-secondary/20 text-secondary">
            <ShieldCheck className="h-8 w-8" />
          </div>

          <span className="inline-block rounded-full bg-secondary/10 border border-secondary/20 px-3 py-1 text-[11px] font-bold text-secondary mb-3">
            {isBn ? "🎓 এনরোলমেন্ট আবশ্যক" : "🎓 Enrollment Required"}
          </span>

          <h2 className="text-xl font-bold text-white mb-2">
            {isBn ? "আপনি এখনও এই কোর্সে এনরোল করেননি" : "You Are Not Enrolled in This Course"}
          </h2>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed">
            {isBn
              ? "ক্লাসরুমের ভিডিও ও পাঠ্য উপকরণ দেখতে এখনই কোর্সে এনরোল সম্পন্ন করুন।"
              : "To stream lessons, access resources, and earn your verified certificate, please enroll in this course."}
          </p>

          <div className="space-y-3">
            {isFree ? (
              <Button
                type="button"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isEnrolling}
                onClick={handleDirectEnroll}
                className="gap-2 font-bold shadow-lg"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isBn ? "এখনই বিনামূল্যে এনরোল করুন" : "Enroll Now (Free)"}</span>
              </Button>
            ) : (
              <Link
                href={`/checkout?courseId=${course?.courseId || courseId}`}
                className="flex items-center justify-center gap-2 w-full rounded-xl bg-secondary hover:bg-secondary/90 px-4 py-3 text-xs font-bold text-white shadow-lg transition-all"
              >
                <ArrowRight className="h-4 w-4" />
                <span>
                  {isBn ? `কোর্সে ভর্তি হন (৳ ${course?.price})` : `Enroll Now (৳ ${course?.price})`}
                </span>
              </Link>
            )}

            <Link
              href={`/courses/${courseId}`}
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 px-4 py-3 text-xs font-semibold text-slate-300 transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              <span>{isBn ? "কোর্স আউটলাইন দেখুন" : "View Course Outline"}</span>
            </Link>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <Link href="/subscriber/courses" className="hover:text-primary transition-colors">
              ← {isBn ? "আমার এনরোল্ড কোর্সসমূহ" : "My Enrolled Courses"}
            </Link>
            <Link href="/courses" className="hover:text-slate-300 transition-colors">
              {isBn ? "সকল কোর্স" : "Browse Courses"} →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentLesson = lessons[currentLessonIdx] || lessons[0];
  const progressPercent =
    lessons.length > 0
      ? Math.round((completedLessonIds.length / lessons.length) * 100)
      : 0;

  const handleNextLesson = () => {
    if (currentLesson && !completedLessonIds.includes(currentLesson.id)) {
      setCompletedLessonIds((prev) => [...prev, currentLesson.id]);
    }

    // Always trigger Quiz prompt when a class is completed
    setShowQuizModal(true);
  };

  const handleProceedToNextLesson = () => {
    setShowQuizModal(false);
    if (currentLessonIdx < lessons.length - 1) {
      setCurrentLessonIdx((prev) => prev + 1);
      toast.success(
        isBn
          ? "পরবর্তী ক্লাসে যাওয়া হচ্ছে..."
          : "Moving to next lesson..."
      );
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIdx > 0) {
      setCurrentLessonIdx((prev) => prev - 1);
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-950 text-slate-100">
      {/* 1. Classroom Top Navigation Bar */}
      <ClassroomHeader
        courseId={courseId}
        currentLessonIdx={currentLessonIdx}
        totalLessons={lessons.length}
        progressPercent={progressPercent}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* 2. Main Classroom Body (Video Player + Sidebar) */}
      <div className="flex flex-1 overflow-hidden">
        <ClassroomVideoPlayer
          courseId={courseId}
          currentLesson={currentLesson}
          currentLessonIdx={currentLessonIdx}
          totalLessons={lessons.length}
          completedLessonIds={completedLessonIds}
          setCompletedLessonIds={setCompletedLessonIds}
          handlePrevLesson={handlePrevLesson}
          handleNextLesson={handleNextLesson}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onTriggerQuiz={() => setShowQuizModal(true)}
        />

        <ClassroomPlaylistSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          lessons={lessons}
          currentLessonIdx={currentLessonIdx}
          setCurrentLessonIdx={setCurrentLessonIdx}
          completedLessonIds={completedLessonIds}
          courseId={courseId}
        />
      </div>

      {/* 3. Class Completion -> Quiz Modal */}
      <Dialog
        isOpen={showQuizModal}
        onClose={() => setShowQuizModal(false)}
        maxWidth="md"
        title={
          isBn
            ? currentLessonIdx === lessons.length - 1
              ? "🎓 সমস্ত পাঠ সম্পন্ন! চূড়ান্ত কুইজে অংশ নিন"
              : "🎉 ক্লাস সম্পন্ন হয়েছে! কুইজে অংশ নিন"
            : currentLessonIdx === lessons.length - 1
              ? "🎓 All Lessons Completed! Take Final Quiz"
              : "🎉 Class Completed! Take Assessment Quiz"
        }
        description={
          isBn
            ? "আপনি সফলভাবে এই ক্লাসটি শেষ করেছেন। আপনার অর্জিত জ্ঞানের মূল্যায়নের জন্য কুইজে অংশ নিন অথবা পরবর্তী পাঠে যান।"
            : "You have completed this class. Test your knowledge with the assessment quiz or continue to the next lesson."
        }
      >
        <div className="p-6 text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
            <Award className="h-8 w-8" />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isBn ? currentLesson?.titleBn || currentLesson?.title : currentLesson?.title}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {isBn
                ? "কোর্স মূল্যায়ন কুইজে ৮০% বা তার বেশি স্কোর করলে তাৎক্ষণিক ডিজিটাল সার্টিফিকেট পাওয়া যাবে।"
                : "Score 80% or above in the assessment quiz to receive your verified digital certificate."}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowQuizModal(false)}
            >
              {isBn ? "পরে দেব" : "Review Later"}
            </Button>

            {currentLessonIdx < lessons.length - 1 && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleProceedToNextLesson}
              >
                <span>{isBn ? "পরবর্তী ক্লাস" : "Next Class"}</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            )}

            <Link
              href={`/courses/${courseId}/quiz`}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 shadow-md transition-all active:scale-95"
            >
              <span>{isBn ? "কুইজ শুরু করুন" : "Take Quiz Now"}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

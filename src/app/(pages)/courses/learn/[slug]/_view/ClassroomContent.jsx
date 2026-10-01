// src/app/(pages)/courses/learn/[slug]/_view/ClassroomContent.jsx
"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import {
  CheckCircle2,
  AlertCircle,
  Lock,
  LogIn,
  BookOpen,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import ClassroomHeader from "../_components/ClassroomHeader";
import ClassroomVideoPlayer from "../_components/ClassroomVideoPlayer";
import ClassroomPlaylistSidebar from "../_components/ClassroomPlaylistSidebar";
import ModuleQuizModal from "../_components/ModuleQuizModal";
import AuthModal from "@/components/shared/AuthModal";
import { useDictionary } from "@/context/DictionaryContext";
import {
  useGetCourseByIdQuery,
  useGetMyLearningCoursesQuery,
  useEnrollCourseMutation,
} from "@/redux/api/courseApi";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";

export default function ClassroomContent({ courseSlug }) {
  const router = useRouter();
  const { locale } = useDictionary();
  const isBn = locale === "bn";

  const { user, isLoggedIn } = useSelector((state) => state.auth);

  const { data: courseData, isLoading, error } = useGetCourseByIdQuery(courseSlug);
  const course = courseData?.data;
  const canonicalCourseId = course?.courseId || course?._id || courseSlug;
  const canonicalSlug = course?.slug || courseSlug;

  // Canonical slug URL synchronization: if accessed by numeric ID like "5", replace URL with canonical slug
  useEffect(() => {
    if (course?.slug && courseSlug !== course.slug && /^\d+$/.test(courseSlug)) {
      router.replace(`/courses/learn/${course.slug}`);
    }
  }, [course, courseSlug, router]);

  // Check enrollment from subscriber learning query if logged in
  const {
    data: learningData,
    isLoading: isLearningLoading,
    refetch: refetchLearning,
  } = useGetMyLearningCoursesQuery(undefined, { skip: !isLoggedIn });

  const [enrollCourse, { isLoading: isEnrolling }] = useEnrollCourseMutation();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Gating & Locked Lesson Modals
  const [lockedLessonModalOpen, setLockedLessonModalOpen] = useState(false);
  const [lockedLessonTarget, setLockedLessonTarget] = useState(null);

  // Module Quiz state
  const [activeModuleQuizData, setActiveModuleQuizData] = useState(null);
  const [activeModuleQuizIdx, setActiveModuleQuizIdx] = useState(0);
  const [showModuleQuizModal, setShowModuleQuizModal] = useState(false);

  // Passed module quizzes state: { [moduleIndex]: scorePercent }
  const [passedModuleQuizzes, setPassedModuleQuizzes] = useState({});

  // Sync passed quizzes with localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && canonicalCourseId) {
      try {
        const stored = localStorage.getItem(`lpg_course_${canonicalCourseId}_passed_quizzes`);
        if (stored) {
          setPassedModuleQuizzes(JSON.parse(stored));
        }
      } catch (err) {
        console.error("Failed to load passed quizzes from storage", err);
      }
    }
  }, [canonicalCourseId]);

  const handleQuizPassed = (moduleIndex, scorePercent) => {
    const updated = {
      ...passedModuleQuizzes,
      [moduleIndex]: scorePercent,
    };
    setPassedModuleQuizzes(updated);
    if (typeof window !== "undefined" && canonicalCourseId) {
      try {
        localStorage.setItem(
          `lpg_course_${canonicalCourseId}_passed_quizzes`,
          JSON.stringify(updated)
        );
      } catch (err) {
        console.error("Failed to persist passed quiz", err);
      }
    }
    toast.success(
      isBn
        ? `অভিনন্দন! মডিউল ${moduleIndex + 1} কুইজ পাস করেছেন (${scorePercent}%)। পরবর্তী মডিউল উন্মুক্ত হয়েছে!`
        : `Congratulations! Passed Module ${moduleIndex + 1} Quiz (${scorePercent}%). Next module unlocked!`
    );
  };

  // Determine if user has full access to this course
  const hasFullAccess = useMemo(() => {
    if (!isLoggedIn) return false;

    // Free courses are accessible to any logged in user
    if (!course?.price || course?.price === 0) return true;

    // Admin & manager roles have preview access to all courses
    const adminRoles = ["super_admin", "admin", "course_admin", "manager"];
    if (adminRoles.includes(user?.role)) return true;

    // Subscriber role has access
    if (user?.role === "subscriber") return true;

    // Check my learning courses
    const myCourses = Array.isArray(learningData?.data) ? learningData.data : [];
    const inLearning = myCourses.some(
      (c) =>
        (c.courseId && String(c.courseId) === String(canonicalCourseId)) ||
        (c.slug && String(c.slug) === String(canonicalSlug)) ||
        (c._id && String(c._id) === String(course?._id))
    );
    if (inLearning) return true;

    // Check user.enrolledCourses on auth user object
    const userEnrolled = Array.isArray(user?.enrolledCourses)
      ? user.enrolledCourses
      : [];
    const inUserEnrolled = userEnrolled.some((e) => {
      const eId = typeof e === "string" ? e : e?.courseId || e?._id;
      return (
        String(eId) === String(canonicalCourseId) ||
        (course?.courseId && String(eId) === String(course.courseId)) ||
        (course?._id && String(eId) === String(course._id))
      );
    });

    return inUserEnrolled;
  }, [isLoggedIn, user, learningData, canonicalCourseId, canonicalSlug, course]);

  // Structured Modules with free status & strict sequential gating
  const modules = useMemo(() => {
    if (!course?.curriculum || course.curriculum.length === 0) {
      return [
        {
          moduleTitle: course?.title || "Course Lessons",
          moduleTitleBn: course?.titleBn || "কোর্স পাঠসমূহ",
          isFree: true,
          isGatedLocked: false,
          lessons: [
            {
              id: "default-lesson-1",
              title: course?.title || "Safety Orientation & Guidelines",
              titleBn: course?.titleBn || "নিরাপত্তা পরিচিতি ও নির্দেশিকা",
              duration: course?.duration || "10 mins",
              durationBn: course?.durationBn || "১০ মিনিট",
              videoUrl: course?.videoUrl || "/sample-course-video.mp4",
              description: course?.description || "Course safety lesson.",
              descriptionBn: course?.descriptionBn || "কোর্স নিরাপত্তা পাঠ।",
              notes: "Adhere to Bangladesh standard regulations.",
              notesBn: "বাংলাদেশ সরকারি নিরাপত্তা বিধিমালা মেনে চলুন।",
              isLocked: false,
              isFree: true,
              isGatedLocked: false,
              moduleIdx: 0,
            },
          ],
          quiz: {
            title: "Course Quiz",
            titleBn: "কোর্স কুইজ",
            passingScore: 70,
            questions: [],
          },
        },
      ];
    }

    return course.curriculum.map((mod, mIdx) => {
      const isModFree = Boolean(
        mod.isFree || (mIdx === 0 && course.price > 0 && mod.isFree !== false)
      );

      // Sequential Gating Rule:
      // Module 0 is never gated by a previous quiz.
      // Module M (M > 0) is locked if Module (M - 1) quiz is not yet passed!
      const isGatedLocked = mIdx > 0 && !Boolean(passedModuleQuizzes[mIdx - 1]);

      const lessons = (mod.lessons || []).map((l, lIdx) => {
        const isLessonFree = isModFree || Boolean(l.freePreview);
        const isPremiumLocked = !hasFullAccess && !isLessonFree;
        const isLocked = isGatedLocked || isPremiumLocked;

        return {
          ...l,
          id: l._id || `m${mIdx}-l${lIdx}`,
          moduleIdx: mIdx,
          moduleTitle: mod.moduleTitle,
          moduleTitleBn: mod.moduleTitleBn,
          isModuleFree: isModFree,
          isLessonFree,
          isGatedLocked,
          isPremiumLocked,
          isLocked,
          requiredQuizModuleIdx: isGatedLocked ? mIdx - 1 : null,
          videoUrl: l.videoUrl || course.videoUrl || "/sample-course-video.mp4",
        };
      });

      return {
        ...mod,
        isFree: isModFree,
        isGatedLocked,
        requiredQuizModuleIdx: isGatedLocked ? mIdx - 1 : null,
        lessons,
      };
    });
  }, [course, hasFullAccess, passedModuleQuizzes]);

  // Flattened lessons list for video player navigation
  const lessons = useMemo(() => {
    return modules.flatMap((m) => m.lessons || []);
  }, [modules]);

  const firstPlayableIdx = useMemo(() => {
    const idx = lessons.findIndex((l) => !l.isLocked);
    return idx >= 0 ? idx : 0;
  }, [lessons]);

  const [currentLessonIdx, setCurrentLessonIdx] = useState(firstPlayableIdx);
  const [completedLessonIds, setCompletedLessonIds] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("notes");

  useEffect(() => {
    if (lessons[currentLessonIdx]?.isLocked) {
      const available = lessons.findIndex((l) => !l.isLocked);
      if (available >= 0) setCurrentLessonIdx(available);
    }
  }, [lessons, currentLessonIdx]);

  const hasAnyFreeLesson = useMemo(() => {
    return lessons.some((l) => !l.isLocked);
  }, [lessons]);

  if (isLoading || (isLoggedIn && isLearningLoading)) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 text-slate-800">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-3 border-primary border-t-transparent" />
          <p className="mt-4 text-xs font-semibold text-slate-500">
            {isBn ? "ক্লাসরুম লোড হচ্ছে..." : "Loading classroom..."}
          </p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-800 p-4">
        <div className="max-w-md text-center p-8 rounded-xl bg-white border border-slate-200 shadow-xs">
          <AlertCircle className="h-10 w-10 text-rose-500 mx-auto mb-3" />
          <h2 className="text-base font-bold text-slate-900 mb-2">
            {isBn ? "কোর্স খুঁজে পাওয়া যায়নি" : "Course Not Found"}
          </h2>
          <p className="text-xs text-slate-500 mb-6">
            {isBn
              ? "এই কোর্সের কোনো পাঠ বা কনটেন্ট খুঁজে পাওয়া যায়নি।"
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

  // Guard 1: User is not logged in -> Prompt registration / login
  if (!isLoggedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-800 p-4">
        <div className="w-full max-w-md text-center p-8 rounded-xl bg-white border border-slate-200 shadow-sm relative">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BookOpen className="h-6 w-6" />
          </div>

          <span className="inline-block rounded bg-emerald-50 border border-emerald-200 px-2.5 py-1 text-[11px] font-bold text-emerald-800 mb-3">
            {isBn ? "রেজিস্ট্রেশন করলেই ১ম মডিউল ফ্রি" : "Module 1 Free on Registration"}
          </span>

          <h2 className="text-lg font-bold text-slate-900 mb-2">
            {isBn ? "ক্লাসরুমে প্রবেশের জন্য লগইন করুন" : "Sign In to Access Classroom"}
          </h2>
          <p className="text-xs text-slate-600 mb-6 leading-relaxed">
            {isBn
              ? "এই কোর্সের ১ম মডিউল সকল নিবন্ধিত ব্যবহারকারীর জন্য সম্পূর্ণ ফ্রি। ভিডিও দেখতে ও কুইজে অংশ নিতে এখনই লগইন করুন।"
              : "Module 1 is accessible for all registered learners. Sign in or register to begin streaming."}
          </p>

          <div className="space-y-3">
            <Button
              type="button"
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => setShowAuthModal(true)}
              className="gap-2 font-bold"
            >
              <LogIn className="h-4 w-4" />
              <span>{isBn ? "লগইন / ফ্রি রেজিস্ট্রেশন" : "Log In / Register"}</span>
            </Button>

            <Link
              href={`/courses/${canonicalSlug}`}
              className="flex items-center justify-center gap-2 w-full rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              <span>{isBn ? "কোর্স বিবরণ ও সিলেবাস দেখুন" : "View Course Details"}</span>
            </Link>
          </div>
        </div>

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          defaultTab="register"
          onSuccess={() => {
            setShowAuthModal(false);
            if (refetchLearning) refetchLearning();
          }}
        />
      </div>
    );
  }

  // Guard 2: Paid course, no full access, no free lessons
  if (!hasFullAccess && !hasAnyFreeLesson) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-800 p-4">
        <div className="w-full max-w-md text-center p-8 rounded-xl bg-white border border-slate-200 shadow-sm relative">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Lock className="h-6 w-6" />
          </div>

          <span className="inline-block rounded bg-primary/10 px-2.5 py-1 text-[11px] font-bold text-primary mb-3">
            {isBn ? "ভর্তি আবশ্যক" : "Enrollment Required"}
          </span>

          <h2 className="text-lg font-bold text-slate-900 mb-2">
            {isBn ? "কোর্সে ভর্তি সম্পন্ন করুন" : "Enrollment Required"}
          </h2>
          <p className="text-xs text-slate-600 mb-6 leading-relaxed">
            {isBn
              ? "ক্লাসরুমের লেকচার, মডিউল কুইজ ও সার্টিফিকেট অ্যাক্সেস করতে অনুগ্রহ করে কোর্সে ভর্তি সম্পন্ন করুন।"
              : "To access lessons, gating quizzes and your certificate, please enroll in this course."}
          </p>

          <div className="space-y-3">
            <Link
              href={`/checkout?courseId=${canonicalCourseId}`}
              className="flex items-center justify-center gap-2 w-full rounded-lg bg-primary hover:bg-primary/90 px-4 py-2.5 text-xs font-bold text-white transition-colors"
            >
              <ArrowRight className="h-4 w-4" />
              <span>
                {isBn ? `কোর্সে ভর্তি হন (৳ ${course?.price})` : `Enroll Now (৳ ${course?.price})`}
              </span>
            </Link>

            <Link
              href={`/courses/${canonicalSlug}`}
              className="flex items-center justify-center gap-2 w-full rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              <span>{isBn ? "কোর্স বিবরণ দেখুন" : "View Course Details"}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Active Lesson State
  const currentLesson = lessons[currentLessonIdx] || lessons[0];
  const progressPercent =
    lessons.length > 0
      ? Math.round((completedLessonIds.length / lessons.length) * 100)
      : 0;

  // Gating & Next Lesson Trigger Logic
  const handleNextLesson = () => {
    if (currentLesson && !completedLessonIds.includes(currentLesson.id)) {
      setCompletedLessonIds((prev) => [...prev, currentLesson.id]);
    }

    const currentModIdx = currentLesson?.moduleIdx ?? 0;
    const currentMod = modules[currentModIdx];
    const currentModLessons = currentMod?.lessons || [];
    const isLastLessonOfModule =
      currentModLessons.length > 0 &&
      currentLesson.id === currentModLessons[currentModLessons.length - 1].id;

    // Last lesson of module -> Trigger module quiz if not passed
    if (isLastLessonOfModule && currentMod?.quiz?.questions?.length > 0) {
      const isQuizPassed = Boolean(passedModuleQuizzes[currentModIdx]);
      if (!isQuizPassed) {
        setActiveModuleQuizData(currentMod);
        setActiveModuleQuizIdx(currentModIdx);
        setShowModuleQuizModal(true);
        toast.info(
          isBn
            ? `মডিউল ${currentModIdx + 1} শেষ হয়েছে! পরবর্তী মডিউলে যাওয়ার জন্য কুইজে অংশ নিন।`
            : `Module ${currentModIdx + 1} completed! Pass the quiz to unlock the next module.`
        );
        return;
      }
    }

    if (currentLessonIdx < lessons.length - 1) {
      const nextLesson = lessons[currentLessonIdx + 1];
      if (nextLesson.isLocked) {
        setLockedLessonTarget(nextLesson);
        setLockedLessonModalOpen(true);
      } else {
        setCurrentLessonIdx((prev) => prev + 1);
      }
    } else {
      toast.success(
        isBn
          ? "🎉 অভিনন্দন! আপনি এই কোর্সের সকল পাঠ সফলভাবে সম্পন্ন করেছেন।"
          : "🎉 All lessons completed in this course!"
      );
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIdx > 0) {
      setCurrentLessonIdx((prev) => prev - 1);
    }
  };

  const handleSelectLockedLesson = (lesson) => {
    setLockedLessonTarget(lesson);
    setLockedLessonModalOpen(true);
  };

  const handleTakeModuleQuiz = (mod, modIdx) => {
    setActiveModuleQuizData(mod);
    setActiveModuleQuizIdx(modIdx);
    setShowModuleQuizModal(true);
  };

  const handleProceedToNextModule = (fromModuleIdx) => {
    const nextModLessonIdx = lessons.findIndex(
      (l) => l.moduleIdx === fromModuleIdx + 1
    );
    if (nextModLessonIdx >= 0) {
      setCurrentLessonIdx(nextModLessonIdx);
    }
  };

  const courseTitle = isBn ? course.titleBn || course.title : course.title;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50 text-slate-800">
      {/* 1. Light Theme Header */}
      <ClassroomHeader
        courseSlug={canonicalSlug}
        courseTitle={courseTitle}
        currentLessonIdx={currentLessonIdx}
        totalLessons={lessons.length}
        progressPercent={progressPercent}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Free Module Banner */}
      {!hasFullAccess && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>
              {isBn
                ? "আপনি এই কোর্সের ১ম ফ্রি মডিউল দেখছেন।"
                : "You are currently viewing the Free Module 1."}
            </span>
          </div>
          <Link
            href={`/checkout?courseId=${canonicalCourseId}`}
            className="font-bold text-emerald-900 underline hover:text-emerald-700 ml-2 shrink-0"
          >
            {isBn ? `সম্পূর্ণ কোর্স আনলক করুন (৳ ${course?.price})` : `Unlock All Modules (৳ ${course?.price})`} →
          </Link>
        </div>
      )}

      {/* 2. Main Classroom Body (Video Player + Sidebar) */}
      <div className="flex flex-1 overflow-hidden">
        <ClassroomVideoPlayer
          courseId={canonicalCourseId}
          currentLesson={currentLesson}
          currentLessonIdx={currentLessonIdx}
          totalLessons={lessons.length}
          completedLessonIds={completedLessonIds}
          setCompletedLessonIds={setCompletedLessonIds}
          handlePrevLesson={handlePrevLesson}
          handleNextLesson={handleNextLesson}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onTriggerQuiz={() => {
            const currentMod = modules[currentLesson?.moduleIdx ?? 0];
            if (currentMod?.quiz?.questions?.length > 0) {
              setActiveModuleQuizData(currentMod);
              setActiveModuleQuizIdx(currentLesson?.moduleIdx ?? 0);
              setShowModuleQuizModal(true);
            }
          }}
        />

        <ClassroomPlaylistSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          modules={modules}
          lessons={lessons}
          currentLessonIdx={currentLessonIdx}
          setCurrentLessonIdx={setCurrentLessonIdx}
          completedLessonIds={completedLessonIds}
          courseSlug={canonicalSlug}
          passedModuleQuizzes={passedModuleQuizzes}
          onTakeModuleQuiz={handleTakeModuleQuiz}
          onSelectLockedLesson={handleSelectLockedLesson}
        />
      </div>

      {/* 3. Locked Lesson Modal */}
      <Dialog
        isOpen={lockedLessonModalOpen}
        onClose={() => setLockedLessonModalOpen(false)}
        maxWidth="md"
        title={
          lockedLessonTarget?.isGatedLocked
            ? isBn
              ? "পরবর্তী মডিউলটি লক করা রয়েছে"
              : "Module Locked: Quiz Required"
            : isBn
            ? "প্রিমিয়াম মডিউল আনলক করুন"
            : "Unlock Premium Module"
        }
      >
        <div className="p-6 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
            <Lock className="h-6 w-6" />
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isBn
                ? lockedLessonTarget?.titleBn || lockedLessonTarget?.title || "লক করা পাঠ"
                : lockedLessonTarget?.title || "Locked Lesson"}
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {lockedLessonTarget?.isGatedLocked ? (
                isBn ? (
                  <>
                    পরবর্তী মডিউলে প্রবেশ করতে পূর্ববর্তী{" "}
                    <strong>
                      মডিউল {((lockedLessonTarget?.requiredQuizModuleIdx ?? 0) + 1)}
                    </strong>{" "}
                    এর মূল্যায়ন কুইজে ন্যূনতম ৭০% নম্বর পেয়ে পাস করতে হবে।
                  </>
                ) : (
                  <>
                    Passing the{" "}
                    <strong>
                      Module {(lockedLessonTarget?.requiredQuizModuleIdx ?? 0) + 1} Assessment Quiz
                    </strong>{" "}
                    (minimum 70%) is required before accessing this module.
                  </>
                )
              ) : isBn ? (
                `সম্পূর্ণ কোর্স, হ্যান্ডআউট ও সার্টিফিকেট পেতে অনুগ্রহ করে ভর্তি সম্পন্ন করুন।`
              ) : (
                `Enroll in the full course to unlock all modules, resources, and your certificate.`
              )}
            </p>
          </div>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setLockedLessonModalOpen(false)}
              className="w-full sm:w-auto"
            >
              {isBn ? "ফিরে যান" : "Close"}
            </Button>

            {lockedLessonTarget?.isGatedLocked ? (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => {
                  const reqIdx = lockedLessonTarget.requiredQuizModuleIdx ?? 0;
                  setLockedLessonModalOpen(false);
                  if (modules[reqIdx]) {
                    handleTakeModuleQuiz(modules[reqIdx], reqIdx);
                  }
                }}
                className="gap-1.5 font-bold w-full sm:w-auto"
              >
                <HelpCircle className="h-4 w-4" />
                <span>
                  {isBn
                    ? `মডিউল ${(lockedLessonTarget?.requiredQuizModuleIdx ?? 0) + 1} কুইজ দিন`
                    : `Take Module ${(lockedLessonTarget?.requiredQuizModuleIdx ?? 0) + 1} Quiz`}
                </span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            ) : (
              <Link
                href={`/checkout?courseId=${canonicalCourseId}`}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2 text-xs font-bold text-white hover:bg-primary/90 transition-colors w-full sm:w-auto"
              >
                <span>{isBn ? `কোর্সে ভর্তি হন (৳ ${course?.price})` : `Enroll (৳ ${course?.price})`}</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </Dialog>

      {/* 4. Module Quiz Modal */}
      {activeModuleQuizData && (
        <ModuleQuizModal
          isOpen={showModuleQuizModal}
          onClose={() => setShowModuleQuizModal(false)}
          moduleData={activeModuleQuizData}
          moduleIndex={activeModuleQuizIdx}
          onQuizPassed={handleQuizPassed}
          onProceedToNextModule={handleProceedToNextModule}
        />
      )}
    </div>
  );
}

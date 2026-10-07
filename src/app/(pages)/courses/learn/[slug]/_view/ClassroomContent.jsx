// src/app/(pages)/courses/learn/[slug]/_view/ClassroomContent.jsx
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
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
} from "lucide-react";
import ClassroomHeader from "../_components/ClassroomHeader";
import ClassroomVideoPlayer from "../_components/ClassroomVideoPlayer";
import ClassroomPlaylistSidebar from "../_components/ClassroomPlaylistSidebar";
import ClassroomQuizView from "../_components/ClassroomQuizView";
import AuthModal from "@/components/shared/AuthModal";
import { useDictionary } from "@/context/DictionaryContext";
import {
  useGetCourseByIdQuery,
  useGetMyLearningCoursesQuery,
  useEnrollCourseMutation,
  useSubmitModuleQuizMutation,
} from "@/redux/api/courseApi";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import CheckoutModal from "@/components/shared/CheckoutModal";

export default function ClassroomContent({ courseSlug }) {
  const router = useRouter();
  const { locale } = useDictionary();
  const isBn = locale === "bn";

  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

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

  const [enrollCourse] = useEnrollCourseMutation();
  const [submitModuleQuizApi] = useSubmitModuleQuizMutation();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Gating & Locked Lesson Modals
  const [lockedLessonModalOpen, setLockedLessonModalOpen] = useState(false);
  const [lockedLessonTarget, setLockedLessonTarget] = useState(null);

  // Active learning view: { type: "video", lessonIdx: number, moduleIdx: number } | { type: "quiz", moduleIdx: number, lessonIdx: -1 }
  const [activeView, setActiveView] = useState({
    type: "video",
    lessonIdx: 0,
    moduleIdx: 0,
  });

  // Learning Progress States
  const [completedLessonIds, setCompletedLessonIds] = useState([]);
  const [lessonProgressMap, setLessonProgressMap] = useState({});
  const [moduleQuizResults, setModuleQuizResults] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("notes");

  // Reset learning state whenever logged-in user changes (prevents progress bleed between accounts)
  const lastUserIdRef = useRef(user?._id);
  useEffect(() => {
    if (lastUserIdRef.current !== user?._id) {
      lastUserIdRef.current = user?._id;
      setCompletedLessonIds([]);
      setLessonProgressMap({});
      setModuleQuizResults({});
      hasAutoEnrolledRef.current = false;
      setActiveView({ type: "video", lessonIdx: 0, moduleIdx: 0 });
    }
  }, [user?._id]);

  // Auto-enroll guard to prevent repeated mutation or infinite re-fetching loops
  const hasAutoEnrolledRef = useRef(false);

  // Helper to reliably determine if course is 100% free
  const checkIsCourseFree = (c) => {
    if (!c) return false;
    if (c.isFree === true) return true;
    if (!c.price || Number(c.price) === 0 || String(c.price).trim() === "0") return true;
    return false;
  };

  const isCourseFree = checkIsCourseFree(course);

  // Auto-enroll logged-in user in free course if not enrolled (strictly once per load)
  useEffect(() => {
    if (hasAutoEnrolledRef.current) return;
    if (isLoggedIn && course && isCourseFree) {
      const myCourses = Array.isArray(learningData?.data) ? learningData.data : [];
      const alreadyEnrolled = myCourses.some(
        (c) =>
          String(c.courseId) === String(canonicalCourseId) ||
          String(c.slug) === String(canonicalSlug) ||
          String(c._id) === String(course?._id)
      );
      if (alreadyEnrolled) {
        hasAutoEnrolledRef.current = true;
      } else if (!isLearningLoading) {
        hasAutoEnrolledRef.current = true;
        const enrollId = course.courseId || course._id || course.slug;
        if (enrollId) {
          enrollCourse(enrollId)
            .unwrap()
            .then(() => {
              if (refetchLearning) refetchLearning();
            })
            .catch(() => {});
        }
      }
    }
  }, [
    isLoggedIn,
    course,
    isCourseFree,
    canonicalCourseId,
    canonicalSlug,
    learningData,
    isLearningLoading,
    enrollCourse,
    refetchLearning,
  ]);

  // Determine if user has full access to this course
  const hasFullAccess = useMemo(() => {
    // Free courses are accessible to any logged in user
    if (isCourseFree) return true;

    if (!isLoggedIn || !user) return false;

    // Active subscriber has access to all courses while subscription is valid (> 0 days remaining)
    const sub = user?.subscription;
    const now = Date.now();
    const hasRemainingDays =
      sub?.remainingDays !== undefined && sub?.remainingDays !== null
        ? Number(sub.remainingDays) > 0
        : true;
    const hasValidExpiry = sub?.expiresAt
      ? new Date(sub.expiresAt).getTime() > now
      : sub?.planKey === "lifetime";

    const isSubActive =
      sub?.status === "active" &&
      sub?.planKey &&
      sub?.planKey !== "course_single" &&
      sub?.planKey !== "free" &&
      hasValidExpiry &&
      hasRemainingDays;

    if (isSubActive) return true;

    // Check user.enrolledCourses on auth user object
    const userEnrolled = Array.isArray(user?.enrolledCourses)
      ? user.enrolledCourses
      : [];
    const inUserEnrolled = userEnrolled.some((e) => {
      // Free preview enrollments do NOT grant full access to paid courses
      if (typeof e === "object" && (e?.status === "preview" || e?.isFreePreview === true)) {
        return false;
      }
      const eId = typeof e === "string" ? e : e?.courseId || e?._id;
      return (
        String(eId) === String(canonicalCourseId) ||
        (course?.courseId && String(eId) === String(course.courseId)) ||
        (course?._id && String(eId) === String(course._id)) ||
        (canonicalSlug && String(eId) === String(canonicalSlug))
      );
    });

    return inUserEnrolled;
  }, [isLoggedIn, user, isCourseFree, canonicalCourseId, canonicalSlug, course]);

  // Sync completed lessons, lesson positions, and module quiz results
  useEffect(() => {
    if (!canonicalCourseId) return;

    // Purge legacy unscoped keys from localStorage so old tester sessions never bleed
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(`lpg_course_${canonicalCourseId}_completed_lessons`);
        localStorage.removeItem(`lpg_course_${canonicalCourseId}_quiz_results`);
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const k = localStorage.key(i);
          if (k && k.startsWith("lpg_course_")) {
            localStorage.removeItem(k);
          }
        }
      } catch (e) {}
    }

    if (isLoggedIn) {
      // 1. Authenticated User: Authoritative backend learningData is the single source of truth
      const myCourse = Array.isArray(learningData?.data)
        ? learningData.data.find(
            (c) =>
              String(c.courseId) === String(canonicalCourseId) ||
              String(c.slug) === String(canonicalSlug) ||
              String(c._id) === String(course?._id)
          )
        : null;

      if (myCourse?.enrollment) {
        // Completed lessons from backend
        const backendLessons = Array.isArray(myCourse.enrollment.completedLessons)
          ? myCourse.enrollment.completedLessons
          : [];
        setCompletedLessonIds(backendLessons);

        // Lesson playback progress from backend
        const lpMap = {};
        if (Array.isArray(myCourse.enrollment.lessonProgress)) {
          myCourse.enrollment.lessonProgress.forEach((lp) => {
            if (lp.lessonId) lpMap[lp.lessonId] = Number(lp.lastPositionSeconds) || 0;
          });
        }
        setLessonProgressMap(lpMap);

        // Module Quiz results from backend
        const mqMap = {};
        if (Array.isArray(myCourse.enrollment.moduleQuizResults)) {
          myCourse.enrollment.moduleQuizResults.forEach((qr) => {
            if (qr && qr.moduleIndex !== undefined) {
              mqMap[qr.moduleIndex] = qr;
            }
          });
        }
        setModuleQuizResults(mqMap);
      } else if (!isLearningLoading) {
        // New user or not enrolled yet -> clean empty slate!
        setCompletedLessonIds([]);
        setLessonProgressMap({});
        setModuleQuizResults({});
      }
    } else {
      // 2. Guest User: Isolated guest cache in localStorage
      if (typeof window !== "undefined") {
        try {
          const storedLessons = localStorage.getItem(
            `lpg_guest_course_${canonicalCourseId}_completed_lessons`
          );
          if (storedLessons) {
            const parsed = JSON.parse(storedLessons);
            setCompletedLessonIds(Array.isArray(parsed) ? parsed : []);
          } else {
            setCompletedLessonIds([]);
          }

          const storedQuizResults = localStorage.getItem(
            `lpg_guest_course_${canonicalCourseId}_quiz_results`
          );
          if (storedQuizResults) {
            const parsed = JSON.parse(storedQuizResults);
            setModuleQuizResults(parsed && typeof parsed === "object" ? parsed : {});
          } else {
            setModuleQuizResults({});
          }
        } catch (e) {
          setCompletedLessonIds([]);
          setModuleQuizResults({});
        }
      }
    }
  }, [
    isLoggedIn,
    learningData,
    isLearningLoading,
    canonicalCourseId,
    canonicalSlug,
    course?._id,
  ]);

  // Persist completedLessonIds in localStorage (strictly scoped per user or guest)
  useEffect(() => {
    if (typeof window !== "undefined" && canonicalCourseId) {
      try {
        const userScope = user?._id ? `user_${user._id}` : "guest";
        if (completedLessonIds.length > 0) {
          localStorage.setItem(
            `lpg_${userScope}_course_${canonicalCourseId}_completed_lessons`,
            JSON.stringify(completedLessonIds)
          );
        } else {
          localStorage.removeItem(
            `lpg_${userScope}_course_${canonicalCourseId}_completed_lessons`
          );
        }
      } catch (e) {}
    }
  }, [completedLessonIds, canonicalCourseId, user?._id]);

  // Structured Modules with sequential video gating & module quiz passing rules
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
              lessonIdx: 0,
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
      // Paid course: Module 1 is ALWAYS free preview for registered users; Module 2+ requires enrollment
      // Free course: All modules are 100% free
      const isModFree = isCourseFree || mIdx === 0;

      // Previous module quiz gating check:
      let isGatedLocked = false;
      if (mIdx > 0) {
        const prevMod = course.curriculum[mIdx - 1];
        const prevQuizResult = moduleQuizResults[mIdx - 1];
        const hasPrevQuiz = prevMod.quiz?.questions && prevMod.quiz.questions.length > 0;
        if (hasPrevQuiz) {
          isGatedLocked = !prevQuizResult?.isPassed;
        } else {
          // Fallback if previous module had no quiz questions
          const prevLessons = prevMod.lessons || [];
          const allPrevCompleted = prevLessons.every((pl, pIdx) => {
            const plId = pl._id ? String(pl._id) : `m${mIdx - 1}-l${pIdx}`;
            return (
              completedLessonIds.includes(plId) ||
              completedLessonIds.includes(String(pl._id))
            );
          });
          isGatedLocked = !allPrevCompleted;
        }
      }

      const lessons = (mod.lessons || []).map((l, lIdx) => {
        const lessonId = l._id ? String(l._id) : `m${mIdx}-l${lIdx}`;
        const isLessonFree = isModFree;
        const isPremiumLocked = !hasFullAccess && !isLessonFree;

        // Sequential lesson gating within module:
        let isSequentialLocked = false;
        if (isGatedLocked) {
          isSequentialLocked = true;
        } else if (lIdx > 0) {
          const prevLesson = mod.lessons[lIdx - 1];
          const prevLessonId = prevLesson._id
            ? String(prevLesson._id)
            : `m${mIdx}-l${lIdx - 1}`;
          const isPrevCompleted =
            completedLessonIds.includes(prevLessonId) ||
            completedLessonIds.includes(String(prevLesson._id));
          if (!isPrevCompleted) {
            isSequentialLocked = true;
          }
        }

        // A completed lesson is only replayable if user has access to that tier!
        const isAlreadyCompleted =
          completedLessonIds.includes(lessonId) ||
          completedLessonIds.includes(String(l._id));

        // Premium lock ALWAYS locks the lesson if user has no access, regardless of completion status!
        const isLocked = isPremiumLocked || (!isAlreadyCompleted && isSequentialLocked);

        const isLastInModule = lIdx === (mod.lessons?.length || 1) - 1;
        const hasModuleQuiz = Boolean(mod.quiz?.questions && mod.quiz.questions.length > 0);

        return {
          ...l,
          id: lessonId,
          moduleIdx: mIdx,
          lessonIdx: lIdx,
          isLastInModule,
          hasModuleQuiz,
          moduleTitle: mod.moduleTitle,
          moduleTitleBn: mod.moduleTitleBn,
          isModuleFree: isModFree,
          isLessonFree,
          isGatedLocked,
          isPremiumLocked,
          isLocked,
          videoUrl: l.videoUrl || course.videoUrl || "/sample-course-video.mp4",
        };
      });

      return {
        ...mod,
        isFree: isModFree,
        isGatedLocked,
        lessons,
      };
    });
  }, [course, isCourseFree, hasFullAccess, moduleQuizResults, completedLessonIds]);

  // Flattened lessons list for video player navigation
  const lessons = useMemo(() => {
    return modules.flatMap((m) => m.lessons || []);
  }, [modules]);

  const firstPlayableIdx = useMemo(() => {
    // 1. Is there an in-progress paused lesson?
    const inProgressIdx = lessons.findIndex(
      (l) =>
        !l.isLocked &&
        !completedLessonIds.includes(l.id) &&
        (lessonProgressMap[l.id] || 0) > 3
    );
    if (inProgressIdx >= 0) return inProgressIdx;

    // 2. Otherwise first unlocked incomplete lesson
    const firstIncomplete = lessons.findIndex(
      (l) => !l.isLocked && !completedLessonIds.includes(l.id)
    );
    if (firstIncomplete >= 0) return firstIncomplete;

    // 3. Fallback to first unlocked lesson
    const idx = lessons.findIndex((l) => !l.isLocked);
    return idx >= 0 ? idx : 0;
  }, [lessons, completedLessonIds, lessonProgressMap]);

  // Synchronize initial playable lesson when lessons load
  useEffect(() => {
    if (firstPlayableIdx >= 0 && lessons[firstPlayableIdx]) {
      setActiveView((prev) => {
        if (prev.type === "video" && prev.lessonIdx === 0 && firstPlayableIdx !== 0) {
          return {
            type: "video",
            lessonIdx: firstPlayableIdx,
            moduleIdx: lessons[firstPlayableIdx]?.moduleIdx ?? 0,
          };
        }
        return prev;
      });
    }
  }, [firstPlayableIdx, lessons]);

  const currentLessonIdx =
    activeView.type === "video" && activeView.lessonIdx >= 0
      ? activeView.lessonIdx
      : 0;

  // Auto-switch away if active video lesson is locked
  useEffect(() => {
    if (activeView.type === "video" && lessons[activeView.lessonIdx]?.isLocked) {
      const available = lessons.findIndex((l) => !l.isLocked);
      if (available >= 0 && available !== activeView.lessonIdx) {
        setActiveView({
          type: "video",
          lessonIdx: available,
          moduleIdx: lessons[available]?.moduleIdx ?? 0,
        });
      }
    }
  }, [lessons, activeView.lessonIdx, activeView.type]);

  // Strict guard: Paid course + No enrollment or valid subscription -> cannot view Module 2+
  useEffect(() => {
    if (!isCourseFree && !hasFullAccess && activeView.moduleIdx > 0) {
      setActiveView({
        type: "video",
        lessonIdx: 0,
        moduleIdx: 0,
      });
      setIsCheckoutModalOpen(true);
    }
  }, [isCourseFree, hasFullAccess, activeView.moduleIdx]);

  const hasAnyFreeLesson = useMemo(() => {
    return lessons.some((l) => !l.isLocked);
  }, [lessons]);

  // Active Lesson State & Overall Progress (Must be called unconditionally before early returns)
  const currentLesson = lessons[currentLessonIdx] || lessons[0];
  const progressPercent = useMemo(() => {
    const totalVideos = lessons.length;
    const totalQuizzes = (modules || []).filter(
      (m) => m.quiz?.questions && m.quiz.questions.length > 0
    ).length;
    const totalItems = totalVideos + totalQuizzes;
    if (totalItems === 0) return 0;

    const completedQuizzesCount = Object.values(moduleQuizResults || {}).filter(
      (r) => r?.isPassed
    ).length;
    const completedItems = (completedLessonIds || []).length + completedQuizzesCount;
    return Math.min(100, Math.round((completedItems / totalItems) * 100));
  }, [lessons?.length, modules, moduleQuizResults, completedLessonIds?.length]);

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
  if (!isCourseFree && !hasFullAccess && !hasAnyFreeLesson) {
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
            <Button
              type="button"
              variant="primary"
              size="md"
              fullWidth
              onClick={() => setIsCheckoutModalOpen(true)}
              className="gap-2 font-bold"
            >
              <ArrowRight className="h-4 w-4" />
              <span>
                {isBn ? `কোর্সে ভর্তি হন (৳ ${course?.price})` : `Enroll Now (৳ ${course?.price})`}
              </span>
            </Button>

            <Link
              href={`/courses/${canonicalSlug}`}
              className="flex items-center justify-center gap-2 w-full rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 transition-colors"
            >
              <BookOpen className="h-4 w-4" />
              <span>{isBn ? "কোর্স বিবরণ দেখুন" : "View Course Details"}</span>
            </Link>
          </div>
        </div>

        {/* Checkout Modal */}
        <CheckoutModal
          isOpen={isCheckoutModalOpen}
          onClose={() => setIsCheckoutModalOpen(false)}
          course={course}
          onSuccess={() => setIsCheckoutModalOpen(false)}
        />
      </div>
    );
  }

  // Next Lesson & Quiz Transition Logic (In-place transitions!)
  const handleNextLesson = () => {
    // 1. Mark current lesson completed
    if (currentLesson?.id) {
      setCompletedLessonIds((prev) =>
        prev.includes(currentLesson.id) ? prev : [...prev, currentLesson.id]
      );
    }

    const currentModIdx = currentLesson?.moduleIdx ?? 0;
    const currentMod = modules[currentModIdx];
    const isLastLessonInMod =
      currentLesson?.lessonIdx === (currentMod?.lessons?.length || 1) - 1;
    const hasModQuiz = Boolean(
      currentMod?.quiz?.questions && currentMod.quiz.questions.length > 0
    );

    // If last lesson in module and module has a quiz -> SWITCH VIEW TO QUIZ IN-PLACE!
    if (isLastLessonInMod && hasModQuiz) {
      setActiveView({
        type: "quiz",
        moduleIdx: currentModIdx,
        lessonIdx: -1,
      });
      return;
    }

    // If last lesson in Module 1 and Module 1 does NOT have a quiz:
    // Module 1 is finished! For a paid course without enrollment or valid subscription, open CheckoutModal immediately!
    if (isLastLessonInMod && currentModIdx === 0 && !isCourseFree && !hasFullAccess) {
      setIsCheckoutModalOpen(true);
      toast.warning(
        isBn
          ? "১ম মডিউল সম্পন্ন হয়েছে! পরবর্তী মডিউল দেখতে কোর্সে ভর্তি হন বা সাবস্ক্রিপশন নিশ্চিত করুন।"
          : "Module 1 completed! Please enroll or subscribe to continue to Module 2."
      );
      return;
    }

    if (currentLessonIdx < lessons.length - 1) {
      const nextLesson = lessons[currentLessonIdx + 1];

      // Check 1: Is next lesson in Module 2+ or premium locked (Paid course & not enrolled)?
      if ((nextLesson.moduleIdx > 0 || nextLesson.isPremiumLocked) && !isCourseFree && !hasFullAccess) {
        setIsCheckoutModalOpen(true);
        toast.warning(
          isBn
            ? "মডিউল ২ এবং পরবর্তী পাঠগুলো দেখতে কোর্সে ভর্তি হন বা সাবস্ক্রিপশন নিশ্চিত করুন।"
            : "Please enroll in the course or subscribe to unlock Module 2 onwards."
        );
        return;
      }

      // Check 2: Is next lesson in a new module that is gated by quiz?
      if (nextLesson.moduleIdx > currentModIdx && nextLesson.isGatedLocked) {
        toast.warning(
          isBn
            ? "পূর্ববর্তী মডিউলের কুইজ সফলভাবে সম্পন্ন না করে পরবর্তী মডিউলে যাওয়া যাবে না।"
            : "Please pass the previous module quiz before advancing to the next module."
        );
        return;
      }

      // Advance directly to next lesson!
      setActiveView({
        type: "video",
        lessonIdx: currentLessonIdx + 1,
        moduleIdx: nextLesson.moduleIdx,
      });
    } else {
      // Check if current module has a quiz first
      if (currentMod && hasModQuiz) {
        setActiveView({
          type: "quiz",
          moduleIdx: currentModIdx,
          lessonIdx: -1,
        });
        return;
      }

      // Or check if next module is an exam-only module (0 videos, quiz only)
      const nextModIdx = currentModIdx + 1;
      const nextMod = modules[nextModIdx];
      if (
        nextMod &&
        (!nextMod.lessons || nextMod.lessons.length === 0) &&
        nextMod.quiz?.questions?.length > 0
      ) {
        setActiveView({
          type: "quiz",
          moduleIdx: nextModIdx,
          lessonIdx: -1,
        });
        return;
      }

      toast.success(
        isBn
          ? "🎉 অভিনন্দন! আপনি এই কোর্সের সকল পাঠ সফলভাবে সম্পন্ন করেছেন।"
          : "🎉 Congratulations! All lessons completed."
      );
    }
  };

  const handlePrevLesson = () => {
    if (currentLessonIdx > 0) {
      const prevLesson = lessons[currentLessonIdx - 1];
      // If previous lesson was in a previous module that has a quiz:
      if (prevLesson.moduleIdx < currentLesson.moduleIdx) {
        const prevMod = modules[prevLesson.moduleIdx];
        if (prevMod?.quiz?.questions?.length > 0) {
          setActiveView({
            type: "quiz",
            moduleIdx: prevLesson.moduleIdx,
            lessonIdx: -1,
          });
          return;
        }
      }
      setActiveView({
        type: "video",
        lessonIdx: currentLessonIdx - 1,
        moduleIdx: prevLesson.moduleIdx,
      });
    }
  };

  const handlePrevFromQuiz = (modIdx) => {
    const currentModLessons = lessons.filter((l) => l.moduleIdx === modIdx);
    if (currentModLessons.length > 0) {
      const lastLesson = currentModLessons[currentModLessons.length - 1];
      const lastGlobalIdx = lessons.findIndex((l) => l.id === lastLesson.id);
      if (lastGlobalIdx >= 0) {
        setActiveView({
          type: "video",
          lessonIdx: lastGlobalIdx,
          moduleIdx: modIdx,
        });
        return;
      }
    }
    if (modIdx > 0) {
      const prevMod = modules[modIdx - 1];
      if (prevMod?.quiz?.questions?.length > 0) {
        setActiveView({
          type: "quiz",
          moduleIdx: modIdx - 1,
          lessonIdx: -1,
        });
      } else {
        const prevLessons = lessons.filter((l) => l.moduleIdx === modIdx - 1);
        if (prevLessons.length > 0) {
          const lastPrev = prevLessons[prevLessons.length - 1];
          const lastPrevIdx = lessons.findIndex((l) => l.id === lastPrev.id);
          if (lastPrevIdx >= 0) {
            setActiveView({
              type: "video",
              lessonIdx: lastPrevIdx,
              moduleIdx: modIdx - 1,
            });
          }
        }
      }
    }
  };

  const handleSelectLockedLesson = (lesson) => {
    if (!isCourseFree && !hasFullAccess && (lesson.moduleIdx > 0 || lesson.isPremiumLocked)) {
      setIsCheckoutModalOpen(true);
      toast.warning(
        isBn
          ? `মডিউল ${lesson.moduleIdx + 1} দেখতে অনুগ্রহ করে কোর্সে ভর্তি হন বা সাবস্ক্রিপশন নিশ্চিত করুন।`
          : `Please enroll in the course or subscribe to unlock Module ${lesson.moduleIdx + 1}.`
      );
      return;
    }
    if (lesson.isGatedLocked) {
      toast.warning(
        isBn
          ? `এই মডিউলটি লক করা রয়েছে। পূর্ববর্তী মডিউলের কুইজ সম্পন্ন করুন।`
          : `This module is locked. Please pass the previous module quiz first.`
      );
    } else {
      toast.warning(
        isBn
          ? `অনুগ্রহ করে পূর্ববর্তী পাঠ (${lesson.moduleIdx + 1}.${lesson.lessonIdx}) সম্পূর্ণ করুন।`
          : `Please complete the previous lesson first before advancing.`
      );
    }
  };

  const handleTakeModuleQuiz = (mod, modIdx) => {
    if (!isCourseFree && !hasFullAccess && modIdx > 0) {
      setIsCheckoutModalOpen(true);
      toast.warning(
        isBn
          ? `মডিউল ${modIdx + 1} কুইজ আনলক করতে কোর্সে ভর্তি হন বা সাবস্ক্রিপশন নিশ্চিত করুন।`
          : `Please enroll in the course or subscribe to unlock Module ${modIdx + 1} Quiz.`
      );
      return;
    }

    const modLessons = mod.lessons || [];
    const allCompleted =
      modLessons.length === 0 ||
      modLessons.every((l) => completedLessonIds.includes(l.id));
    if (!allCompleted) {
      toast.warning(
        isBn
          ? `কুইজ আনলক করতে এই মডিউলের সকল ভিডিও পাঠ সম্পন্ন করুন।`
          : `Please complete all video lessons in this module to unlock the quiz.`
      );
      return;
    }
    setActiveView({
      type: "quiz",
      moduleIdx: modIdx,
      lessonIdx: -1,
    });
  };

  const handleQuizSubmitted = async ({
    moduleIndex,
    scorePercent,
    isPassed,
    submittedAnswers,
  }) => {
    // 1. Update state
    setModuleQuizResults((prev) => {
      const next = {
        ...prev,
        [moduleIndex]: {
          moduleIndex,
          scorePercent,
          isPassed,
          submittedAnswers,
          attemptedAt: new Date().toISOString(),
        },
      };
      if (typeof window !== "undefined" && canonicalCourseId) {
        try {
          const userScope = user?._id ? `user_${user._id}` : "guest";
          localStorage.setItem(
            `lpg_${userScope}_course_${canonicalCourseId}_quiz_results`,
            JSON.stringify(next)
          );
        } catch (e) {}
      }
      return next;
    });

    // 2. Sync to Backend
    try {
      await submitModuleQuizApi({
        courseId: canonicalCourseId,
        data: {
          moduleIndex,
          scorePercent,
          isPassed,
          submittedAnswers,
        },
      }).unwrap();
      if (refetchLearning) refetchLearning();
    } catch (err) {
      // Sync fail-safe
    }

    if (isPassed) {
      const totalMods = modules.length;
      if (moduleIndex >= totalMods - 1) {
        toast.success(
          isBn
            ? "🎓 অভিনন্দন! আপনি ফাইনাল সার্টিফিকেশন পরীক্ষায় পাস করেছেন এবং আপনার সার্টিফিকেট তৈরি হয়েছে!"
            : "🎓 Congratulations! You passed the Certification Exam and earned your certificate!"
        );
      } else if (moduleIndex === 0 && !isCourseFree && !hasFullAccess) {
        // Module 1 finished! Open Checkout Modal immediately!
        setIsCheckoutModalOpen(true);
        toast.success(
          isBn
            ? "🎉 অভিনন্দন! আপনি ১ম মডিউল সম্পন্ন করেছেন। মডিউল ২ দেখতে কোর্সে ভর্তি হন বা সাবস্ক্রিপশন নিশ্চিত করুন।"
            : "🎉 Module 1 completed! Please enroll or subscribe to unlock Module 2."
        );
      } else {
        toast.success(
          isBn
            ? `🎉 চমৎকার! মডিউল ${moduleIndex + 1} কুইজ পাস করেছেন। মডিউল ${moduleIndex + 2} আনলক হয়েছে!`
            : `🎉 Great job! Module ${moduleIndex + 1} passed. Module ${moduleIndex + 2} is now unlocked!`
        );
      }
    }
  };

  const handleProceedToNextModule = (fromModuleIdx) => {
    const nextModIdx = fromModuleIdx + 1;
    const nextMod = modules[nextModIdx];
    if (!nextMod) return;

    // If paid course and user does not have full access, enrollment or subscription is mandatory to access Module 2+!
    if (!isCourseFree && !hasFullAccess) {
      setIsCheckoutModalOpen(true);
      toast.warning(
        isBn
          ? `মডিউল ${nextModIdx + 1} দেখতে অনুগ্রহ করে কোর্সে ভর্তি হন বা সাবস্ক্রিপশন নিশ্চিত করুন।`
          : `Please enroll in the course or subscribe to unlock Module ${nextModIdx + 1}.`
      );
      return;
    }

    const nextModLessons = nextMod.lessons || [];
    // If next module has NO video lessons, only a final exam/quiz:
    if (nextModLessons.length === 0 && nextMod.quiz?.questions?.length > 0) {
      setActiveView({
        type: "quiz",
        moduleIdx: nextModIdx,
        lessonIdx: -1,
      });
      toast.info(
        isBn
          ? `মডিউল ${nextModIdx + 1}: সমাপনী পরীক্ষা শুরু হয়েছে`
          : `Module ${nextModIdx + 1}: Final Exam started`
      );
      return;
    }

    const nextModLessonIdx = lessons.findIndex(
      (l) => l.moduleIdx === nextModIdx
    );
    if (nextModLessonIdx >= 0) {
      setActiveView({
        type: "video",
        lessonIdx: nextModLessonIdx,
        moduleIdx: nextModIdx,
      });
      toast.info(
        isBn
          ? `মডিউল ${nextModIdx + 1} শুরু হয়েছে`
          : `Module ${nextModIdx + 1} started`
      );
    }
  };

  const courseTitle = isBn ? course.titleBn || course.title : course.title;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-50 text-slate-800">
      {/* 1. Header */}
      <ClassroomHeader
        courseSlug={canonicalSlug}
        courseTitle={courseTitle}
        currentLessonIdx={currentLessonIdx}
        totalLessons={lessons.length}
        progressPercent={progressPercent}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Free Module Preview Banner for Paid Courses */}
      {!isCourseFree && !hasFullAccess && (
        <div className="bg-emerald-50 border-b border-emerald-200 px-4 sm:px-6 py-2.5 flex items-center justify-between text-xs text-emerald-800">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>
              {isBn
                ? "আপনি এই কোর্সের ১ম ফ্রি মডিউল দেখছেন।"
                : "You are currently viewing the Free Module 1."}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsCheckoutModalOpen(true)}
            className="font-bold text-emerald-900 underline hover:text-emerald-700 ml-2 shrink-0 cursor-pointer"
          >
            {isBn ? `সম্পূর্ণ কোর্স আনলক করুন (৳ ${course?.price})` : `Unlock All Modules (৳ ${course?.price})`} →
          </button>
        </div>
      )}

      {/* 2. Main Classroom Body (Video Player OR In-Place Quiz + Sidebar) */}
      <div className="flex flex-1 overflow-hidden">
        {activeView.type === "quiz" ? (
          <ClassroomQuizView
            courseId={canonicalCourseId}
            moduleData={modules[activeView.moduleIdx]}
            moduleIndex={activeView.moduleIdx}
            totalModules={modules.length}
            displayNumber={`${activeView.moduleIdx + 1}.${(modules[activeView.moduleIdx]?.lessons?.length || 0) + 1}`}
            previousSubmission={moduleQuizResults[activeView.moduleIdx]}
            onQuizSubmitted={handleQuizSubmitted}
            onProceedToNextModule={handleProceedToNextModule}
            onPrevLesson={() => handlePrevFromQuiz(activeView.moduleIdx)}
            hasPrevLesson={Boolean(modules[activeView.moduleIdx]?.lessons?.length > 0)}
            isCoursePaid={Boolean((course?.price || 0) > 0)}
            hasFullAccess={hasFullAccess}
            coursePrice={course?.price || 0}
          />
        ) : (
          <ClassroomVideoPlayer
            courseId={canonicalCourseId}
            course={course}
            currentLesson={currentLesson}
            currentLessonIdx={currentLessonIdx}
            totalLessons={lessons.length}
            completedLessonIds={completedLessonIds}
            setCompletedLessonIds={setCompletedLessonIds}
            lessonProgressMap={lessonProgressMap}
            setLessonProgressMap={setLessonProgressMap}
            handlePrevLesson={handlePrevLesson}
            handleNextLesson={handleNextLesson}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isCourseFree={isCourseFree}
            hasFullAccess={hasFullAccess}
            onOpenCheckout={() => setIsCheckoutModalOpen(true)}
          />
        )}

        <ClassroomPlaylistSidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          modules={modules}
          lessons={lessons}
          activeView={activeView}
          currentLessonIdx={currentLessonIdx}
          onSelectLesson={(globalIdx, mIdx) => {
            if (!isCourseFree && !hasFullAccess && mIdx > 0) {
              setIsCheckoutModalOpen(true);
              toast.warning(
                isBn
                  ? `মডিউল ${mIdx + 1} দেখতে অনুগ্রহ করে কোর্সে ভর্তি হন বা সাবস্ক্রিপশন নিশ্চিত করুন।`
                  : `Please enroll or subscribe to unlock Module ${mIdx + 1}.`
              );
              return;
            }
            setActiveView({
              type: "video",
              lessonIdx: globalIdx,
              moduleIdx: mIdx,
            });
          }}
          completedLessonIds={completedLessonIds}
          lessonProgressMap={lessonProgressMap}
          moduleQuizResults={moduleQuizResults}
          courseSlug={canonicalSlug}
          onTakeModuleQuiz={handleTakeModuleQuiz}
          onSelectLockedLesson={handleSelectLockedLesson}
          hasFullAccess={hasFullAccess}
          isCourseFree={isCourseFree}
        />
      </div>

      {/* 3. Locked Lesson Modal */}
      <Dialog
        isOpen={lockedLessonModalOpen}
        onClose={() => setLockedLessonModalOpen(false)}
        maxWidth="md"
        title={isBn ? "কোর্সে ভর্তি আবশ্যক" : "Enrollment Required"}
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
              {isBn
                ? `সম্পূর্ণ কোর্স, হ্যান্ডআউট ও সার্টিফিকেট পেতে অনুগ্রহ করে ভর্তি সম্পন্ন করুন।`
                : `Enroll in the full course to unlock all modules, resources, and your certificate.`}
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

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => {
                setLockedLessonModalOpen(false);
                setIsCheckoutModalOpen(true);
              }}
              className="gap-2 font-bold w-full sm:w-auto"
            >
              <span>{isBn ? `কোর্সে ভর্তি হন (৳ ${course?.price})` : `Enroll (৳ ${course?.price})`}</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Dialog>

      {/* 5. Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        course={course}
        onSuccess={() => {
          setIsCheckoutModalOpen(false);
          if (refetchLearning) refetchLearning();
        }}
      />
    </div>
  );
}

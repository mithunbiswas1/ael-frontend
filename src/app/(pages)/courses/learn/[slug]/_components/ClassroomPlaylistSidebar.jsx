// src/app/(pages)/courses/learn/[slug]/_components/ClassroomPlaylistSidebar.jsx
"use client";

import {
  CheckCircle2,
  Circle,
  PlayCircle,
  PauseCircle,
  Clock,
  Lock,
  HelpCircle,
  Award,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useDictionary } from "@/context/DictionaryContext";

export default function ClassroomPlaylistSidebar({
  sidebarOpen,
  setSidebarOpen,
  modules = [],
  lessons = [],
  activeView = { type: "video", lessonIdx: 0, moduleIdx: 0 },
  currentLessonIdx = 0,
  setCurrentLessonIdx,
  onSelectLesson,
  completedLessonIds = [],
  lessonProgressMap = {},
  moduleQuizResults = {},
  courseSlug,
  onTakeModuleQuiz,
  onSelectLockedLesson,
  hasFullAccess = true,
}) {
  const { locale } = useDictionary();
  const isBn = locale === "bn";

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 top-14 bg-black/40 z-30 lg:hidden backdrop-blur-2xs"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Right: Curriculum Sidebar */}
      <aside
        className={`border-l border-slate-200 bg-white overflow-y-auto ${sidebarOpen
          ? "fixed inset-y-14 right-0 z-40 w-80 max-w-[85vw] shadow-2xl block"
          : "hidden lg:block lg:w-80 lg:shrink-0"
          }`}
      >
        {/* Header */}
        <div className="border-b border-slate-200 p-4 bg-slate-50">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {isBn ? "কোর্স কারিকুলাম ও মডিউল" : "Course Curriculum"}
            </h2>
            <span className="text-[11px] text-slate-500 font-semibold">
              {modules.length} {isBn ? "মডিউল" : "Modules"}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {isBn
              ? `${lessons.length}টির মধ্যে ${completedLessonIds.length}টি পাঠ সম্পন্ন`
              : `${completedLessonIds.length} of ${lessons.length} completed`}
          </p>
        </div>

        {/* Modules & Lessons List */}
        <div className="divide-y divide-slate-200">
          {modules.map((mod, modIdx) => {
            const modTitle = isBn ? mod.moduleTitleBn || mod.moduleTitle : mod.moduleTitle;
            const modLessons = mod.lessons || [];
            const isModFree = mod.isFree;
            const hasQuiz = mod.quiz?.questions && mod.quiz.questions.length > 0;
            const quizResult = moduleQuizResults[modIdx];
            const isQuizPassed = Boolean(quizResult?.isPassed);
            const quizScore = quizResult?.scorePercent;
            const isModuleGated = Boolean(mod.isGatedLocked);

            // Check if all lessons in this module are completed (or module is exam-only with 0 videos)
            const allLessonsInModCompleted =
              modLessons.length === 0 ||
              modLessons.every((l) => completedLessonIds.includes(l.id));

            const isQuizLocked = isModuleGated || !allLessonsInModCompleted;

            return (
              <div key={modIdx} className="bg-white">
                {/* Module Heading */}
                <div className="px-4 py-2.5 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="font-mono text-[10px] font-bold text-slate-700 bg-slate-200/80 px-1.5 py-0.5 rounded">
                      M{modIdx + 1}
                    </span>
                    <span className="font-bold text-xs text-slate-800 truncate">
                      {modTitle}
                    </span>
                  </div>

                  {isModuleGated ? (
                    <span className="shrink-0 rounded bg-slate-100 text-slate-500 px-1.5 py-0.5 text-[9px] font-medium flex items-center gap-0.5">
                      <Lock className="h-2.5 w-2.5" />
                      {isBn ? "লক" : "LOCKED"}
                    </span>
                  ) : isQuizPassed ? (
                    <span className="shrink-0 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 text-[9px] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600" />
                      <span>{isBn ? "পাস" : "Passed"} ({quizScore}%)</span>
                    </span>
                  ) : isModFree ? (
                    <span className="shrink-0 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 text-[9px] font-bold">
                      {isBn ? "ফ্রি" : "FREE"}
                    </span>
                  ) : !hasFullAccess ? (
                    <span className="shrink-0 rounded bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 text-[9px] font-bold flex items-center gap-1">
                      <Lock className="h-2.5 w-2.5 text-amber-600" />
                      <span>{isBn ? "ভর্তি আবশ্যক" : "ENROLL REQ"}</span>
                    </span>
                  ) : (
                    <span className="shrink-0 rounded bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 text-[9px] font-medium">
                      {isBn ? "চলমান" : "ACTIVE"}
                    </span>
                  )}
                </div>

                {/* Lessons within this module */}
                <div className="divide-y divide-slate-100">
                  {modLessons.map((lesson, lIdx) => {
                    const globalIdx = lessons.findIndex((l) => l.id === lesson.id);
                    const isActive =
                      activeView?.type === "video" &&
                      (activeView?.lessonIdx === globalIdx || (!activeView && currentLessonIdx === globalIdx));
                    const isCompleted = completedLessonIds.includes(lesson.id);
                    const savedPos = lessonProgressMap[lesson.id] || 0;
                    const isPaused = !isCompleted && savedPos > 3;
                    const isLocked = Boolean(lesson.isLocked);
                    const lessonTitle = isBn ? lesson.titleBn || lesson.title : lesson.title;
                    const lessonDuration = isBn ? lesson.durationBn || lesson.duration : lesson.duration;
                    const lessonNumber = `${modIdx + 1}.${lIdx + 1}`;

                    return (
                      <button
                        key={lesson.id}
                        type="button"
                        onClick={() => {
                          if (isLocked) {
                            if (onSelectLockedLesson) onSelectLockedLesson(lesson);
                          } else {
                            if (onSelectLesson) {
                              onSelectLesson(globalIdx, modIdx);
                            } else if (setCurrentLessonIdx) {
                              setCurrentLessonIdx(globalIdx);
                            }
                            if (typeof window !== "undefined" && window.innerWidth < 1024) {
                              setSidebarOpen(false);
                            }
                          }
                        }}
                        className={`w-full text-left px-4 py-3 text-xs transition-colors flex items-start gap-2.5 cursor-pointer ${isActive
                          ? "bg-primary/5 text-primary border-l-2 border-primary font-bold shadow-2xs"
                          : isLocked
                            ? "text-slate-400 bg-slate-50/40 opacity-70 hover:bg-slate-50 cursor-not-allowed"
                            : "text-slate-700 hover:bg-slate-50"
                          }`}
                      >
                        <span className="mt-0.5 shrink-0">
                          {isCompleted ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" title="Completed" />
                          ) : isPaused ? (
                            <PauseCircle className="h-3.5 w-3.5 text-amber-500" title="In progress / Paused" />
                          ) : isLocked ? (
                            <Lock className="h-3.5 w-3.5 text-slate-400" title="Locked" />
                          ) : isActive ? (
                            <PlayCircle className="h-3.5 w-3.5 text-primary" title="Now Playing" />
                          ) : (
                            <Circle className="h-3.5 w-3.5 text-slate-300" />
                          )}
                        </span>

                        <div className="flex-1 min-w-0">
                          <div className="line-clamp-2 leading-snug text-xs">
                            <span className="font-mono text-[11px] font-semibold text-slate-500 mr-1.5">
                              {lessonNumber}
                            </span>
                            <span>{lessonTitle}</span>
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                            <Clock className="h-2.5 w-2.5" />
                            <span>{lessonDuration}</span>
                            {isPaused && (
                              <span className="text-amber-600 font-semibold">• Paused</span>
                            )}
                            {isCompleted && (
                              <span className="text-emerald-600 font-semibold">• Done</span>
                            )}
                            {isModFree && !isModuleGated && (
                              <span className="text-emerald-700 font-semibold">• Free</span>
                            )}
                            {lesson.isPremiumLocked && (
                              <span className="text-amber-700 font-semibold">• {isBn ? "ভর্তি আবশ্যক" : "Enroll to view"}</span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Module Assessment Quiz Button (e.g. 1.4 Quiz) */}
                {hasQuiz && (
                  <div className="p-2.5 border-t border-slate-100 bg-slate-50/50">
                    <button
                      type="button"
                      disabled={isQuizLocked}
                      onClick={() => {
                        if (onTakeModuleQuiz) onTakeModuleQuiz(mod, modIdx);
                        if (typeof window !== "undefined" && window.innerWidth < 1024) {
                          setSidebarOpen(false);
                        }
                      }}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${activeView?.type === "quiz" && activeView?.moduleIdx === modIdx
                        ? "bg-primary/10 border-2 border-primary text-primary font-bold shadow-2xs"
                        : isQuizLocked
                          ? "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
                          : isQuizPassed
                            ? "bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-800"
                            : quizResult
                              ? "bg-rose-50 hover:bg-rose-100/80 border border-rose-200 text-rose-800"
                              : "bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-amber-900"
                        }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {isQuizPassed ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        ) : isQuizLocked ? (
                          <Lock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        ) : quizResult ? (
                          <AlertCircle className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                        ) : (
                          <HelpCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                        )}
                        <span className="truncate">
                          <span className="font-mono text-[11px] font-bold mr-1">
                            {modIdx + 1}.{modLessons.length + 1}
                          </span>
                          {isBn
                            ? mod.quiz.titleBn || `মডিউল ${modIdx + 1} কুইজ`
                            : mod.quiz.title || `Module ${modIdx + 1} Quiz`}
                        </span>
                      </div>
                      <span className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded font-bold shrink-0">
                        {isQuizPassed
                          ? `${quizScore}%`
                          : quizResult
                            ? `${quizScore}% (Retry)`
                            : `${mod.quiz.questions.length} Qs`}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Final Course Certification Assessment Banner */}
        <div className="p-4 bg-slate-50 border-t border-slate-200">
          <div className="rounded-xl border border-slate-200 p-4 transition-all duration-200 bg-white shadow-2xs">
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-lg shrink-0 ${completedLessonIds.length >= lessons.length && lessons.length > 0
                  ? "bg-amber-100 text-amber-800"
                  : "bg-slate-100 text-slate-400"
                  }`}
              >
                <Award className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3 className="font-bold text-xs text-slate-900">
                    {isBn ? "চূড়ান্ত সার্টিফিকেশন পরীক্ষা" : "Final Certification Exam"}
                  </h3>
                  {completedLessonIds.length >= lessons.length && lessons.length > 0 ? (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">

                      {isBn ? "উন্মুক্ত" : "UNLOCKED"}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                      <Lock className="h-2.5 w-2.5" />
                      {isBn ? "লকড" : "LOCKED"}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  {completedLessonIds.length >= lessons.length && lessons.length > 0
                    ? isBn
                      ? "সকল পাঠ সম্পন্ন হয়েছে! পাস করলেই ভেরিফাইড সার্টিফিকেট পাবেন।"
                      : "All lessons completed! Pass the exam to earn your verified certificate."
                    : isBn
                      ? `সার্টিফিকেট পেতে সকল পাঠ সম্পন্ন করুন (${completedLessonIds.length}/${lessons.length} সম্পন্ন)।`
                      : `Finish all lessons to unlock (${completedLessonIds.length}/${lessons.length} completed).`}
                </p>

                <div className="mt-3">
                  {modules.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        const lastModIdx = modules.length - 1;
                        const lastMod = modules[lastModIdx];
                        if (onTakeModuleQuiz) onTakeModuleQuiz(lastMod, lastModIdx);
                      }}
                      className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90 transition shadow-2xs cursor-pointer"
                    >
                      <span>
                        {completedLessonIds.length >= lessons.length && lessons.length > 0
                          ? isBn ? "পরীক্ষা শুরু করুন" : "Start Certification Exam"
                          : isBn ? "সার্টিফিকেশন এক্সাম দেখুন" : "View Certification Exam"}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

// src/app/(pages)/courses/learn/[slug]/_components/ClassroomPlaylistSidebar.jsx
"use client";

import {
  CheckCircle2,
  Circle,
  PlayCircle,
  Clock,
  Lock,
  HelpCircle,
} from "lucide-react";
import { useDictionary } from "@/context/DictionaryContext";

export default function ClassroomPlaylistSidebar({
  sidebarOpen,
  setSidebarOpen,
  modules = [],
  lessons = [],
  currentLessonIdx,
  setCurrentLessonIdx,
  completedLessonIds = [],
  courseSlug,
  passedModuleQuizzes = {},
  onTakeModuleQuiz,
  onSelectLockedLesson,
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
        className={`border-l border-slate-200 bg-white overflow-y-auto ${
          sidebarOpen
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
            const isQuizPassed = Boolean(passedModuleQuizzes[modIdx]);
            const quizScore = passedModuleQuizzes[modIdx];
            const isModuleGated = mod.isGatedLocked;

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
                    <span className="shrink-0 rounded bg-amber-50 text-amber-800 border border-amber-200 px-1.5 py-0.5 text-[9px] font-semibold flex items-center gap-1">
                      <Lock className="h-2.5 w-2.5" />
                      <span>{isBn ? `মডিউল ${modIdx} কুইজ আবশ্যক` : `Pass M${modIdx}`}</span>
                    </span>
                  ) : isQuizPassed ? (
                    <span className="shrink-0 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 text-[9px] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-2.5 w-2.5 text-emerald-600" />
                      <span>{isBn ? "পাস" : "Passed"} ({quizScore}%)</span>
                    </span>
                  ) : isModFree ? (
                    <span className="shrink-0 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.5 text-[9px] font-bold">
                      FREE
                    </span>
                  ) : (
                    <span className="shrink-0 rounded bg-slate-100 text-slate-600 px-1.5 py-0.5 text-[9px] font-medium flex items-center gap-0.5">
                      <Lock className="h-2.5 w-2.5" />
                      PAID
                    </span>
                  )}
                </div>

                {/* Lessons within this module */}
                <div className="divide-y divide-slate-100">
                  {modLessons.map((lesson) => {
                    const globalIdx = lessons.findIndex((l) => l.id === lesson.id);
                    const isActive = globalIdx === currentLessonIdx;
                    const isCompleted = completedLessonIds.includes(lesson.id);
                    const isLocked = lesson.isLocked;
                    const lessonTitle = isBn ? lesson.titleBn || lesson.title : lesson.title;
                    const lessonDuration = isBn ? lesson.durationBn || lesson.duration : lesson.duration;

                    return (
                      <button
                        key={lesson.id}
                        type="button"
                        onClick={() => {
                          if (isLocked) {
                            if (onSelectLockedLesson) onSelectLockedLesson(lesson);
                          } else {
                            if (globalIdx >= 0) setCurrentLessonIdx(globalIdx);
                            if (typeof window !== "undefined" && window.innerWidth < 1024) {
                              setSidebarOpen(false);
                            }
                          }
                        }}
                        className={`w-full text-left px-4 py-3 text-xs transition-colors flex items-start gap-2.5 cursor-pointer ${
                          isActive
                            ? "bg-primary/5 text-primary border-l-2 border-primary font-bold"
                            : isLocked
                            ? "text-slate-400 bg-slate-50/40 opacity-70 hover:bg-slate-50"
                            : "text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span className="mt-0.5 shrink-0">
                          {isCompleted ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                          ) : isLocked ? (
                            <Lock className="h-3.5 w-3.5 text-slate-400" />
                          ) : isActive ? (
                            <PlayCircle className="h-3.5 w-3.5 text-primary" />
                          ) : (
                            <Circle className="h-3.5 w-3.5 text-slate-300" />
                          )}
                        </span>

                        <div className="flex-1 min-w-0">
                          <div className="line-clamp-2 leading-snug text-xs">
                            {lessonTitle}
                          </div>
                          <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                            <Clock className="h-2.5 w-2.5" />
                            <span>{lessonDuration}</span>
                            {isModFree && !isModuleGated && (
                              <span className="text-emerald-700 font-semibold">• Free</span>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Module Assessment Quiz Button */}
                {hasQuiz && (
                  <div className="p-2.5 border-t border-slate-100 bg-slate-50/50">
                    <button
                      type="button"
                      disabled={isModuleGated}
                      onClick={() => onTakeModuleQuiz && onTakeModuleQuiz(mod, modIdx)}
                      className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                        isModuleGated
                          ? "bg-slate-100 border border-slate-200 text-slate-400 cursor-not-allowed"
                          : isQuizPassed
                          ? "bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-800"
                          : "bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-amber-900"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        {isQuizPassed ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                        ) : isModuleGated ? (
                          <Lock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        ) : (
                          <HelpCircle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                        )}
                        <span className="truncate">
                          {isBn
                            ? mod.quiz.titleBn || `মডিউল ${modIdx + 1} কুইজ`
                            : mod.quiz.title || `Module ${modIdx + 1} Quiz`}
                        </span>
                      </div>
                      <span className="text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded font-bold shrink-0">
                        {isQuizPassed
                          ? `${quizScore}%`
                          : `${mod.quiz.questions.length} Qs`}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}

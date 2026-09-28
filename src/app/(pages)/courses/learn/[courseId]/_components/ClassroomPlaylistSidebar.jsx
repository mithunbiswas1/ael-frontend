import Link from "next/link";
import {
  CheckCircle2,
  Circle,
  PlayCircle,
  Clock,
  Award,
  ChevronRight,
} from "lucide-react";
import { useDictionary } from "@/context/DictionaryContext";

export default function ClassroomPlaylistSidebar({
  sidebarOpen,
  setSidebarOpen,
  lessons,
  currentLessonIdx,
  setCurrentLessonIdx,
  completedLessonIds,
  courseId,
}) {
  const { locale } = useDictionary();
  const isBn = locale === "bn";

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 top-14 bg-black/70 z-30 lg:hidden backdrop-blur-xs"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Right: Curriculum Sidebar */}
      <aside
        className={`border-l border-slate-800 bg-slate-950 overflow-y-auto ${
          sidebarOpen
            ? "fixed inset-y-14 right-0 z-40 w-80 max-w-[85vw] shadow-2xl block"
            : "hidden lg:block lg:w-80 lg:shrink-0"
        }`}
      >
        <div className="border-b border-slate-800 p-4">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-300">
            {isBn ? "কোর্স প্লেলিস্ট" : "Course Playlist"}
          </h2>
          <p className="text-[10px] text-slate-500 mt-0.5">
            {isBn
              ? `${lessons.length}টির মধ্যে ${completedLessonIds.length}টি পাঠ সম্পন্ন`
              : `${completedLessonIds.length} of ${lessons.length} lessons completed`}
          </p>
        </div>

        <div className="divide-y divide-slate-900">
          {lessons.map((lesson, idx) => {
            const isActive = idx === currentLessonIdx;
            const isCompleted = completedLessonIds.includes(lesson.id);
            const lessonTitle = isBn ? lesson.titleBn || lesson.title : lesson.title;
            const lessonDuration = isBn ? lesson.durationBn || lesson.duration : lesson.duration;

            return (
              <button
                key={lesson.id}
                onClick={() => {
                  setCurrentLessonIdx(idx);
                  if (typeof window !== "undefined" && window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }}
                className={`w-full text-left p-3.5 text-xs transition-colors flex items-start gap-3 ${
                  isActive
                    ? "bg-slate-900 text-white border-l-2 border-primary"
                    : "text-slate-400 hover:bg-slate-900/50 hover:text-slate-200"
                }`}
              >
                <span className="mt-0.5 shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  ) : isActive ? (
                    <PlayCircle className="h-4 w-4 text-primary" />
                  ) : (
                    <Circle className="h-4 w-4 text-slate-600" />
                  )}
                </span>

                <div className="flex-1">
                  <div className="font-semibold line-clamp-2 leading-snug">
                    {lessonTitle}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500">
                    <Clock className="h-3 w-3" />
                    <span>{lessonDuration}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Final Quiz Trigger in Sidebar */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/50 mt-4">
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-950/30 p-3 text-center">
            <Award className="h-6 w-6 text-emerald-400 mx-auto mb-1.5" />
            <div className="text-xs font-bold text-white">
              {isBn ? "কোর্স মূল্যায়ন কুইজ" : "Course Assessment"}
            </div>
            <p className="text-[10px] text-slate-400 mt-1 mb-3">
              {isBn
                ? "সরকারি স্বীকৃত ডিজিটাল সার্টিফিকেট পেতে ৮০% বা তার বেশি স্কোর করুন।"
                : "Score 80% or above to unlock your government recognized certificate."}
            </p>
            <Link
              href={`/courses/${courseId}/quiz`}
              className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition-colors"
            >
              <span>{isBn ? "এখনই কুইজ দিন" : "Take Quiz Now"}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

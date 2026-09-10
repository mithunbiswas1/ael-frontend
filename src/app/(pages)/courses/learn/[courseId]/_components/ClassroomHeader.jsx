import Link from "next/link";
import { ArrowLeft, Award, Menu, X } from "lucide-react";

export default function ClassroomHeader({
  courseId,
  currentLessonIdx,
  totalLessons,
  progressPercent,
  sidebarOpen,
  setSidebarOpen,
}) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-800 bg-slate-900 px-3 sm:px-4 gap-2">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <Link
          href={`/courses/${courseId}`}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 sm:px-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors shrink-0"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Back to Course</span>
        </Link>

        <span className="h-4 w-px bg-slate-800 shrink-0" />

        <div className="flex flex-col min-w-0">
          <h1 className="text-xs sm:text-sm font-bold text-white truncate">
            LPG Safety Training
          </h1>
          <span className="text-[10px] text-slate-400">
            Lesson {currentLessonIdx + 1} of {totalLessons}
          </span>
        </div>
      </div>

      {/* Progress & Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Progress Bar */}
        <div className="hidden md:flex flex-col items-end gap-1 w-32">
          <div className="flex items-center justify-between w-full text-[10px] text-slate-400">
            <span>Progress</span>
            <span className="font-bold text-emerald-400">{progressPercent}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <Link
          href={`/courses/${courseId}/quiz`}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition-colors shadow-xs"
        >
          <Award className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Take Assessment Quiz</span>
          <span className="sm:hidden">Quiz</span>
        </Link>

        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="rounded-lg border border-slate-700 bg-slate-800 p-1.5 text-slate-300 hover:text-white lg:hidden"
          title="Toggle Curriculum Sidebar"
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
}

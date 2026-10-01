// src/app/(pages)/courses/learn/[slug]/_components/ClassroomHeader.jsx
"use client";

import Link from "next/link";
import { ArrowLeft, Menu, X } from "lucide-react";
import { useDictionary } from "@/context/DictionaryContext";

export default function ClassroomHeader({
  courseSlug,
  courseTitle,
  currentLessonIdx,
  totalLessons,
  progressPercent,
  sidebarOpen,
  setSidebarOpen,
}) {
  const { locale } = useDictionary();
  const isBn = locale === "bn";

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 gap-3">
      {/* Left: Back Link & Title */}
      <div className="flex items-center gap-3 min-w-0">
        <Link
          href={`/courses/${courseSlug}`}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors shrink-0"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">
            {isBn ? "কোর্স বিবরণ" : "Course Outline"}
          </span>
        </Link>

        <span className="h-4 w-px bg-slate-200 shrink-0" />

        <div className="flex flex-col min-w-0">
          <h1 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
            {courseTitle || (isBn ? "অনলাইন ক্লাসরুম" : "Online Classroom")}
          </h1>
        </div>
      </div>

      {/* Right: Progress & Menu Toggle */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="hidden md:flex flex-col items-end gap-1 w-32">
          <div className="flex items-center justify-between w-full text-[10px] text-slate-500 font-semibold">
            <span>{isBn ? "অগ্রগতি" : "Progress"}</span>
            <span className="font-bold text-slate-800">{progressPercent}%</span>
          </div>
          <div className="h-1.5 w-full rounded bg-slate-100 overflow-hidden border border-slate-200/60">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 lg:hidden"
          title="Toggle Playlist Sidebar"
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>
    </header>
  );
}

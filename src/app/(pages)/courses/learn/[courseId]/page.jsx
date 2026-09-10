// src/app/(pages)/courses/learn/[courseId]/page.jsx
"use client";

import { useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  PlayCircle,
  FileText,
  Download,
  Award,
  ChevronRight,
  ChevronLeft,
  BookOpen,
  HelpCircle,
  Clock,
  Menu,
  X,
  Volume2,
  Maximize2,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

const MOCK_LESSONS = [
  {
    id: 1,
    title: "1. Physical Properties & Hazardous Nature of LPG",
    duration: "10:15",
    videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    description:
      "Understanding propane-butane vapor pressure, flammability limits (1.8% to 9.5% in air), and why LPG sinks to the ground because it is heavier than air.",
    notes:
      "Key Rule: Because LPG vapor is roughly 1.5 to 2.0 times denser than air, leaking gas pools in ground depressions, drains, and kitchen floor corners. Adequate low-level ventilation is mandatory.",
  },
  {
    id: 2,
    title: "2. Understanding Cylinder Construction, Tare Weight & Valves",
    duration: "12:40",
    description:
      "Anatomy of standard 12kg and 35kg welded steel cylinders, brass foot rings, shroud rings, and identifying statutory test validity dates.",
    notes:
      "All cylinders must bear an embossed statutory hydro-test stamp (e.g., 'Q3 2026'). Never accept a cylinder with a dented body or chipped valve threads.",
  },
  {
    id: 3,
    title: "3. Step-by-Step Regulator Connection Protocol",
    duration: "14:20",
    description:
      "How to inspect the O-ring gasket, depress the safety collar, and firmly engage the click-on regulator without mechanical cross-threading.",
    notes:
      "Listen for the distinctive mechanical 'click' when locking the regulator collar. Gently pull upward on the regulator body to confirm positive locking before turning the valve lever ON.",
  },
  {
    id: 4,
    title: "4. Conducting the 2-Minute Soap Water Leak Test",
    duration: "11:50",
    description:
      "Practical demonstration using non-corrosive soapy water to detect micro-fissures around the valve spindle, regulator neck, and clamp points.",
    notes:
      "NEVER use an open flame, matchstick, or lighter to check for gas leaks! Always use liquid dishwashing soap mixed with water and a soft sponge.",
  },
  {
    id: 5,
    title: "5. Safe Kitchen Ventilation & Distance Clearances",
    duration: "13:10",
    description:
      "Positioning requirements: maintaining 1 meter distance from cooktops, keeping cylinders strictly upright, and avoiding underground pit storage.",
    notes:
      "Keep LPG cylinders at least 1 meter away from heat sources and electrical outlets. Never store spare cylinders inside enclosed cabinets without floor-level louvers.",
  },
  {
    id: 6,
    title: "6. Emergency Action Sequence: Gas Leakage Response",
    duration: "15:00",
    description:
      "Immediate action sequence: shut off the regulator valve, open all doors and windows, and DO NOT touch electrical switches or ring doorbells.",
    notes:
      "If you smell gas: 1. Turn regulator OFF. 2. Open all doors & windows. 3. Do not turn ON or OFF any electrical switch. 4. Evacuate premises and call emergency hotline 16137 from outside.",
  },
];

export default function ClassroomPlayerPage({ params }) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.courseId;

  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [completedLessonIds, setCompletedLessonIds] = useState([1]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("notes");

  const currentLesson = MOCK_LESSONS[currentLessonIdx];
  const progressPercent = Math.round(
    (completedLessonIds.length / MOCK_LESSONS.length) * 100
  );

  const handleNextLesson = () => {
    if (!completedLessonIds.includes(currentLesson.id)) {
      setCompletedLessonIds((prev) => [...prev, currentLesson.id]);
    }

    if (currentLessonIdx < MOCK_LESSONS.length - 1) {
      setCurrentLessonIdx((prev) => prev + 1);
      toast.success("Progress saved. Starting next lesson!");
    } else {
      toast.success("Congratulations! All video lessons completed. You can now take the final assessment quiz!");
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
              Lesson {currentLessonIdx + 1} of {MOCK_LESSONS.length}
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

      {/* 2. Main Classroom Body (Video Player + Sidebar) */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Video Canvas & Lesson Resources */}
        <main className="flex flex-1 flex-col overflow-y-auto bg-slate-900">
          {/* Video Mockup Screen */}
          <div className="relative aspect-16/9 w-full max-h-[60vh] bg-black flex items-center justify-center border-b border-slate-800">
            <div className="text-center p-6 max-w-lg">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-primary border border-primary/40 animate-pulse">
                <PlayCircle className="h-10 w-10" />
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white mb-2">
                {currentLesson.title}
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Interactive safety lesson video stream (HD 1080p). Highlighting official Bangladesh DoE safety handling techniques.
              </p>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-[11px] text-slate-300">
                <Clock className="h-3 w-3 text-blue-400" />
                <span>Duration: {currentLesson.duration}</span>
              </div>
            </div>

            {/* Custom Mock Player Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-gradient-to-t from-black/90 via-black/50 to-transparent p-3 text-xs text-white">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toast.info("Video player paused / resumed")}
                  className="rounded p-1 hover:text-primary transition-colors"
                >
                  <PlayCircle className="h-5 w-5" />
                </button>
                <span className="text-[11px] text-slate-300">03:24 / {currentLesson.duration}</span>
              </div>

              <div className="flex items-center gap-3">
                <Volume2 className="h-4 w-4 text-slate-300" />
                <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-slate-300">
                  1080p HD
                </span>
                <Maximize2 className="h-4 w-4 text-slate-300" />
              </div>
            </div>
          </div>

          {/* Lesson Navigation & Meta Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-950 px-6 py-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevLesson}
                disabled={currentLessonIdx === 0}
                className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Previous Lesson</span>
              </button>

              <button
                onClick={handleNextLesson}
                className="flex items-center gap-1 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-bold text-white hover:bg-primary/90 transition-colors shadow-xs"
              >
                <span>
                  {currentLessonIdx === MOCK_LESSONS.length - 1
                    ? "Complete & Go to Quiz"
                    : "Complete & Next Lesson"}
                </span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  toast.success("Lesson marked as completed!");
                  if (!completedLessonIds.includes(currentLesson.id)) {
                    setCompletedLessonIds((prev) => [...prev, currentLesson.id]);
                  }
                }}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
                  completedLessonIds.includes(currentLesson.id)
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                    : "border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800"
                }`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>
                  {completedLessonIds.includes(currentLesson.id)
                    ? "Completed"
                    : "Mark as Complete"}
                </span>
              </button>
            </div>
          </div>

          {/* Lesson Notes & Download Tabs */}
          <div className="p-6">
            <div className="flex items-center gap-4 border-b border-slate-800 pb-2 mb-4 text-xs font-bold">
              <button
                onClick={() => setActiveTab("notes")}
                className={`pb-2 transition-colors ${
                  activeTab === "notes"
                    ? "border-b-2 border-primary text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Lesson Notes & Guidelines
              </button>
              <button
                onClick={() => setActiveTab("downloads")}
                className={`pb-2 transition-colors ${
                  activeTab === "downloads"
                    ? "border-b-2 border-primary text-white"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Downloadable PDF Assets (2)
              </button>
            </div>

            {activeTab === "notes" ? (
              <div className="space-y-4 max-w-3xl">
                <div>
                  <h3 className="text-sm font-bold text-white mb-2">
                    {currentLesson.title}
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentLesson.description}
                  </p>
                </div>

                <div className="rounded-lg border border-blue-900/60 bg-blue-950/40 p-4 text-xs text-blue-200 leading-relaxed">
                  <div className="font-bold text-blue-400 mb-1 flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>Key Practical Takeaway:</span>
                  </div>
                  {currentLesson.notes}
                </div>
              </div>
            ) : (
              <div className="space-y-3 max-w-xl">
                <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <FileText className="h-4 w-4 text-primary" />
                    <div>
                      <div className="font-bold text-white">
                        LPG Kitchen Inspection Checklist.pdf
                      </div>
                      <div className="text-[10px] text-slate-400">PDF • 1.2 MB</div>
                    </div>
                  </div>
                  <button
                    onClick={() => toast.success("Downloading Kitchen Inspection Checklist...")}
                    className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-slate-300 hover:text-white"
                  >
                    <Download className="h-3 w-3" />
                    <span>Download</span>
                  </button>
                </div>

                <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs">
                  <div className="flex items-center gap-2.5">
                    <FileText className="h-4 w-4 text-primary" />
                    <div>
                      <div className="font-bold text-white">
                        Soap Solution Leak Testing Guide.pdf
                      </div>
                      <div className="text-[10px] text-slate-400">PDF • 850 KB</div>
                    </div>
                  </div>
                  <button
                    onClick={() => toast.success("Downloading Soap Solution Guide...")}
                    className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-slate-300 hover:text-white"
                  >
                    <Download className="h-3 w-3" />
                    <span>Download</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>

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
              Course Playlist
            </h2>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {completedLessonIds.length} of {MOCK_LESSONS.length} lessons completed
            </p>
          </div>

          <div className="divide-y divide-slate-900">
            {MOCK_LESSONS.map((lesson, idx) => {
              const isActive = idx === currentLessonIdx;
              const isCompleted = completedLessonIds.includes(lesson.id);

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
                      {lesson.title}
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500">
                      <Clock className="h-3 w-3" />
                      <span>{lesson.duration}</span>
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
              <div className="text-xs font-bold text-white">Course Assessment</div>
              <p className="text-[10px] text-slate-400 mt-1 mb-3">
                Score 80% or above to unlock your government recognized certificate.
              </p>
              <Link
                href={`/courses/${courseId}/quiz`}
                className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition-colors"
              >
                <span>Take Quiz Now</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

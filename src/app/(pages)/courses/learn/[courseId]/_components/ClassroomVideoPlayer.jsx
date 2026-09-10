import {
  PlayCircle,
  Clock,
  Volume2,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  BookOpen,
  FileText,
  Download,
} from "lucide-react";
import { toast } from "sonner";

export default function ClassroomVideoPlayer({
  currentLesson,
  currentLessonIdx,
  totalLessons,
  completedLessonIds,
  setCompletedLessonIds,
  handlePrevLesson,
  handleNextLesson,
  activeTab,
  setActiveTab,
}) {
  return (
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
              {currentLessonIdx === totalLessons - 1
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
            Lesson Notes &amp; Guidelines
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
  );
}

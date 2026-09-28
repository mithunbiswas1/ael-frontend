import Link from "next/link";
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
  Award,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useDictionary } from "@/context/DictionaryContext";

export default function ClassroomVideoPlayer({
  courseId,
  currentLesson,
  currentLessonIdx,
  totalLessons,
  completedLessonIds,
  setCompletedLessonIds,
  handlePrevLesson,
  handleNextLesson,
  activeTab,
  setActiveTab,
  onTriggerQuiz,
}) {
  const { locale } = useDictionary();
  const isBn = locale === "bn";

  const title = isBn ? currentLesson.titleBn || currentLesson.title : currentLesson.title;
  const description = isBn ? currentLesson.descriptionBn || currentLesson.description : currentLesson.description;
  const notes = isBn ? currentLesson.notesBn || currentLesson.notes : currentLesson.notes;
  const duration = isBn ? currentLesson.durationBn || currentLesson.duration : currentLesson.duration;

  const rawVideoUrl =
    currentLesson.videoUrl ||
    currentLesson.video ||
    "/sample-course-video.mp4";

  const isEmbed =
    rawVideoUrl.includes("youtube.com") ||
    rawVideoUrl.includes("youtu.be") ||
    rawVideoUrl.includes("vimeo.com");

  const videoSrc =
    rawVideoUrl.startsWith("/public/upload")
      ? `http://localhost:8005${rawVideoUrl}`
      : rawVideoUrl;

  const handleCompleteCurrent = () => {
    if (!completedLessonIds.includes(currentLesson.id)) {
      setCompletedLessonIds((prev) => [...prev, currentLesson.id]);
    }
    toast.success(isBn ? "পাঠটি সম্পন্ন হয়েছে!" : "Lesson completed!");
    if (onTriggerQuiz) {
      onTriggerQuiz();
    }
  };

  return (
    <main className="flex flex-1 flex-col overflow-y-auto bg-slate-900">
      {/* Real Video Player Screen */}
      <div className="relative aspect-16/9 w-full max-h-[62vh] bg-black flex items-center justify-center border-b border-slate-800">
        {isEmbed ? (
          <iframe
            src={videoSrc}
            title={title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            key={videoSrc}
            controls
            autoPlay={false}
            playsInline
            preload="metadata"
            className="w-full h-full object-contain bg-black"
            src={videoSrc}
            onEnded={() => {
              handleCompleteCurrent();
            }}
          >
            Your browser does not support HTML5 video streaming.
          </video>
        )}
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
            <span>{isBn ? "পূর্ববর্তী পাঠ" : "Previous Lesson"}</span>
          </button>

          <button
            onClick={() => {
              handleCompleteCurrent();
              if (handleNextLesson && currentLessonIdx < totalLessons - 1) {
                handleNextLesson();
              }
            }}
            className="flex items-center gap-1 rounded-lg bg-primary px-3.5 py-1.5 text-xs font-bold text-white hover:bg-primary/90 transition-colors shadow-xs"
          >
            <span>
              {currentLessonIdx === totalLessons - 1
                ? isBn
                  ? "সম্পূর্ণ করে কুইজে যান"
                  : "Complete & Go to Quiz"
                : isBn
                  ? "সম্পূর্ণ করে পরবর্তী পাঠ"
                  : "Complete & Next Lesson"}
            </span>
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCompleteCurrent}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
              completedLessonIds.includes(currentLesson.id)
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800"
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>
              {completedLessonIds.includes(currentLesson.id)
                ? isBn ? "সম্পন্ন হয়েছে" : "Completed"
                : isBn ? "সম্পন্ন হিসেবে চিহ্নিত করুন" : "Mark as Complete"}
            </span>
          </button>
        </div>
      </div>

      {/* Lesson Notes, Download & Quiz Tabs */}
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
            {isBn ? "পাঠের নোট ও নির্দেশিকা" : "Lesson Notes & Guidelines"}
          </button>
          <button
            onClick={() => setActiveTab("quiz")}
            className={`flex items-center gap-1.5 pb-2 transition-colors ${
              activeTab === "quiz"
                ? "border-b-2 border-emerald-400 text-emerald-400"
                : "text-emerald-500/80 hover:text-emerald-300"
            }`}
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>{isBn ? "মূল্যায়ন কুইজ" : "Assessment Quiz"}</span>
          </button>
          <button
            onClick={() => setActiveTab("downloads")}
            className={`pb-2 transition-colors ${
              activeTab === "downloads"
                ? "border-b-2 border-primary text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {isBn ? "ডাউনলোডযোগ্য পিডিএফ রিসোর্স (২)" : "Downloadable PDF Assets (2)"}
          </button>
        </div>

        {activeTab === "quiz" ? (
          <div className="max-w-2xl rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <Award className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-white">
                  {isBn ? "কোর্স মূল্যায়ন কুইজ" : "Course Assessment Quiz"}
                </h4>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                  {isBn
                    ? "এই ক্লাসের পর আপনার অর্জিত জ্ঞান যাচাই করুন। ৮০% বা তার বেশি স্কোর করলে স্বয়ংক্রিয়ভাবে কিউআর ভেরিফাইড সার্টিফিকেট অর্জন করতে পারবেন।"
                    : "Test what you learned in this class. Pass with 80% or higher to receive an official QR-verified certificate."}
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <Link
                    href={`/courses/${courseId}/quiz`}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition-colors shadow-xs"
                  >
                    <span>{isBn ? "কুইজ শুরু করুন" : "Start Assessment Quiz"}</span>
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => setActiveTab("notes")}
                    className="text-xs text-slate-400 hover:text-slate-200"
                  >
                    {isBn ? "নোটে ফিরে যান" : "Back to Notes"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === "notes" ? (
          <div className="space-y-4 max-w-3xl">
            <div>
              <h3 className="text-sm font-bold text-white mb-2">
                {title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {description}
              </p>
            </div>

            <div className="rounded-lg border border-blue-900/60 bg-blue-950/40 p-4 text-xs text-blue-200 leading-relaxed">
              <div className="font-bold text-blue-400 mb-1 flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" />
                <span>{isBn ? "মূল ব্যবহারিক পরামর্শ:" : "Key Practical Takeaway:"}</span>
              </div>
              {notes}
            </div>
          </div>
        ) : (
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs">
              <div className="flex items-center gap-2.5">
                <FileText className="h-4 w-4 text-primary" />
                <div>
                  <div className="font-bold text-white">
                    {isBn
                      ? "রান্নাঘর পরিদর্শন চেকলিস্ট.pdf"
                      : "LPG Kitchen Inspection Checklist.pdf"}
                  </div>
                  <div className="text-[10px] text-slate-400">PDF • 1.2 MB</div>
                </div>
              </div>
              <button
                onClick={() => toast.success(isBn ? "রান্নাঘর চেকলিস্ট ডাউনলোড হচ্ছে..." : "Downloading Kitchen Inspection Checklist...")}
                className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-slate-300 hover:text-white"
              >
                <Download className="h-3 w-3" />
                <span>{isBn ? "ডাউনলোড" : "Download"}</span>
              </button>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-950 p-3 text-xs">
              <div className="flex items-center gap-2.5">
                <FileText className="h-4 w-4 text-primary" />
                <div>
                  <div className="font-bold text-white">
                    {isBn
                      ? "সাবান পানি লিকেজ টেস্ট গাইড.pdf"
                      : "Soap Solution Leak Testing Guide.pdf"}
                  </div>
                  <div className="text-[10px] text-slate-400">PDF • 850 KB</div>
                </div>
              </div>
              <button
                onClick={() => toast.success(isBn ? "সাবান দ্রবণ টেস্ট গাইড ডাউনলোড হচ্ছে..." : "Downloading Soap Solution Guide...")}
                className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-slate-300 hover:text-white"
              >
                <Download className="h-3 w-3" />
                <span>{isBn ? "ডাউনলোড" : "Download"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

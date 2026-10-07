// src/app/(pages)/courses/learn/[slug]/_components/ClassroomVideoPlayer.jsx
"use client";

import { useRef, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  FileText,
  Download,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { useDictionary } from "@/context/DictionaryContext";
import { useUpdateCourseProgressMutation } from "@/redux/api/courseApi";
import { Button } from "@/components/ui/Button";
import { getMediaUrl } from "@/utils/mediaUrl";

export default function ClassroomVideoPlayer({
  courseId,
  course,
  currentLesson,
  currentLessonIdx,
  totalLessons,
  completedLessonIds,
  setCompletedLessonIds,
  lessonProgressMap = {},
  setLessonProgressMap,
  handlePrevLesson,
  handleNextLesson,
  activeTab,
  setActiveTab,
  onTriggerQuiz,
  isCourseFree = false,
  hasFullAccess = true,
  onOpenCheckout,
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

  const videoSrc = getMediaUrl(rawVideoUrl, "/sample-course-video.mp4");

  const { user } = useSelector((state) => state.auth);
  const userScope = user?._id ? `user_${user._id}` : "guest";

  const isModule2PlusLocked =
    !isCourseFree &&
    !hasFullAccess &&
    ((currentLesson?.moduleIdx ?? 0) > 0 || Boolean(currentLesson?.isPremiumLocked));

  const [updateCourseProgress] = useUpdateCourseProgressMutation();
  const lastHeartbeatRef = useRef(0);
  const videoRef = useRef(null);
  const hasResumedRef = useRef(false);

  const formatSeconds = (totalSec) => {
    const mins = Math.floor(totalSec / 60);
    const secs = Math.floor(totalSec % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Reset resume flag when lesson changes
  useEffect(() => {
    hasResumedRef.current = false;
  }, [currentLesson?.id]);

  // Attempt to resume from saved position on loadedmetadata
  const handleLoadedMetadata = () => {
    if (isModule2PlusLocked) return;
    if (hasResumedRef.current || !videoRef.current) return;
    try {
      const savedSec =
        Number(lessonProgressMap?.[currentLesson?.id]) ||
        Number(
          localStorage.getItem(
            `lpg_${userScope}_course_${courseId}_lesson_${currentLesson?.id}_pos`
          )
        ) ||
        0;
      if (
        savedSec > 3 &&
        videoRef.current.duration &&
        savedSec < videoRef.current.duration - 5
      ) {
        videoRef.current.currentTime = savedSec;
        hasResumedRef.current = true;
        toast.info(
          isBn
            ? `পূর্ববর্তী সময় (${formatSeconds(savedSec)}) থেকে ভিডিও শুরু করা হয়েছে`
            : `Resumed from last position (${formatSeconds(savedSec)})`
        );
      }
    } catch (err) {
      // Storage access fail-safe
    }
  };

  // 10-second heartbeat interval for active tracking
  useEffect(() => {
    if (isModule2PlusLocked) return;
    lastHeartbeatRef.current = 0;
    const interval = setInterval(() => {
      if (videoRef.current && !videoRef.current.paused) {
        const cur = Math.floor(videoRef.current.currentTime);
        if (cur > 0) {
          lastHeartbeatRef.current = cur;
          updateCourseProgress({
            courseId,
            data: {
              lessonId: currentLesson.id,
              watchedSeconds: cur,
              isCompleted: false,
            },
          });
        }
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [courseId, currentLesson.id, updateCourseProgress, isModule2PlusLocked]);

  const handleCompleteCurrent = () => {
    if (isModule2PlusLocked) {
      if (onOpenCheckout) onOpenCheckout();
      return;
    }
    if (!completedLessonIds.includes(currentLesson.id)) {
      setCompletedLessonIds((prev) => [...prev, currentLesson.id]);
    }
    const finalSeconds = Math.floor(videoRef.current?.duration || 600);
    if (setLessonProgressMap) {
      setLessonProgressMap((prev) => ({
        ...prev,
        [currentLesson.id]: finalSeconds,
      }));
    }
    try {
      localStorage.setItem(
        `lpg_${userScope}_course_${courseId}_lesson_${currentLesson.id}_pos`,
        String(finalSeconds)
      );
    } catch (e) {}

    updateCourseProgress({
      courseId,
      data: {
        lessonId: currentLesson.id,
        watchedSeconds: finalSeconds,
        isCompleted: true,
      },
    });
    toast.success(isBn ? "পাঠটি সম্পন্ন হয়েছে" : "Lesson completed");
  };

  const handleTimeUpdate = (e) => {
    const currentTime = Math.floor(e.target.currentTime);
    if (currentTime > 0) {
      if (setLessonProgressMap) {
        setLessonProgressMap((prev) => ({
          ...prev,
          [currentLesson.id]: currentTime,
        }));
      }
      try {
        localStorage.setItem(
          `lpg_${userScope}_course_${courseId}_lesson_${currentLesson.id}_pos`,
          String(currentTime)
        );
      } catch (err) {}

      if (
        currentTime % 10 === 0 &&
        currentTime !== lastHeartbeatRef.current
      ) {
        lastHeartbeatRef.current = currentTime;
        updateCourseProgress({
          courseId,
          data: {
            lessonId: currentLesson.id,
            watchedSeconds: currentTime,
            isCompleted: false,
          },
        });
      }
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      const cur = Math.floor(videoRef.current.currentTime);
      if (cur > 0) {
        if (setLessonProgressMap) {
          setLessonProgressMap((prev) => ({
            ...prev,
            [currentLesson.id]: cur,
          }));
        }
        try {
          localStorage.setItem(
            `lpg_${userScope}_course_${courseId}_lesson_${currentLesson.id}_pos`,
            String(cur)
          );
        } catch (e) {}
        updateCourseProgress({
          courseId,
          data: {
            lessonId: currentLesson.id,
            watchedSeconds: cur,
            isCompleted: false,
          },
        });
      }
    }
  };

  const isCompleted = completedLessonIds.includes(currentLesson.id);

  return (
    <main className="flex flex-1 flex-col overflow-y-auto bg-slate-50">
      {/* Video Screen OR Locked Premium Wall */}
      <div className="relative aspect-16/9 w-full max-h-[60vh] bg-slate-950 flex items-center justify-center border-b border-slate-200 overflow-hidden">
        {isModule2PlusLocked ? (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-slate-950/95 via-slate-900 to-slate-950 text-white">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-lg shadow-amber-500/5">
              <Lock className="h-7 w-7" />
            </div>

            <span className="inline-block rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-1 text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-2">
              {isBn ? "মডিউল ২ লক করা রয়েছে • কোর্স ভর্তি আবশ্যক" : "Module 2 Locked • Enrollment Required"}
            </span>

            <h2 className="text-base sm:text-lg font-bold text-white max-w-lg leading-snug">
              {title}
            </h2>

            <p className="text-xs text-slate-300 max-w-md mt-2 leading-relaxed">
              {isBn
                ? "এই কোর্সের ১ম মডিউল ফ্রি প্রিভিউ ছিল। মডিউল ২ এবং পরবর্তী সকল ভিডিও লেকচার, হ্যান্ডআউট ও সার্টিফিকেট পেতে কোর্সে ভর্তি সম্পন্ন করুন বা সাবস্ক্রিপশন নিশ্চিত করুন।"
                : "Module 1 was a free preview. Please enroll in the course or subscribe to unlock Module 2 onwards."}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={onOpenCheckout}
                className="gap-2 font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md cursor-pointer"
              >
                <Lock className="h-4 w-4" />
                <span>
                  {isBn
                    ? `কোর্সে ভর্তি হন (৳ ${course?.price || 0}) / সাবস্ক্রাইব করুন`
                    : `Enroll Now (৳ ${course?.price || 0}) / Subscribe`}
                </span>
              </Button>

              <button
                type="button"
                onClick={handlePrevLesson}
                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition border border-white/10 cursor-pointer"
              >
                {isBn ? "১ম মডিউলে ফিরে যান" : "Return to Module 1"}
              </button>
            </div>
          </div>
        ) : isEmbed ? (
          <iframe
            src={videoSrc}
            title={title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video
            ref={videoRef}
            key={videoSrc}
            controls
            autoPlay={false}
            playsInline
            preload="metadata"
            className="w-full h-full object-contain bg-black"
            src={videoSrc}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onPause={handlePause}
            onEnded={() => {
              handleCompleteCurrent();
              if (handleNextLesson) handleNextLesson();
            }}
          >
            Your browser does not support video streaming.
          </video>
        )}
      </div>

      {/* Navigation Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 sm:px-6 py-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrevLesson}
            disabled={currentLessonIdx === 0}
            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
            <span>{isBn ? "পূর্ববর্তী পাঠ" : "Previous Lesson"}</span>
          </button>

          {isModule2PlusLocked ? (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={onOpenCheckout}
              className="gap-1 font-bold text-xs bg-amber-600 hover:bg-amber-700 text-white"
            >
              <Lock className="h-3.5 w-3.5" />
              <span>
                {isBn
                  ? `কোর্সে ভর্তি হন (৳ ${course?.price || 0})`
                  : `Enroll Now (৳ ${course?.price || 0})`}
              </span>
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => {
                handleCompleteCurrent();
                if (handleNextLesson) handleNextLesson();
              }}
              className="gap-1 font-bold text-xs"
            >
              <span>
                {currentLesson?.isLastInModule && currentLesson?.hasModuleQuiz
                  ? isBn
                    ? "সম্পন্ন করে কুইজে যান"
                    : "Complete & Go to Quiz"
                  : currentLessonIdx === totalLessons - 1
                  ? isBn
                    ? "সম্পন্ন করে মূল্যায়ন কুইজে যান"
                    : "Finish & Take Quiz"
                  : isBn
                  ? "সম্পন্ন করে পরবর্তী পাঠ"
                  : "Complete & Next Lesson"}
              </span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCompleteCurrent}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              isCompleted
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <CheckCircle2 className={`h-3.5 w-3.5 ${isCompleted ? "text-emerald-600" : "text-slate-400"}`} />
            <span>
              {isCompleted
                ? isBn ? "সম্পন্ন হয়েছে" : "Completed"
                : isBn ? "সম্পন্ন হিসেবে মার্ক করুন" : "Mark Completed"}
            </span>
          </button>
        </div>
      </div>

      {/* Lesson Notes & Resources Area */}
      <div className="p-5 sm:p-6 max-w-4xl">
        {/* Clean Standard Tabs */}
        <div className="flex items-center gap-6 border-b border-slate-200 pb-2 mb-4 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("notes")}
            className={`pb-2 transition-colors cursor-pointer ${
              activeTab === "notes"
                ? "border-b-2 border-primary text-slate-900"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {isBn ? "পাঠের নোট ও সারসংক্ষেপ" : "Lesson Notes"}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("downloads")}
            className={`pb-2 transition-colors cursor-pointer ${
              activeTab === "downloads"
                ? "border-b-2 border-primary text-slate-900"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {isBn ? "প্রয়োজনীয় রিসোর্স ও ডকুমেন্টস" : "Resources"}
          </button>
        </div>

        {activeTab === "notes" ? (
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-white p-5">
              <h2 className="text-base font-bold text-slate-900 mb-2">
                {title}
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                {description}
              </p>
            </div>

            {notes && (
              <div className="rounded-lg border border-slate-200 bg-white p-5 text-xs text-slate-700 leading-relaxed">
                <div className="font-bold text-slate-900 mb-1.5 uppercase text-[11px] tracking-wider">
                  {isBn ? "জরুরি নির্দেশিকা ও সারসংক্ষেপ:" : "Key Practical Guidelines:"}
                </div>
                <p className="text-slate-600">{notes}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {/* 1. Official Course PDF Study Guide if uploaded */}
            {course?.pdfUrl && (
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">
                      {course.pdfOriginalName || (isBn ? `${course.titleBn || course.title} - স্টাডি গাইড.pdf` : `${course.title} - Study Guide.pdf`)}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {course.pdfSize ? `${course.pdfSize} • ` : ""}Official Course PDF Guide
                    </div>
                  </div>
                </div>
                <a
                  href={getMediaUrl(course.pdfUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Download className="h-3.5 w-3.5 text-primary" />
                  <span>{isBn ? "ডাউনলোড" : "Download"}</span>
                </a>
              </div>
            )}

            {/* 2. Specific Lesson PDF Handout if uploaded */}
            {currentLesson?.pdfUrl && (
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 text-xs">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">
                      {currentLesson.pdfOriginalName || (isBn ? `${currentLesson.titleBn || currentLesson.title} - হ্যান্ডআউট.pdf` : `${currentLesson.title} - Lesson Handout.pdf`)}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">Lesson Resource Handout</div>
                  </div>
                </div>
                <a
                  href={getMediaUrl(currentLesson.pdfUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Download className="h-3.5 w-3.5 text-primary" />
                  <span>{isBn ? "ডাউনলোড" : "Download"}</span>
                </a>
              </div>
            )}

            {/* Standard Safety Checklist & Guide */}
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 text-xs">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">
                    {isBn
                      ? "এলপিজি সিলিন্ডার ব্যবহার চেকলিস্ট.pdf"
                      : "LPG Safety Checklist.pdf"}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">PDF Document • 1.2 MB</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toast.success(isBn ? "ফাইল ডাউনলোড শুরু হয়েছে..." : "Downloading checklist...")}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Download className="h-3.5 w-3.5" />
                <span>{isBn ? "ডাউনলোড" : "Download"}</span>
              </button>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4 text-xs">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <div className="font-bold text-slate-900">
                    {isBn
                      ? "জরুরি অগ্নিপ্রতিরোধ নির্দেশিকা.pdf"
                      : "Emergency Fire Response Guide.pdf"}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">PDF Document • 850 KB</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toast.success(isBn ? "ফাইল ডাউনলোড শুরু হয়েছে..." : "Downloading guide...")}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Download className="h-3.5 w-3.5" />
                <span>{isBn ? "ডাউনলোড" : "Download"}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

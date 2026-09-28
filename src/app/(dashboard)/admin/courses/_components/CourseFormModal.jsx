// src/app/(dashboard)/admin/courses/_components/CourseFormModal.jsx
"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { FaVideo, FaUpload, FaCheckCircle, FaPlay } from "react-icons/fa";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { P } from "@/components/ui/Typography";
import { useUploadCourseVideoMutation } from "@/redux/api/courseApi";

const CATEGORY_OPTIONS = [
  { value: "Consumer Safety", label: "Consumer Safety (ভোক্তা নিরাপত্তা)" },
  { value: "Dealer Compliance", label: "Dealer Compliance (ডিলার ও খুচরা বিক্রেতা)" },
  { value: "Auto-Gas & Transport", label: "Auto-Gas & Transport (অটো-গ্যাস ও পরিবহন)" },
  { value: "Industrial & Commercial", label: "Industrial & Commercial (শিল্প ও বাণিজ্যিক)" },
];

const LEVEL_OPTIONS = [
  { value: "Beginner", label: "Beginner (প্রাথমিক)" },
  { value: "Intermediate", label: "Intermediate (মাধ্যমিক)" },
  { value: "Professional", label: "Professional (পেশাদার)" },
];

export default function CourseFormModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  isSaving,
  isEditing,
}) {
  const fileInputRef = useRef(null);
  const [uploadVideo, { isLoading: isUploadingVideo }] =
    useUploadCourseVideoMutation();

  const handleVideoFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      toast.error("Video file size must be less than 100MB.");
      return;
    }

    const payload = new FormData();
    payload.append("video", file);

    try {
      toast.loading("Uploading course video...", { id: "upload-vid" });
      const res = await uploadVideo(payload).unwrap();
      const videoPath = res?.data?.videoUrl;

      if (videoPath) {
        setFormData((prev) => ({
          ...prev,
          videoUrl: videoPath,
        }));
        toast.success("Direct video uploaded successfully!", {
          id: "upload-vid",
        });
      } else {
        toast.error("Failed to retrieve uploaded video URL", {
          id: "upload-vid",
        });
      }
    } catch (err) {
      toast.error(
        err?.data?.message || "Failed to upload video to backend.",
        { id: "upload-vid" }
      );
    }
  };

  const handleUseSampleVideo = () => {
    setFormData((prev) => ({
      ...prev,
      videoUrl: "/sample-course-video.mp4",
    }));
    toast.success("Sample 2s video selected for this course!");
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="4xl"
      title={
        isEditing
          ? "Edit Course / কোর্স সম্পাদনা"
          : "Create New LMS Course / নতুন কোর্স তৈরি করুন"
      }
      description="Provide English and Bengali curriculum details side-by-side with a single unified course link."
    >
      <form onSubmit={onSubmit} className="p-6 space-y-6">
        {/* Section 1: Course Title (Side by Side) */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-primary uppercase tracking-wider">
              1. Course Titles / কোর্সের শিরোনাম
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Course Title"
                required
                placeholder="e.g., Safe Domestic LPG Cylinder Handling & Regulations"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              <Input
                label="কোর্সের নাম"
                required
                placeholder="যেমন: গৃহস্থালি এলপিজি সিলিন্ডার নিরাপদ ব্যবহার ও সরকারি বিধিমালা"
                value={formData.titleBn}
                onChange={(e) =>
                  setFormData({ ...formData, titleBn: e.target.value })
                }
              />
            </div>
          </div>

          {/* Section 2: Audience & Duration (Side by Side) */}
          <div className="space-y-3 border-t border-slate-100 pt-4">
            <div className="text-xs font-bold text-primary uppercase tracking-wider">
              2. Target Audience & Duration / কাদের জন্য ও সময়কাল
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Input
                label="Audience"
                placeholder="e.g., Homemakers & Consumers"
                value={formData.audience}
                onChange={(e) =>
                  setFormData({ ...formData, audience: e.target.value })
                }
              />
              <Input
                label="কাদের জন্য"
                placeholder="যেমন: ভোক্তা ও গৃহিণী"
                value={formData.audienceBn}
                onChange={(e) =>
                  setFormData({ ...formData, audienceBn: e.target.value })
                }
              />
              <Input
                label="Duration"
                placeholder="e.g., 1h 45m"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
              />
              <Input
                label="সময়কাল"
                placeholder="যেমন: ১ ঘণ্টা ৪৫ মিনিট"
                value={formData.durationBn}
                onChange={(e) =>
                  setFormData({ ...formData, durationBn: e.target.value })
                }
              />
            </div>
          </div>

          {/* Section 3: Course Description (Side by Side) */}
          <div className="space-y-3 border-t border-slate-100 pt-4">
            <div className="text-xs font-bold text-primary uppercase tracking-wider">
              3. Course Description / কোর্সের পূর্ণাঙ্গ বিবরণ
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Textarea
                label="Full Description"
                required
                rows={4}
                placeholder="Comprehensive overview of modules, objectives, and regulatory requirements..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
              <Textarea
                label="কোর্সের পূর্ণাঙ্গ বিবরণ"
                required
                rows={4}
                placeholder="কোর্সের উদ্দেশ্য ও শিক্ষণীয় বিষয়ের পূর্ণাঙ্গ বিবরণ..."
                value={formData.descriptionBn}
                onChange={(e) =>
                  setFormData({ ...formData, descriptionBn: e.target.value })
                }
              />
            </div>
          </div>

          {/* Section 4: Common Shared Metadata */}
          <div className="space-y-4 border-t border-slate-200 pt-4">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              4. Curriculum Metadata & Pricing / মেটাডাটা ও মূল্য
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Category / ক্যাটাগরি"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                options={CATEGORY_OPTIONS}
              />

              <Select
                label="Skill Level / স্তর"
                value={formData.level}
                onChange={(e) =>
                  setFormData({ ...formData, level: e.target.value })
                }
                options={LEVEL_OPTIONS}
              />

              <Input
                label="Price (BDT, 0 = Free / বিনামূল্যে)"
                type="number"
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Course ID Code"
                placeholder="e.g., 1 or LPG-101"
                value={formData.courseId}
                onChange={(e) =>
                  setFormData({ ...formData, courseId: e.target.value })
                }
              />

              <Input
                label="URL Slug (Shared Link / একই লিংক)"
                placeholder="safe-domestic-lpg-handling"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
              />
            </div>

            <Input
              label="Banner Image URL"
              placeholder="https://images.unsplash.com/..."
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
            />

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) =>
                  setFormData({ ...formData, isPublished: e.target.checked })
                }
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20"
              />
              <span className="text-xs font-semibold text-slate-800">
                Publish to public Academy LMS catalog / সর্বজনীন ক্যাটালগে প্রকাশ করুন
              </span>
            </label>
          </div>

          {/* Section 5: Direct Course Video Upload & Preview */}
          <div className="space-y-4 border-t border-slate-200 pt-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <FaVideo className="h-3.5 w-3.5" />
                <span>5. Direct Course Video / সরাসরি ভিডিও আপলোড</span>
              </div>

              {/* Sample 2s video quick-select button */}
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={handleUseSampleVideo}
                className="text-[11px] gap-1.5 border-primary/30 text-primary hover:bg-primary/5"
              >
                <FaCheckCircle className="h-3 w-3 text-secondary" />
                <span>Use Sample 2s Video (নমুনা ২ সেকেন্ডের ভিডিও)</span>
              </Button>
            </div>

            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="video/mp4,video/webm,video/mov,video/ogg"
              onChange={handleVideoFileChange}
              className="hidden"
            />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
              {/* Left Column: Upload button & URL */}
              <div className="md:col-span-7 space-y-3">
                <div className="rounded-xl border-2 border-dashed border-slate-300 hover:border-primary/60 bg-slate-50/70 p-4 transition-colors text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary mb-2">
                    <FaUpload className="h-4 w-4" />
                  </div>
                  <P className="text-xs font-bold text-slate-800">
                    Upload Lesson / Promo Video File
                  </P>
                  <P className="text-[11px] text-slate-500 mt-0.5">
                    Direct MP4, WebM (up to 100MB supported)
                  </P>

                  <div className="mt-3 flex items-center justify-center gap-2">
                    <Button
                      type="button"
                      variant="primary"
                      size="xs"
                      disabled={isUploadingVideo}
                      onClick={() => fileInputRef.current?.click()}
                      className="gap-1.5"
                    >
                      {isUploadingVideo ? (
                        <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      ) : (
                        <FaUpload className="h-3 w-3" />
                      )}
                      <span>{isUploadingVideo ? "Uploading..." : "Select Video File"}</span>
                    </Button>
                  </div>
                </div>

                <Input
                  label="Direct Video Stream URL (or Relative Path)"
                  placeholder="/sample-course-video.mp4 or /public/upload/videos/..."
                  value={formData.videoUrl || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, videoUrl: e.target.value })
                  }
                />
              </div>

              {/* Right Column: Live Video Player Preview */}
              <div className="md:col-span-5">
                <div className="rounded-xl border border-slate-200 overflow-hidden bg-slate-900 shadow-sm">
                  <div className="px-3 py-1.5 bg-slate-950 text-[11px] font-bold text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <FaPlay className="h-2.5 w-2.5 text-primary" />
                      Video Preview
                    </span>
                    <span className="text-[10px] text-secondary font-mono">
                      {formData.videoUrl ? "Ready" : "No Video"}
                    </span>
                  </div>

                  <div className="aspect-video bg-black flex items-center justify-center relative">
                    {formData.videoUrl ? (
                      <video
                        key={formData.videoUrl}
                        controls
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-contain"
                        src={
                          formData.videoUrl.startsWith("/") && !formData.videoUrl.startsWith("//")
                            ? formData.videoUrl.startsWith("/public/upload")
                              ? `http://localhost:8005${formData.videoUrl}`
                              : formData.videoUrl
                            : formData.videoUrl
                        }
                      >
                        Your browser does not support HTML5 video tag.
                      </video>
                    ) : (
                      <div className="text-center p-4">
                        <FaVideo className="h-8 w-8 text-slate-600 mx-auto mb-1.5" />
                        <P className="text-[11px] text-slate-400">
                          Upload or select a video to preview
                        </P>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              size="sm"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSaving}
              variant="primary"
              size="sm"
              className="gap-2"
            >
              {isSaving && (
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
              <span>{isEditing ? "Save Changes" : "Create Course"}</span>
            </Button>
          </div>
        </form>
    </Dialog>
  );
}

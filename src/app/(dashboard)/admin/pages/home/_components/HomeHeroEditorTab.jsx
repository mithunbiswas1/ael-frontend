// src/app/(dashboard)/admin/pages/home/_components/HomeHeroEditorTab.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Trash2,
  MoveUp,
  MoveDown,
  CheckCircle,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { H3, H4, P } from "@/components/ui/Typography";
import HeroSection from "@/app/(home)/_components/HeroSection";
import DragDropUploadZone from "@/app/(dashboard)/_components/DragDropUploadZone";
import { useUploadHomeBannerSlidesMutation } from "@/redux/api/homeBannerApi";

export default function HomeHeroEditorTab({
  banner = {},
  onChange = () => { },
}) {
  const [previewLocale, setPreviewLocale] = useState("en");
  const [activeSlidePreview, setActiveSlidePreview] = useState(0);

  const [uploadSlides, { isLoading: isUploading }] =
    useUploadHomeBannerSlidesMutation();

  const slides = Array.isArray(banner.slides) ? banner.slides : [];

  const updateField = (field, value) => {
    onChange({
      ...banner,
      [field]: value,
    });
  };

  const handleUpdateSlide = (index, key, value) => {
    const updated = slides.map((s, idx) =>
      idx === index ? { ...s, [key]: value } : s
    );
    updateField("slides", updated);
  };

  const handleDeleteSlide = (index) => {
    const updated = slides.filter((_, idx) => idx !== index);
    updateField("slides", updated);
    if (activeSlidePreview >= updated.length) {
      setActiveSlidePreview(Math.max(0, updated.length - 1));
    }
    toast.info("Slide removed");
  };

  const handleMoveSlide = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const reordered = [...slides];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, moved);

    const withOrder = reordered.map((s, idx) => ({ ...s, order: idx + 1 }));
    updateField("slides", withOrder);
    setActiveSlidePreview(targetIndex);
  };

  const handleFilesUpload = async (files) => {
    if (!files || files.length === 0) return;

    const validFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (validFiles.length === 0) {
      toast.error("Please drop valid image files (PNG, JPG, WEBP).");
      return;
    }

    const formData = new FormData();
    validFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await uploadSlides(formData).unwrap();
      const uploaded = response?.data || [];

      if (uploaded.length > 0) {
        const newSlides = [
          ...slides,
          ...uploaded.map((item, idx) => ({
            image: item.image,
            alt: item.alt || `LPG Slide ${slides.length + idx + 1}`,
            altBn: "",
            order: slides.length + idx + 1,
          })),
        ];
        updateField("slides", newSlides);
        toast.success(
          `${uploaded.length} slide image(s) uploaded successfully!`
        );
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to upload slide images.");
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Real-Time Front-Panel Matched Live Storefront Preview */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Live Front Panel Storefront Preview
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Preview Language:</span>
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5">
              <Button
                type="button"
                variant="unstyled"
                onClick={() => setPreviewLocale("en")}
                className={`px-3 py-1 text-xs rounded-md font-semibold transition-all cursor-pointer ${previewLocale === "en"
                  ?"bg-primary text-white"
                  : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                English
              </Button>
              <Button
                type="button"
                variant="unstyled"
                onClick={() => setPreviewLocale("bn")}
                className={`px-3 py-1 text-xs rounded-md font-semibold transition-all cursor-pointer ${previewLocale === "bn"
                  ?"bg-primary text-white"
                  : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                বাংলা
              </Button>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-primary/20 pointer-events-auto">
          <HeroSection locale={previewLocale} banner={banner} />
        </div>
      </div>

      {/* 2. Configuration Form Sections */}
      <div className="space-y-6">
        {/* Section 1: Hero Headlines */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
              1
            </span>
            <H3 className="text-sm font-bold text-slate-900">Hero Headlines & Subtitle</H3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Headline Line 1"
              value={banner.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="e.g. SAFETY FIRST."
              required
            />
            <Input
              label="শিরোনাম লাইন ১"
              value={banner.titleBn || ""}
              onChange={(e) => updateField("titleBn", e.target.value)}
              placeholder="যেমন: নিরাপত্তা সবার আগে।"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Headline Line 2"
              value={banner.accent || ""}
              onChange={(e) => updateField("accent", e.target.value)}
              placeholder="e.g. AWARENESS ALWAYS."
              required
            />
            <Input
              label="শিরোনাম লাইন ২"
              value={banner.accentBn || ""}
              onChange={(e) => updateField("accentBn", e.target.value)}
              placeholder="যেমন: সচেতনতা সর্বদা।"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
              label="Subtitle Description"
              rows={3}
              value={banner.description || ""}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="English introductory paragraph..."
            />
            <Textarea
              label="সাবটাইটেল বর্ণনা"
              rows={3}
              value={banner.descriptionBn || ""}
              onChange={(e) => updateField("descriptionBn", e.target.value)}
              placeholder="বাংলা পরিচিতিমূলক অনুচ্ছেদ..."
            />
          </div>
        </div>

        {/* Section 2: Call-to-Action Buttons */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
              2
            </span>
            <H3 className="text-sm font-bold text-slate-900">Call-To-Action (CTA) Buttons</H3>
          </div>

          <div className="rounded-lg bg-slate-50/70 p-4 border border-slate-200/60 space-y-3">
            <span className="text-xs font-bold text-primary uppercase tracking-wide">
              Primary Action Button (Solid Blue)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Button Label"
                value={banner.btnPrimaryText || ""}
                onChange={(e) => updateField("btnPrimaryText", e.target.value)}
                placeholder="e.g. Explore Safety Guidelines"
              />
              <Input
                label="বাটন লেবেল"
                value={banner.btnPrimaryTextBn || ""}
                onChange={(e) => updateField("btnPrimaryTextBn", e.target.value)}
                placeholder="যেমন: নিরাপত্তা নির্দেশিকা দেখুন"
              />
              <Input
                label="Target Link (URL)"
                value={banner.btnPrimaryHref || ""}
                onChange={(e) => updateField("btnPrimaryHref", e.target.value)}
                placeholder="/safety-guidelines"
              />
            </div>
          </div>

          <div className="rounded-lg bg-slate-50/70 p-4 border border-slate-200/60 space-y-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Secondary Action Button (Frosted Outline)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input
                label="Button Label"
                value={banner.btnSecondaryText || ""}
                onChange={(e) => updateField("btnSecondaryText", e.target.value)}
                placeholder="e.g. Start Training & Quiz"
              />
              <Input
                label="বাটন লেবেল"
                value={banner.btnSecondaryTextBn || ""}
                onChange={(e) => updateField("btnSecondaryTextBn", e.target.value)}
                placeholder="যেমন: প্রশিক্ষণ ও কুইজ শুরু করুন"
              />
              <Input
                label="Target Link (URL)"
                value={banner.btnSecondaryHref || ""}
                onChange={(e) => updateField("btnSecondaryHref", e.target.value)}
                placeholder="/courses"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Right Side Carousel Media (Drag & Drop Multiple Images - No Links) */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                3
              </span>
              <H3 className="text-sm font-bold text-slate-900">
                Hero Carousel Slides (Right Side Media)
              </H3>
            </div>
          </div>

          {/* Drag & Drop Upload Zone */}
          <DragDropUploadZone
            onFilesSelected={handleFilesUpload}
            isUploading={isUploading}
            multiple={true}
            title={
              <>
                Drag and drop images here, or <span className="text-primary underline">browse</span>
              </>
            }
            subtitle="Upload multiple slides simultaneously. Supported formats: PNG, JPG, JPEG, WEBP."
            uploadingText="Uploading slide image(s)..."
          />

          {/* Slides List & Alt Texts */}
          {slides.length > 0 && (
            <div className="space-y-3 pt-2">
              <H4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Configured Slides (Drag & Drop or reorder)
              </H4>

              <div className="space-y-3">
                {slides.map((slide, idx) => (
                  <div
                    key={slide._id || `slide-${idx}`}
                    className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xl border p-3.5 transition-colors ${activeSlidePreview === idx
                      ? "border-primary/50 bg-primary/5"
                      : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                  >
                    {/* Thumbnail & Order */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex flex-col items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="xs"
                          onClick={() => handleMoveSlide(idx, -1)}
                          disabled={idx === 0}
                          className="h-6 w-6 p-0 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          title="Move Up"
                        >
                          <MoveUp className="h-3 w-3" />
                        </Button>
                        <span className="text-[10px] font-bold text-slate-500 font-mono">
                          #{idx + 1}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="xs"
                          onClick={() => handleMoveSlide(idx, 1)}
                          disabled={idx === slides.length - 1}
                          className="h-6 w-6 p-0 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                          title="Move Down"
                        >
                          <MoveDown className="h-3 w-3" />
                        </Button>
                      </div>

                      <div
                        onClick={() => setActiveSlidePreview(idx)}
                        className="relative aspect-4/3 h-16 w-24 overflow-hidden rounded-lg bg-slate-100 border border-slate-200 cursor-pointer group"
                        title="Click to preview this slide"
                      >
                        <Image
                          src={slide.image || "/lpg-hero.jpg"}
                          alt={slide.alt || "Slide image"}
                          fill
                          unoptimized
                          className="object-cover transition-transform"
                        />
                        {activeSlidePreview === idx && (
                          <div className="absolute inset-0 bg-primary/20 border-2 border-primary rounded-lg flex items-center justify-center">
                            <CheckCircle className="h-4 w-4 text-white drop-" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Alt Text Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 w-full">
                      <Input
                        label="Image Alt Text"
                        value={slide.alt || ""}
                        onChange={(e) =>
                          handleUpdateSlide(idx, "alt", e.target.value)
                        }
                        placeholder="e.g. LPG Cylinder Quality Inspection"
                      />
                      <Input
                        label="ছবির বিবরণ"
                        value={slide.altBn || ""}
                        onChange={(e) =>
                          handleUpdateSlide(idx, "altBn", e.target.value)
                        }
                        placeholder="যেমন: এলপিজি সিলিন্ডার গুণমান পরীক্ষা"
                      />
                    </div>

                    {/* Delete Action */}
                    <div className="shrink-0 self-end sm:self-center">
                      <Button
                        type="button"
                        onClick={() => handleDeleteSlide(idx)}
                        variant="ghost"
                        size="xs"
                        className="p-2 text-red-500 hover:bg-red-50 hover:text-red-700"
                        title="Delete this slide"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

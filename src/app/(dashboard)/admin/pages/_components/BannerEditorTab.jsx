// src/app/(dashboard)/admin/pages/_components/BannerEditorTab.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Trash2, Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { H1, H3, H4, P } from "@/components/ui/Typography";
import AmbientGlow from "@/components/ui/AmbientGlow";
import DragDropUploadZone from "@/app/(dashboard)/_components/DragDropUploadZone";
import { useUploadPageImageMutation } from "@/redux/api/pageApi";

export default function BannerEditorTab({
  banner = {},
  bannerData,
  onChange = () => { },
  bannerType = "visual", // "visual" | "centered"
  previewBreadcrumb,
  previewBreadcrumbBn,
}) {
  const activeBanner = (banner && Object.keys(banner).length > 0) ? banner : (bannerData || {});
  const [previewLang, setPreviewLang] = useState("en");
  const [uploadImage, { isLoading: isUploading }] = useUploadPageImageMutation();

  const isCentered = (activeBanner.type || bannerType) === "centered";
  const isBn = previewLang === "bn";

  const updateField = (field, value) => {
    onChange({
      ...activeBanner,
      type: isCentered ? "centered" : "visual",
      [field]: value,
    });
  };

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    if (!file.type.startsWith("image/")) {
      toast.error("Please drop a valid image file (PNG, JPG, WEBP).");
      return;
    }

    const formData = new FormData();
    formData.append("images", file);

    try {
      const response = await uploadImage(formData).unwrap();
      const uploadedItem = Array.isArray(response?.data)
        ? response.data[0]
        : response?.data;
      const uploadedImage =
        uploadedItem?.image || uploadedItem?.url || (typeof uploadedItem === "string" ? uploadedItem : null);

      if (uploadedImage) {
        onChange({
          ...activeBanner,
          type: isCentered ? "centered" : "visual",
          imageSrc: uploadedImage,
          imageAlt: activeBanner.imageAlt || uploadedItem?.alt || file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
        });
        toast.success("Banner image uploaded successfully!");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to upload banner image.");
    }
  };

  const displayedTitle = (isBn ? activeBanner.titleBn : activeBanner.title) || activeBanner.title || "";
  const displayedAccent = (isBn ? activeBanner.accentBn : activeBanner.accent) || activeBanner.accent || "";
  const displayedDescription = (isBn ? activeBanner.descriptionBn : activeBanner.description) || activeBanner.description || "";

  return (
    <div className="space-y-8">
      {/* 1. Real-Time Front-Panel Matched Live Storefront Preview */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Live Front Panel Storefront Preview ({isCentered ? "Centered Hero" : "Visual Split Hero"})
            </span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-mono text-slate-600">
              Real-time Sync
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Preview Language:</span>
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5">
              <Button
                type="button"
                variant="unstyled"
                onClick={() => setPreviewLang("en")}
                className={`px-3 py-1 text-xs rounded-md font-semibold transition-all cursor-pointer ${previewLang === "en"
                  ?"bg-primary text-white"
                  : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                English
              </Button>
              <Button
                type="button"
                variant="unstyled"
                onClick={() => setPreviewLang("bn")}
                className={`px-3 py-1 text-xs rounded-md font-semibold transition-all cursor-pointer ${previewLang === "bn"
                  ?"bg-primary text-white"
                  : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                বাংলা
              </Button>
            </div>
          </div>
        </div>

        {/* Live Banner Container Matching Public Storefront Theme */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-tertiary via-[#0c1a33] to-tertiary p-6 sm:p-10 border border-primary/20">
          <AmbientGlow color="primary" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(#1D4E91_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.08]"
          />

          {isCentered ? (
            /* CENTERED HERO PREVIEW */
            <div className="relative z-10 text-center max-w-2xl mx-auto py-8">
              <H1 color="white">
                {displayedTitle && <span>{displayedTitle}</span>}
                {displayedTitle && displayedAccent && " "}
                {displayedAccent && <span className="text-secondary">{displayedAccent}</span>}
              </H1>

              {displayedDescription && (
                <P color="light" className="mt-4 text-xs sm:text-sm text-slate-300 max-w-xl mx-auto line-clamp-3 leading-relaxed">
                  {displayedDescription}
                </P>
              )}
            </div>
          ) : (
            /* VISUAL SPLIT HERO PREVIEW */
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 flex flex-col items-start">
                <H1 color="white">
                  {displayedTitle && <span>{displayedTitle}</span>}
                  {displayedTitle && displayedAccent && <br />}
                  {displayedAccent && <span className="text-secondary">{displayedAccent}</span>}
                </H1>

                {displayedDescription && (
                  <P color="light" className="mt-5 max-w-xl text-slate-300">
                    {displayedDescription}
                  </P>
                )}
              </div>

              <div className="relative flex items-center justify-center lg:col-span-5">
                <div className="group relative aspect-4/3 w-full max-w-sm overflow-hidden rounded-2xl border border-white/15 bg-tertiary/80 backdrop-blur-sm">
                  {activeBanner.imageSrc ? (
                    <>
                      <Image
                        src={activeBanner.imageSrc}
                        alt={activeBanner.imageAlt || "Banner preview"}
                        fill
                        unoptimized
                        className="object-cover object-center transition-transform duration-700 ease-out"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/10" />
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full p-6 text-center text-slate-400">
                      <ImageIcon className="h-10 w-10 text-slate-500 mb-2" />
                      <span className="text-xs font-semibold text-slate-300">No Image Configured</span>
                      <span className="text-[11px] text-slate-500 mt-0.5">Drag and drop an image below</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Configuration Form Sections */}
      <div className="space-y-6">
        {/* Section 1: Hero Headlines & Subtitle Content */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
              1
            </span>
            <div>
              <H3 className="text-sm font-bold text-slate-900">Hero Headlines & Subtitle Content</H3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Headline Line 1"
              value={activeBanner.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="e.g. ABOUT"
            />
            <Input
              label="শিরোনাম লাইন ১"
              value={activeBanner.titleBn || ""}
              onChange={(e) => updateField("titleBn", e.target.value)}
              placeholder="যেমন: আমাদের"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Headline Line 2 (Accent Sub-headline)"
              value={activeBanner.accent || ""}
              onChange={(e) => updateField("accent", e.target.value)}
              placeholder="e.g. US."
            />
            <Input
              label="শিরোনাম লাইন ২ (হাইলাইট শব্দ)"
              value={activeBanner.accentBn || ""}
              onChange={(e) => updateField("accentBn", e.target.value)}
              placeholder="যেমন: সম্পর্কে।"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
              label="Official Summary Description (English)"
              rows={3}
              value={activeBanner.description || ""}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Enter official English summary..."
            />
            <Textarea
              label="অফিশিয়াল বিবরণ (বাংলা)"
              rows={3}
              value={activeBanner.descriptionBn || ""}
              onChange={(e) => updateField("descriptionBn", e.target.value)}
              placeholder="বাংলা বিবরণ লিখুন..."
            />
          </div>
        </div>

        {/* Section 2: Right Side Visual Media (Only for Visual Split Banners) */}
        {!isCentered && (
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                  2
                </span>
                <div>
                  <H3 className="text-sm font-bold text-slate-900">Right Side Visual Media</H3>
                </div>
              </div>
            </div>

            {/* Drag & Drop Upload Zone - 1 image upload */}
            <DragDropUploadZone
              onFilesSelected={handleFileUpload}
              isUploading={isUploading}
              multiple={false}
              title={
                <>
                  Drag and drop image here, or <span className="text-primary underline">browse</span>
                </>
              }
              subtitle="Upload page banner image (PNG, JPG, JPEG, WEBP). Only 1 image is supported."
              uploadingText="Uploading banner image..."
            />

            {/* Configured Banner Image Card - Home Banner slide design */}
            {activeBanner.imageSrc && (
              <div className="space-y-3 pt-2">
                <H4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Configured Banner Image
                </H4>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-xl border border-slate-200 bg-white p-3.5 hover:border-slate-300 transition-colors">
                  {/* Thumbnail */}
                  <div className="relative aspect-4/3 h-16 w-24 overflow-hidden rounded-lg bg-slate-100 border border-slate-200 shrink-0">
                    <Image
                      src={activeBanner.imageSrc}
                      alt={activeBanner.imageAlt || "Banner image"}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>

                  {/* Alt Text Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1 w-full">
                    <Input
                      label="Image Alt Text"
                      value={activeBanner.imageAlt || ""}
                      onChange={(e) => updateField("imageAlt", e.target.value)}
                      placeholder="e.g. Safe LPG Platform Infrastructure"
                    />
                    <Input
                      label="ছবির বিবরণ (বাংলা)"
                      value={activeBanner.imageAltBn || ""}
                      onChange={(e) => updateField("imageAltBn", e.target.value)}
                      placeholder="যেমন: নিরাপদ এলপিজি প্ল্যাটফর্ম"
                    />
                  </div>

                  {/* Delete Action */}
                  <div className="shrink-0 self-end sm:self-center">
                    <Button
                      type="button"
                      onClick={() => {
                        updateField("imageSrc", "");
                        updateField("imageAlt", "");
                        updateField("imageAltBn", "");
                      }}
                      variant="ghost"
                      size="xs"
                      className="p-2 text-red-500 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                      title="Delete banner image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

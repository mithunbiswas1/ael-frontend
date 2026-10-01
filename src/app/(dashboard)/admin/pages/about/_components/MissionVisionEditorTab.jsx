// src/app/(dashboard)/admin/pages/about/_components/MissionVisionEditorTab.jsx
"use client";

import { useState } from "react";
import { Target, Compass } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { H3, P } from "@/components/ui/Typography";
import SectionHeader from "@/components/ui/SectionHeader";

export default function MissionVisionEditorTab({
  data = {},
  onChange = () => { },
}) {
  const [previewLang, setPreviewLang] = useState("en");
  const isBn = previewLang === "bn";

  const updateField = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  // Preview values - strictly dynamic
  const displayedTag = isBn ? data?.tagBn : data?.tag;
  const displayedTitle = isBn ? data?.titleBn : data?.title;
  const displayedAccent = isBn ? data?.accentBn : data?.accent;
  const displayedSubtitle = isBn ? data?.subtitleBn : data?.subtitle;

  const missionBadge = isBn ? data?.missionBadgeBn : data?.missionBadge;
  const missionHead = isBn ? data?.missionHeadBn : data?.missionHead;
  const missionDesc = isBn ? data?.missionBn : data?.mission;

  const visionBadge = isBn ? data?.visionBadgeBn : data?.visionBadge;
  const visionHead = isBn ? data?.visionHeadBn : data?.visionHead;
  const visionDesc = isBn ? data?.visionBn : data?.vision;

  const hasMission = missionBadge || missionHead || missionDesc;
  const hasVision = visionBadge || visionHead || visionDesc;
  const hasHeader = displayedTag || displayedTitle || displayedAccent || displayedSubtitle;
  const hasContent = hasHeader || hasMission || hasVision;

  return (
    <div className="space-y-8">
      {/* 1. Real-Time Front-Panel Matched Live Storefront Preview */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2">

            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Live Front Panel Storefront Preview (Mission & Vision)
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

        {/* Live Storefront Preview Container */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 sm:p-10">
          {!hasContent ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm font-medium">No Mission & Vision content configured yet.</p>
              <p className="text-xs text-slate-400 mt-1">Fill out the statements in the form below to preview.</p>
            </div>
          ) : (
            <>
              {hasHeader && (
                <SectionHeader
                  align="center"
                  tag={displayedTag || ""}
                  title={displayedTitle || ""}
                  accent={displayedAccent || ""}
                  subtitle={displayedSubtitle || ""}
                />
              )}

              {(hasMission || hasVision) && (
                <div className={`grid grid-cols-1 gap-5 ${hasMission && hasVision ? "md:grid-cols-2" : "max-w-xl mx-auto"} ${hasHeader ? "mt-8" : ""}`}>
                  {/* Mission Card Preview */}
                  {hasMission && (
                    <div className="flex items-start gap-4 rounded-xl border border-slate-200/80 bg-white p-6 transition-colors duration-200">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-primary border border-blue-100">
                        <Target className="h-6 w-6" strokeWidth={2} />
                      </div>
                      <div>
                        {missionBadge && (
                          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                            {missionBadge}
                          </span>
                        )}
                        {missionHead && (
                          <H3 className="mt-0.5 text-base sm:text-lg font-black text-slate-900">
                            {missionHead}
                          </H3>
                        )}
                        {missionDesc && (
                          <P color="muted" size="sm" className="mt-2 leading-relaxed">
                            {missionDesc}
                          </P>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Vision Card Preview */}
                  {hasVision && (
                    <div className="flex items-start gap-4 rounded-xl border border-slate-200/80 bg-white p-6 transition-colors duration-200">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                        <Compass className="h-6 w-6" strokeWidth={2} />
                      </div>
                      <div>
                        {visionBadge && (
                          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                            {visionBadge}
                          </span>
                        )}
                        {visionHead && (
                          <H3 className="mt-0.5 text-base sm:text-lg font-black text-slate-900">
                            {visionHead}
                          </H3>
                        )}
                        {visionDesc && (
                          <P color="muted" size="sm" className="mt-2 leading-relaxed">
                            {visionDesc}
                          </P>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* 2. Form Configuration */}
      <div className="space-y-6">
        {/* Step 1: Section Header */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
              1
            </span>
            <div>
              <H3 className="text-sm font-bold text-slate-900">Section Header & Subtitle</H3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Tag (Small Upper Label)"
              value={data?.tag || ""}
              onChange={(e) => updateField("tag", e.target.value)}
              placeholder="e.g. CORE FOUNDATION"
            />
            <Input
              label="ট্যাগ (বাংলা)"
              value={data?.tagBn || ""}
              onChange={(e) => updateField("tagBn", e.target.value)}
              placeholder="যেমন: মূল ভিত্তি"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Title Line"
              value={data?.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="e.g. MISSION &"
            />
            <Input
              label="শিরোনাম লাইন (বাংলা)"
              value={data?.titleBn || ""}
              onChange={(e) => updateField("titleBn", e.target.value)}
              placeholder="যেমন: লক্ষ্য ও"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Accent Word"
              value={data?.accent || ""}
              onChange={(e) => updateField("accent", e.target.value)}
              placeholder="e.g. VISION."
            />
            <Input
              label="হাইলাইট শব্দ (বাংলা)"
              value={data?.accentBn || ""}
              onChange={(e) => updateField("accentBn", e.target.value)}
              placeholder="যেমন: উদ্দেশ্য।"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
              label="Section Subtitle"
              rows={2}
              value={data?.subtitle || ""}
              onChange={(e) => updateField("subtitle", e.target.value)}
              placeholder="Enter section subtitle..."
            />
            <Textarea
              label="সেকশন সাবটাইটেল (বাংলা)"
              rows={2}
              value={data?.subtitleBn || ""}
              onChange={(e) => updateField("subtitleBn", e.target.value)}
              placeholder="বাংলা সাবটাইটেল লিখুন..."
            />
          </div>
        </div>

        {/* Step 2: Mission Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-primary font-bold text-xs">
              2
            </span>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <div>
                <H3 className="text-sm font-bold text-slate-900">Our Mission Card</H3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Badge Label (Upper small text)"
              value={data?.missionBadge || ""}
              onChange={(e) => updateField("missionBadge", e.target.value)}
              placeholder="e.g. OUR MISSION"
            />
            <Input
              label="ব্যাজ লেবেল (বাংলা)"
              value={data?.missionBadgeBn || ""}
              onChange={(e) => updateField("missionBadgeBn", e.target.value)}
              placeholder="যেমন: আমাদের লক্ষ্য"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Card Heading"
              value={data?.missionHead || ""}
              onChange={(e) => updateField("missionHead", e.target.value)}
              placeholder="e.g. Mission"
            />
            <Input
              label="কার্ডের শিরোনাম (বাংলা)"
              value={data?.missionHeadBn || ""}
              onChange={(e) => updateField("missionHeadBn", e.target.value)}
              placeholder="যেমন: মিশন"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
              label="Mission Statement"
              rows={3}
              value={data?.mission || ""}
              onChange={(e) => updateField("mission", e.target.value)}
              placeholder="Enter mission statement..."
            />
            <Textarea
              label="মিশন বার্তা (বাংলা)"
              rows={3}
              value={data?.missionBn || ""}
              onChange={(e) => updateField("missionBn", e.target.value)}
              placeholder="বাংলা মিশন বার্তা লিখুন..."
            />
          </div>
        </div>

        {/* Step 3: Vision Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 font-bold text-xs">
              3
            </span>
            <div className="flex items-center gap-2">
              <Compass className="h-4 w-4 text-emerald-600" />
              <div>
                <H3 className="text-sm font-bold text-slate-900">Our Vision Card</H3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Badge Label (Upper small text)"
              value={data?.visionBadge || ""}
              onChange={(e) => updateField("visionBadge", e.target.value)}
              placeholder="e.g. OUR VISION"
            />
            <Input
              label="ব্যাজ লেবেল (বাংলা)"
              value={data?.visionBadgeBn || ""}
              onChange={(e) => updateField("visionBadgeBn", e.target.value)}
              placeholder="যেমন: আমাদের ভিশন"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Card Heading"
              value={data?.visionHead || ""}
              onChange={(e) => updateField("visionHead", e.target.value)}
              placeholder="e.g. Vision"
            />
            <Input
              label="কার্ডের শিরোনাম (বাংলা)"
              value={data?.visionHeadBn || ""}
              onChange={(e) => updateField("visionHeadBn", e.target.value)}
              placeholder="যেমন: ভিশন"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
              label="Vision Statement"
              rows={3}
              value={data?.vision || ""}
              onChange={(e) => updateField("vision", e.target.value)}
              placeholder="Enter vision statement..."
            />
            <Textarea
              label="ভিশন বার্তা (বাংলা)"
              rows={3}
              value={data?.visionBn || ""}
              onChange={(e) => updateField("visionBn", e.target.value)}
              placeholder="বাংলা ভিশন বার্তা লিখুন..."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

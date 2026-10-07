// src/app/(dashboard)/admin/pages/about/_components/WhoWeAreEditorTab.jsx
"use client";

import { useState } from "react";
import { ShieldCheck, Users, BookOpen, Handshake, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { H3, H4, P } from "@/components/ui/Typography";
import SectionHeader from "@/components/ui/SectionHeader";

const ICONS = [ShieldCheck, Users, BookOpen, Handshake];

export default function WhoWeAreEditorTab({
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

  const featuresList = data?.features || [];

  const addFeature = () => {
    const updated = [
      {
        title: "",
        titleBn: "",
        desc: "",
        descBn: "",
      },
      ...featuresList,
    ];
    onChange({
      ...data,
      features: updated,
    });
  };

  const removeFeature = (index) => {
    const updated = featuresList.filter((_, i) => i !== index);
    onChange({
      ...data,
      features: updated,
    });
  };

  const updateFeature = (index, field, value) => {
    const updated = [...featuresList];
    if (!updated[index]) {
      updated[index] = {};
    }
    updated[index] = {
      ...updated[index],
      [field]: value,
    };
    onChange({
      ...data,
      features: updated,
    });
  };

  // Preview values - strictly dynamic
  const displayedTag = isBn ? data?.tagBn : data?.tag;
  const displayedTitle = isBn ? data?.titleBn : data?.title;
  const displayedAccent = isBn ? data?.accentBn : data?.accent;
  const displayedLead = isBn ? data?.leadTextBn : data?.leadText;
  const displayedNarrative = isBn ? data?.paragraphsBn : data?.paragraphs;

  const hasContent =
    displayedTag ||
    displayedTitle ||
    displayedAccent ||
    displayedLead ||
    displayedNarrative ||
    featuresList.length > 0;

  return (
    <div className="space-y-8">
      {/* 1. Real-Time Front-Panel Matched Live Storefront Preview */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2">

            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Live Front Panel Storefront Preview (Who We Are / LPG Safety)
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

        {/* Live Storefront Component Preview Container */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 sm:p-10">
          {!hasContent ? (
            <div className="py-12 text-center text-slate-400">
              <p className="text-sm font-medium">No Who We Are content configured yet.</p>
              <p className="text-xs text-slate-400 mt-1">Enter headline and details in the form below to preview.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
              {/* Left Content */}
              <div className="lg:col-span-6">
                {(displayedTag || displayedTitle || displayedAccent) && (
                  <SectionHeader
                    tag={displayedTag || ""}
                    title={displayedTitle || ""}
                    accent={displayedAccent || ""}
                  />
                )}

                <div className="mt-5 space-y-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {displayedLead && (
                    <P color="muted" size="sm">
                      {displayedLead}
                    </P>
                  )}
                  {displayedNarrative && (
                    <P color="muted" size="sm">
                      {displayedNarrative}
                    </P>
                  )}
                </div>
              </div>

              {/* Right 2x2 Feature Grid */}
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:col-span-6">
                {featuresList.map((item, idx) => {
                  const Icon = ICONS[idx % ICONS.length] || ShieldCheck;
                  const title = (isBn ? item.titleBn : item.title) || item.title || "";
                  const desc = (isBn ? item.descBn : item.desc) || item.desc || "";

                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-5 transition-colors duration-200"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                        <Icon className="h-5 w-5" strokeWidth={2.2} />
                      </div>
                      {title && (
                        <H4 className="mt-3 text-sm font-bold text-slate-900">
                          {title}
                        </H4>
                      )}
                      {desc && (
                        <P color="muted" size="xs" className="mt-1.5 leading-relaxed line-clamp-3">
                          {desc}
                        </P>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Form Configuration */}
      <div className="space-y-6">
        {/* Step 1: Section Header & Lead Narrative */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
              1
            </span>
            <div>
              <H3 className="text-sm font-bold text-slate-900">Section Header & Overview Narrative</H3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Tag (Small Upper Label)"
              value={data?.tag || ""}
              onChange={(e) => updateField("tag", e.target.value)}
              placeholder="e.g. WHO WE ARE"
            />
            <Input
              label="ট্যাগ"
              value={data?.tagBn || ""}
              onChange={(e) => updateField("tagBn", e.target.value)}
              placeholder="যেমন: আমরা কারা"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Main Headline"
              value={data?.title || ""}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="e.g. DEDICATED TO"
            />
            <Input
              label="প্রধান শিরোনাম"
              value={data?.titleBn || ""}
              onChange={(e) => updateField("titleBn", e.target.value)}
              placeholder="যেমন: নিবেদিত"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Headline Accent Word"
              value={data?.accent || ""}
              onChange={(e) => updateField("accent", e.target.value)}
              placeholder="e.g. LPG SAFETY."
            />
            <Input
              label="হাইলাইট শব্দ"
              value={data?.accentBn || ""}
              onChange={(e) => updateField("accentBn", e.target.value)}
              placeholder="যেমন: এলপিজি নিরাপত্তায়।"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
              label="Lead Introductory Text"
              rows={3}
              value={data?.leadText || ""}
              onChange={(e) => updateField("leadText", e.target.value)}
              placeholder="Enter lead introductory text..."
            />
            <Textarea
              label="সূচনা টেক্সট"
              rows={3}
              value={data?.leadTextBn || ""}
              onChange={(e) => updateField("leadTextBn", e.target.value)}
              placeholder="বাংলা সূচনা টেক্সট লিখুন..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
              label="Detailed Secondary Narrative"
              rows={3}
              value={data?.paragraphs || ""}
              onChange={(e) => updateField("paragraphs", e.target.value)}
              placeholder="Enter detailed narrative text..."
            />
            <Textarea
              label="বিস্তারিত বিবরণ"
              rows={3}
              value={data?.paragraphsBn || ""}
              onChange={(e) => updateField("paragraphsBn", e.target.value)}
              placeholder="বাংলা বিস্তারিত বিবরণ লিখুন..."
            />
          </div>
        </div>

        {/* Step 2: Feature Cards */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                2
              </span>
              <div>
                <H3 className="text-sm font-bold text-slate-900">Feature Pillar Cards ({featuresList.length})</H3>
              </div>
            </div>

            <Button
              type="button"
              onClick={addFeature}
              size="sm"
              className="gap-1.5 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Feature Card</span>
            </Button>
          </div>

          {featuresList.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <p className="text-xs text-slate-500">No feature cards added yet.</p>
              <Button
                type="button"
                onClick={addFeature}
                variant="outline"
                size="xs"
                className="mt-2.5 cursor-pointer"
              >
                <Plus className="h-3 w-3 mr-1" /> Add First Feature Card
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {featuresList.map((feature, idx) => {
                const Icon = ICONS[idx % ICONS.length] || ShieldCheck;
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200 bg-slate-50/50 p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-bold text-slate-800">
                          Feature Card {idx + 1}
                        </span>
                      </div>

                      <Button
                        type="button"
                        onClick={() => removeFeature(idx)}
                        variant="ghost"
                        size="xs"
                        className="text-red-500 hover:bg-red-50 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span className="ml-1 text-xs">Remove</span>
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Input
                        label="Card Title"
                        value={feature.title || ""}
                        onChange={(e) => updateFeature(idx, "title", e.target.value)}
                        placeholder="e.g. Safety First"
                      />
                      <Input
                        label="কার্ডের শিরোনাম"
                        value={feature.titleBn || ""}
                        onChange={(e) => updateFeature(idx, "titleBn", e.target.value)}
                        placeholder="যেমন: নিরাপত্তা সবার আগে"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Textarea
                        label="Card Description"
                        rows={2}
                        value={feature.desc || ""}
                        onChange={(e) => updateFeature(idx, "desc", e.target.value)}
                        placeholder="Card description in English..."
                      />
                      <Textarea
                        label="কার্ডের বিবরণ"
                        rows={2}
                        value={feature.descBn || ""}
                        onChange={(e) => updateFeature(idx, "descBn", e.target.value)}
                        placeholder="কার্ডের বিবরণ বাংলায়..."
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

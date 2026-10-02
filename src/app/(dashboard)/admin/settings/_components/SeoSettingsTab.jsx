// src/app/(dashboard)/admin/settings/_components/SeoSettingsTab.jsx
"use client";

import { Save, Search, Globe } from "lucide-react";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function SeoSettingsTab({
  formData,
  setFormData,
  onSave,
  isUpdating,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const previewTitle =
    formData.seoTitle ||
    formData.siteName ||
    "Safe LPG Bangladesh | National Safety & Awareness Portal";
  const previewDesc =
    formData.seoDescription ||
    "Official national portal for LPG safety awareness, technical guidelines, certified courses, and regulatory directives.";

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs space-y-7">
      {/* Header */}
      <div>
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Search className="h-4 w-4 text-primary" />
          <span>SEO Defaults & Search Engine Metadata</span>
        </h4>
        <p className="text-xs text-slate-500 mt-0.5">
          Global fallback meta tags for search engine bots, OpenGraph link shares, and browser titles.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Global SEO Title *
          </label>
          <Input
            name="seoTitle"
            value={formData.seoTitle || ""}
            onChange={handleChange}
            placeholder="Safe LPG Bangladesh | National Safety & Awareness Portal"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Global Meta Description *
          </label>
          <textarea
            rows={3}
            name="seoDescription"
            value={formData.seoDescription || ""}
            onChange={handleChange}
            placeholder="Write official meta description for search engines..."
            className="w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm text-slate-800 outline-hidden focus:border-primary leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Search Keywords (Comma-separated)
            </label>
            <Input
              name="seoKeywords"
              value={formData.seoKeywords || ""}
              onChange={handleChange}
              placeholder="LPG safety, Bangladesh, cylinder, BERC, LOAB"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Meta Author / Publisher
            </label>
            <Input
              name="metaAuthor"
              value={formData.metaAuthor || ""}
              onChange={handleChange}
              placeholder="Safe LPG Bangladesh"
            />
          </div>
        </div>
      </div>

      {/* Google SERP Snippet Preview */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 space-y-2">
        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
          <Globe className="h-3.5 w-3.5 text-blue-500" />
          <span>Google Search Result Snippet Preview</span>
        </span>
        <div className="rounded-lg bg-white border border-slate-200/80 p-3.5 shadow-2xs max-w-xl space-y-1">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="font-medium text-slate-700">https://safelpg.com</span>
            <span>›</span>
          </div>
          <h5 className="text-sm font-semibold text-blue-800 hover:underline cursor-pointer truncate">
            {previewTitle}
          </h5>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {previewDesc}
          </p>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <Button
          type="button"
          variant="primary"
          size="default"
          onClick={onSave}
          isLoading={isUpdating}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          <span>Save SEO Settings</span>
        </Button>
      </div>
    </div>
  );
}

// src/app/(dashboard)/admin/settings/_components/SeoSettingsTab.jsx
"use client";

import { Save, Search } from "lucide-react";
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

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs space-y-5">
      <div>
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Search className="h-4 w-4 text-primary" />
          <span>SEO Defaults & Search Engine Metadata</span>
        </h4>
        <p className="text-xs text-slate-500 mt-0.5">
          Global fallback meta tags for search indexers and social link previews.
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
            rows={4}
            name="seoDescription"
            value={formData.seoDescription || ""}
            onChange={handleChange}
            placeholder="Write official meta description for search engines..."
            className="w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm text-slate-800 outline-hidden focus:border-primary leading-relaxed"
          />
        </div>
      </div>

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

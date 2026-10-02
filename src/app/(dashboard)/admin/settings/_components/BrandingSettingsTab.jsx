// src/app/(dashboard)/admin/settings/_components/BrandingSettingsTab.jsx
"use client";

import { useRef } from "react";
import Image from "next/image";
import { Save, UploadCloud, X, Image as ImageIcon, Sparkles } from "lucide-react";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function BrandingSettingsTab({
  formData,
  setFormData,
  logoFiles,
  setLogoFiles,
  previewUrls,
  setPreviewUrls,
  onSave,
  isUpdating,
}) {
  const siteLogoInputRef = useRef(null);
  const footerLogoInputRef = useRef(null);
  const faviconInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (field, e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFiles((prev) => ({ ...prev, [field]: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls((prev) => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveSelectedFile = (field, inputRef) => {
    setLogoFiles((prev) => ({ ...prev, [field]: null }));
    setPreviewUrls((prev) => ({ ...prev, [field]: null }));
    if (inputRef.current) inputRef.current.value = "";
  };

  const resolveImageSrc = (field, fallback) => {
    if (previewUrls[field]) return previewUrls[field];
    const val = formData[field];
    if (!val) return fallback;
    if (val.startsWith("http://") || val.startsWith("https://") || val.startsWith("data:")) {
      return val;
    }
    if (val.startsWith("/public/upload")) {
      const base =
        process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") ||
        "http://localhost:8005";
      return `${base}${val}`;
    }
    return val;
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs space-y-7">
      {/* Header */}
      <div>
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>Brand Identity & Visual Assets</span>
        </h4>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure official portal name, slogans, main logos, favicon, and copyright declarations.
        </p>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Site / Platform Title *
          </label>
          <Input
            name="siteName"
            value={formData.siteName || ""}
            onChange={handleChange}
            placeholder="e.g. AEL SafeLPG Bangladesh"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Tagline / Sub-heading
          </label>
          <Input
            name="tagline"
            value={formData.tagline || ""}
            onChange={handleChange}
            placeholder="e.g. National LPG Safety & Awareness Portal"
          />
        </div>
      </div>

      {/* Visual Media / Logo Uploaders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
        {/* 1. Main Header Logo */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ImageIcon className="h-3.5 w-3.5 text-primary" />
                Primary Site Logo
              </span>
              <span className="text-[10px] font-semibold text-slate-400">Header</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Recommended: Transparent PNG or SVG (height ~40-50px)
            </p>
          </div>

          <div className="h-24 w-full rounded-lg bg-white border border-slate-200/80 flex items-center justify-center p-2 relative overflow-hidden group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resolveImageSrc("siteLogo", "/safe_lpg_2.png")}
              alt="Site Logo Preview"
              className="max-h-16 max-w-full object-contain"
            />
            {previewUrls.siteLogo && (
              <button
                type="button"
                onClick={() => handleRemoveSelectedFile("siteLogo", siteLogoInputRef)}
                className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors shadow-xs"
                title="Remove uploaded file"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <div>
            <input
              type="file"
              ref={siteLogoInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileSelect("siteLogo", e)}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full text-xs font-semibold gap-1.5"
              onClick={() => siteLogoInputRef.current?.click()}
            >
              <UploadCloud className="h-3.5 w-3.5" />
              <span>{previewUrls.siteLogo ? "Change Logo" : "Upload Logo"}</span>
            </Button>
          </div>
        </div>

        {/* 2. Footer Logo */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ImageIcon className="h-3.5 w-3.5 text-slate-700" />
                Footer Brand Logo
              </span>
              <span className="text-[10px] font-semibold text-slate-400">Footer</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Logo displayed in dark / light footer section.
            </p>
          </div>

          <div className="h-24 w-full rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center p-2 relative overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resolveImageSrc("footerLogo", "/safe_lpg_2.png")}
              alt="Footer Logo Preview"
              className="max-h-16 max-w-full object-contain"
            />
            {previewUrls.footerLogo && (
              <button
                type="button"
                onClick={() => handleRemoveSelectedFile("footerLogo", footerLogoInputRef)}
                className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors shadow-xs"
                title="Remove uploaded file"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <div>
            <input
              type="file"
              ref={footerLogoInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileSelect("footerLogo", e)}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full text-xs font-semibold gap-1.5"
              onClick={() => footerLogoInputRef.current?.click()}
            >
              <UploadCloud className="h-3.5 w-3.5" />
              <span>{previewUrls.footerLogo ? "Change Logo" : "Upload Logo"}</span>
            </Button>
          </div>
        </div>

        {/* 3. Favicon */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ImageIcon className="h-3.5 w-3.5 text-amber-500" />
                Browser Favicon
              </span>
              <span className="text-[10px] font-semibold text-slate-400">Tab Icon</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Square icon (32x32px or 64x64px .ico / .png)
            </p>
          </div>

          <div className="h-24 w-full rounded-lg bg-white border border-slate-200/80 flex items-center justify-center p-2 relative overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resolveImageSrc("favicon", "/favicon.ico")}
              alt="Favicon Preview"
              className="h-10 w-10 object-contain rounded"
            />
            {previewUrls.favicon && (
              <button
                type="button"
                onClick={() => handleRemoveSelectedFile("favicon", faviconInputRef)}
                className="absolute top-1 right-1 p-1 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors shadow-xs"
                title="Remove uploaded file"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          <div>
            <input
              type="file"
              ref={faviconInputRef}
              accept="image/*,.ico"
              className="hidden"
              onChange={(e) => handleFileSelect("favicon", e)}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full text-xs font-semibold gap-1.5"
              onClick={() => faviconInputRef.current?.click()}
            >
              <UploadCloud className="h-3.5 w-3.5" />
              <span>{previewUrls.favicon ? "Change Favicon" : "Upload Favicon"}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer Text & Declarations */}
      <div className="space-y-4 pt-2">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Copyright Declaration Notice
          </label>
          <Input
            name="copyrightText"
            value={formData.copyrightText || ""}
            onChange={handleChange}
            placeholder="e.g. All rights reserved. Powered by Safe LPG Bangladesh."
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Footer Organization Summary / About
          </label>
          <textarea
            rows={3}
            name="footerAbout"
            value={formData.footerAbout || ""}
            onChange={handleChange}
            placeholder="Short introductory summary about the portal shown in the footer..."
            className="w-full rounded-xl border border-slate-200 p-3 text-xs sm:text-sm text-slate-800 outline-hidden focus:border-primary leading-relaxed"
          />
        </div>
      </div>

      {/* Bottom Save Action */}
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
          <span>Save Brand Settings</span>
        </Button>
      </div>
    </div>
  );
}

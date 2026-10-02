// src/app/(dashboard)/admin/market-updates/_components/MarketUpdateForm.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
  Trash2,
  FileText,
  CheckCircle2,
  FileDown,
  Upload,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import RichTextEditor from "@/components/ui/RichTextEditor";
import DragDropUploadZone from "@/app/(dashboard)/_components/DragDropUploadZone";
import { useUploadPageImageMutation } from "@/redux/api/pageApi";
import {
  useCreateMarketUpdateMutation,
  useUpdateMarketUpdateMutation,
} from "@/redux/api/marketUpdateApi";

export const MARKET_UPDATE_CATEGORIES = [
  { id: "incidents", labelEn: "Incidents & Probe Reports", labelBn: "দুর্ঘটনা ও তদন্ত প্রতিবেদন" },
  { id: "berc", labelEn: "Message from BERC & Pricing", labelBn: "বিইআরসি বার্তা ও মূল্য সার্কুলার" },
  { id: "global", labelEn: "Global Market & Trends", labelBn: "বৈশ্বিক মার্কেট আপডেট ও ট্রেন্ড" },
];

export default function MarketUpdateForm({ initialData = null, isEdit = false }) {
  const router = useRouter();
  const [uploadFile, { isLoading: isUploadingFile }] = useUploadPageImageMutation();
  const [createUpdate, { isLoading: isCreating }] = useCreateMarketUpdateMutation();
  const [updateUpdate, { isLoading: isUpdating }] = useUpdateMarketUpdateMutation();

  const isSaving = isCreating || isUpdating;

  const [formData, setFormData] = useState({
    titleEn: "",
    titleBn: "",
    slug: "",
    category: "incidents",
    categoryBn: "দুর্ঘটনা ও তদন্ত প্রতিবেদন",
    summaryEn: "",
    summaryBn: "",
    contentEn: "",
    contentBn: "",
    image: "",
    pdfUrl: "",
    pdfOriginalName: "",
    pdfSize: 0,
    authorEn: "Safe LPG Research & Intelligence",
    authorBn: "সেইফ এলপিজি রিসার্চ অ্যান্ড ইন্টেলিজেন্স",
    publishDate: new Date().toISOString().split("T")[0],
    isPublished: true,
    accessType: "free",
    isFeatured: false,
    tags: "lpg, market-update, gazette",
    metaTitle: "",
    metaTitleBn: "",
    metaDescription: "",
    metaDescriptionBn: "",
    metaKeywords: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        titleEn: initialData.titleEn || "",
        titleBn: initialData.titleBn || "",
        slug: initialData.slug || "",
        category: initialData.category || "incidents",
        categoryBn: initialData.categoryBn || "দুর্ঘটনা ও তদন্ত প্রতিবেদন",
        summaryEn: initialData.summaryEn || "",
        summaryBn: initialData.summaryBn || "",
        contentEn: initialData.contentEn || "",
        contentBn: initialData.contentBn || "",
        image: initialData.image || "",
        pdfUrl: initialData.pdfUrl || "",
        pdfOriginalName: initialData.pdfOriginalName || "",
        pdfSize: initialData.pdfSize || 0,
        authorEn: initialData.authorEn || "Safe LPG Research & Intelligence",
        authorBn: initialData.authorBn || "সেইফ এলপিজি রিসার্চ অ্যান্ড ইন্টেলিজেন্স",
        publishDate: initialData.publishDate
          ? new Date(initialData.publishDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        isPublished: initialData.isPublished !== false,
        accessType: initialData.accessType || "free",
        isFeatured: Boolean(initialData.isFeatured),
        tags: Array.isArray(initialData.tags)
          ? initialData.tags.join(", ")
          : initialData.tags || "",
        metaTitle: initialData.metaTitle || "",
        metaTitleBn: initialData.metaTitleBn || "",
        metaDescription: initialData.metaDescription || "",
        metaDescriptionBn: initialData.metaDescriptionBn || "",
        metaKeywords: initialData.metaKeywords || "",
      });
    }
  }, [initialData]);

  const handleTitleEnChange = (e) => {
    const val = e.target.value;
    if (!isEdit && (!formData.slug || formData.slug === slugify(formData.titleEn))) {
      setFormData((prev) => ({
        ...prev,
        titleEn: val,
        slug: slugify(val),
      }));
    } else {
      setFormData((prev) => ({ ...prev, titleEn: val }));
    }
  };

  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleCategoryChange = (e) => {
    const catId = e.target.value;
    const cat = MARKET_UPDATE_CATEGORIES.find((c) => c.id === catId);
    setFormData((prev) => ({
      ...prev,
      category: catId,
      categoryBn: cat ? cat.labelBn : prev.categoryBn,
    }));
  };

  // Image Upload handler
  const handleImageUpload = async (files) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please drop an image file (PNG, JPG, WEBP)");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("images", file);

    try {
      const res = await uploadFile(uploadData).unwrap();
      const uploadedItem = Array.isArray(res?.data) ? res.data[0] : res?.data;
      const uploadedUrl =
        uploadedItem?.image ||
        uploadedItem?.url ||
        (typeof uploadedItem === "string" ? uploadedItem : null);

      if (uploadedUrl) {
        setFormData((prev) => ({ ...prev, image: uploadedUrl }));
        toast.success("Featured image uploaded successfully");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to upload image");
    }
  };

  // PDF Upload handler
  const handlePdfUpload = async (files) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      toast.error("Please upload a valid PDF document (.pdf)");
      return;
    }

    const uploadData = new FormData();
    uploadData.append("images", file);

    try {
      const res = await uploadFile(uploadData).unwrap();
      const uploadedItem = Array.isArray(res?.data) ? res.data[0] : res?.data;
      const uploadedUrl =
        uploadedItem?.image ||
        uploadedItem?.url ||
        (typeof uploadedItem === "string" ? uploadedItem : null);

      if (uploadedUrl) {
        setFormData((prev) => ({
          ...prev,
          pdfUrl: uploadedUrl,
          pdfOriginalName: file.name,
          pdfSize: file.size,
        }));
        toast.success(`PDF "${file.name}" uploaded successfully`);
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to upload PDF document");
    }
  };

  const handleRemovePdf = () => {
    setFormData((prev) => ({
      ...prev,
      pdfUrl: "",
      pdfOriginalName: "",
      pdfSize: 0,
    }));
    toast.info("Attached PDF removed");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.titleEn.trim()) {
      toast.error("English article title is mandatory");
      return;
    }
    if (!formData.titleBn.trim()) {
      toast.error("Bengali article title is mandatory");
      return;
    }
    if (!formData.summaryEn.trim() || !formData.summaryBn.trim()) {
      toast.error("Summaries are required in both languages");
      return;
    }

    const payload = {
      ...formData,
      slug: slugify(formData.slug || formData.titleEn),
    };

    try {
      if (isEdit && initialData?._id) {
        await updateUpdate({
          id: initialData._id,
          data: payload,
        }).unwrap();
        toast.success("Market update modified successfully!");
      } else {
        await createUpdate(payload).unwrap();
        toast.success("Market update published successfully!");
      }
      router.push("/admin/market-updates");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save market update");
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 KB";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/market-updates"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {isEdit ? "Edit Market Update" : "New Market Update"}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Publish incidents, official BERC circulars, price gazettes, and global trends
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <LinkButton href="/admin/market-updates" variant="outline" size="sm">
            Cancel
          </LinkButton>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isSaving}
            icon={Save}
          >
            {isEdit ? "Update Article" : "Publish Article"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Main Bilingual Content (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Article Titles */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4 shadow-xs">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span>Article Title & Identifier</span>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Article Title <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={formData.titleEn}
                  onChange={handleTitleEnChange}
                  placeholder="e.g. Chattogram Port LPG Terminal Safety Probe & Incident Analysis Report"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  প্রবন্ধের শিরোনাম <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={formData.titleBn}
                  onChange={(e) => setFormData((p) => ({ ...p, titleBn: e.target.value }))}
                  placeholder="যেমন: চট্টগ্রাম বন্দর এলপিজি টার্মিনাল নিরাপত্তা তদন্ত ও দুর্ঘটনা বিশ্লেষণ প্রতিবেদন"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  URL Slug
                </label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData((p) => ({ ...p, slug: e.target.value }))}
                  placeholder="chattogram-port-lpg-safety-probe"
                />
                <span className="text-[11px] text-slate-400 mt-1 block font-mono">
                  /market-updates/{formData.slug || "slug-placeholder"}
                </span>
              </div>
            </div>
          </div>

          {/* Excerpts / Summaries */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4 shadow-xs">
            <h2 className="text-sm font-bold text-slate-800">Brief Summary</h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Summary <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={formData.summaryEn}
                onChange={(e) => setFormData((p) => ({ ...p, summaryEn: e.target.value }))}
                rows={3}
                placeholder="Key highlights and regulatory telemetry for preview cards..."
                className="w-full rounded-lg border border-slate-200 p-3 text-xs text-slate-800 focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary/20"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                সংক্ষিপ্ত বিবরণী <span className="text-rose-500">*</span>
              </label>
              <textarea
                value={formData.summaryBn}
                onChange={(e) => setFormData((p) => ({ ...p, summaryBn: e.target.value }))}
                rows={3}
                placeholder="প্রিভিউ কার্ডের জন্য গুরুত্বপূর্ণ সারসংক্ষেপ..."
                className="w-full rounded-lg border border-slate-200 p-3 text-xs text-slate-800 focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary/20"
                required
              />
            </div>
          </div>

          {/* Detailed Content (RichTextEditor) */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 space-y-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-800">Detailed Article Content</h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Article Content
              </label>
              <RichTextEditor
                value={formData.contentEn}
                onChange={(val) => setFormData((p) => ({ ...p, contentEn: val }))}
                placeholder="Write the comprehensive report and technical telemetry in English..."
                minHeight={500}
              />
            </div>

            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                বিস্তারিত প্রবন্ধের বিষয়বস্তু
              </label>
              <RichTextEditor
                value={formData.contentBn}
                onChange={(val) => setFormData((p) => ({ ...p, contentBn: val }))}
                placeholder="বাংলা ভাষায় সম্পূর্ণ তদন্ত ও কারিগরি পর্যালোচনা লিখুন..."
                minHeight={500}
              />
            </div>
          </div>

          {/* SEO Metadata */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6 space-y-4 shadow-xs">
            <h2 className="text-sm font-bold text-slate-800">Search Engine Optimization (SEO)</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Meta Title
                </label>
                <Input
                  value={formData.metaTitle}
                  onChange={(e) => setFormData((p) => ({ ...p, metaTitle: e.target.value }))}
                  placeholder="Official SEO Title"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  মেটা শিরোনাম
                </label>
                <Input
                  value={formData.metaTitleBn}
                  onChange={(e) => setFormData((p) => ({ ...p, metaTitleBn: e.target.value }))}
                  placeholder="বাংলা এসইও শিরোনাম"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Meta Description
                </label>
                <textarea
                  value={formData.metaDescription}
                  onChange={(e) => setFormData((p) => ({ ...p, metaDescription: e.target.value }))}
                  rows={2}
                  placeholder="Search engine summary..."
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-primary focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  মেটা বিবরণ
                </label>
                <textarea
                  value={formData.metaDescriptionBn}
                  onChange={(e) => setFormData((p) => ({ ...p, metaDescriptionBn: e.target.value }))}
                  rows={2}
                  placeholder="বাংলা সার্চ ইঞ্জিন বিবরণ..."
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-primary focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Meta Keywords
              </label>
              <Input
                value={formData.metaKeywords}
                onChange={(e) => setFormData((p) => ({ ...p, metaKeywords: e.target.value }))}
                placeholder="lpg, berc, circular, probe report, gazette"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Settings, Images & PDF Attachment (1 Col) */}
        <div className="space-y-6">
          {/* Publication Status & Category */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
            <h2 className="text-sm font-bold text-slate-800">Article Classification</h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Category <span className="text-rose-500">*</span>
              </label>
              <Select
                value={formData.category}
                onChange={handleCategoryChange}
                options={MARKET_UPDATE_CATEGORIES.map((cat) => ({
                  value: cat.id,
                  label: `${cat.labelEn} (${cat.labelBn})`,
                }))}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Publication Date
              </label>
              <Input
                type="date"
                value={formData.publishDate}
                onChange={(e) => setFormData((p) => ({ ...p, publishDate: e.target.value }))}
              />
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-3">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData((p) => ({ ...p, isPublished: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <span className="text-xs font-semibold text-slate-700">
                  Publish Immediately (পাবলিশ করুন)
                </span>
              </label>

              {/* Access Type: Free vs Paid */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  Content Access Type / অ্যাক্সেস ধরন *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, accessType: "free" }))}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      formData.accessType === "free"
                        ? "border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                      <span>Free (উন্মুক্ত)</span>
                      {formData.accessType === "free" && (
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">Open to all public visitors</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, accessType: "paid" }))}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      formData.accessType === "paid"
                        ? "border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                      <span>Paid (সাবস্ক্রাইবার)</span>
                      {formData.accessType === "paid" && (
                        <span className="h-2 w-2 rounded-full bg-amber-500" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-0.5">Subscribers & Admins only</p>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* PDF Attachment Uploader (Key Requirement) */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <FileDown className="h-4 w-4 text-rose-500" />
                <span>PDF Document Attachment</span>
              </h2>
              {formData.pdfUrl && (
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">
                  <CheckCircle2 className="h-3 w-3" /> Attached
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Upload statutory gazettes, inquiry reports, or price sheets (PDF up to 10MB).
            </p>

            {formData.pdfUrl ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-600 text-white font-black text-xs shadow-xs">
                      PDF
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {formData.pdfOriginalName || "Attached Official Document.pdf"}
                      </p>
                      {formData.pdfSize > 0 && (
                        <p className="text-[11px] text-slate-500">
                          {formatFileSize(formData.pdfSize)}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="danger-ghost"
                    size="icon-sm"
                    onClick={handleRemovePdf}
                    title="Remove attached PDF"
                    icon={Trash2}
                  />
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-rose-100">
                  <a
                    href={formData.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 hover:text-rose-800 hover:underline"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>View / Test Attached PDF</span>
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <DragDropUploadZone
                  onFilesSelected={handlePdfUpload}
                  isUploading={isUploadingFile}
                  multiple={false}
                  accept="application/pdf"
                  title="Upload Official PDF"
                  subtitle="Drop circular PDF or click to browse"
                  uploadingText="Uploading PDF document..."
                  icon={Upload}
                />

                <div className="pt-2">
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                    Or direct PDF URL:
                  </label>
                  <Input
                    value={formData.pdfUrl}
                    onChange={(e) => setFormData((p) => ({ ...p, pdfUrl: e.target.value }))}
                    placeholder="https://example.com/circular.pdf"
                    className="text-xs"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Featured Image Uploader */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
            <h2 className="text-sm font-bold text-slate-800">Featured Image</h2>

            {formData.image ? (
              <div className="relative aspect-16/10 w-full overflow-hidden rounded-lg border border-slate-200 group">
                <Image
                  src={formData.image}
                  alt="Featured banner"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/default_image.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, image: "" }))}
                    className="rounded-lg bg-rose-600 p-2 text-white hover:bg-rose-700 transition-colors shadow-xs"
                    title="Remove image"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <DragDropUploadZone
                onFilesSelected={handleImageUpload}
                isUploading={isUploadingFile}
                multiple={false}
                title="Drop image here"
                subtitle="PNG, JPG, WEBP up to 5MB"
              />
            )}

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Or direct image URL:
              </label>
              <Input
                value={formData.image}
                onChange={(e) => setFormData((p) => ({ ...p, image: e.target.value }))}
                placeholder="https://images.unsplash.com/..."
                className="text-xs"
              />
            </div>
          </div>

          {/* Author Attribution */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-xs">
            <h2 className="text-sm font-bold text-slate-800">Author Attribution</h2>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Author
              </label>
              <Input
                value={formData.authorEn}
                onChange={(e) => setFormData((p) => ({ ...p, authorEn: e.target.value }))}
                placeholder="Safe LPG Research & Intelligence"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                লেখক
              </label>
              <Input
                value={formData.authorBn}
                onChange={(e) => setFormData((p) => ({ ...p, authorBn: e.target.value }))}
                placeholder="সেইফ এলপিজি রিসার্চ অ্যান্ড ইন্টেলিজেন্স"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tags
              </label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData((p) => ({ ...p, tags: e.target.value }))}
                placeholder="lpg, safety, pricing, circular"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

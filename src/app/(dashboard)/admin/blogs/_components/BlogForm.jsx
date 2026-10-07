// src/app/(dashboard)/admin/blogs/_components/BlogForm.jsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
  Trash2,
  Globe,
  FileText,
  User,
  Clock,
  Tag,
  CheckCircle2,
  Plus,
  Search,
  HelpCircle,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { Input } from "@/components/ui/Input";
import SlugInput, { slugify } from "@/components/ui/SlugInput";
import { Select } from "@/components/ui/Select";
import RichTextEditor from "@/components/ui/RichTextEditor";
import DragDropUploadZone from "@/app/(dashboard)/_components/DragDropUploadZone";
import { useUploadPageImageMutation } from "@/redux/api/pageApi";
import {
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useGetBlogCategoriesQuery,
} from "@/redux/api/blogApi";
import CreateCategoryModal from "./CreateCategoryModal";

export const BLOG_CATEGORIES = [
  { id: "seminar", labelEn: "Seminar", labelBn: "সেমিনার" },
  {
    id: "programs_of_association",
    labelEn: "Programs of Association",
    labelBn: "অ্যাসোসিয়েশনের কার্যক্রম",
  },
  {
    id: "safety_guidelines",
    labelEn: "Safety Guidelines",
    labelBn: "নিরাপত্তা নির্দেশিকা",
  },
];

export default function BlogForm({ initialData = null, isEdit = false }) {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const [uploadImage, { isLoading: isUploadingImage }] = useUploadPageImageMutation();
  const [createBlog, { isLoading: isCreating }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();

  const isSaving = isCreating || isUpdating;

  const currentUserName = user?.fullName || user?.userName || user?.name || "Admin";
  const authorDisplayName = isEdit && initialData?.authorEn ? initialData.authorEn : currentUserName;
  const authorDisplayBn = isEdit && initialData?.authorBn ? initialData.authorBn : authorDisplayName;

  const [formData, setFormData] = useState({
    titleEn: "",
    titleBn: "",
    slug: "",
    descriptionEn: "",
    descriptionBn: "",
    shortDescriptionEn: "",
    shortDescriptionBn: "",
    contentEn: "",
    contentBn: "",
    category: "seminar",
    categoryBn: "সেমিনার",
    image: "",
    authorEn: authorDisplayName,
    authorBn: authorDisplayBn,
    readTimeEn: "5 min read",
    readTimeBn: "৫ মিনিট পাঠ",
    tags: "lpg, safety, regulations",
    isPublished: true,
    accessType: "free",
    metaTitle: "",
    metaTitleBn: "",
    metaDescription: "",
    metaDescriptionBn: "",
    metaKeywords: "",
    canonicalUrl: "",
    ogImage: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        titleEn: initialData.titleEn || "",
        titleBn: initialData.titleBn || "",
        slug: initialData.slug || "",
        descriptionEn: initialData.descriptionEn || "",
        descriptionBn: initialData.descriptionBn || "",
        shortDescriptionEn: initialData.shortDescriptionEn || "",
        shortDescriptionBn: initialData.shortDescriptionBn || "",
        contentEn: initialData.contentEn || "",
        contentBn: initialData.contentBn || "",
        category: initialData.category || "seminar",
        categoryBn: initialData.categoryBn || "সেমিনার",
        image: initialData.image || "",
        authorEn: initialData.authorEn || authorDisplayName,
        authorBn: initialData.authorBn || authorDisplayBn,
        readTimeEn: initialData.readTimeEn || "5 min read",
        readTimeBn: initialData.readTimeBn || "৫ মিনিট পাঠ",
        tags: Array.isArray(initialData.tags)
          ? initialData.tags.join(", ")
          : (initialData.tags || "lpg, safety"),
        isPublished: initialData.isPublished !== undefined ? initialData.isPublished : true,
        accessType: initialData.accessType || "free",
        metaTitle: initialData.metaTitle || "",
        metaTitleBn: initialData.metaTitleBn || "",
        metaDescription: initialData.metaDescription || "",
        metaDescriptionBn: initialData.metaDescriptionBn || "",
        metaKeywords: initialData.metaKeywords || "",
        canonicalUrl: initialData.canonicalUrl || "",
        ogImage: initialData.ogImage || "",
      });
    } else if (user) {
      setFormData((prev) => ({
        ...prev,
        authorEn: currentUserName,
        authorBn: currentUserName,
      }));
    }
  }, [initialData, user, currentUserName, authorDisplayName, authorDisplayBn]);

  const stripHtml = (html = "") => {
    return html.replace(/<[^>]*>?/gm, " ").replace(/\s+/g, " ").trim();
  };

  const handleAutoFillSeo = () => {
    const cleanEn = stripHtml(formData.descriptionEn);
    const cleanBn = stripHtml(formData.descriptionBn);

    setFormData((prev) => ({
      ...prev,
      metaTitle: prev.metaTitle || prev.titleEn.slice(0, 60),
      metaTitleBn: prev.metaTitleBn || prev.titleBn.slice(0, 60),
      metaDescription: prev.metaDescription || cleanEn.slice(0, 160),
      metaDescriptionBn: prev.metaDescriptionBn || cleanBn.slice(0, 160),
      metaKeywords: prev.metaKeywords || (typeof prev.tags === "string" ? prev.tags : "lpg, cylinder, safety"),
      canonicalUrl: prev.canonicalUrl || (prev.slug ? `https://safelpg.com/blogs/${prev.slug}` : ""),
    }));

    toast.success("SEO meta fields auto-filled from article title & content!");
  };

  // Auto-generate slug from English title if empty
  const handleTitleEnChange = (e) => {
    const val = e.target.value;
    setFormData((prev) => {
      const updates = { ...prev, titleEn: val };
      if (!isEdit && !prev.slug) {
        updates.slug = slugify(val);
      }
      return updates;
    });
  };

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please drop a valid image file (PNG, JPG, JPEG, WEBP).");
      return;
    }
    const uploadData = new FormData();
    uploadData.append("images", file);
    try {
      const response = await uploadImage(uploadData).unwrap();
      const uploadedItem = Array.isArray(response?.data)
        ? response.data[0]
        : response?.data;
      const uploadedImage =
        uploadedItem?.image || uploadedItem?.url || (typeof uploadedItem === "string" ? uploadedItem : null);
      if (uploadedImage) {
        setFormData((prev) => ({ ...prev, image: uploadedImage }));
        toast.success("Cover image uploaded successfully!");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to upload image.");
    }
  };

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const { data: categoriesResponse } = useGetBlogCategoriesQuery();
  const fetchedCategories = Array.isArray(categoriesResponse?.data)
    ? categoriesResponse.data
    : [];

  const allCategories = useMemo(() => {
    const list = [...BLOG_CATEGORIES];
    fetchedCategories.forEach((fc) => {
      const slug = fc.slug;
      if (!list.some((item) => (item.id || item.slug) === slug)) {
        list.push({
          id: slug,
          slug: slug,
          labelEn: fc.nameEn,
          labelBn: fc.nameBn,
        });
      }
    });
    return list;
  }, [fetchedCategories]);

  const categoryOptions = useMemo(
    () =>
      allCategories.map((c) => ({
        value: c.slug || c.id,
        label: `${c.labelEn || c.nameEn} - ${c.labelBn || c.nameBn}`,
      })),
    [allCategories]
  );

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    const sel = allCategories.find((c) => (c.slug || c.id) === val);
    setFormData((prev) => ({
      ...prev,
      category: val,
      categoryBn: sel ? sel.labelBn || sel.nameBn : "",
    }));
  };

  const handleCategoryCreated = (newCat) => {
    setFormData((prev) => ({
      ...prev,
      category: newCat.slug,
      categoryBn: newCat.nameBn,
    }));
    toast.success(`Category "${newCat.nameEn}" selected`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.titleEn?.trim() || !formData.titleBn?.trim()) {
      toast.error("Please enter both English and Bengali titles.");
      return;
    }

    if (!formData.descriptionEn?.trim() && !formData.descriptionBn?.trim()) {
      toast.error("Please provide article description.");
      return;
    }

    const payload = {
      ...formData,
      authorEn: authorDisplayName,
      authorBn: authorDisplayBn,
      tags: typeof formData.tags === "string"
        ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : formData.tags,
    };

    try {
      if (isEdit && initialData?._id) {
        await updateBlog({ id: initialData._id, data: payload }).unwrap();
        toast.success("Article updated successfully!");
      } else {
        await createBlog(payload).unwrap();
        toast.success("New article published successfully!");
      }
      router.push("/admin/blogs");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save article");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/blogs"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            title="Back to Articles"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>{isEdit ? "Edit Article" : "Write New Article"}</span>
              <span className="text-xs font-normal text-slate-500">
                ({isEdit ? "প্রবন্ধ সম্পাদনা" : "নতুন প্রবন্ধ লিখুন"})
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <LinkButton href="/admin/blogs" variant="white" size="sm">
            Cancel
          </LinkButton>
          <Button
            type="submit"
            isLoading={isSaving}
            variant="primary"
            size="sm"
            icon={Save}
          >
            {isEdit ? "Save Changes" : "Publish Article"}
          </Button>
        </div>
      </div>

      {/* Grid container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content Area (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Article Titles */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Globe className="h-4 w-4 text-primary" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                1. Article Titles
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Article Title"
                required
                placeholder="e.g., LPG Safety Compliance Standards in Bangladesh"
                value={formData.titleEn}
                onChange={handleTitleEnChange}
              />
              <Input
                label="প্রবন্ধের শিরোনাম"
                required
                placeholder="যেমন: বাংলাদেশে এলপিজি নিরাপত্তা ও নিয়ন্ত্রণ মানদণ্ড"
                value={formData.titleBn}
                onChange={(e) =>
                  setFormData({ ...formData, titleBn: e.target.value })
                }
              />
            </div>

            {/* URL Slug with SlugInput */}
            <div className="pt-2">
              <SlugInput
                required
                label="URL Slug"
                value={formData.slug}
                sourceValue={formData.titleEn || formData.titleBn}
                prefix="/blogs/"
                placeholder="lpg-safety-compliance-standards"
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
              />
            </div>
          </div>

          {/* Card 2: Article Description with React Quill */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  2. Article Description & Details
                </h2>
              </div>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                WYSIWYG Rich Editor
              </span>
            </div>

            {/* Short Descriptions for Cards & Image Overlays */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Card Short Summary
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-primary focus:outline-hidden"
                  placeholder="Concise 1-2 sentence summary displayed on blog cards and image banner..."
                  value={formData.shortDescriptionEn}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, shortDescriptionEn: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  কার্ড সংক্ষিপ্ত বিবরণী
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-primary focus:outline-hidden"
                  placeholder="ব্লগ কার্ড এবং ইমেজ ব্যানারে প্রদর্শনের জন্য ১-২ লাইনের সংক্ষিপ্ত সারসংক্ষেপ..."
                  value={formData.shortDescriptionBn}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, shortDescriptionBn: e.target.value }))
                  }
                />
              </div>
            </div>

            {/* English Description with Quill */}
            <div className="space-y-1.5">
              <RichTextEditor
                label="Article Detailed Description"
                required
                minHeight={500}
                placeholder="Write rich formatted article content, safety instructions, technical standards, or regulatory bullet points in English..."
                value={formData.descriptionEn}
                onChange={(content) =>
                  setFormData((prev) => ({ ...prev, descriptionEn: content }))
                }
              />
            </div>

            {/* Bengali Description with Quill */}
            <div className="space-y-1.5 pt-4 border-t border-slate-100">
              <RichTextEditor
                label="প্রবন্ধের বিবরণ"
                required
                minHeight={500}
                placeholder="প্রবন্ধের বিষয়বস্তু, নিরাপত্তা নির্দেশনা, প্রযুক্তিগত নির্দেশাবলী বাংলায় বিশদভাবে লিখুন..."
                value={formData.descriptionBn}
                onChange={(content) =>
                  setFormData((prev) => ({ ...prev, descriptionBn: content }))
                }
              />
            </div>
          </div>

          {/* Card 3: Search Engine Optimization (SEO & Meta Tags) */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-primary" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  3. Search Engine Optimization (SEO & Meta Tags)
                </h2>
              </div>
            </div>


            {/* Meta Titles (English & Bengali) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Meta Title
                  </label>
                  <span
                    className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${formData.metaTitle.length >= 40 && formData.metaTitle.length <= 60
                      ? "bg-emerald-50 text-emerald-700"
                      : formData.metaTitle.length > 60
                        ? "bg-rose-50 text-rose-600"
                        : "bg-slate-100 text-slate-500"
                      }`}
                  >
                    {formData.metaTitle.length}/60 chars
                  </span>
                </div>
                <Input
                  name="metaTitle"
                  placeholder="e.g. LPG Cylinder Safety Protocols & Emergency Action in Bangladesh"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                  maxLength={70}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    মেটা শিরোনাম
                  </label>
                  <span
                    className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${formData.metaTitleBn.length >= 40 && formData.metaTitleBn.length <= 60
                      ? "bg-emerald-50 text-emerald-700"
                      : formData.metaTitleBn.length > 60
                        ? "bg-rose-50 text-rose-600"
                        : "bg-slate-100 text-slate-500"
                      }`}
                  >
                    {formData.metaTitleBn.length}/60 chars
                  </span>
                </div>
                <Input
                  name="metaTitleBn"
                  placeholder="যেমন: এলপিজি সিলিন্ডার নিরাপত্তা নির্দেশিকা ও জরুরি ব্যবস্থা"
                  value={formData.metaTitleBn}
                  onChange={(e) => setFormData({ ...formData, metaTitleBn: e.target.value })}
                  maxLength={70}
                />
              </div>
            </div>

            {/* Meta Descriptions (English & Bengali) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    Meta Description
                  </label>
                  <span
                    className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${formData.metaDescription.length >= 130 && formData.metaDescription.length <= 160
                      ? "bg-emerald-50 text-emerald-700"
                      : formData.metaDescription.length > 160
                        ? "bg-rose-50 text-rose-600"
                        : "bg-slate-100 text-slate-500"
                      }`}
                  >
                    {formData.metaDescription.length}/160 chars
                  </span>
                </div>
                <textarea
                  rows={3}
                  name="metaDescription"
                  placeholder="Concise summary for search engines (150–160 characters recommended)..."
                  value={formData.metaDescription}
                  onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                  maxLength={180}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-primary focus:outline-hidden"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">
                    মেটা বিবরণ
                  </label>
                  <span
                    className={`text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded ${formData.metaDescriptionBn.length >= 130 && formData.metaDescriptionBn.length <= 160
                      ? "bg-emerald-50 text-emerald-700"
                      : formData.metaDescriptionBn.length > 160
                        ? "bg-rose-50 text-rose-600"
                        : "bg-slate-100 text-slate-500"
                      }`}
                  >
                    {formData.metaDescriptionBn.length}/160 chars
                  </span>
                </div>
                <textarea
                  rows={3}
                  name="metaDescriptionBn"
                  placeholder="গুগল সার্চ ও সামাজিক মাধ্যমের জন্য সংক্ষিপ্ত বাংলা বিবরণ (১৫০-১৬০ অক্ষর)..."
                  value={formData.metaDescriptionBn}
                  onChange={(e) => setFormData({ ...formData, metaDescriptionBn: e.target.value })}
                  maxLength={180}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-primary focus:outline-hidden"
                />
              </div>
            </div>

            {/* SEO Keywords & Canonical URL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Meta Keywords
                </label>
                <Input
                  name="metaKeywords"
                  placeholder="lpg safety, gas leak, cylinder valve, bangladesh energy, fire precautions"
                  value={formData.metaKeywords}
                  onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Canonical URL (Optional)
                </label>
                <Input
                  name="canonicalUrl"
                  placeholder="https://safelpg.com/blogs/custom-canonical-slug"
                  value={formData.canonicalUrl}
                  onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings Area (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Publishing & Category Settings */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
              Publishing Options
            </h3>

            {/* Publish Toggle */}
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/70 cursor-pointer hover:bg-slate-50 transition-colors">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Publish Article
                </span>
                <span className="text-[11px] text-slate-500">
                  Visible to public readers
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) =>
                  setFormData({ ...formData, isPublished: e.target.checked })
                }
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20"
              />
            </label>

            {/* Category Select with Create New button */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  Article Category *
                </label>
                <Button
                  type="button"
                  variant="link"
                  size="xs"
                  onClick={() => setIsCategoryModalOpen(true)}
                  icon={Plus}
                >
                  Add Category
                </Button>
              </div>
              <Select
                value={formData.category}
                onChange={handleCategoryChange}
                options={categoryOptions}
              />
            </div>

            {/* Access Type: Free vs Paid */}
            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Content Access Type *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, accessType: "free" })}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${formData.accessType === "free"
                    ? "border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                >
                  <span className="text-xs font-bold text-slate-900 flex items-center justify-between">
                    Free
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, accessType: "paid" })}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${formData.accessType === "paid"
                    ? "border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20"
                    : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                >
                  <span className="text-xs font-bold text-slate-900 flex items-center justify-between">
                    Paid

                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Cover Thumbnail Image */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
              Featured Image
            </h3>

            {formData.image ? (
              <div className="space-y-2">
                <div className="relative aspect-16/10 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                  <Image
                    src={formData.image}
                    alt="Featured Image Preview"
                    fill
                    unoptimized
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/default_image.jpg";
                    }}
                  />
                  <Button
                    type="button"
                    variant="danger"
                    size="icon-xs"
                    shape="circle"
                    onClick={() => setFormData({ ...formData, image: "" })}
                    className="absolute top-2 right-2 shadow-md"
                    title="Remove image"
                    icon={Trash2}
                  />
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Cover image ready</span>
                </div>
              </div>
            ) : null}

            <DragDropUploadZone
              onFilesSelected={handleFileUpload}
              isUploading={isUploadingImage}
              multiple={false}
              title={
                <>
                  Drag & drop cover photo here, or <span className="text-primary underline">browse</span>
                </>
              }
              subtitle="PNG, JPG, WEBP recommended (1200x630px)"
              uploadingText="Uploading article cover..."
            />
          </div>

          {/* Metadata: Author & Read Time */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <User className="h-3.5 w-3.5 text-primary" />
                <span>Author & Details</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
                <Lock className="h-3 w-3" /> Fixed
              </span>
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                  <span>Author (Posting User)</span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    Auto-assigned
                  </span>
                </label>
                <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/90 text-slate-800">
                  <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-primary/10 flex items-center justify-center font-bold text-xs text-primary">
                    {user?.image ? (
                      <Image
                        src={
                          typeof user.image === "string"
                            ? user.image
                            : user.image?.url || "/default_person.jpg"
                        }
                        alt={authorDisplayName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      (authorDisplayName || "U").slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-slate-900 truncate">
                      {authorDisplayName}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      @{user?.userName || "author"} •{" "}
                      <span className="capitalize">
                        {user?.role?.replace("_", " ") || "Administrator"}
                      </span>
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200 shrink-0">
                    <Lock className="h-2.5 w-2.5" /> Fixed
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <Input
                  label="Read Time"
                  placeholder="5 min read"
                  value={formData.readTimeEn}
                  onChange={(e) =>
                    setFormData({ ...formData, readTimeEn: e.target.value })
                  }
                />
                <Input
                  label="পাঠের সময়"
                  placeholder="৫ মিনিট পাঠ"
                  value={formData.readTimeBn}
                  onChange={(e) =>
                    setFormData({ ...formData, readTimeBn: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Tag className="h-3.5 w-3.5 text-primary" />
              <span>Search Tags</span>
            </h3>
            <Input
              placeholder="lpg, cylinder, regulations, inspection"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
            />
            <p className="text-[11px] text-slate-400">
              Separate tags with commas. Helps users find this article in search.
            </p>
          </div>
        </div>
      </div>

      {/* Category Creation Modal */}
      <CreateCategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onCategoryCreated={handleCategoryCreated}
      />
    </form>
  );
}

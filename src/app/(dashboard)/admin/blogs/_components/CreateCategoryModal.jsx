// src/app/(dashboard)/admin/blogs/_components/CreateCategoryModal.jsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FolderPlus, Tag } from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useCreateBlogCategoryMutation } from "@/redux/api/blogApi";

export default function CreateCategoryModal({
  isOpen,
  onClose,
  onCategoryCreated = () => {},
}) {
  const [createCategory, { isLoading }] = useCreateBlogCategoryMutation();

  const [nameEn, setNameEn] = useState("");
  const [nameBn, setNameBn] = useState("");
  const [slug, setSlug] = useState("");

  const handleNameEnChange = (e) => {
    const val = e.target.value;
    setNameEn(val);
    if (!slug) {
      setSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "_")
      );
    }
  };

  const handleReset = () => {
    setNameEn("");
    setNameBn("");
    setSlug("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nameEn.trim() || !nameBn.trim()) {
      toast.error("Please enter both English and Bengali category names.");
      return;
    }

    const finalSlug = (slug || nameEn)
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "_");

    try {
      const res = await createCategory({
        nameEn: nameEn.trim(),
        nameBn: nameBn.trim(),
        slug: finalSlug,
      }).unwrap();

      toast.success("Blog category created successfully!");
      const createdItem = res?.data || {
        slug: finalSlug,
        nameEn: nameEn.trim(),
        nameBn: nameBn.trim(),
      };
      onCategoryCreated(createdItem);
      handleReset();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create category");
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={handleReset}
      maxWidth="md"
      title="Create New Blog Category / নতুন ক্যাটাগরি তৈরি"
      description="Define a new category in English and Bengali to classify blog articles."
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div className="space-y-3">
          <Input
            label="Category Name (English)"
            required
            placeholder="e.g., Industrial LPG Solutions"
            value={nameEn}
            onChange={handleNameEnChange}
          />

          <Input
            label="ক্যাটাগরির নাম (বাংলা)"
            required
            placeholder="যেমন: শিল্প এলপিজি সমাধান"
            value={nameBn}
            onChange={(e) => setNameBn(e.target.value)}
          />

          <div className="pt-1">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Category Identifier / Key Slug *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                <Tag className="h-3.5 w-3.5" />
              </span>
              <input
                type="text"
                required
                placeholder="industrial_lpg_solutions"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:border-primary focus:outline-hidden"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Used internally and in article filters (lowercase, underscore separated).
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleReset}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isLoading}
            variant="primary"
            size="sm"
            className="gap-2 font-bold"
          >
            {isLoading ? (
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <FolderPlus className="h-3.5 w-3.5" />
            )}
            <span>Create Category</span>
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

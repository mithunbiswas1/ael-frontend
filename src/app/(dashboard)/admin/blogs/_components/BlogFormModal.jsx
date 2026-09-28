// src/app/(dashboard)/admin/blogs/_components/BlogFormModal.jsx
"use client";

import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";

export default function BlogFormModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  isSaving,
  isEditing,
  categories,
}) {
  const categoryOptions = categories.map((c) => ({
    value: c.id,
    label: `${c.labelEn} (${c.labelBn})`,
  }));

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="4xl"
      title={
        isEditing
          ? "Edit Article / প্রবন্ধ সম্পাদনা"
          : "Create New Article / নতুন প্রবন্ধ লিখুন"
      }
      description="Provide English and Bengali side-by-side for unified bilingual publishing with a single shared link."
    >
      <form
        onSubmit={onSubmit}
        className="p-6 space-y-6"
      >
          {/* Section 1: Titles (Side by Side) */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-primary uppercase tracking-wider">
              1. Article Titles / শিরোনাম
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Blog Title"
                required
                placeholder="e.g., LPG Demand to Rise Rapidly Across Bangladesh by 2025"
                value={formData.titleEn}
                onChange={(e) =>
                  setFormData({ ...formData, titleEn: e.target.value })
                }
              />
              <Input
                label="শিরোনাম"
                required
                placeholder="যেমন: ২০২৫ সালের মধ্যে বাংলাদেশে এলপিজির চাহিদা ব্যাপক বৃদ্ধির সম্ভাবনা"
                value={formData.titleBn}
                onChange={(e) =>
                  setFormData({ ...formData, titleBn: e.target.value })
                }
              />
            </div>
          </div>

          {/* Section 2: Author & Read Time (Side by Side) */}
          <div className="space-y-3 border-t border-slate-100 pt-4">
            <div className="text-xs font-bold text-primary uppercase tracking-wider">
              2. Author & Read Time / লেখক ও পাঠ সময়
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <Input
                label="Author"
                placeholder="Safe LPG Committee"
                value={formData.authorEn}
                onChange={(e) =>
                  setFormData({ ...formData, authorEn: e.target.value })
                }
              />
              <Input
                label="লেখক"
                placeholder="সেইফ এলপিজি কমিটি"
                value={formData.authorBn}
                onChange={(e) =>
                  setFormData({ ...formData, authorBn: e.target.value })
                }
              />
              <Input
                label="Read Time"
                placeholder="5 min read"
                value={formData.readTimeEn}
                onChange={(e) =>
                  setFormData({ ...formData, readTimeEn: e.target.value })
                }
              />
              <Input
                label="পাঠ সময়"
                placeholder="৫ মিনিট পাঠ"
                value={formData.readTimeBn}
                onChange={(e) =>
                  setFormData({ ...formData, readTimeBn: e.target.value })
                }
              />
            </div>
          </div>

          {/* Section 3: Summary / Excerpt (Side by Side) */}
          <div className="space-y-3 border-t border-slate-100 pt-4">
            <div className="text-xs font-bold text-primary uppercase tracking-wider">
              3. Summary Excerpt / সংক্ষিপ্ত বিবরণ
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Textarea
                label="Summary"
                required
                rows={3}
                placeholder="Brief summary displayed on blog cards..."
                value={formData.descriptionEn}
                onChange={(e) =>
                  setFormData({ ...formData, descriptionEn: e.target.value })
                }
              />
              <Textarea
                label="সারসংক্ষেপ"
                required
                rows={3}
                placeholder="ব্লগ কার্ডে প্রদর্শিত সংক্ষিপ্ত বিবরণ..."
                value={formData.descriptionBn}
                onChange={(e) =>
                  setFormData({ ...formData, descriptionBn: e.target.value })
                }
              />
            </div>
          </div>

          {/* Section 4: Full Body Content (Side by Side) */}
          <div className="space-y-3 border-t border-slate-100 pt-4">
            <div className="text-xs font-bold text-primary uppercase tracking-wider">
              4. Full Content Body / পূর্ণাঙ্গ প্রবন্ধ
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Textarea
                label="Full Article Content"
                rows={8}
                placeholder="Detailed English article content..."
                value={formData.contentEn}
                onChange={(e) =>
                  setFormData({ ...formData, contentEn: e.target.value })
                }
              />
              <Textarea
                label="পূর্ণাঙ্গ বিষয়বস্তু"
                rows={8}
                placeholder="প্রবন্ধের পূর্ণাঙ্গ বিষয়বস্তু..."
                value={formData.contentBn}
                onChange={(e) =>
                  setFormData({ ...formData, contentBn: e.target.value })
                }
              />
            </div>
          </div>

          {/* Section 5: Common Shared Metadata */}
          <div className="space-y-4 border-t border-slate-200 pt-4">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              5. Category, URL Slug & Media / ক্যাটাগরি, স্লাগ ও মিডিয়া
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Category / ক্যাটাগরি"
                value={formData.category}
                onChange={(e) => {
                  const sel = categories.find((c) => c.id === e.target.value);
                  setFormData({
                    ...formData,
                    category: e.target.value,
                    categoryBn: sel ? sel.labelBn : "",
                  });
                }}
                options={categoryOptions}
              />

              <Input
                label="URL Slug (Shared Link / একই লিংক)"
                placeholder="e.g., lpg-safety-seminar-dhaka"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
              />
            </div>

            <Input
              label="Thumbnail Image URL"
              placeholder="https://images.unsplash.com/..."
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
            />

            <Input
              label="Tags (Comma-separated)"
              placeholder="lpg, safety, cylinder, regulation"
              value={formData.tags}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value })
              }
            />

            <label className="flex items-center gap-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={formData.isPublished}
                onChange={(e) =>
                  setFormData({ ...formData, isPublished: e.target.checked })
                }
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20"
              />
              <span className="text-xs font-semibold text-slate-800">
                Publish immediately to website / ওয়েবসাইটে সরাসরি প্রকাশ করুন
              </span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              size="sm"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSaving}
              variant="primary"
              size="sm"
              className="gap-2"
            >
              {isSaving && (
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
              <span>{isEditing ? "Save Changes" : "Publish Article"}</span>
            </Button>
          </div>
        </form>
    </Dialog>
  );
}

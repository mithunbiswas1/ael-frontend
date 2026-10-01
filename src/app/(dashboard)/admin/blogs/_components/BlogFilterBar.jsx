// src/app/(dashboard)/admin/blogs/_components/BlogFilterBar.jsx
"use client";

import { FaNewspaper } from "react-icons/fa";
import { AdminPageHeader } from "@/components/ui/AdminPageHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import { useGetBlogCategoriesQuery } from "@/redux/api/blogApi";

export default function BlogFilterBar({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories = [],
  onOpenCreate,
  onOpenCreateModal,
}) {
  const handleCreate = onOpenCreate || onOpenCreateModal;
  const { data: catResponse } = useGetBlogCategoriesQuery();
  const fetched = catResponse?.data || [];

  const merged = [...(categories || [])];
  if (Array.isArray(fetched)) {
    fetched.forEach((fc) => {
      if (!merged.some((m) => (m.id || m.slug) === fc.slug)) {
        merged.push({
          id: fc.slug,
          slug: fc.slug,
          labelEn: fc.nameEn,
          labelBn: fc.nameBn,
        });
      }
    });
  }

  const categoryOptions = [
    { value: "all", label: "All Categories / সকল ক্যাটাগরি" },
    ...merged.map((c) => ({
      value: c.slug || c.id,
      label: `${c.labelEn || c.nameEn} (${c.labelBn || c.nameBn})`,
    })),
  ];

  return (
    <div className="space-y-4">
      {/* Page Title & Action */}
      <AdminPageHeader
        icon={FaNewspaper}
        title="Blog & Article Management"
        description="Publish bilingual articles, technical advisories, and industry updates."
        actionLabel="Write New Article"
        onActionClick={handleCreate}
      />

      {/* Search and Category Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-xl border border-slate-200/80">
        <div className="w-full sm:w-72">
          <SearchInput
            placeholder="Search by title, author, or keyword..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange("")}
            size="sm"
          />
        </div>

        <div className="w-full sm:w-64">
          <Select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            options={categoryOptions}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}

// src/app/(dashboard)/admin/market-updates/_components/MarketUpdateFilterBar.jsx
"use client";

import { FaChartLine } from "react-icons/fa";
import { AdminPageHeader } from "@/components/ui/AdminPageHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";

export default function MarketUpdateFilterBar({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories = [],
  onOpenCreate,
}) {
  const categoryOptions = [
    { value: "all", label: "All Categories (সকল ক্যাটাগরি)" },
    ...categories.map((c) => ({
      value: c.id,
      label: `${c.labelEn} (${c.labelBn})`,
    })),
  ];

  return (
    <div className="space-y-4">
      {/* Page Title & Action */}
      <AdminPageHeader
        icon={FaChartLine}
        title="LPG Market Updates Management"
        actionLabel="New Market Update"
        onActionClick={onOpenCreate}
      />

      {/* Search and Category Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-xl border border-slate-200/80">
        <div className="w-full sm:w-72">
          <SearchInput
            placeholder="Search market updates..."
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

// src/app/(dashboard)/admin/market-updates/_components/MarketUpdateFilterBar.jsx
"use client";

import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
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
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
      <div className="flex flex-1 flex-col sm:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search market updates..."
            className="pl-9 h-9 text-xs"
          />
        </div>

        {/* Category Filter */}
        <div className="w-full sm:w-64">
          <Select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            options={categoryOptions}
            className="h-9 text-xs"
          />
        </div>
      </div>

      {/* Create Button */}
      <Button
        onClick={onOpenCreate}
        variant="primary"
        size="sm"
        className="gap-2 shrink-0 shadow-xs"
      >
        <Plus className="h-4 w-4" />
        <span>New Market Update</span>
      </Button>
    </div>
  );
}

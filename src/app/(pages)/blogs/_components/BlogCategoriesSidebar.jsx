// src/app/(pages)/blogs/_components/BlogCategoriesSidebar.jsx
"use client";

import { LayoutGrid, List, Shield, Newspaper } from "lucide-react";
import { H4 } from "@/components/ui/Typography";
import { useDictionary } from "@/context/DictionaryContext";

export default function BlogCategoriesSidebar({
  categories,
  selectedCategory,
  setSelectedCategory,
  viewType,
  setViewType,
}) {
  const { locale } = useDictionary();
  const isBn = locale === "bn";

  return (
    <div className="space-y-4 lg:col-span-3">
      {/* Category Filter */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <H4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
          {isBn ? "ক্যাটাগরি" : "CATEGORIES"}
        </H4>
        <div className="space-y-1">
          {categories.map((cat) => {
            const Icon = cat.icon || Shield;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-primary text-white font-bold shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* View Type Toggle */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
        <H4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
          {isBn ? "ভিউ লেআউট" : "VIEW LAYOUT"}
        </H4>
        <div className="flex gap-2">
          <button
            onClick={() => setViewType("grid")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-bold transition-colors ${
              viewType === "grid"
                ? "border-primary bg-primary text-white"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            <span>{isBn ? "গ্রিড" : "Grid"}</span>
          </button>

          <button
            onClick={() => setViewType("list")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-bold transition-colors ${
              viewType === "list"
                ? "border-primary bg-primary text-white"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
            }`}
          >
            <List className="h-3.5 w-3.5" />
            <span>{isBn ? "তালিকা" : "List"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

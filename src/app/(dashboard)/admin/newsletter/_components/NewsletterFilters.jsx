// src/app/(dashboard)/admin/newsletter/_components/NewsletterFilters.jsx
"use client";

import { Search } from "lucide-react";

export default function NewsletterFilters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  sourceFilter,
  setSourceFilter,
  setPage,
}) {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by email, name, or phone..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-9 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-primary focus:outline-hidden transition-all"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Status:</span>
          <div className="inline-flex rounded-xl bg-slate-100 p-0.5 text-xs font-semibold">
            {["all", "active", "inactive"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => {
                  setStatusFilter(st);
                  setPage(1);
                }}
                className={`rounded-lg px-3 py-1.5 capitalize transition-all cursor-pointer ${
                  statusFilter === st
                    ? "bg-white text-slate-900 shadow-2xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Source Filter */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500">Source:</span>
          <div className="inline-flex rounded-xl bg-slate-100 p-0.5 text-xs font-semibold">
            {[
              { key: "all", label: "All" },
              { key: "registration", label: "Registered" },
              { key: "website_footer", label: "Newsletter User" },
            ].map((src) => (
              <button
                key={src.key}
                type="button"
                onClick={() => {
                  setSourceFilter(src.key);
                  setPage(1);
                }}
                className={`rounded-lg px-3 py-1.5 transition-all cursor-pointer ${
                  sourceFilter === src.key
                    ? "bg-white text-slate-900 shadow-2xs font-bold"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {src.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// src/app/(pages)/market-updates/_components/GlobalMarketSection.jsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, RotateCcw, Globe2 } from "lucide-react";
import Input from "@/components/ui/Input";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/Table";

export default function GlobalMarketSection({ globalNews }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredNews = useMemo(() => {
    return globalNews.filter((news) => {
      return (
        !searchTerm ||
        news.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        news.source.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [globalNews, searchTerm]);

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage) || 1;
  const paginatedNews = filteredNews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleResetFilters = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 mb-4">
        <div>
          <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Globe2 className="h-4 w-4 text-emerald-600" />
            <span>Global LPG Market Update</span>
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            International freight, contract price (CP), and commodity trends
          </p>
        </div>

        <button
          onClick={handleResetFilters}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-medium self-start sm:self-auto"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-lg border border-slate-200/70 bg-slate-50/60 p-3 mb-4">
        <Input
          type="text"
          placeholder="Search by title, source..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          prefix={<Search className="h-3.5 w-3.5" />}
          size="sm"
          className="bg-white text-xs h-9"
        />
      </div>

      {/* Global News Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Time</TableHead>
            <TableHead className="text-center">View</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedNews.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="py-8 text-center text-slate-500">
                No global market updates found matching the selected filters.
              </TableCell>
            </TableRow>
          ) : (
            paginatedNews.map((news) => (
              <TableRow key={news.id}>
                <TableCell className="text-slate-700 font-medium max-w-sm truncate">
                  {news.title}
                </TableCell>
                <TableCell className="font-semibold text-slate-900 whitespace-nowrap">
                  {news.source}
                </TableCell>
                <TableCell className="text-slate-500 whitespace-nowrap">
                  {news.time}
                </TableCell>
                <TableCell className="text-center">
                  <Link
                    href={`/market-updates/${news.slug}`}
                    className="inline-flex h-7 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 hover:border-primary hover:bg-blue-50 hover:text-primary transition-colors"
                  >
                    View
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <span>
          Page <strong className="text-slate-900">{currentPage}</strong> of{" "}
          <strong className="text-slate-900">{totalPages}</strong>
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="inline-flex h-8 px-2.5 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNum = idx + 1;
            const isActive = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-lg font-bold text-xs transition-colors ${isActive
                  ? "bg-primary text-white shadow-2xs"
                  : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="inline-flex h-8 px-2.5 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}

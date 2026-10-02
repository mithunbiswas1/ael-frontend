// src/components/ui/Pagination.jsx
"use client";

import { forwardRef } from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { Button } from "./Button";

/**
 * Reusable Atomic Pagination Component
 * Standard 10 items per page with customizable window and details
 */
export const Pagination = forwardRef(function Pagination(
  {
    currentPage = 1,
    totalPages = 1,
    totalItems,
    pageSize = 10,
    onPageChange,
    showDetails = true,
    className,
    isBn = false,
  },
  ref
) {
  const page = Math.max(1, parseInt(currentPage, 10) || 1);
  const total = Math.max(1, parseInt(totalPages, 10) || 1);

  // Only hide if totalItems is explicitly 0 and total is 1, or both are 0
  if (total <= 1 && totalItems === 0) {
    return null;
  }

  // Calculate items range: e.g. "Showing 1-10 of 42 items"
  const startItem = (page - 1) * pageSize + 1;
  const endItem = totalItems ? Math.min(page * pageSize, totalItems) : page * pageSize;

  // Generate page numbers with ellipsis window
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (total <= maxVisible + 2) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, page - 1);
      let end = Math.min(total - 1, page + 1);

      if (page <= 3) {
        start = 2;
        end = 4;
      } else if (page >= total - 2) {
        start = total - 3;
        end = total - 1;
      }

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < total - 1) {
        pages.push("...");
      }

      pages.push(total);
    }

    return pages;
  };

  const handlePageClick = (p) => {
    if (typeof p === "number" && p >= 1 && p <= total && p !== page) {
      onPageChange?.(p);
    }
  };

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 border-t border-slate-200/80 bg-white",
        className
      )}
    >
      {/* Left side: Results Count Summary */}
      {showDetails && (
        <div className="text-xs text-slate-500 font-medium">
          {totalItems !== undefined && totalItems !== null ? (
            isBn ? (
              <span>
                মোট <strong className="font-bold text-slate-800">{totalItems}</strong> টির মধ্যে{" "}
                <strong className="font-bold text-slate-800">{startItem} - {endItem}</strong> প্রদর্শিত
              </span>
            ) : (
              <span>
                Showing <strong className="font-bold text-slate-800">{startItem}</strong> to{" "}
                <strong className="font-bold text-slate-800">{endItem}</strong> of{" "}
                <strong className="font-bold text-slate-800">{totalItems}</strong> entries
              </span>
            )
          ) : (
            isBn ? (
              <span>
                পৃষ্ঠা <strong className="font-bold text-slate-800">{page}</strong> / {total}
              </span>
            ) : (
              <span>
                Page <strong className="font-bold text-slate-800">{page}</strong> of{" "}
                <strong className="font-bold text-slate-800">{total}</strong>
              </span>
            )
          )}
        </div>
      )}

      {/* Right side: Page Navigation Controls */}
      <div className="flex items-center gap-1.5 self-center sm:self-auto">
        {/* First Page Button */}
        {total > 4 && (
          <Button
            type="button"
            variant="outline"
            size="xs"
            disabled={page <= 1}
            onClick={() => handlePageClick(1)}
            className="hidden sm:inline-flex h-8 w-8 p-0 text-slate-500 hover:text-slate-900 border-slate-200"
            title="First Page"
          >
            <ChevronsLeft className="h-3.5 w-3.5" />
          </Button>
        )}

        {/* Previous Button */}
        <Button
          type="button"
          variant="outline"
          size="xs"
          disabled={page <= 1}
          onClick={() => handlePageClick(page - 1)}
          className="h-8 px-2.5 text-xs text-slate-700 border-slate-200 font-medium gap-1"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{isBn ? "পূর্ববর্তী" : "Prev"}</span>
        </Button>

        {/* Page Number Buttons */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, idx) => {
            if (p === "...") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-xs text-slate-400 select-none font-mono"
                >
                  •••
                </span>
              );
            }

            const isActive = p === page;
            return (
              <button
                key={`page-${p}`}
                type="button"
                onClick={() => handlePageClick(p)}
                className={cn(
                  "h-8 min-w-[32px] px-2 rounded-lg text-xs font-bold transition-all select-none",
                  isActive
                    ? "bg-primary text-white shadow-xs"
                    : "bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent hover:border-slate-200"
                )}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <Button
          type="button"
          variant="outline"
          size="xs"
          disabled={page >= total}
          onClick={() => handlePageClick(page + 1)}
          className="h-8 px-2.5 text-xs text-slate-700 border-slate-200 font-medium gap-1"
        >
          <span className="hidden sm:inline">{isBn ? "পরবর্তী" : "Next"}</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>

        {/* Last Page Button */}
        {total > 4 && (
          <Button
            type="button"
            variant="outline"
            size="xs"
            disabled={page >= total}
            onClick={() => handlePageClick(total)}
            className="hidden sm:inline-flex h-8 w-8 p-0 text-slate-500 hover:text-slate-900 border-slate-200"
            title="Last Page"
          >
            <ChevronsRight className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
});

export default Pagination;

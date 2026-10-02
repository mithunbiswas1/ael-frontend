// src/app/(pages)/blogs/_components/BlogPostsSection.jsx
"use client";

import { useState, useEffect } from "react";
import { Search, LayoutGrid, List } from "lucide-react";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Pagination from "@/components/ui/Pagination";
import BlogCard from "@/components/shared/BlogCard";
import { useDictionary } from "@/context/DictionaryContext";

export default function BlogPostsSection({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  viewType,
  setViewType,
  filteredBlogs,
}) {
  const { locale, dict } = useDictionary();
  const isBn = locale === "bn";
  const common = dict?.common || {};

  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, sortBy, filteredBlogs.length]);

  const totalItems = filteredBlogs.length;
  const totalPages = Math.ceil(totalItems / 10) || 1;
  const paginatedBlogs = filteredBlogs.slice((page - 1) * 10, page * 10);

  return (
    <div className="space-y-6 lg:col-span-3">
      {/* Search, Sort & Grid/List View Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div className="flex-1">
          <Input
            type="text"
            placeholder={
              isBn ? "প্রবন্ধ অনুসন্ধান করুন..." : "Search articles..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            prefix={<Search className="h-3.5 w-3.5" />}
          />
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 whitespace-nowrap hidden sm:inline">
              {isBn ? "সর্টিং:" : "Sort:"}
            </span>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={
                isBn
                  ? [
                      { value: "latest", label: "সর্বশেষ" },
                      { value: "popular", label: "জনপ্রিয়" },
                    ]
                  : [
                      { value: "latest", label: "Latest" },
                      { value: "popular", label: "Popular" },
                    ]
              }
              className="w-32"
            />
          </div>

          {/* Grid / List View Switcher */}
          {setViewType && (
            <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50/70 p-1">
              <button
                type="button"
                onClick={() => setViewType("grid")}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewType === "grid"
                    ? "bg-primary text-white shadow-2xs"
                    : "text-slate-500 hover:text-slate-900 hover:bg-white"
                }`}
                title={isBn ? "গ্রিড ভিউ" : "Grid View"}
                aria-label="Grid View"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewType("list")}
                className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  viewType === "list"
                    ? "bg-primary text-white shadow-2xs"
                    : "text-slate-500 hover:text-slate-900 hover:bg-white"
                }`}
                title={isBn ? "তালিকা ভিউ" : "List View"}
                aria-label="List View"
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cards Grid / List using unified BlogCard */}
      {filteredBlogs.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500 shadow-2xs">
          {isBn
            ? "আপনার মানদণ্ডের সাথে মিলে এমন কোনো প্রবন্ধ পাওয়া যায়নি।"
            : "No articles found matching your criteria."}
        </div>
      ) : (
        <div
          className={
            viewType === "grid"
              ? "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
              : "flex flex-col gap-4"
          }
        >
          {paginatedBlogs.map((blog) => (
            <BlogCard
              key={blog.id || blog.slug}
              category={blog.category}
              badgeText={blog.category}
              imageUrl={blog.imageUrl}
              title={blog.title}
              summary={blog.shortDescription || blog.description}
              date={blog.date}
              readTime={blog.readTime}
              author={isBn ? blog.authorBn || blog.author : blog.author}
              href={`/blogs/${blog.slug}`}
              viewMode={viewType}
            />
          ))}
        </div>
      )}

      {/* Pagination Component */}
      {totalItems > 0 && (
        <div className="pt-2">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={10}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}

// src/app/(pages)/authors/[username]/_components/AuthorArticlesSection.jsx
"use client";

import { useState, useMemo } from "react";
import { Grid, List, BookOpen } from "lucide-react";
import { H4, P } from "@/components/ui/Typography";
import Pagination from "@/components/ui/Pagination";
import BlogCard from "@/components/shared/BlogCard";
import MarketUpdateCard from "@/components/shared/MarketUpdateCard";

export default function AuthorArticlesSection({
  author,
  blogs = [],
  marketUpdates = [],
  isBn,
}) {
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'blogs', 'market'
  const [viewType, setViewType] = useState("grid"); // 'grid', 'list'
  const [page, setPage] = useState(1);

  const defaultImage = "/default_image.jpg";
  const getSafeImg = (img1, img2) => {
    if (img1 && typeof img1 === "string" && img1.trim() !== "") return img1;
    if (img2 && typeof img2 === "string" && img2.trim() !== "") return img2;
    return defaultImage;
  };

  // Normalize articles list
  const allArticles = useMemo(() => {
    const blogList = (blogs || []).map((b) => ({
      id: b._id || b.slug,
      slug: b.slug,
      type: "blog",
      title: isBn ? b.titleBn || b.titleEn : b.titleEn || b.titleBn,
      summary: isBn
        ? b.shortDescriptionBn || b.descriptionBn || ""
        : b.shortDescriptionEn || b.descriptionEn || "",
      category: isBn ? b.categoryBn || b.category : b.category || "Safety Protocols",
      image: getSafeImg(b.image, b.imageUrl),
      date: new Date(b.createdAt).toLocaleDateString(isBn ? "bn-BD" : "en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      readTime: isBn ? b.readTimeBn || "৫ মিনিট পাঠ" : b.readTimeEn || "5 min read",
      views: b.views || 0,
      href: `/blogs/${b.slug}`,
    }));

    const marketList = (marketUpdates || []).map((m) => ({
      id: m._id || m.slug,
      slug: m.slug,
      type: "market",
      title: isBn ? m.titleBn || m.titleEn : m.titleEn || m.titleBn,
      summary: isBn ? m.summaryBn || "" : m.summaryEn || "",
      category: isBn ? m.categoryBn || m.category : m.category || "Market Report",
      image: getSafeImg(m.image, m.imageUrl),
      date: new Date(m.publishDate || m.createdAt).toLocaleDateString(
        isBn ? "bn-BD" : "en-US",
        { month: "short", day: "numeric", year: "numeric" }
      ),
      readTime: isBn ? "প্রতিবেদন" : "Report",
      views: m.views || 0,
      href: `/market-updates/${m.slug}`,
    }));

    return [...blogList, ...marketList].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }, [blogs, marketUpdates, isBn]);

  // Filter based on tab
  const filteredArticles = useMemo(() => {
    if (activeTab === "blogs") return allArticles.filter((item) => item.type === "blog");
    if (activeTab === "market") return allArticles.filter((item) => item.type === "market");
    return allArticles;
  }, [allArticles, activeTab]);

  const totalArticles = filteredArticles.length;
  const totalPages = Math.ceil(totalArticles / 10) || 1;
  const paginatedArticles = filteredArticles.slice((page - 1) * 10, page * 10);

  return (
    <div className="space-y-6">
      {/* Tab Header with Right-Side Grid/List Switcher */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
        {/* Left Side: Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setActiveTab("all");
              setPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "all"
                ? "bg-primary text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            {isBn ? "সকল প্রকাশনা" : "All Publications"}{" "}
            <span className={`ml-1 text-[11px] font-mono ${activeTab === "all" ? "text-white/80" : "text-slate-400"}`}>
              ({allArticles.length})
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab("blogs");
              setPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "blogs"
                ? "bg-primary text-white shadow-xs"
                : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            {isBn ? "ব্লগ ও নিবন্ধ" : "Blogs"}{" "}
            <span className={`ml-1 text-[11px] font-mono ${activeTab === "blogs" ? "text-white/80" : "text-slate-400"}`}>
              ({blogs.length})
            </span>
          </button>

          {marketUpdates.length > 0 && (
            <button
              onClick={() => {
                setActiveTab("market");
                setPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "market"
                  ? "bg-primary text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              {isBn ? "মার্কেট আপডেট" : "Market Updates"}{" "}
              <span className={`ml-1 text-[11px] font-mono ${activeTab === "market" ? "text-white/80" : "text-slate-400"}`}>
                ({marketUpdates.length})
              </span>
            </button>
          )}
        </div>

        {/* Right Side: Grid / List view switcher */}
        <div className="flex items-center justify-end gap-1.5 self-end sm:self-auto">
          <span className="text-xs font-medium text-slate-400 mr-1 hidden sm:inline">
            {isBn ? "ভিউ:" : "View:"}
          </span>
          <button
            onClick={() => setViewType("grid")}
            className={`p-2 rounded-lg border transition-all ${
              viewType === "grid"
                ? "bg-primary text-white border-primary shadow-xs"
                : "bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-50"
            }`}
            title="Grid View"
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewType("list")}
            className={`p-2 rounded-lg border transition-all ${
              viewType === "list"
                ? "bg-primary text-white border-primary shadow-xs"
                : "bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-50"
            }`}
            title="List View"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Articles Presentation */}
      {filteredArticles.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center shadow-2xs space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <BookOpen className="h-6 w-6" />
          </div>
          <H4 className="text-base font-bold text-slate-900">
            {isBn ? "কোনো প্রকাশনা পাওয়া যায়নি" : "No Publications Found"}
          </H4>
          <P className="text-xs text-slate-500 max-w-sm mx-auto">
            {isBn
              ? "এই লেখকের দ্বারা এখনও কোনো নিবন্ধ বা রিপোর্ট প্রকাশিত হয়নি।"
              : "This author has not published any public articles or market updates yet."}
          </P>
        </div>
      ) : (
        <div
          className={
            viewType === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              : "flex flex-col gap-4"
          }
        >
          {paginatedArticles.map((article) =>
            article.type === "market" ? (
              <MarketUpdateCard
                key={article.id || article.slug}
                category={article.category}
                badgeText={article.category}
                imageUrl={article.image}
                title={article.title}
                summary={article.summary}
                date={article.date}
                href={article.href}
                viewMode={viewType}
              />
            ) : (
              <BlogCard
                key={article.id || article.slug}
                category={article.category}
                badgeText={article.category}
                imageUrl={article.image}
                title={article.title}
                summary={article.summary}
                date={article.date}
                readTime={article.readTime}
                author={author?.fullName}
                href={article.href}
                viewMode={viewType}
              />
            )
          )}
        </div>
      )}

      {/* Pagination Component */}
      {totalArticles > 0 && (
        <div className="pt-2">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalArticles}
            pageSize={10}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
}

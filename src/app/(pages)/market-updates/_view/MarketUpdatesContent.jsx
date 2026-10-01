// src/app/(pages)/market-updates/_view/MarketUpdatesContent.jsx
"use client";

import { useState, useMemo } from "react";
import { Search, FileText, AlertCircle, Filter, LayoutGrid, List } from "lucide-react";
import VisualHeroBanner from "@/components/ui/VisualHeroBanner";
import MarketUpdatesTabsSection, {
  MARKET_UPDATE_TABS,
} from "../_components/MarketUpdatesTabsSection";
import MarketUpdateCard from "@/components/shared/MarketUpdateCard";
import { useGetMarketUpdatesQuery } from "@/redux/api/marketUpdateApi";
import { useDictionary } from "@/context/DictionaryContext";
import { Button } from "@/components/ui/Button";

export default function MarketUpdatesContent({
  bannerData,
  initialUpdates = [],
}) {
  const { locale, dict } = useDictionary();
  const isBn = locale === "bn";

  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid"); // "grid" | "list"
  const cleanSearch = searchTerm.trim();

  // Live RTK Query data fetching
  const { data: apiResponse, isLoading } = useGetMarketUpdatesQuery({
    ...(activeTab && activeTab !== "all" ? { category: activeTab } : {}),
    ...(cleanSearch ? { q: cleanSearch } : {}),
    limit: 30,
  });

  const liveUpdates = apiResponse?.data?.data;

  // Filter items (fallback to initialUpdates if offline)
  const items = useMemo(() => {
    if (liveUpdates && Array.isArray(liveUpdates)) {
      return liveUpdates;
    }

    // Fallback: filter initialUpdates client-side
    return initialUpdates.filter((item) => {
      const matchesCategory =
        activeTab === "all" || item.category === activeTab;
      const matchesSearch =
        !searchTerm ||
        (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.titleBn && item.titleBn.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.summary && item.summary.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [liveUpdates, initialUpdates, activeTab, searchTerm]);

  // Tab counts
  const currentTabObj =
    MARKET_UPDATE_TABS.find((t) => t.id === activeTab) || MARKET_UPDATE_TABS[0];

  return (
    <main className="min-h-screen bg-slate-50 selection:bg-primary/20 selection:text-primary">
      {/* 1. Hero Banner */}
      {bannerData && <VisualHeroBanner data={bannerData} />}

      {/* 2. Main Content Area */}
      <section className="py-10 sm:py-14">
        <div className="site-container">
          {/* Section Header */}
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-black uppercase tracking-widest text-primary">
                {isBn ? "নিয়ন্ত্রণকারী ও শিল্প গোয়েন্দা" : "STATUTORY & MARKET INTELLIGENCE"}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                {isBn ? "এলপিজি মার্কেট আপডেট" : "LPG Market"} <span className="text-primary">{isBn ? "ও প্রজ্ঞাপন" : "Updates."}</span>
              </h1>
            </div>

            {/* Search Input & View Toggle in 1 Single Row */}
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              {/* Search Input */}
              <div className="relative flex-1 min-w-0 sm:w-72 sm:flex-initial">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={isBn ? "সার্কুলার বা প্রজ্ঞাপন খুঁজুন..." : "Search circulars & reports..."}
                  className="h-10 w-full rounded-full border border-slate-200 bg-white pl-10 pr-9 text-xs text-slate-800 placeholder:text-slate-400 shadow-2xs focus:border-primary focus:outline-hidden focus:ring-1 focus:ring-primary/20 transition-all"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                  >
                    ×
                  </button>
                )}
              </div>

              {/* Grid / List View Toggle */}
              <div className="flex h-10 shrink-0 items-center rounded-full border border-slate-200/90 bg-white p-1 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  aria-label={isBn ? "গ্রিড ভিউ" : "Grid View"}
                  title={isBn ? "গ্রিড ভিউ" : "Grid View"}
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                    viewMode === "grid"
                      ? "bg-primary text-white shadow-2xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  aria-label={isBn ? "লিস্ট ভিউ" : "List View"}
                  title={isBn ? "লিস্ট ভিউ" : "List View"}
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                    viewMode === "list"
                      ? "bg-primary text-white shadow-2xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 3 Categories as 3 Tabs */}
          <MarketUpdatesTabsSection
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab);
            }}
          />

          {/* Card Grid (Blog-style layout) */}
          {isLoading && (!items || items.length === 0) ? (
            <div className="py-20 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="mt-3 text-xs font-semibold text-slate-500">
                {isBn ? "মার্কেট আপডেট লোড হচ্ছে..." : "Loading market intelligence reports..."}
              </p>
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center my-6">
              <AlertCircle className="mx-auto h-10 w-10 text-slate-300 mb-3" />
              <h3 className="text-sm font-bold text-slate-800">
                {isBn ? "কোনো প্রজ্ঞাপন বা প্রতিবেদন পাওয়া যায়নি" : "No Market Reports Found"}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                {searchTerm
                  ? isBn
                    ? `"${searchTerm}" এর জন্য কোনো ফলাফল নেই। অন্য কিওয়ার্ড দিয়ে অনুসন্ধান করুন।`
                    : `No reports matching "${searchTerm}". Try a different keyword.`
                  : isBn
                  ? "এই ক্যাটাগরিতে এখনো কোনো প্রজ্ঞাপন প্রকাশিত হয়নি।"
                  : "No official notices or telemetry published in this category yet."}
              </p>
              {searchTerm && (
                <Button
                  onClick={() => setSearchTerm("")}
                  variant="outline"
                  size="sm"
                  className="mt-4"
                >
                  {isBn ? "ফিল্টার মুছুন" : "Clear Search"}
                </Button>
              )}
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-6"
                  : "flex flex-col gap-4 my-6"
              }
            >
              {items.map((item) => {
                const title = isBn
                  ? item.titleBn || item.title
                  : item.titleEn || item.title;
                const summary = isBn
                  ? item.summaryBn || item.summary
                  : item.summaryEn || item.summary;
                const badgeText = isBn
                  ? item.categoryBn || item.badgeText
                  : item.category === "incidents"
                  ? "Incident Report"
                  : item.category === "berc"
                  ? "BERC Notice"
                  : "Global Market";
                const rawDate = item.publishDate || item.createdAt;
                const date = isBn
                  ? item.dateBn || (rawDate ? new Date(rawDate).toLocaleDateString("bn-BD") : item.date)
                  : item.date || (rawDate ? new Date(rawDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "");

                return (
                  <MarketUpdateCard
                    key={item.id || item._id}
                    category={item.category}
                    badgeText={badgeText}
                    imageUrl={item.imageUrl || item.image}
                    title={title}
                    summary={summary}
                    date={date}
                    hasPdf={Boolean(item.pdfUrl)}
                    pdfUrl={item.pdfUrl}
                    href={`/market-updates/${item.slug || item.id || item._id}`}
                    viewMode={viewMode}
                  />
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

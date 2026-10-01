// src/app/(pages)/archive/page.jsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  Download,
  Calendar,
  Tag,
  Filter,
  Eye,
  ExternalLink,
  ShieldAlert,
  Users,
  Briefcase,
  AlertTriangle,
  FileCheck,
  Building,
} from "lucide-react";
import { toast } from "sonner";
import { useDictionary } from "@/context/DictionaryContext";
import {
  useGetArchiveRecordsQuery,
  useTrackArchiveDownloadMutation,
} from "@/redux/api/archiveApi";
import { H1, H2, H3, P } from "@/components/ui/Typography";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";

const CATEGORIES = [
  { id: "all", labelEn: "All Archives", labelBn: "সকল আর্কাইভ", icon: FileText },
  {
    id: "regulatory_circulars",
    labelEn: "Regulatory Circulars",
    labelBn: "সরকারি প্রজ্ঞাপন",
    icon: FileCheck,
    color: "text-blue-600 bg-blue-50 border-blue-200",
  },
  {
    id: "incident_news",
    labelEn: "Incident News & Probes",
    labelBn: "দুর্ঘটনা ও তদন্ত",
    icon: AlertTriangle,
    color: "text-rose-600 bg-rose-50 border-rose-200",
  },
  {
    id: "meeting_updates",
    labelEn: "Meeting Updates",
    labelBn: "ত্রিপক্ষীয় সভা ও সিদ্ধান্ত",
    icon: Users,
    color: "text-indigo-600 bg-indigo-50 border-indigo-200",
  },
  {
    id: "safety_instructions",
    labelEn: "Safety Instructions",
    labelBn: "নিরাপত্তা নির্দেশিকা",
    icon: ShieldAlert,
    color: "text-emerald-600 bg-emerald-50 border-emerald-200",
  },
  {
    id: "stakeholder_updates",
    labelEn: "Stakeholder Updates",
    labelBn: "অংশীজন হালনাগাদ",
    icon: Building,
    color: "text-amber-600 bg-amber-50 border-amber-200",
  },
];

export default function ArchivePage() {
  const { locale } = useDictionary();
  const isBn = locale === "bn";

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [viewingItem, setViewingItem] = useState(null);

  const queryParams = useMemo(() => {
    const p = {};
    if (selectedCategory !== "all") p.category = selectedCategory;
    if (searchQuery.trim()) p.search = searchQuery.trim();
    if (selectedYear !== "all") p.year = selectedYear;
    return p;
  }, [selectedCategory, searchQuery, selectedYear]);

  const { data: archiveData, isLoading } = useGetArchiveRecordsQuery(queryParams);
  const [trackDownload] = useTrackArchiveDownloadMutation();

  const records = archiveData?.data?.records || [];
  const total = archiveData?.data?.total || 0;

  const handleDownload = (item) => {
    if (item._id) {
      trackDownload(item._id);
    }
    toast.success(
      isBn
        ? "ডকুমেন্ট ডাউনলোড শুরু হয়েছে..."
        : "Document download initiated."
    );
    if (item.documentUrl) {
      window.open(item.documentUrl, "_blank");
    }
  };

  return (
    <main className="min-h-screen bg-slate-50/60 pb-20">
      {/* 1. Header Hero Banner */}
      <section className="bg-slate-900 text-white py-14 px-4 border-b border-slate-800">
        <div className="site-container max-w-5xl text-center space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/20 border border-primary/30 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
            <FileText className="h-3.5 w-3.5" />
            <span>{isBn ? "কেন্দ্রীয় আর্কাইভ ও নথি ভাণ্ডার" : "Official Digital Archive"}</span>
          </span>
          <H1 className="text-2xl sm:text-3xl md:text-4xl text-white font-black tracking-tight">
            {isBn
              ? "জাতীয় এলপিজি নিরাপত্তা, সার্কুলার ও তদন্ত আর্কাইভ"
              : "National LPG Regulatory, Incident & Safety Archive"}
          </H1>
          <P className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            {isBn
              ? "বিস্ফোরক পরিদপ্তর, লোয়াব ও বিদ্যুৎ জ্বালানি মন্ত্রণালয়ের সার্বিক প্রজ্ঞাপন, ত্রিপক্ষীয় সভার সিদ্ধান্ত এবং তদন্ত প্রতিবেদন সহজে অনুসন্ধান ও ডাউনলোড করুন।"
              : "Access and search authenticated circulars, safety guidelines, tripartite committee minutes, and official investigation reports."}
          </P>
        </div>
      </section>

      {/* 2. Main Filter & Search Section */}
      <section className="site-container max-w-5xl -mt-6 px-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm space-y-4">
          {/* Search & Year */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:flex-1">
              <Input
                placeholder={
                  isBn
                    ? "শিরোনাম, সার্কুলার নম্বর বা কি-ওয়ার্ড দিয়ে খুঁজুন..."
                    : "Search by title, reference number or keywords..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                prefix={<Search className="h-4 w-4 text-slate-400" />}
                className="w-full"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-xs font-bold text-slate-500 whitespace-nowrap">
                {isBn ? "সাল:" : "Year:"}
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-hidden focus:border-primary transition-colors"
              >
                <option value="all">{isBn ? "সকল বছর" : "All Years"}</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-primary text-white shadow-2xs"
                      : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{isBn ? cat.labelBn : cat.labelEn}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Archive Documents Listing */}
      <section className="site-container max-w-5xl mt-6 px-4">
        <div className="mb-4 flex items-center justify-between text-xs text-slate-500">
          <span>
            {isBn ? "মোট নথি পাওয়া গেছে:" : "Total Documents:"}{" "}
            <strong className="text-slate-800 font-bold">{total}</strong>
          </span>
        </div>

        {isLoading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="mt-3 text-xs text-slate-500">
              {isBn ? "আর্কাইভ লোড হচ্ছে..." : "Loading archive documents..."}
            </p>
          </div>
        ) : records.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
            <FileText className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">
              {isBn ? "কোনো নথি খুঁজে পাওয়া যায়নি" : "No documents found"}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {isBn
                ? "অনুগ্রহ করে অন্য কোনো কি-ওয়ার্ড অথবা অন্য ক্যাটাগরি বেছে নিন।"
                : "Try clearing search filters or selecting another archive category."}
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {records.map((item) => {
              const currentCat = CATEGORIES.find((c) => c.id === item.category) || CATEGORIES[0];
              const dateStr = item.publishDate
                ? new Date(item.publishDate).toLocaleDateString(
                    isBn ? "bn-BD" : "en-US",
                    { month: "short", day: "numeric", year: "numeric" }
                  )
                : "";

              return (
                <div
                  key={item._id}
                  className="rounded-xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-[11px]">
                        <span
                          className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded border text-[10px] uppercase ${
                            currentCat.color || "bg-slate-100 text-slate-700 border-slate-200"
                          }`}
                        >
                          {isBn ? currentCat.labelBn : currentCat.labelEn}
                        </span>

                        {item.referenceNumber && (
                          <span className="font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                            {item.referenceNumber}
                          </span>
                        )}

                        <span className="flex items-center gap-1 text-slate-400">
                          <Calendar className="h-3 w-3" />
                          <span>{dateStr}</span>
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-slate-900 hover:text-primary transition-colors cursor-pointer"
                        onClick={() => setViewingItem(item)}
                      >
                        {isBn ? item.titleBn || item.title : item.title}
                      </h3>

                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {isBn ? item.summaryBn || item.summary : item.summary}
                      </p>

                      {/* Tags */}
                      {Array.isArray(item.tags) && item.tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {item.tags.map((t, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] font-medium text-slate-500 bg-slate-50 border border-slate-200/60 px-2 py-0.5 rounded-full"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <button
                        onClick={() => setViewingItem(item)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-700 transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>{isBn ? "বিবরণ" : "View"}</span>
                      </button>

                      <button
                        onClick={() => handleDownload(item)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary hover:bg-primary/90 text-white px-3.5 py-1.5 text-xs font-bold shadow-2xs transition-colors"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>{isBn ? "ডাউনলোড" : "PDF"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Document Details Modal */}
      {viewingItem && (
        <Dialog
          isOpen={!!viewingItem}
          onClose={() => setViewingItem(null)}
          maxWidth="lg"
          title={isBn ? viewingItem.titleBn || viewingItem.title : viewingItem.title}
          description={viewingItem.referenceNumber ? `Reference: ${viewingItem.referenceNumber}` : "Official Archive Entry"}
        >
          <div className="p-6 space-y-4">
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">
                {isBn ? "প্রকাশনা তারিখ:" : "Published:"}{" "}
                {viewingItem.publishDate
                  ? new Date(viewingItem.publishDate).toLocaleDateString(
                      isBn ? "bn-BD" : "en-US",
                      { month: "long", day: "numeric", year: "numeric" }
                    )
                  : ""}
              </span>
              <span>•</span>
              <span className="capitalize">
                {viewingItem.category?.replace(/_/g, " ")}
              </span>
              <span>•</span>
              <span>
                {viewingItem.downloadCount || 0} {isBn ? "বার ডাউনলোড" : "downloads"}
              </span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed max-h-[55vh] overflow-y-auto pr-2">
              <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
                <h4 className="font-bold text-slate-900 mb-1">
                  {isBn ? "সারসংক্ষেপ" : "Summary"}
                </h4>
                <p className="text-slate-600">
                  {isBn
                    ? viewingItem.summaryBn || viewingItem.summary
                    : viewingItem.summary}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">
                  {isBn ? "পূর্ণাঙ্গ প্রজ্ঞাপন ও বিবরণ" : "Full Circular & Details"}
                </h4>
                <p className="whitespace-pre-line text-slate-600">
                  {isBn
                    ? viewingItem.contentBn || viewingItem.content || viewingItem.summaryBn
                    : viewingItem.content || viewingItem.summary}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewingItem(null)}
              >
                {isBn ? "বন্ধ করুন" : "Close"}
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={() => handleDownload(viewingItem)}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                <span>{isBn ? "অফিসিয়াল PDF ডাউনলোড" : "Download Official PDF"}</span>
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </main>
  );
}

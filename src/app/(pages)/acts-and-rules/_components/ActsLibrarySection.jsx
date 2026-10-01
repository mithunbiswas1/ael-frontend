// src/app/(pages)/acts-and-rules/_components/ActsLibrarySection.jsx
"use client";

import { useState } from "react";
import { Download, Search } from "lucide-react";
import { toast } from "sonner";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { H3, P } from "@/components/ui/Typography";
import { useDictionary } from "@/context/DictionaryContext";

export default function ActsLibrarySection({ gazettes = [] }) {
  const { locale, dict } = useDictionary();
  const isBn = locale === "bn";
  const actsDict = dict?.actsAndRules || {};

  const allStatutes =
    Array.isArray(gazettes) && gazettes.length > 0
      ? gazettes.map((g, idx) => ({
          id: g.id || `gazette-${idx}`,
          title: g.title || "",
          titleBn: g.titleBn || g.title || "",
          subtitle: g.subtitle || "",
          subtitleBn: g.subtitleBn || g.subtitle || "",
          category: g.category || "Official Gazette",
          categoryBn: g.categoryBn || "সরকারি গেজেট",
          authority: g.authority || "Ministry of Energy / DoE",
          authorityBn: g.authority || "জ্বালানি মন্ত্রণালয় / বিস্ফোরক পরিদপ্তর",
          gazetteRef: g.gazetteRef || `Gazette ${g.year || ""}`,
          year: g.year || "",
          yearBn: g.yearBn || g.year || "",
          fileSize: g.fileSize || "Official PDF",
          fileUrl: g.fileUrl || "",
        }))
      : [];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredActs = allStatutes.filter((act) => {
    const titleMatch =
      (isBn ? act.titleBn : act.title)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const subtitleMatch =
      (isBn ? act.subtitleBn : act.subtitle)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.subtitle?.toLowerCase().includes(searchTerm.toLowerCase());
    const authorityMatch =
      (isBn ? act.authorityBn : act.authority)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.authority?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSearch = !searchTerm || titleMatch || subtitleMatch || authorityMatch;

    const matchesCategory =
      selectedCategory === "all" ||
      act.category?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="relative z-20 -mt-8 mx-auto w-full max-w-5xl px-4 pb-20">
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-8 shadow-2xs mb-6">
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1">
            <Input
              placeholder={
                actsDict.searchPlaceholder ||
                (isBn
                  ? "আইনের নাম, গেজেট রেফারেন্স অথবা কর্তৃপক্ষ দিয়ে অনুসন্ধান করুন..."
                  : "Search by act name, gazette reference, or authority...")
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="sm"
              prefix={<Search className="h-4 w-4 text-slate-400" />}
              className="bg-slate-50/70 text-xs"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: "all", label: actsDict.allCategories || (isBn ? "সকল ক্যাটাগরি" : "All Categories") },
              ...Array.from(new Set(allStatutes.map((s) => s.category).filter(Boolean))).map((cat) => {
                const match = allStatutes.find((s) => s.category === cat);
                return {
                  id: cat,
                  label: isBn && match?.categoryBn ? match.categoryBn : cat,
                };
              }),
            ].map((cat) => (
              <Button
                key={cat.id}
                variant="unstyled"
                onClick={() => setSelectedCategory(cat.id)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-primary text-white shadow-2xs"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Statutes List */}
        <div className="space-y-4">
          {filteredActs.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              {isBn
                ? "আপনার অনুসন্ধানের সাথে মিলে এমন কোনো আইন বা বিধিমালা পাওয়া যায়নি।"
                : "No statutes or regulations found matching your query."}
            </div>
          ) : (
            filteredActs.map((act) => {
              const displayTitle = isBn && act.titleBn ? act.titleBn : act.title;
              const displaySubtitle = isBn && act.subtitleBn ? act.subtitleBn : act.subtitle;
              const displayCategory = isBn && act.categoryBn ? act.categoryBn : act.category;
              const displayAuthority = isBn && act.authorityBn ? act.authorityBn : act.authority;
              const displayYear = isBn && act.yearBn ? act.yearBn : act.year;

              return (
                <div
                  key={act.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 sm:p-5 transition-all hover:bg-white hover:border-primary/40"
                >
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded bg-blue-50 border border-blue-100 px-2 py-0.5 text-[10px] font-bold text-primary">
                        {displayCategory}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {act.gazetteRef} • {isBn ? "জারিকৃত:" : "Enacted:"} {displayYear}
                      </span>
                    </div>

                    <H3 className="text-sm font-bold text-slate-900 leading-snug">
                      {displayTitle}
                    </H3>

                    <P color="muted" size="xs" className="leading-relaxed">
                      {displaySubtitle}
                    </P>

                    <div className="text-[11px] text-slate-500 font-medium">
                      {isBn ? "প্রয়োগকারী কর্তৃপক্ষ:" : "Enforcing Authority:"}{" "}
                      <strong className="text-slate-700">{displayAuthority}</strong>
                    </div>
                  </div>

                  <div className="shrink-0 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (act.fileUrl) {
                          window.open(act.fileUrl, "_blank");
                        } else {
                          toast.success(
                            isBn
                              ? `${displayTitle} এর অফিশিয়াল গেজেট ডাউনলোড হচ্ছে (${act.fileSize})...`
                              : `Downloading official gazette PDF for ${act.title} (${act.fileSize})...`
                          );
                        }
                      }}
                      className="w-full sm:w-auto text-xs font-bold gap-1.5"
                    >
                      <Download className="h-3.5 w-3.5 text-blue-600" />
                      <span>{actsDict.downloadPdf || (isBn ? "গেজেট ডাউনলোড" : "Download Gazette PDF")}</span>
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Legal Disclaimer Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 text-xs text-slate-500 leading-relaxed">
        <strong className="text-slate-800 block mb-1">
          {isBn ? "অফিশিয়াল সতর্কবার্তা:" : "Official Disclaimer:"}
        </strong>
        {isBn
          ? "এই পোর্টালে প্রকাশিত আইন ও গেজেটসমূহ শুধুমাত্র সচেতনতা ও রেফারেন্সের উদ্দেশ্যে সংকলিত হয়েছে। যেকোনো আইনি বা বিচারিক প্রক্রিয়ার জন্য মুদ্রণ ও প্রকাশনা অধিদপ্তর কর্তৃক প্রকাশিত বাংলাদেশ গেজেটের মূল কপি অনুসরণ করুন।"
          : "The legal texts and gazette orders published on this portal are indexed for educational and compliance reference purposes only. For judicial or court proceedings, please refer to the official hardcopy Bangladesh Government Gazette published by the Department of Printing and Publications."}
      </div>
    </section>
  );
}

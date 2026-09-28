// src/app/(pages)/safety-guidelines/_components/GuidelinesGridSection.jsx

"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Lightbulb,
  ArrowRight,
  Building2,
  ExternalLink,
  FileText,
  Download,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { H3, H4 } from "@/components/ui/Typography";
import SectionHeader from "@/components/ui/SectionHeader";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import { STAKEHOLDER_TABS } from "./StakeholderTabsSection";
import { useDictionary } from "@/context/DictionaryContext";

export default function GuidelinesGridSection({ activeTab, sections = {} }) {
  const { locale, dict } = useDictionary();
  const isBn = locale === "bn";
  const sg = dict?.safetyGuidelines || {};

  const dynamicStandards = Array.isArray(sections?.standardsList) ? sections.standardsList : [];
  const dynamicAgencies = Array.isArray(sections?.regulatoryAgencies) ? sections.regulatoryAgencies : [];
  const dynamicDocs = Array.isArray(sections?.documentDownloads) ? sections.documentDownloads : [];

  const handleDownload = (doc) => {
    const docTitle = isBn ? doc.nameBn : doc.nameEn;
    if (doc.access === "Login Required") {
      toast.error(
        isBn
          ? `"${docTitle}" ডাউনলোড করতে অনুগ্রহ করে লগইন করুন।`
          : `"${docTitle}" requires authentication. Please log in to download.`
      );
    } else {
      toast.success(
        isBn
          ? `ডাউনলোড শুরু হচ্ছে: ${docTitle} (PDF)`
          : `Starting download: ${docTitle} (PDF)`
      );
    }
  };

  const filteredDocs = dynamicDocs.filter(
    (doc) => doc.targetTab === "all" || doc.targetTab === activeTab
  );

  const activeTabObj = STAKEHOLDER_TABS.find((t) => t.id === activeTab);
  const activeTabLabel = isBn
    ? activeTabObj?.labelBn || activeTabObj?.label
    : activeTabObj?.label;

  return (
    <section className="py-12 sm:py-16">
      <div className="site-container">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-8">
          {/* Left Column (4 cols): Global Safety Standards & Safety Tip */}
          <div className="space-y-6 lg:col-span-4">
            {/* Global Standards Card */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs">
              <H3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                {sg.globalStandardsTitle || (isBn ? "বৈশ্বিক নিরাপত্তা মানদণ্ড" : "GLOBAL SAFETY STANDARDS")}
              </H3>

              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                {sg.globalStandardsDesc ||
                  (isBn
                    ? "বাংলাদেশে এলপিজি নিরাপত্তা নিশ্চিত করতে আমরা আন্তর্জাতিকভাবে স্বীকৃত মানদণ্ড অনুসরণ করি।"
                    : "We follow globally recognized practices and international safety standards to ensure LPG safety across Bangladesh.")}
              </p>

              <div className="mt-4 space-y-2.5 border-t border-slate-100 pt-4">
                {dynamicStandards.map((std, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
                    <span>{isBn ? std.bn : std.en}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5">
                <button
                  onClick={() =>
                    toast.info(
                      isBn
                        ? "আন্তর্জাতিক এলপিজি নিরাপত্তা ডাটাবেজ প্রদর্শিত হচ্ছে।"
                        : "Accessing international LPG safety documentation database."
                    )
                  }
                  className="w-full rounded-lg bg-primary py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-blue-700"
                >
                  {sg.viewAllStandards || (isBn ? "সকল মানদণ্ড দেখুন" : "View All Standards")}
                </button>
              </div>
            </div>

            {/* Safety Tip Card */}
            <div className="flex items-start gap-3.5 rounded-xl border border-amber-200 bg-amber-50/70 p-5 shadow-xs">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-white shadow-xs">
                <Lightbulb className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-wider text-amber-900">
                  {sg.safetyTipTitle || (isBn ? "নিরাপত্তা টিপস" : "SAFETY TIP")}
                </div>
                <p className="mt-1 text-xs leading-relaxed text-amber-800">
                  {isBn
                    ? "ব্যবহারের পূর্বে সর্বদা আপনার এলপিজি সিলিন্ডার, রেগুলেটর এবং পাইপ পরীক্ষা করুন। কোনো ফাটল আছে কিনা দেখুন এবং সাবান-পানি দিয়ে লিক পরীক্ষা করুন।"
                    : "Always inspect your LPG cylinder, regulator and hose before use. Look for cracks, smell gas, and conduct regular soap-water leak checks."}
                </p>
                <Link
                  href="/blogs"
                  className="mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-amber-900 underline hover:text-amber-950"
                >
                  <span>{isBn ? "আরও নিরাপত্তা টিপস জানুন" : "Learn More Safety Tips"}</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column (8 cols): Regulatory Documents & Guidelines Downloads */}
          <div className="space-y-8 lg:col-span-8">
            {/* 1. Regulatory Documents */}
            <div>
              <SectionHeader
                tag={isBn ? "সরকার ও শিল্প খাত" : "GOVERNMENT & INDUSTRY"}
                title={sg.regulatoryTitle || (isBn ? "নিয়ন্ত্রক" : "REGULATORY")}
                accent={isBn ? "কর্তৃপক্ষ।" : "DOCUMENTS."}
                subtitle={
                  sg.officialDirectives ||
                  (isBn
                    ? "জাতীয় কমপ্লায়েন্স কর্তৃপক্ষ কর্তৃক জারিকৃত সরকারি নির্দেশনা ও কারিগরি বিধিমালা।"
                    : "Official circulars, clearance standards, and gazette notifications from governing bodies.")
                }
                className="mb-4"
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {dynamicAgencies.map((agency) => (
                  <div
                    key={agency.id}
                    className="group flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs transition-colors duration-200 hover:border-primary/50"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`rounded-lg border px-2.5 py-1 text-xs font-black uppercase tracking-wider ${agency.badgeBg}`}
                        >
                          {agency.name}
                        </span>
                        <Building2 className="h-4 w-4 text-slate-400" />
                      </div>

                      <H4 className="mt-3 text-xs font-bold text-slate-900 leading-snug">
                        {isBn ? agency.titleBn : agency.titleEn}
                      </H4>

                      <p className="mt-1 text-[11px] leading-relaxed text-slate-500 line-clamp-2">
                        {isBn ? agency.descBn : agency.descEn}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <a
                        href={agency.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                      >
                        <span>{isBn ? "ওয়েবসাইট দেখুন" : "View Documents"}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Guidelines & Downloads Table */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs">
              <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <H3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                    {sg.downloadableManuals || (isBn ? "সরকারি নির্দেশিকা ও ম্যানুয়াল" : "GUIDELINES & DOWNLOADS")}
                  </H3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {isBn
                      ? "কিছু সংরক্ষিত নথি শুধুমাত্র নিবন্ধিত ব্যবহারকারীদের জন্য উন্মুক্ত।"
                      : "Some documents are restricted and available for logged-in users only."}
                  </p>
                </div>
                <span className="self-start sm:self-auto rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                  {isBn ? `প্রদর্শিত: ${activeTabLabel}` : `Showing: ${activeTabLabel}`}
                </span>
              </div>

              {/* Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{sg.docName || (isBn ? "নথির নাম" : "Document Name")}</TableHead>
                    <TableHead>{sg.fileFormat || (isBn ? "ফরম্যাট" : "Type")}</TableHead>
                    <TableHead>{sg.accessLevel || (isBn ? "অ্যাক্সেস" : "Access")}</TableHead>
                    <TableHead className="text-right">{sg.action || (isBn ? "ডাউনলোড" : "Download")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocs.map((doc) => {
                    const isPublic = doc.access === "Public";
                    const docTitle = isBn ? doc.nameBn : doc.nameEn;
                    const accessText = isPublic
                      ? isBn ? "সবার জন্য উন্মুক্ত" : "Public"
                      : isBn ? "লগইন প্রয়োজন" : "Login Required";

                    return (
                      <TableRow key={doc.id}>
                        <TableCell className="font-semibold text-slate-800">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 shrink-0 text-slate-400" />
                            <span>{docTitle}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                            {doc.type}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${isPublic
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-blue-50 text-primary border border-blue-200"
                              }`}
                          >
                            {accessText}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {isPublic ? (
                            <button
                              onClick={() => handleDownload(doc)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-primary shadow-2xs hover:bg-primary hover:text-white transition-colors"
                              title={isBn ? "পিডিএফ ডাউনলোড" : "Download PDF"}
                            >
                              <Download className="h-3.5 w-3.5" />
                            </button>
                          ) : (
                            <Link
                              href="/login"
                              onClick={() => handleDownload(doc)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-500 hover:border-primary hover:text-primary transition-colors"
                              title={isBn ? "ডাউনলোড করতে লগইন প্রয়োজন" : "Login Required to Download"}
                            >
                              <Lock className="h-3.5 w-3.5" />
                            </Link>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400">
                <span>
                  {isBn
                    ? "বিদ্যুৎ, জ্বালানি ও খনিজ সম্পদ মন্ত্রণালয় কর্তৃক অনুমোদিত"
                    : "Authorized by Ministry of Power, Energy & Mineral Resources"}
                </span>
                <span>{isBn ? "সর্বশেষ হালনাগাদ: মে ২০২৪" : "Updated: May 2024"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

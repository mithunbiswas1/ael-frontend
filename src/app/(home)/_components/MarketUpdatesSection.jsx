// src/app/(home)/_components/MarketUpdatesSection.jsx
"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import MarketUpdateCard from "@/components/shared/MarketUpdateCard";
import SectionHeader from "@/components/ui/SectionHeader";

const DEFAULT_UPDATES = [
  {
    id: "update-1",
    category: "incidents",
    badgeText: "Incident Report",
    badgeTextBn: "দুর্ঘটনা রিপোর্ট",
    imageUrl:
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop",
    title: "Chattogram Port LPG Terminal Safety Probe & Incident Analysis Report",
    titleBn: "চট্টগ্রাম বন্দর এলপিজি টার্মিনাল নিরাপত্তা তদন্ত ও দুর্ঘটনা বিশ্লেষণ প্রতিবেদন",
    summary:
      "Investigation into the static discharge leak and rapid valve response at Chattogram coastal terminal.",
    summaryBn:
      "চট্টগ্রাম উপকূলীয় টার্মিনালে স্ট্যাটিক ডিসচার্জ লিক ও জরুরি ভাল্ব নিয়ন্ত্রণ ব্যবস্থার কারিগরি তদন্ত প্রতিবেদন।",
    date: "May 20, 2024",
    dateBn: "২০ মে, ২০২৪",
    slug: "chattogram-port-lpg-terminal-safety-probe-analysis",
    hasPdf: true,
  },
  {
    id: "update-2",
    category: "berc",
    badgeText: "BERC Notice",
    badgeTextBn: "বিইআরসি বার্তা",
    imageUrl:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
    title: "BERC Official Statutory Notice: 12kg Cylinder Retail Price & Tariff Formula",
    titleBn: "বিইআরসি সংবিধিবদ্ধ প্রজ্ঞাপন: ১২ কেজি সিলিন্ডার খুচরা মূল্য ও ট্যারিফ নির্ধারণ",
    summary:
      "Statutory circular outlining international Saudi Aramco CP adjustment and consumer price ceiling.",
    summaryBn:
      "সৌদি আরামকো সিপি দর ও ভোক্তা পর্যায়ে ১২ কেজি বোতলজাত এলপিজির সমন্বিত মূল্য তালিকা।",
    date: "May 18, 2024",
    dateBn: "১৮ মে, ২০২৪",
    slug: "berc-official-statutory-notice-12kg-cylinder-pricing",
    hasPdf: true,
  },
];

export default function MarketUpdatesSection({
  dict = {},
  liveUpdates = [],
  locale = "en",
}) {
  const isBn = locale === "bn";

  const rawItems = liveUpdates && liveUpdates.length > 0 ? liveUpdates : DEFAULT_UPDATES;

  const items = rawItems.slice(0, 2).map((update, idx) => {
    const dictItem = dict?.items?.[idx];
    const liveTitle = isBn
      ? update.titleBn || update.title
      : update.title || update.titleEn;
    const liveSummary = isBn
      ? update.summaryBn || update.summary
      : update.summary || update.summaryEn;
    const liveDate = isBn
      ? update.dateBn || update.date
      : update.date;
    const liveBadge = isBn
      ? update.categoryBn || update.badgeTextBn
      : update.badgeText;

    return {
      id: update.id || update._id || `mu-${idx}`,
      category: update.category,
      badgeText: liveBadge || dictItem?.badge || (update.category === "incidents" ? "Incident Report" : update.category === "berc" ? "BERC Notice" : "Global Market"),
      imageUrl: update.imageUrl || update.image,
      title: liveTitle || dictItem?.title,
      summary: liveSummary || dictItem?.desc || "",
      date: liveDate || dictItem?.date,
      href: `/market-updates/${update.slug || update.id || update._id}`,
      hasPdf: Boolean(update.pdfUrl || update.hasPdf),
      pdfUrl: update.pdfUrl,
    };
  });

  return (
    <div className="mb-10">
      {/* Header */}
      <SectionHeader
        level="h3"
        tag={dict?.tag || "INDUSTRY INTELLIGENCE"}
        title={dict?.title || "LPG MARKET"}
        accent={dict?.accent || "UPDATES."}
        subtitle={
          dict?.subtitle ||
          "Real-time market insights, regulatory circulars, and sector reports"
        }
        className="mb-5"
        action={
          <Link
            href="/market-updates"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/90 px-4 py-1.5 text-xs font-bold text-slate-700 backdrop-blur-md transition-colors duration-200 hover:border-primary hover:bg-primary hover:text-white"
          >
            <span>{dict?.viewAll || "View All"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        }
      />

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((item) => (
          <MarketUpdateCard
            key={item.id}
            category={item.category}
            badgeText={item.badgeText}
            imageUrl={item.imageUrl}
            title={item.title}
            summary={item.summary}
            date={item.date}
            href={item.href}
            hasPdf={item.hasPdf}
            pdfUrl={item.pdfUrl}
          />
        ))}
      </div>
    </div>
  );
}

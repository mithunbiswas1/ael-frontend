// src/components/shared/MarketUpdateCard.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight } from "lucide-react";
import { FaFilePdf } from "react-icons/fa";
import { H4 } from "@/components/ui/Typography";

const BADGE_VARIANTS = {
  incidents: "bg-rose-600 text-white",
  "Incident Report": "bg-rose-600 text-white",
  "দুর্ঘটনা রিপোর্ট": "bg-rose-600 text-white",
  "দুর্ঘটনা ও তদন্ত": "bg-rose-600 text-white",
  berc: "bg-blue-600 text-white",
  "BERC Message": "bg-blue-600 text-white",
  "বিইআরসি বার্তা": "bg-blue-600 text-white",
  "বিইআরসি সার্কুলার": "bg-blue-600 text-white",
  global: "bg-purple-600 text-white",
  "Global Market": "bg-purple-600 text-white",
  "বৈশ্বিক মার্কেট আপডেট": "bg-purple-600 text-white",
};

export default function MarketUpdateCard({
  category,
  badgeText,
  imageUrl,
  title,
  summary,
  date,
  hasPdf = false,
  pdfUrl,
  href = "/market-updates",
  viewMode = "grid", // "grid" | "list"
}) {
  const defaultImage = "/default_image.jpg";
  const safeImageUrl =
    imageUrl && typeof imageUrl === "string" && imageUrl.trim() !== ""
      ? imageUrl
      : defaultImage;

  const badgeStyle =
    BADGE_VARIANTS[category] ||
    BADGE_VARIANTS[badgeText] ||
    "bg-primary text-white";

  const resolvedBadgeText =
    badgeText ||
    (category === "incidents"
      ? "Incidents"
      : category === "berc"
      ? "BERC Notice"
      : "Global Market");

  // ── LIST VIEW MODE ──
  if (viewMode === "list") {
    return (
      <Link
        href={href}
        className="group flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-colors duration-200 hover:border-primary/50"
      >
        {/* Left Thumbnail (Desktop) / Top (Mobile) */}
        <div className="relative w-full sm:w-64 md:w-72 shrink-0 aspect-16/10 sm:aspect-auto overflow-hidden bg-slate-100">
          <Image
            src={safeImageUrl}
            alt={title || "Market Update"}
            fill
            sizes="(max-width: 640px) 100vw, 300px"
            className="object-cover"
            onError={(e) => {
              e.currentTarget.src = defaultImage;
            }}
          />

          {/* Category Badge on image */}
          <span
            className={`absolute left-3 top-3 rounded-md px-2.5 py-1 text-[10px] font-black uppercase tracking-wider shadow-xs ${badgeStyle}`}
          >
            {resolvedBadgeText}
          </span>

          {/* Floating PDF Badge on image */}
          {(hasPdf || pdfUrl) && (
            <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-white/95 px-2 py-0.5 text-[10px] font-black text-rose-600 shadow-xs backdrop-blur-xs border border-rose-200">
              <FaFilePdf className="h-3 w-3 text-rose-600 shrink-0" />
              <span>PDF</span>
            </span>
          )}
        </div>

        {/* Right Content */}
        <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${badgeStyle}`}>
                {resolvedBadgeText}
              </span>
              {(hasPdf || pdfUrl) && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200/60">
                  <FaFilePdf className="h-3 w-3 text-rose-600 shrink-0" />
                  <span>Circular / PDF</span>
                </span>
              )}
            </div>

            <H4 className="text-base sm:text-lg font-bold text-slate-900 transition-colors group-hover:text-primary leading-snug line-clamp-2">
              {title}
            </H4>

            {summary && (
              <p className="line-clamp-2 sm:line-clamp-3 text-xs sm:text-sm text-slate-500 leading-relaxed">
                {summary}
              </p>
            )}
          </div>

          <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>{date}</span>
            </div>

            <span className="inline-flex items-center gap-1 text-xs font-bold text-primary transition-transform group-hover:translate-x-1">
              <span>Read Full Report</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // ── GRID VIEW MODE (Default) ──
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-colors duration-200 hover:border-primary/50"
    >
      {/* Image container with floating badges */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
        <Image
          src={safeImageUrl}
          alt={title || "Market Update"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          onError={(e) => {
            e.currentTarget.src = defaultImage;
          }}
        />

        {/* Category Badge */}
        <span
          className={`absolute left-3 top-3 rounded-md px-2.5 py-1 text-[10px] font-black uppercase tracking-wider shadow-xs ${badgeStyle}`}
        >
          {resolvedBadgeText}
        </span>

        {/* PDF Indicator Badge */}
        {(hasPdf || pdfUrl) && (
          <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-md bg-white/95 px-2 py-0.5 text-[10px] font-black text-rose-600 shadow-xs backdrop-blur-xs border border-rose-200">
            <FaFilePdf className="h-3 w-3 text-rose-600 shrink-0" />
            <span>PDF</span>
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div className="space-y-2">
          <H4 className="line-clamp-2 text-sm sm:text-base font-bold text-slate-900 transition-colors group-hover:text-primary leading-snug">
            {title}
          </H4>

          {summary && (
            <p className="line-clamp-2 text-xs text-slate-500 leading-relaxed">
              {summary}
            </p>
          )}
        </div>

        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>{date}</span>
          </div>

          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary transition-transform group-hover:translate-x-0.5">
            <span>Read Report</span>
            <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

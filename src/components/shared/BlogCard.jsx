// src/components/shared/BlogCard.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight } from "lucide-react";
import { H4 } from "@/components/ui/Typography";
import { useDictionary } from "@/context/DictionaryContext";

const BLOG_BADGE_VARIANTS = {
  seminar: "bg-blue-600 text-white",
  Seminar: "bg-blue-600 text-white",
  "সেমিনার": "bg-blue-600 text-white",
  programs_of_association: "bg-teal-600 text-white",
  "Programs of Association": "bg-teal-600 text-white",
  "অ্যাসোসিয়েশনের কার্যক্রম": "bg-teal-600 text-white",
  safety: "bg-emerald-600 text-white",
  Safety: "bg-emerald-600 text-white",
  "Safety Protocols": "bg-emerald-600 text-white",
  "Safety Tips": "bg-emerald-600 text-white",
  "নিরাপত্তা": "bg-emerald-600 text-white",
  "নিরাপত্তা প্রটোকল": "bg-emerald-600 text-white",
  regulations: "bg-purple-600 text-white",
  Regulations: "bg-purple-600 text-white",
  "নীতিমালা": "bg-purple-600 text-white",
  technology: "bg-indigo-600 text-white",
  Technology: "bg-indigo-600 text-white",
  "প্রযুক্তি": "bg-indigo-600 text-white",
  industry_news: "bg-sky-600 text-white",
  "Industry News": "bg-sky-600 text-white",
  "শিল্প সংবাদ": "bg-sky-600 text-white",
};

const CATEGORY_DISPLAY_MAP = {
  seminar: { en: "Seminar", bn: "সেমিনার" },
  programs_of_association: { en: "Programs of Association", bn: "অ্যাসোসিয়েশনের কার্যক্রম" },
  safety: { en: "Safety Protocols", bn: "নিরাপত্তা প্রটোকল" },
  "safety protocols": { en: "Safety Protocols", bn: "নিরাপত্তা প্রটোকল" },
  regulations: { en: "Regulations", bn: "নীতিমালা" },
  technology: { en: "Technology", bn: "প্রযুক্তি" },
  industry_news: { en: "Industry News", bn: "শিল্প সংবাদ" },
};

function formatBadgeText(rawText, isBn) {
  if (!rawText) return isBn ? "ব্লগ নিবন্ধ" : "Blog Article";
  const normalizedKey = rawText.toString().toLowerCase().trim();
  if (CATEGORY_DISPLAY_MAP[normalizedKey]) {
    return isBn ? CATEGORY_DISPLAY_MAP[normalizedKey].bn : CATEGORY_DISPLAY_MAP[normalizedKey].en;
  }
  // If it's already a clean string or contains Bengali, return as is
  if (/[^\u0000-\u007F]/.test(rawText)) return rawText;
  // Convert snake_case or kebab-case to Title Case
  return rawText
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function BlogCard({
  category,
  badgeText,
  imageUrl,
  title,
  summary,
  date,
  href = "/blogs",
  viewMode = "grid", // "grid" | "list"
  readMoreText,
  className = "",
}) {
  const { locale } = useDictionary();
  const isBn = locale === "bn";

  const defaultImage = "/default_image.jpg";
  const safeImageUrl =
    imageUrl && typeof imageUrl === "string" && imageUrl.trim() !== ""
      ? imageUrl
      : defaultImage;

  const resolvedBadgeText = formatBadgeText(badgeText || category, isBn);

  const badgeStyle =
    BLOG_BADGE_VARIANTS[category] ||
    BLOG_BADGE_VARIANTS[badgeText] ||
    BLOG_BADGE_VARIANTS[resolvedBadgeText] ||
    "bg-primary text-white";

  const resolvedReadMore =
    readMoreText || (isBn ? "সম্পূর্ণ পড়ুন" : "Read Article");

  // ── LIST VIEW MODE (Matches MarketUpdateCard List View) ──
  if (viewMode === "list") {
    return (
      <Link
        href={href}
        className={`group flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-colors duration-200 hover:border-primary/50 ${className}`}
      >
        {/* Left Thumbnail (Desktop) / Top (Mobile) */}
        <div className="relative w-full sm:w-64 md:w-72 shrink-0 aspect-16/10 sm:aspect-auto overflow-hidden bg-slate-100">
          <Image
            src={safeImageUrl}
            alt={title || "Blog Post"}
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
        </div>

        {/* Right Content */}
        <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold ${badgeStyle}`}>
                {resolvedBadgeText}
              </span>
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
              <span>{isBn ? "সম্পূর্ণ পড়ুন" : "Read Full Article"}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </Link>
    );
  }

  // ── GRID VIEW MODE (Matches MarketUpdateCard Grid View) ──
  return (
    <Link
      href={href}
      className={`group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs transition-colors duration-200 hover:border-primary/50 ${className}`}
    >
      {/* Image container with floating badge */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
        <Image
          src={safeImageUrl}
          alt={title || "Blog Post"}
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
            <span>{resolvedReadMore}</span>
            <ArrowRight className="h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}

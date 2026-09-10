// src/components/shared/SafetyGuidelineCard.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const STAKEHOLDER_THEMES = {
  consumer: "bg-emerald-600",
  dealer: "bg-blue-600",
  distributor: "bg-amber-500",
  "auto-gas": "bg-purple-600",
  industrial: "bg-teal-600",
};

export default function SafetyGuidelineCard({
  id,
  icon: Icon,
  badgeText,
  imageUrl,
  description,
  href = "/safety-guidelines",
}) {
  const iconBg = STAKEHOLDER_THEMES[id] || "bg-primary";

  return (
    <Link
      href={href}
      className="group flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white/90 p-4 backdrop-blur-md transition-colors duration-200 hover:border-primary/50 hover:bg-white hover:shadow-xs"
    >
      <div>
        {/* Category Header */}
        <div className="mb-3 flex items-center gap-2">
          <div
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white ${iconBg}`}
          >
            {Icon && <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />}
          </div>
          <span className="text-xs font-black uppercase tracking-wider text-slate-900">
            {badgeText}
          </span>
        </div>

        {/* Thumbnail Image */}
        <div className="relative aspect-16/10 w-full overflow-hidden rounded-lg bg-slate-100">
          <Image
            src={imageUrl}
            alt={badgeText}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
            className="object-cover"
          />
        </div>

        {/* Description */}
        <p className="mt-2.5 text-xs leading-relaxed text-slate-500 line-clamp-2">
          {description}
        </p>
      </div>

      {/* Link action */}
      <div className="mt-3">
        <span className="inline-flex items-center gap-1 text-xs font-bold text-primary transition-colors group-hover:text-blue-700">
          <span>View Guidelines</span>
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

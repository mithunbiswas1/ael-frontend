// src/components/shared/SafetyGuidelineCard.jsx

"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { H5, P } from "../ui/Typography";

const STAKEHOLDER_THEMES = {
  consumer: "bg-emerald-600",
  dealer: "bg-blue-600",
  distributor: "bg-amber-500",
  investors: "bg-teal-600",
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
      className="group flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white/90 p-4 backdrop-blur-md transition-colors duration-200 hover:border-primary/50 hover:bg-white"
    >
      <div>
        {/* Category Header */}
        <div className="mb-3 flex items-center gap-2">
          <div
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white ${iconBg}`}
          >
            {Icon && <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />}
          </div>
          <H5 className="font-bold uppercase">
            {badgeText}
          </H5>
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
        <P color="dark" className="mt-2.5 line-clamp-2">
          {description}
        </P>
      </div>

      {/* Link action */}
      <div className="mt-3">
        <P className="inline-flex !text-sm items-center gap-1 font-semibold text-primary">
          <span>View Guidelines</span>
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </P>
      </div>
    </Link>
  );
}

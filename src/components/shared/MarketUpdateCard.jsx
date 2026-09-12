// src/components/shared/MarketUpdateCard.jsx

import Link from "next/link";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { H4 } from "@/components/ui/Typography";

const BADGE_VARIANTS = {
  "Incident Report": "bg-red-700 text-white",
  "BERC Message": "bg-blue-700 text-white",
  "Stakeholder Update": "bg-emerald-800 text-white",
  "Global Market": "bg-purple-800 text-white",
  incident: "bg-red-700 text-white",
  berc: "bg-blue-700 text-white",
  stakeholder: "bg-emerald-800 text-white",
  global: "bg-purple-800 text-white",
};

export default function MarketUpdateCard({
  category,
  badgeText,
  imageUrl,
  title,
  date,
  href = "/market-updates",
}) {
  const badgeStyle =
    BADGE_VARIANTS[category] ||
    BADGE_VARIANTS[badgeText] ||
    "bg-primary text-white";

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white/90 backdrop-blur-md transition-all duration-200 hover:border-primary/50 hover:bg-white hover:shadow-xs"
    >
      {/* Image container with floating badge */}
      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
          className="object-cover"
        />
        <span
          className={`absolute left-2.5 top-2.5 rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-wider shadow-xs ${badgeStyle}`}
        >
          {badgeText}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-3.5">
        <H4 className="line-clamp-2 transition-colors group-hover:text-primary leading-snug">
          {title}
        </H4>

        <div className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
          <Calendar className="h-3 w-3 text-slate-400" />
          <span>{date}</span>
        </div>
      </div>
    </Link>
  );
}

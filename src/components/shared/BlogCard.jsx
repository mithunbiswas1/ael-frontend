// src/components/shared/BlogCard.jsx
import Link from "next/link";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { H4 } from "@/components/ui/Typography";

const BLOG_BADGE_VARIANTS = {
  Seminar: "bg-blue-600 text-white",
  seminar: "bg-blue-600 text-white",
  "Safety Tips": "bg-emerald-600 text-white",
  safety: "bg-emerald-600 text-white",
  Program: "bg-teal-600 text-white",
  program: "bg-teal-600 text-white",
  Regulations: "bg-purple-600 text-white",
  regulations: "bg-purple-600 text-white",
  Technology: "bg-indigo-600 text-white",
  technology: "bg-indigo-600 text-white",
  Environment: "bg-emerald-700 text-white",
  environment: "bg-emerald-700 text-white",
  "Industry News": "bg-sky-600 text-white",
  news: "bg-sky-600 text-white",
};

export default function BlogCard({
  category,
  badgeText,
  imageUrl,
  title,
  date,
  readTime,
  href = "/blogs",
}) {
  const badgeStyle =
    BLOG_BADGE_VARIANTS[category] ||
    BLOG_BADGE_VARIANTS[badgeText] ||
    "bg-emerald-600 text-white";

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
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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

        <div className="mt-3 flex items-center gap-2 text-[11px] font-medium text-slate-500">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-slate-400" />
            <span>{date}</span>
          </div>
          {readTime && (
            <>
              <span className="text-slate-300">•</span>
              <span>{readTime}</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

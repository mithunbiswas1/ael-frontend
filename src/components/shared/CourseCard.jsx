// src/components/shared/CourseCard.jsx

import Image from "next/image";
import { Clock, BookOpen, User, ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/LinkButton";
import { H3, P } from "@/components/ui/Typography";

export default function CourseCard({
  isBestSeller = true,
  isPaid = true,
  imageUrl,
  title,
  description,
  duration = "3h 45m",
  lessonsCount = 12,
  level = "Beginner",
  price = "৳ 500.00",
  href = "/courses",
}) {
  return (
    <div className="group overflow-hidden rounded-xl border border-slate-200/80 bg-white/90 p-4 backdrop-blur-md transition-all duration-200 hover:border-primary/50 hover:bg-white hover:shadow-xs">
      {/* Thumbnail with floating badges */}
      <div className="relative aspect-16/10 w-full overflow-hidden rounded-lg bg-slate-100">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
          className="object-cover"
        />

        {isBestSeller && (
          <span className="absolute right-2.5 top-2.5 rounded-md bg-emerald-800 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-xs">
            Best Seller
          </span>
        )}

        <span
          className={`absolute bottom-2.5 left-2.5 rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-xs ${
            isPaid ? "bg-primary" : "bg-emerald-800"
          }`}
        >
          {isPaid ? "Paid Course" : "Free Course"}
        </span>
      </div>

      {/* Content */}
      <div className="mt-3.5 flex flex-col">
        <H3 className="text-sm sm:text-base font-bold transition-colors group-hover:text-primary">
          {title}
        </H3>

        <P size="xs" className="mt-1 line-clamp-2">
          {description}
        </P>

        {/* Specs row */}
        <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] font-medium text-slate-500">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5 text-slate-400" />
            <span>{lessonsCount} Lessons</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-3.5 w-3.5 text-slate-400" />
            <span>{level}</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-3 border-t border-slate-100 pt-3">
          <div className="mb-2.5 text-lg font-black text-primary">
            {price}
          </div>

          <LinkButton
            href={href}
            variant="primary"
            size="sm"
            fullWidth
          >
            <span>Start Course</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </LinkButton>
        </div>
      </div>
    </div>
  );
}

// src/app/(pages)/courses/[slug]/_components/CourseDetailHero.jsx
import { Star, Clock, BookOpen, Award, Layers } from "lucide-react";
import { H1, P } from "@/components/ui/Typography";
import Breadcrumb from "@/components/ui/Breadcrumb";
import AmbientGlow from "@/components/ui/AmbientGlow";
import { getLocale, getDict } from "@/lib/i18n";

export default async function CourseDetailHero({ course }) {
  const [locale, dict] = await Promise.all([getLocale(), getDict()]);
  const isBn = locale === "bn";
  const common = dict?.common || {};

  const title = isBn ? course.titleBn || course.title : course.title;
  const description = isBn ? course.descriptionBn || course.description : course.description;
  const level = isBn ? course.levelBn || course.level : course.level;
  const duration = isBn ? course.durationBn || course.duration : course.duration;
  const moduleCount = course.curriculum?.length || 3;
  const totalLessons = course.totalLessons || 6;
  const rating = course.rating || 4.95;
  const enrolledCount = course.enrolledCount || 120;

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 pb-16 pt-10 text-white border-b border-slate-800">
      <AmbientGlow />

      <div className="site-container relative z-10">
        <div className="max-w-4xl">
          {/* 1. Breadcrumb */}
          <Breadcrumb
            dark
            items={[
              { label: common.home || (isBn ? "হোম" : "Home"), href: "/" },
              {
                label: isBn ? "প্রশিক্ষণ কোর্স" : "Training Courses",
                href: "/courses",
              },
              { label: title },
            ]}
            className="mb-4"
          />

          {/* 2. Course Name */}
          <H1 color="white" className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
            {title}
          </H1>

          {/* Description */}
          {description && (
            <P color="light" className="mt-3 max-w-2xl text-slate-300 leading-relaxed text-sm">
              {description}
            </P>
          )}

          {/* 3. Previous Rich Meta Specifications Row with icons */}
          <div className="mt-6 flex flex-wrap items-center gap-5 text-xs text-slate-300 border-t border-slate-800/80 pt-4">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <Star className="h-4 w-4 fill-amber-400" />
              <span>{rating}</span>
              <span className="text-slate-400 font-normal">
                ({isBn ? `${enrolledCount} জন শিক্ষার্থী` : `${enrolledCount} learners`})
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Layers className="h-4 w-4 text-blue-400" />
              <span>
                {moduleCount} {isBn ? "টি মডিউল" : "Modules"}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-blue-400" />
              <span>
                {totalLessons} {isBn ? "টি ভিডিও পাঠ" : "Lessons"}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-blue-400" />
              <span>{duration || "1h 45m"}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Award className="h-4 w-4 text-emerald-400" />
              <span>{isBn ? "যাচাইযোগ্য ডিজিটাল সনদ" : "Verifiable Certificate"}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { Star, Clock, BookOpen, Award, ShieldCheck } from "lucide-react";
import { H1, P } from "@/components/ui/Typography";
import AmbientGlow from "@/components/ui/AmbientGlow";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { getLocale, getDict } from "@/lib/i18n";

export default async function CourseDetailHero({ course }) {
  const [locale, dict] = await Promise.all([getLocale(), getDict()]);
  const isBn = locale === "bn";
  const common = dict?.common || {};

  const title = isBn ? course.titleBn || course.title : course.title;
  const description = isBn ? course.descriptionBn || course.description : course.description;
  const category = isBn ? course.categoryBn || course.category : course.category;
  const level = isBn ? course.levelBn || course.level : course.level;
  const duration = isBn ? course.durationBn || course.duration : course.duration;

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 pb-14 pt-10 text-white">
      <AmbientGlow />

      <div className="site-container relative z-10">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Breadcrumb
              dark
              items={[
                { label: common.home || (isBn ? "হোম" : "Home"), href: "/" },
                {
                  label: isBn ? "প্রশিক্ষণ ও কুইজ" : "Training & Quiz",
                  href: "/courses",
                },
                { label: title },
              ]}
              className="mb-4"
            />

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="rounded-full bg-blue-500/10 border border-blue-400/30 px-3 py-0.5 text-xs font-bold text-blue-400">
                {category}
              </span>
              <span className="rounded-full bg-slate-800 border border-slate-700 px-3 py-0.5 text-xs font-bold text-slate-300">
                {isBn ? `লেভেল: ${level}` : `Level: ${level}`}
              </span>
              <span className="rounded-full bg-emerald-500/10 border border-emerald-400/30 px-3 py-0.5 text-xs font-bold text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                <span>
                  {isBn ? "অফিসিয়াল সার্টিফিকেট অন্তর্ভুক্ত" : "Official Certificate Included"}
                </span>
              </span>
            </div>

            <H1 color="white">{title}</H1>

            <P color="light" className="mt-3.5 max-w-2xl">
              {description}
            </P>

            <div className="mt-6 flex flex-wrap items-center gap-5 text-xs text-slate-300 border-t border-slate-800/80 pt-4">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Star className="h-4 w-4 fill-amber-400" />
                <span>{course.rating}</span>
                <span className="text-slate-400 font-normal">
                  ({isBn ? `${course.enrolledCount} জন শিক্ষার্থী` : `${course.enrolledCount} learners`})
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-blue-400" />
                <span>{duration} {isBn ? "অন-ডিমান্ড" : "on-demand"}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-blue-400" />
                <span>
                  {isBn
                    ? `${course.totalLessons} পাঠ ও ১টি কুইজ`
                    : `${course.totalLessons} Lessons & 1 Quiz`}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <Award className="h-4 w-4 text-emerald-400" />
                <span>{isBn ? "কিউআর যাচাইযোগ্য সার্টিফিকেট" : "QR Verifiable Certificate"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

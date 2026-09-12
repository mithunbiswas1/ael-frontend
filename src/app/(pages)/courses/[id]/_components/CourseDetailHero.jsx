import { Star, Clock, BookOpen, Award, ShieldCheck } from "lucide-react";
import { H1, P } from "@/components/ui/Typography";
import AmbientGlow from "@/components/ui/AmbientGlow";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function CourseDetailHero({ course }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-tertiary via-[#0c1a33] to-tertiary pb-16 pt-10 md:pb-20 md:pt-14 text-white border-b border-primary/20">
      <AmbientGlow color="primary" />

      {/* Subtle Radial grid pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#224C8D_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.08]"
      />

      <div className="site-container relative z-10">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Breadcrumb
              items={[
                { label: "Home", href: "/" },
                { label: "Training & Quiz", href: "/courses" },
                { label: course.title },
              ]}
              className="mb-4"
            />

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="rounded-full bg-secondary/15 border border-secondary/40 px-3 py-0.5 text-xs font-bold text-secondary">
                {course.category}
              </span>
              <span className="rounded-full bg-white/10 border border-white/15 px-3 py-0.5 text-xs font-bold text-slate-300">
                Level: {course.level}
              </span>
              <span className="rounded-full bg-emerald-500/15 border border-emerald-400/40 px-3 py-0.5 text-xs font-bold text-emerald-300 flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" />
                <span>Official Certificate Included</span>
              </span>
            </div>

            <H1 color="white">
              {course.title}
            </H1>

            <P color="light" className="mt-3.5 max-w-2xl text-slate-300">
              {course.description}
            </P>

            <div className="mt-6 flex flex-wrap items-center gap-5 text-xs text-slate-300 border-t border-white/10 pt-4">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Star className="h-4 w-4 fill-amber-400" />
                <span>{course.rating}</span>
                <span className="text-slate-400 font-normal">
                  ({course.enrolledCount} learners)
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-secondary" />
                <span>{course.duration} on-demand</span>
              </div>

              <div className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-secondary" />
                <span>{course.totalLessons} Lessons &amp; 1 Quiz</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Award className="h-4 w-4 text-emerald-400" />
                <span>QR Verifiable Certificate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

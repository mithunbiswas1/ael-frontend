import { Star, Clock, BookOpen, Award, ShieldCheck } from "lucide-react";
import { H1, P } from "@/components/ui/Typography";
import AmbientGlow from "@/components/ui/AmbientGlow";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function CourseDetailHero({ course }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 pb-14 pt-10 text-white">
      <AmbientGlow />

      <div className="site-container relative z-10">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Breadcrumb
              dark
              items={[
                { label: "Home", href: "/" },
                { label: "Training & Quiz", href: "/courses" },
                { label: course.title },
              ]}
              className="mb-4"
            />

            <H1 color="white">
              {course.title}
            </H1>

            <P color="light" className="mt-3.5 max-w-2xl">
              {course.description}
            </P>

            <div className="mt-6 flex flex-wrap items-center gap-5 text-xs text-slate-300 border-t border-slate-800/80 pt-4">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                <Star className="h-4 w-4 fill-amber-400" />
                <span>{course.rating}</span>
                <span className="text-slate-400 font-normal">
                  ({course.enrolledCount} learners)
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-blue-400" />
                <span>{course.duration} on-demand</span>
              </div>

              <div className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-blue-400" />
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

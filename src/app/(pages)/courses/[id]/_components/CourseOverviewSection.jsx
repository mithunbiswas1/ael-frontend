import Image from "next/image";
import {
  CheckCircle2,
  PlayCircle,
  Lock,
  User,
} from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/Accordion";

export default function CourseOverviewSection({ course }) {
  return (
    <div className="space-y-6 lg:col-span-8">
      {/* Box 1: What You Will Learn */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-2xs">
        <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>WHAT YOU WILL LEARN</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {course.learningPoints?.map((point, index) => (
            <div
              key={index}
              className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50/70 p-3 text-xs text-slate-700 leading-relaxed"
            >
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span>{point}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Box 2: Course Curriculum & Modules */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-2xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div>
            <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900">
              COURSE CURRICULUM
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {course.curriculum?.length} Modules • {course.totalLessons} Lessons • Full Lifetime Access
            </p>
          </div>
          <span className="text-xs font-bold text-primary">
            100% Online Self-Paced
          </span>
        </div>

        <Accordion
          type="multiple"
          defaultValue={course.curriculum?.map((_, idx) => `module-${idx}`) || []}
          className="space-y-3"
        >
          {course.curriculum?.map((module, mIdx) => (
            <AccordionItem
              key={mIdx}
              value={`module-${mIdx}`}
              variant="card"
            >
              <AccordionTrigger
                iconType="chevron"
                className="bg-slate-100/80 px-4 py-3 hover:bg-slate-200/60"
              >
                <div className="flex items-center gap-2">
                  <span>{module.moduleTitle}</span>
                  <span className="rounded bg-slate-200/80 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                    {module.lessons.length} lessons
                  </span>
                </div>
              </AccordionTrigger>

              <AccordionContent variant="card" className="p-0">
                <div className="divide-y divide-slate-100 bg-white">
                  {module.lessons.map((lesson, lIdx) => (
                    <div
                      key={lIdx}
                      className="flex items-center justify-between px-4 py-3 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        {lesson.freePreview ? (
                          <PlayCircle className="h-4 w-4 text-primary shrink-0" />
                        ) : (
                          <Lock className="h-4 w-4 text-slate-400 shrink-0" />
                        )}
                        <span className="font-medium text-slate-800">
                          {lesson.title}
                        </span>
                        {lesson.freePreview && (
                          <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold text-primary">
                            Preview
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 whitespace-nowrap">
                        {lesson.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* Box 3: Lead Instructor */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-2xs">
        <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
          <User className="h-4 w-4 text-blue-600" />
          <span>MEET YOUR INSTRUCTOR</span>
        </h2>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-lg bg-slate-50/80 border border-slate-200/60 p-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-primary">
            <Image
              src={course.instructor.avatar}
              alt={course.instructor.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {course.instructor.name}
            </h3>
            <p className="text-xs font-semibold text-primary">
              {course.instructor.role}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {course.instructor.experience}. Certified LPG safety trainer endorsed by national regulatory agencies.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

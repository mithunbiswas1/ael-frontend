// src/app/(pages)/courses/[slug]/_components/CourseOverviewSection.jsx
import SafeImage from "@/components/ui/SafeImage";
import {
  CheckCircle2,
  PlayCircle,
  Lock,
  User,
  ShieldCheck,
  Award,
  Layers,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/Accordion";
import { getLocale } from "@/lib/i18n";

export default async function CourseOverviewSection({ course }) {
  const locale = await getLocale();
  const isBn = locale === "bn";

  const description = isBn
    ? course.descriptionBn || course.description
    : course.description;
  const learningPoints = isBn
    ? course.learningPointsBn || course.learningPoints
    : course.learningPoints;
  const instructorName = isBn
    ? course.instructor?.nameBn || course.instructor?.name
    : course.instructor?.name;
  const instructorRole = isBn
    ? course.instructor?.roleBn || course.instructor?.role
    : course.instructor?.role;
  const instructorExperience = isBn
    ? course.instructor?.experienceBn || course.instructor?.experience
    : course.instructor?.experience;

  const curriculum = course.curriculum || [];

  return (
    <div className="space-y-6 lg:col-span-8">
      {/* Box 0: Course Description */}
      {description && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wider mb-2">
            {isBn ? "কোর্স পরিচিতি ও উদ্দেশ্য" : "Course Overview"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {description}
          </p>
        </div>
      )}

      {/* Box 1: Professional Progression & Gating System Guide */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="h-5 w-5 text-primary" />
          <h2 className="text-sm sm:text-base font-bold text-slate-900 uppercase tracking-wider">
            {isBn ? "প্রফেশনাল লার্নিং ও মডিউল আনলক পদ্ধতি" : "Professional Sequential Learning System"}
          </h2>
        </div>
        <p className="text-xs text-slate-600 mb-5 leading-relaxed">
          {isBn
            ? "এই কোর্সের গুণগত মান এবং বাস্তব শিখন নিশ্চিত করতে পেশাদার সিকোয়েন্সিয়াল সিস্টেম অনুসরণ করা হয়েছে। প্রতিটি মডিউলের ভিডিও পাঠ সমাপ্ত হলে মূল্যায়ন কুইজ আসবে এবং কুইজ সফলভাবে পাস করলে পরবর্তী মডিউল স্বয়ংক্রিয়ভাবে আনলক হবে।"
            : "To guarantee verified competency, this course enforces sequential progression. Each module concludes with an assessment quiz; passing the quiz unlocks the next module."}
        </p>

        {/* 4 Step Sequential Process */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3">
            <span className="font-mono text-[10px] font-black uppercase text-primary">Step 01</span>
            <div className="font-bold text-slate-900 mt-1">
              {isBn ? "ভিডিও লেকচার" : "Video Lectures"}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {isBn ? "মডিউলের প্রতিটি পাঠ মনোযোগ দিয়ে দেখুন" : "Watch all lessons within the current module"}
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3">
            <span className="font-mono text-[10px] font-black uppercase text-amber-600">Step 02</span>
            <div className="font-bold text-slate-900 mt-1">
              {isBn ? "মডিউল কুইজ" : "Module Assessment"}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {isBn ? "পাঠ শেষেই মূল্যায়ন কুইজ স্বয়ংক্রিয়ভাবে আসবে" : "Quiz appears right after finishing module lessons"}
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3">
            <span className="font-mono text-[10px] font-black uppercase text-emerald-600">Step 03</span>
            <div className="font-bold text-slate-900 mt-1">
              {isBn ? "নেক্সট মডিউল আনলক" : "Unlock Next Module"}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {isBn ? "৭০% স্কোরে পাস করলেই পরবর্তী মডিউল খুলবে" : "Passing (>= 70%) unlocks subsequent module"}
            </p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3">
            <span className="font-mono text-[10px] font-black uppercase text-blue-600">Step 04</span>
            <div className="font-bold text-slate-900 mt-1">
              {isBn ? "সার্টিফিকেট অর্জন" : "Earn Certificate"}
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              {isBn ? "সকল মডিউল শেষে অফিসিয়াল ডিজিটাল সনদ" : "Receive verifiable official completion certificate"}
            </p>
          </div>
        </div>
      </div>

      {/* Box 2: What You Will Learn */}
      {learningPoints && learningPoints.length > 0 && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{isBn ? "কোর্স থেকে আপনি যা শিখবেন" : "What You Will Learn"}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {learningPoints.map((point, index) => (
              <div
                key={index}
                className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50/80 p-3 text-xs text-slate-700 leading-relaxed"
              >
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Box 3: Course Curriculum & Modules */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 mb-4 gap-2">
          <div>
            <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-900">
              {isBn ? "বিস্তারিত কোর্স কারিকুলাম ও সিলেবাস" : "Detailed Course Curriculum"}
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {isBn
                ? `মোট ${curriculum.length}টি মডিউল • ${course.totalLessons}টি লেকচার • মডিউলভিত্তিক কুইজ মূল্যায়ন`
                : `${curriculum.length} Modules • ${course.totalLessons} Lessons • Modular Gating Quizzes`}
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600 self-start sm:self-auto">
            {isBn ? "অন-ডিমান্ড ও সেলফ-পেসড" : "Self-Paced with Progression"}
          </span>
        </div>

        <Accordion
          type="multiple"
          defaultValue={curriculum.map((_, idx) => `module-${idx}`)}
          className="space-y-3"
        >
          {curriculum.map((module, mIdx) => {
            const moduleTitle = isBn
              ? module.moduleTitleBn || module.moduleTitle
              : module.moduleTitle;
            const isCourseFree = !course.price || Number(course.price) === 0;
            const isModuleFree = isCourseFree || mIdx === 0;
            const hasQuiz = module.quiz?.questions && module.quiz.questions.length > 0;
            const isGatedPrereq = mIdx > 0;

            return (
              <AccordionItem key={mIdx} value={`module-${mIdx}`} variant="card">
                <AccordionTrigger
                  iconType="chevron"
                  className="bg-slate-50 px-4 py-3 hover:bg-slate-100 border-b border-slate-200/60"
                >
                  <div className="flex items-center gap-2 flex-wrap text-left">
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-200 px-1.5 py-0.5 rounded">
                      M{mIdx + 1}
                    </span>
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">{moduleTitle}</span>

                    <span className="rounded bg-slate-200/80 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                      {isBn
                        ? `${module.lessons?.length || 0}টি পাঠ`
                        : `${module.lessons?.length || 0} lessons`}
                    </span>

                    {hasQuiz && (
                      <span className="rounded bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 text-[10px] font-bold flex items-center gap-1">
                        <HelpCircle className="h-3 w-3 text-amber-600" />
                        <span>
                          {isBn
                            ? `মূল্যায়ন কুইজ (${module.quiz.questions.length}টি প্রশ্ন)`
                            : `Assessment (${module.quiz.questions.length} Qs)`}
                        </span>
                      </span>
                    )}

                    {isModuleFree ? (
                      <span className="rounded bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 text-[10px] font-bold">
                        {isCourseFree
                          ? (isBn ? "১০০% ফ্রি মডিউল" : "100% Free Module")
                          : (isBn ? "১ম ফ্রি মডিউল (রেজিস্ট্রেশন করলেই উন্মুক্ত)" : "Free Preview (Module 1 Open to All)")}
                      </span>
                    ) : (
                      <span className="rounded bg-amber-50 text-amber-800 border border-amber-300 px-2 py-0.5 text-[10px] font-bold flex items-center gap-1">
                        <Lock className="h-2.5 w-2.5 text-amber-600" />
                        <span>{isBn ? "ভর্তি আবশ্যক" : "Enrolled Only"}</span>
                      </span>
                    )}

                    {isGatedPrereq && (
                      <span className="rounded bg-slate-100 text-slate-600 border border-slate-200 px-2 py-0.5 text-[10px] font-medium flex items-center gap-1">
                        <Lock className="h-2.5 w-2.5 text-slate-400" />
                        <span>
                          {isBn ? `মডিউল ${mIdx} পাসের পর আনলক` : `Unlocks after M${mIdx} Quiz`}
                        </span>
                      </span>
                    )}
                  </div>
                </AccordionTrigger>

                <AccordionContent variant="card" className="p-0">
                  <div className="divide-y divide-slate-100 bg-white">
                    {/* Video Lessons */}
                    {module.lessons?.map((lesson, lIdx) => {
                      const lessonTitle = isBn
                        ? lesson.titleBn || lesson.title
                        : lesson.title;
                      const lessonDuration = isBn
                        ? lesson.durationBn || lesson.duration
                        : lesson.duration;
                      const isLessonFree = isModuleFree;

                      return (
                        <div
                          key={lIdx}
                          className="flex items-center justify-between px-4 py-3 text-xs text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {isLessonFree ? (
                              <PlayCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                            ) : (
                              <Lock className="h-4 w-4 text-slate-400 shrink-0" />
                            )}
                            <span className="font-medium text-slate-800 truncate">
                              {lessonTitle}
                            </span>
                            {isLessonFree ? (
                              <span className="rounded bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.2 text-[9px] font-bold shrink-0">
                                {isBn ? "ফ্রি" : "Free"}
                              </span>
                            ) : (
                              <span className="rounded bg-slate-100 text-slate-500 border border-slate-200 px-1.5 py-0.2 text-[9px] font-medium shrink-0">
                                {isBn ? "লক" : "Locked"}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-400 shrink-0 ml-2">
                            {lessonDuration}
                          </span>
                        </div>
                      );
                    })}

                    {/* Module Assessment Quiz Item */}
                    {hasQuiz && (
                      <div className="flex items-center justify-between px-4 py-3 text-xs bg-amber-50/40 hover:bg-amber-50 text-slate-800 border-t border-dashed border-amber-200 transition-colors">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
                          <div>
                            <div className="font-bold text-amber-950 flex items-center gap-1.5 flex-wrap">
                              <span>
                                {isBn
                                  ? module.quiz.titleBn || `${moduleTitle} - সমাপনী কুইজ`
                                  : module.quiz.title || `${moduleTitle} - Assessment Quiz`}
                              </span>
                              <span className="rounded bg-amber-200/80 text-amber-900 px-1.5 py-0.2 text-[9px] font-bold">
                                {isBn ? "বাধ্যতামূলক কুইজ" : "Mandatory Quiz"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className="text-[11px] text-amber-800 font-bold shrink-0 ml-2">
                          {isBn
                            ? `পাসিং মার্ক ${module.quiz.passingScore || 70}%`
                            : `Pass: ${module.quiz.passingScore || 70}%`}
                        </span>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>

        {/* Culminating Step: Final Course Assessment & Certification */}
        <div className="mt-4 rounded-xl border border-amber-300/80 bg-amber-50/50 p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-[10px] font-black text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded uppercase">
                    {isBn ? "কোর্স সমাপনী পরীক্ষা" : "FINAL CERTIFICATION EXAM"}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    {isBn ? "ভেরিফাইড সার্টিফিকেট" : "VERIFIED CERTIFICATE"}
                  </span>
                </div>
                <h3 className="font-bold text-xs sm:text-sm text-slate-900 mt-1">
                  {isBn ? "চূড়ান্ত সার্টিফিকেশন পরীক্ষা ও সনদ প্রদান" : "Course Certification Assessment"}
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  {isBn
                    ? "সকল মডিউলের পাঠ শেষে স্বয়ংক্রিয়ভাবে ভিন্ন প্রশ্ন সেট দিয়ে পরীক্ষা অনুষ্ঠিত হয়। ৭০% স্কোরে পাস করলেই ডিজিটাল সার্টিফিকেট ইস্যু হবে।"
                    : "Final exam with dynamic question sets. Score 70% or higher to earn your verifiable certificate."}
                </p>
              </div>
            </div>
            <div className="shrink-0">
              <span className="inline-flex items-center gap-1 rounded-lg bg-primary text-white px-3.5 py-1.5 text-xs font-bold shadow-2xs">
                <span>{isBn ? "পাসিং মার্ক ৭০%" : "70% Pass Mark"}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Box 4: Lead Instructor */}
      {course.instructor && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
          <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
            <User className="h-4 w-4 text-blue-600" />
            <span>{isBn ? "প্রশিক্ষকের পরিচিতি" : "Course Instructor"}</span>
          </h2>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-lg bg-slate-50 border border-slate-200/80 p-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-primary">
              <SafeImage
                src={course.instructor.avatar}
                alt={instructorName || "Instructor"}
                fallbackSrc="/default_person.jpg"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{instructorName}</h3>
              <p className="text-xs font-semibold text-primary">{instructorRole}</p>
              <p className="text-xs text-slate-500 mt-1">
                {instructorExperience}.{" "}
                {isBn
                  ? "জাতীয় মানদণ্ড অনুযায়ী এলপিজি ও সিলিন্ডার হ্যান্ডলিংয়ে বিশেষজ্ঞ প্রশিক্ষক।"
                  : "Certified safety specialist adhering strictly to national compliance standards."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

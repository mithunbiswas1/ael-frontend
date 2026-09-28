// src/app/(home)/_components/FeaturedTrainingSection.jsx

import CourseCard from "@/components/shared/CourseCard";
import { H3 } from "@/components/ui/Typography";

export default function FeaturedTrainingSection({ dict = {}, liveCourse = null, locale = "en" }) {
  if (!liveCourse) return null;

  const isBn = locale === "bn";
  const course = liveCourse;
  const courseId = course.courseId;

  return (
    <div className="mb-6">
      <div className="mb-4">
        <span className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary backdrop-blur-md">
          {dict?.tag || "E-LEARNING LMS"}
        </span>
        <H3>
          {dict?.title || "FEATURED TRAINING"}{" "}
          <span className="text-primary">{dict?.accent || "& QUIZ."}</span>
        </H3>
      </div>

      <CourseCard
        isBestSeller={true}
        isPaid={course.price > 0}
        imageUrl={course.imageUrl}
        title={isBn ? course.titleBn : course.title}
        description={isBn ? course.descriptionBn : course.description}
        duration={isBn ? course.durationBn : course.duration}
        lessonsCount={course.totalLessons}
        level={isBn ? course.levelBn : course.level}
        price={`৳ ${course.price}`}
        href={`/courses/${courseId}`}
      />
    </div>
  );
}

// src/app/(home)/_components/FeaturedTrainingSection.jsx

import CourseCard from "@/components/shared/CourseCard";
import { H3 } from "@/components/ui/Typography";

export default function FeaturedTrainingSection({ dict = {}, liveCourse = null, locale = "en" }) {
  if (!liveCourse) return null;

  const isBn = locale === "bn";
  const course = liveCourse;
  const courseSlug = course.slug || course.courseId || course._id;

  return (
    <div className="mb-6">
      <div className="mb-4">
        <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
          {dict?.tag || "E-LEARNING LMS"}
        </span>
        <H3>
          {dict?.title || "FEATURED TRAINING"}{" "}
          <span className="text-primary">{dict?.accent || "& QUIZ."}</span>
        </H3>
      </div>

      <CourseCard
        courseId={course.courseId}
        slug={courseSlug}
        isBestSeller={true}
        isPaid={course.price > 0}
        imageUrl={course.imageUrl}
        title={isBn ? course.titleBn : course.title}
        description={isBn ? course.descriptionBn : course.description}
        duration={isBn ? course.durationBn : course.duration}
        lessonsCount={course.totalLessons}
        level={isBn ? course.levelBn : course.level}
        price={`৳ ${course.price}`}
        href={`/courses/${courseSlug}`}
      />
    </div>
  );
}

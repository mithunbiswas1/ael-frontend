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
        course={course}
        courseId={course.courseId}
        slug={courseSlug}
        isPaid={course.price > 0}
        imageUrl={course.imageUrl}
        title={isBn ? course.titleBn || course.title : course.title}
        description={isBn ? course.descriptionBn || course.description : course.description}
        duration={isBn ? course.durationBn || course.duration : course.duration}
        lessonsCount={course.totalLessons}
        price={course.price}
        category={isBn ? course.categoryBn || course.category : course.category}
        curriculum={course.curriculum}
        href={`/courses/${courseSlug}`}
      />
    </div>
  );
}

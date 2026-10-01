// src/app/(pages)/courses/[slug]/page.jsx
import { notFound, redirect } from "next/navigation";
import { getCourses, getCourseById } from "@/next-api/getCourses";
import CourseDetailHero from "./_components/CourseDetailHero";
import CourseOverviewSection from "./_components/CourseOverviewSection";
import CourseEnrollSidebar from "./_components/CourseEnrollSidebar";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const courseSlug = resolvedParams?.slug || resolvedParams?.id;
  const course = await getCourseById(courseSlug);

  if (!course) {
    return {
      title: "Course Not Found | Safe LPG Academy",
      description: "The requested training course could not be located.",
    };
  }

  return {
    title: `${course.title} | Safe LPG Safety Academy`,
    description: course.description,
  };
}

export default async function CourseDetailPage({ params }) {
  const resolvedParams = await params;
  const courseSlug = resolvedParams?.slug || resolvedParams?.id;
  const course = await getCourseById(courseSlug);

  if (!course) {
    notFound();
  }

  // If accessed by numeric courseId (like '5'), redirect to canonical slug URL
  if (courseSlug && /^\d+$/.test(courseSlug) && course.slug && course.slug !== courseSlug) {
    redirect(`/courses/${course.slug}`);
  }

  const isFree = course.price === 0;

  return (
    <main className="min-h-screen bg-slate-50">
      {/* 1. Page Hero Banner */}
      <CourseDetailHero course={course} />

      {/* 2. Main Content & Enrollment Sidebar */}
      <section className="relative z-20 -mt-6 mx-auto w-full max-w-6xl px-4 pb-20">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          <CourseOverviewSection course={course} />
          <CourseEnrollSidebar course={course} isFree={isFree} />
        </div>
      </section>
    </main>
  );
}

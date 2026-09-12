// src/app/(pages)/courses/[id]/page.jsx
import { ALL_COURSES } from "../_data/coursesData";
import CourseDetailHero from "./_components/CourseDetailHero";
import CourseOverviewSection from "./_components/CourseOverviewSection";
import CourseEnrollSidebar from "./_components/CourseEnrollSidebar";

export function generateStaticParams() {
  return ALL_COURSES.map((course) => ({
    id: course.id,
  }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const courseId = resolvedParams.id;
  const course =
    ALL_COURSES.find((c) => c.id === courseId || c.slug === courseId) || {
      title: `LPG Training Module #${courseId}`,
      description: "Comprehensive LPG safety training course with certified verification.",
    };

  return {
    title: `${course.title} | Safe LPG Safety Academy`,
    description: course.description,
  };
}

export default async function CourseDetailPage({ params }) {
  const resolvedParams = await params;
  const courseId = resolvedParams.id;

  const course =
    ALL_COURSES.find((c) => c.id === courseId || c.slug === courseId) || {
      ...ALL_COURSES[0],
      id: courseId,
      title: `LPG Specialized Training Course #${courseId}`,
      description:
        "Comprehensive safety curriculum covering LPG standards, handling, emergency protocols, and verifiable certification.",
    };

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

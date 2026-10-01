// src/app/(pages)/courses/learn/[slug]/page.jsx
import { redirect } from "next/navigation";
import { getCourseById } from "@/next-api/getCourses";
import ClassroomContent from "./_view/ClassroomContent";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Online Safety Classroom | Safe LPG Academy",
  description:
    "Interactive safety modules, structured video lessons, assessment quizzes, and verified certification.",
};

export default async function ClassroomPlayerPage({ params }) {
  const resolvedParams = await params;
  const rawParam = resolvedParams?.slug;

  // If accessed by numeric courseId (like '5') instead of slug, redirect to canonical slug URL
  if (rawParam && /^\d+$/.test(rawParam)) {
    const course = await getCourseById(rawParam);
    if (course?.slug && course.slug !== rawParam) {
      redirect(`/courses/learn/${course.slug}`);
    }
  }

  return <ClassroomContent courseSlug={rawParam} />;
}

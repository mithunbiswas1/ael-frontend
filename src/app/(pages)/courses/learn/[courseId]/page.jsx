// src/app/(pages)/courses/learn/[courseId]/page.jsx
import ClassroomContent from "./_client/ClassroomContent";

export const metadata = {
  title: "Online Safety Classroom Player | Safe LPG Academy",
  description:
    "Interactive high-definition LPG video safety modules, lesson notes, downloadable guides, and assessment checklists.",
};

export default async function ClassroomPlayerPage({ params }) {
  const resolvedParams = await params;
  const courseId = resolvedParams.courseId;

  return <ClassroomContent courseId={courseId} />;
}

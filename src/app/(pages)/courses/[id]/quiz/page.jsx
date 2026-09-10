// src/app/(pages)/courses/[id]/quiz/page.jsx
import QuizContent from "./_components/QuizContent";

export const metadata = {
  title: "LPG Safety Assessment Quiz | AEL Safety Academy",
  description:
    "Test your LPG safety knowledge, score 80% or higher, and earn your official verified digital certificate.",
};

export default async function CourseQuizPage({ params }) {
  const resolvedParams = await params;
  const courseId = resolvedParams.id;

  return <QuizContent courseId={courseId} />;
}

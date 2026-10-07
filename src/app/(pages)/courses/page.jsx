// src/app/(pages)/courses/page.jsx
import CoursesContent from "./_view/CoursesContent";
import { getCourses } from "@/next-api/getCourses";
import { getPageContent } from "@/next-api/getPageContent";

export const metadata = {
  title: "Training & Quiz LMS | Safe LPG Platform",
  description:
    "Interactive LPG safety training modules, certified quizzes, and verified digital certificates for consumers, dealers, and industrial operators.",
};

export default async function CoursesPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const initialPriceType =
    resolvedSearchParams?.priceType ||
    resolvedSearchParams?.filter ||
    resolvedSearchParams?.price ||
    "all";
  const initialSearch = resolvedSearchParams?.search || "";

  const [courses, cmsData] = await Promise.all([
    getCourses({ priceType: initialPriceType }),
    getPageContent("courses"),
  ]);

  return (
    <CoursesContent
      initialCourses={courses}
      initialPriceFilter={initialPriceType}
      bannerData={cmsData?.banner || null}
    />
  );
}

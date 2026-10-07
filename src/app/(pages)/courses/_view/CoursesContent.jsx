// src/app/(pages)/courses/_view/CoursesContent.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import VisualHeroBanner from "@/components/ui/VisualHeroBanner";
import CourseCatalogSection from "../_components/CourseCatalogSection";
import HowItWorksSection from "../_components/HowItWorksSection";
import { useGetCoursesQuery } from "@/redux/api/courseApi";

export default function CoursesContent({
  initialCourses = [],
  initialPriceFilter = "all",
  bannerData = null,
}) {
  const [priceFilter, setPriceFilter] = useState(initialPriceFilter);
  const isFirstRender = useRef(true);

  // Keep browser URL query params synced with priceFilter
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const params = new URLSearchParams();
    if (priceFilter && priceFilter !== "all") {
      params.set("priceType", priceFilter);
    }

    const qs = params.toString();
    const newUrl = qs ? `/courses?${qs}` : "/courses";
    if (
      typeof window !== "undefined" &&
      window.location.pathname + window.location.search !== newUrl
    ) {
      window.history.replaceState(null, "", newUrl);
    }
  }, [priceFilter]);

  // Query courses from backend with priceType filter (all, free, paid)
  const { data: coursesData, isLoading, isFetching } = useGetCoursesQuery({
    priceType: priceFilter,
  });

  // Use backend query data when available; fallback to initialCourses for initial render
  const coursesList = coursesData?.data;
  const filteredCourses = Array.isArray(coursesList)
    ? coursesList.map((c) => ({ ...c, id: c.courseId || c._id }))
    : Array.isArray(initialCourses)
    ? initialCourses
    : [];

  return (
    <main className="min-h-screen bg-slate-50">
      {/* 1. Hero Banner */}
      <VisualHeroBanner data={bannerData} />

      {/* 2. Course Catalog with Backend Filtering */}
      <CourseCatalogSection
        priceFilter={priceFilter}
        setPriceFilter={setPriceFilter}
        filteredCourses={filteredCourses}
        isLoading={(!coursesData && initialCourses.length === 0) && (isLoading || isFetching)}
      />

      {/* 3. How It Works Section */}
      <HowItWorksSection />
    </main>
  );
}

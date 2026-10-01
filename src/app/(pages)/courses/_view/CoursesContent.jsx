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
  initialSearch = "",
  bannerData = null,
}) {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [priceFilter, setPriceFilter] = useState(initialPriceFilter);
  const isFirstRender = useRef(true);

  // Debounce search input to avoid spamming the backend
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Keep browser URL query params synced
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const params = new URLSearchParams();
    if (priceFilter && priceFilter !== "all") {
      params.set("priceType", priceFilter);
    }
    if (debouncedSearch && debouncedSearch.trim()) {
      params.set("search", debouncedSearch.trim());
    }

    const qs = params.toString();
    const newUrl = qs ? `/courses?${qs}` : "/courses";
    if (
      typeof window !== "undefined" &&
      window.location.pathname + window.location.search !== newUrl
    ) {
      window.history.replaceState(null, "", newUrl);
    }
  }, [priceFilter, debouncedSearch]);

  // Query courses from backend with priceType and search filters
  const { data: coursesData, isLoading, isFetching } = useGetCoursesQuery({
    priceType: priceFilter,
    search: debouncedSearch.trim() || undefined,
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
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        priceFilter={priceFilter}
        setPriceFilter={setPriceFilter}
        filteredCourses={filteredCourses}
        isLoading={isFetching || (isLoading && !coursesData)}
      />

      {/* 3. How It Works Section */}
      <HowItWorksSection />
    </main>
  );
}

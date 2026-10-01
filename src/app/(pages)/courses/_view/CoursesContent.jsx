// src/app/(pages)/courses/_view/CoursesContent.jsx
"use client";

import { useState } from "react";
import VisualHeroBanner from "@/components/ui/VisualHeroBanner";
import CourseCatalogSection from "../_components/CourseCatalogSection";
import HowItWorksSection from "../_components/HowItWorksSection";

export default function CoursesContent({ initialCourses = [], bannerData = null }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");

  const activeCatalog = Array.isArray(initialCourses) ? initialCourses : [];

  const filteredCourses = activeCatalog.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "paid" && course.isPaid) ||
      (priceFilter === "free" && !course.isPaid);
    return matchesSearch && matchesPrice;
  });

  return (
    <main className="min-h-screen bg-slate-50">
      {/* 1. Hero Banner */}
      <VisualHeroBanner data={bannerData} />

      {/* 2. Course Catalog */}
      <CourseCatalogSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        priceFilter={priceFilter}
        setPriceFilter={setPriceFilter}
        filteredCourses={filteredCourses}
      />

      {/* 3. How It Works Section */}
      <HowItWorksSection />
    </main>
  );
}

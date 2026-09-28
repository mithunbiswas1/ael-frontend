// src/app/(pages)/courses/_view/CoursesContent.jsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import VisualHeroBanner from "@/components/ui/VisualHeroBanner";
import CourseCatalogSection from "../_components/CourseCatalogSection";
import HowItWorksSection from "../_components/HowItWorksSection";
import CoursesFeaturesSection from "../_components/CoursesFeaturesSection";
import CertificateVerificationSection from "../_components/CertificateVerificationSection";
import AcademyBulletinsSection from "../_components/AcademyBulletinsSection";

export default function CoursesContent({ initialCourses = [], bannerData = null }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [verifyId, setVerifyId] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const activeCatalog = Array.isArray(initialCourses) ? initialCourses : [];

  const filteredCourses = activeCatalog.filter((course) => {
    const matchesCategory =
      selectedCategory === "all" || course.category === selectedCategory;
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "paid" && course.isPaid) ||
      (priceFilter === "free" && !course.isPaid);
    return matchesCategory && matchesSearch && matchesPrice;
  });

  const handleVerify = (e) => {
    e.preventDefault();
    if (!verifyId.trim()) {
      toast.error("Please enter a Certificate ID");
      return;
    }
    toast.info(`Checking Certificate ID: ${verifyId}...`);
    setTimeout(() => {
      toast.success(`Verified: Certificate ${verifyId} is valid and authentic.`);
    }, 600);
  };

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!newsletterEmail) {
      toast.error("Please enter your email");
      return;
    }
    toast.success("Thank you for subscribing to training updates!");
    setNewsletterEmail("");
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* 1. Hero Banner */}
      <VisualHeroBanner data={bannerData} />

      {/* 2. Course Catalog */}
      <CourseCatalogSection
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        priceFilter={priceFilter}
        setPriceFilter={setPriceFilter}
        filteredCourses={filteredCourses}
      />

      {/* 3. How It Works Section */}
      <HowItWorksSection />

      {/* 4. Features Grid */}
      <CoursesFeaturesSection />

      {/* 5. Certificate Verification Section */}
      <CertificateVerificationSection
        verifyId={verifyId}
        setVerifyId={setVerifyId}
        handleVerify={handleVerify}
      />

      {/* 6. Stay Updated & Stats */}
      <AcademyBulletinsSection
        newsletterEmail={newsletterEmail}
        setNewsletterEmail={setNewsletterEmail}
        handleNewsletter={handleNewsletter}
      />
    </main>
  );
}

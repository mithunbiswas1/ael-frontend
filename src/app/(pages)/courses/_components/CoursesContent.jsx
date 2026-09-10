"use client";

import { useState } from "react";
import { toast } from "sonner";
import CoursesHeroSection from "./CoursesHeroSection";
import CourseCatalogSection, { COURSE_CATALOG } from "./CourseCatalogSection";
import HowItWorksSection from "./HowItWorksSection";
import CoursesFeaturesSection from "./CoursesFeaturesSection";
import CertificateVerificationSection from "./CertificateVerificationSection";
import AcademyBulletinsSection from "./AcademyBulletinsSection";

export default function CoursesContent() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [audienceFilter, setAudienceFilter] = useState("all");
  const [verifyId, setVerifyId] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const filteredCourses = COURSE_CATALOG.filter((course) => {
    const matchesCategory =
      selectedCategory === "all" || course.category === selectedCategory;
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesAudience =
      audienceFilter === "all" ||
      course.audience.toLowerCase() === audienceFilter.toLowerCase();
    return matchesCategory && matchesSearch && matchesAudience;
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
      <CoursesHeroSection />

      {/* 2. Course Catalog */}
      <CourseCatalogSection
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        audienceFilter={audienceFilter}
        setAudienceFilter={setAudienceFilter}
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

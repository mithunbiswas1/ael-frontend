"use client";

import { useState } from "react";
import { toast } from "sonner";
import { GraduationCap, Clock, HelpCircle, Award, CheckCircle2, ArrowRight } from "lucide-react";
import { H3 } from "@/components/ui/Typography";
import { LinkButton } from "@/components/ui/LinkButton";
import GlobalHeroSection from "@/_components/GlobalHeroSection";
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
      <GlobalHeroSection
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Training & Quiz" },
        ]}
        badgeText="ONLINE LMS & CERTIFICATION"
        title="TRAINING &"
        accent="QUIZ."
        description="Industry-aligned LPG safety training for regular consumers, commercial dealers, and industrial operators. Learn at your own pace, take the quiz, and earn your verified certificate."
        extraContent={
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary border border-primary/30">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span className="text-[11px]">Expert Courses</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary border border-primary/30">
                <Clock className="h-4 w-4" />
              </div>
              <span className="text-[11px]">Self-Paced</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary border border-primary/30">
                <HelpCircle className="h-4 w-4" />
              </div>
              <span className="text-[11px]">Dynamic Quiz</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary border border-primary/30">
                <Award className="h-4 w-4" />
              </div>
              <span className="text-[11px]">QR Certificate</span>
            </div>
          </div>
        }
        rightContent={
          <div className="w-full max-w-md rounded-xl border border-white/15 bg-slate-900/80 p-5 sm:p-6 text-white backdrop-blur-xl shadow-md">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                  LEARN ANYWHERE
                </span>
                <H3 color="white" className="text-base font-bold">
                  Digital Academy
                </H3>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white shadow-xs">
                <GraduationCap className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-4 space-y-2.5">
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Self-paced video modules with safety guidelines</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Instant score grading &amp; re-attempt option</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Trusted by 25,000+ certified nationwide users</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/10">
              <LinkButton
                href="#catalog"
                variant="primary"
                size="default"
                fullWidth
              >
                <span>Browse Courses Below</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </LinkButton>
            </div>
          </div>
        }
      />

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

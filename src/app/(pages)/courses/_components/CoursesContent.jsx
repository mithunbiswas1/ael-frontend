// src/app/(pages)/courses/_components/CoursesContent.jsx
import CoursesHeroSection from "./CoursesHeroSection";
import CourseCatalogSection from "./CourseCatalogSection";
import HowItWorksSection from "./HowItWorksSection";
import CoursesFeaturesSection from "./CoursesFeaturesSection";
import CertificateVerificationSection from "./CertificateVerificationSection";
import AcademyBulletinsSection from "./AcademyBulletinsSection";

export default function CoursesContent() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* 1. Hero Banner */}
      <CoursesHeroSection />

      {/* 2. Course Catalog */}
      <CourseCatalogSection />

      {/* 3. How It Works Section */}
      <HowItWorksSection />

      {/* 4. Features Grid */}
      <CoursesFeaturesSection />

      {/* 5. Certificate Verification Section */}
      <CertificateVerificationSection />

      {/* 6. Stay Updated & Stats */}
      <AcademyBulletinsSection />
    </main>
  );
}

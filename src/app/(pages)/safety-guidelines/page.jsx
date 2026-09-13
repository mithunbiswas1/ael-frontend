// src/app/(pages)/safety-guidelines/page.jsx

import { Suspense } from "react";
import SafetyGuidelinesContent from "./_components/SafetyGuidelinesContent";
import GlobalHeroSection from "@/_components/GlobalHeroSection";

export const metadata = {
  title: "Safety Guidelines | Nationwide LPG Safety Protocols Bangladesh",
  description:
    "Guidelines for safe handling, storage and use of LPG across all sectors. Compliant with BERC, Department of Explosives (DoE), and Fire Service regulations.",
};

export default function SafetyGuidelinesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-xs font-bold text-slate-500 animate-pulse">
            Loading Safety Guidelines...
          </div>
        </div>
      }
    >
      <GlobalHeroSection
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Safety Guidelines" },
        ]}
        title="SAFETY"
        accent="GUIDELINES."
        description="Guidelines for safe handling, storage and use of LPG across all sectors. Compliant with BERC, Department of Explosives (DoE), and Fire Service regulations."
        imageSrc="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop"
        imageAlt="LPG Storage Tanks and Cylinders"
      />
      <SafetyGuidelinesContent />
    </Suspense>
  );
}

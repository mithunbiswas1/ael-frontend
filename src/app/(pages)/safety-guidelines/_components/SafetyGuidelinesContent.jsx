// src/app/(pages)/safety-guidelines/_components/SafetyGuidelinesContent.jsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import SharedHeroSection from "@/components/shared/SharedHeroSection";
import StakeholderTabsSection, { STAKEHOLDER_TABS } from "./StakeholderTabsSection";
import GuidelinesGridSection from "./GuidelinesGridSection";

export default function SafetyGuidelinesContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("dealer");

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl && STAKEHOLDER_TABS.some((t) => t.id === tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-slate-50">
      <SharedHeroSection
        variant="main"
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
      <StakeholderTabsSection activeTab={activeTab} setActiveTab={setActiveTab} />
      <GuidelinesGridSection activeTab={activeTab} />
    </main>
  );
}

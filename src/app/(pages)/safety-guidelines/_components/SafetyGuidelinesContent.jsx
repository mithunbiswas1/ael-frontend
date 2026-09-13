// src/app/(pages)/safety-guidelines/_components/SafetyGuidelinesContent.jsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import StakeholderTabsSection, { STAKEHOLDER_TABS } from "./StakeholderTabsSection";
import GuidelinesGridSection from "./GuidelinesGridSection";

export default function SafetyGuidelinesContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("investors");

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab")?.toLowerCase();
    if (tabFromUrl && STAKEHOLDER_TABS.some((t) => t.id.toLowerCase() === tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-slate-50">
      <StakeholderTabsSection activeTab={activeTab} setActiveTab={setActiveTab} />
      <GuidelinesGridSection activeTab={activeTab} />
    </main>
  );
}

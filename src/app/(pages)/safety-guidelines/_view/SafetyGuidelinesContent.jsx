// src/app/(pages)/safety-guidelines/_view/SafetyGuidelinesContent.jsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import StakeholderTabsSection, { STAKEHOLDER_TABS } from "../_components/StakeholderTabsSection";
import GuidelinesGridSection from "../_components/GuidelinesGridSection";

export default function SafetyGuidelinesContent({ sections = {} }) {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("investors");

  useEffect(() => {
    const rawTab = searchParams?.get("tab")?.toLowerCase();
    if (!rawTab) return;
    const tabAliases = {
      consumer: "customer",
      household: "customer",
      industrial: "investors",
      "auto-gas": "dealer",
    };
    const target = tabAliases[rawTab] || rawTab;
    if (STAKEHOLDER_TABS.some((t) => t.id.toLowerCase() === target)) {
      setActiveTab(target);
    }
  }, [searchParams]);

  return (
    <main className="min-h-screen bg-slate-50">
      <StakeholderTabsSection activeTab={activeTab} setActiveTab={setActiveTab} />
      <GuidelinesGridSection activeTab={activeTab} sections={sections} />
    </main>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import StakeholderTabsSection, { STAKEHOLDER_TABS } from "./StakeholderTabsSection";
import GuidelinesGridSection from "./GuidelinesGridSection";

export default function SafetyGuidelinesInteractive() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("dealer");

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl && STAKEHOLDER_TABS.some((t) => t.id === tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  return (
    <>
      <StakeholderTabsSection activeTab={activeTab} setActiveTab={setActiveTab} />
      <GuidelinesGridSection activeTab={activeTab} />
    </>
  );
}

// src/app/(pages)/pricing/page.jsx
"use client";

import { useState } from "react";
import PricingHeroSection from "./_components/PricingHeroSection";
import PricingCardsSection from "./_components/PricingCardsSection";

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <main className="min-h-screen bg-slate-50">
      <PricingHeroSection isAnnual={isAnnual} setIsAnnual={setIsAnnual} />
      <PricingCardsSection isAnnual={isAnnual} />
    </main>
  );
}

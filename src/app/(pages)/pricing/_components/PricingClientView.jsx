// src/app/(pages)/pricing/_components/PricingClientView.jsx
"use client";

import { useState } from "react";
import PricingHeroSection from "./PricingHeroSection";
import PricingCardsSection from "./PricingCardsSection";

export default function PricingClientView({ banner, plansConfig }) {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <>
      <PricingHeroSection
        banner={banner}
        isAnnual={isAnnual}
        setIsAnnual={setIsAnnual}
      />
      <PricingCardsSection
        isAnnual={isAnnual}
        plansConfig={plansConfig}
      />
    </>
  );
}

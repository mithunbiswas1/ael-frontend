// src/app/(pages)/pricing/page.jsx
"use client";

import { useState } from "react";
import SharedHeroSection from "@/components/shared/SharedHeroSection";
import PricingCardsSection from "./_components/PricingCardsSection";

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <main className="min-h-screen bg-slate-50">
      <SharedHeroSection
        variant="others"
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Pricing & Plans" },
        ]}
        title="FLEXIBLE SAFETY"
        accent="PLANS."
        description="Choose the safety, training, and regulatory compliance package tailored for your home, retail outlet, auto gas station, or manufacturing facility."
      >
        {/* Billing Cycle Toggle */}
        <div className="inline-flex items-center gap-1.5 sm:gap-3 rounded-full border border-slate-700 bg-slate-900/80 p-1 sm:p-1.5 shadow-md max-w-full">
          <button
            onClick={() => setIsAnnual(false)}
            className={`rounded-full px-3 sm:px-4 py-1.5 text-xs font-bold transition-all ${
              !isAnnual
                ? "bg-secondary text-white shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Monthly
          </button>

          <button
            onClick={() => setIsAnnual(true)}
            className={`flex items-center gap-1.5 rounded-full px-3 sm:px-4 py-1.5 text-xs font-bold transition-all ${
              isAnnual
                ? "bg-secondary text-white shadow-xs"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <span>Annual</span>
            <span className="rounded-full bg-emerald-400 px-1.5 sm:px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-slate-950">
              Save 20%
            </span>
          </button>
        </div>
      </SharedHeroSection>
      <PricingCardsSection isAnnual={isAnnual} />
    </main>
  );
}

// src/app/(pages)/pricing/_components/PricingHeroSection.jsx
"use client";

import { H1, P } from "@/components/ui/Typography";
import AmbientGlow from "@/components/ui/AmbientGlow";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function PricingHeroSection({ isAnnual, setIsAnnual }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 pb-16 pt-10 text-white">
      <AmbientGlow />

      <div className="site-container relative z-10 text-center max-w-3xl mx-auto">
        <Breadcrumb
          dark
          items={[
            { label: "Home", href: "/" },
            { label: "Pricing & Plans" },
          ]}
          className="justify-center mb-3"
        />

        <H1 color="white">
          <span>FLEXIBLE SAFETY</span>{" "}
          <span className="text-primary">PLANS.</span>
        </H1>

        <P color="light" className="mt-3 max-w-xl mx-auto">
          Choose the safety, training, and regulatory compliance package tailored for your home, retail outlet, auto gas station, or manufacturing facility.
        </P>

        {/* Billing Cycle Toggle */}
        <div className="mt-8 inline-flex items-center gap-1.5 sm:gap-3 rounded-full border border-slate-700 bg-slate-900/80 p-1 sm:p-1.5 shadow-md max-w-full">
          <button
            onClick={() => setIsAnnual(false)}
            className={`rounded-full px-3 sm:px-4 py-1.5 text-xs font-bold transition-all ${!isAnnual
                ? "bg-primary text-white shadow-2xs"
                : "text-slate-400 hover:text-white"
              }`}
          >
            Monthly
          </button>

          <button
            onClick={() => setIsAnnual(true)}
            className={`flex items-center gap-1.5 rounded-full px-3 sm:px-4 py-1.5 text-xs font-bold transition-all ${isAnnual
                ? "bg-primary text-white shadow-2xs"
                : "text-slate-400 hover:text-white"
              }`}
          >
            <span>Annual</span>
            <span className="rounded-full bg-emerald-500 px-1.5 sm:px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-slate-950">
              Save 20%
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}

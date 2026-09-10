// src/app/(pages)/faq/_components/FaqHeroSection.jsx
"use client";

import { HelpCircle } from "lucide-react";
import { H1, P } from "@/components/ui/Typography";
import AmbientGlow from "@/components/ui/AmbientGlow";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function FaqHeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 pb-16 pt-10 text-white">
      <AmbientGlow />

      <div className="site-container relative z-10 text-center max-w-3xl mx-auto">
        <Breadcrumb
          dark
          items={[{ label: "Home", href: "/" }, { label: "FAQ & Help Center" }]}
          className="justify-center mb-3"
        />

        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-blue-400 backdrop-blur-md">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>KNOWLEDGE BASE & SUPPORT DESK</span>
        </div>

        <H1 color="white" className="leading-tight">
          <span>FREQUENTLY ASKED</span>{" "}
          <span className="text-primary">QUESTIONS.</span>
        </H1>

        <P className="mt-3 text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          Clear, authoritative guidance on LPG household handling, regulator maintenance, commercial compliance, and emergency protocols.
        </P>
      </div>
    </section>
  );
}

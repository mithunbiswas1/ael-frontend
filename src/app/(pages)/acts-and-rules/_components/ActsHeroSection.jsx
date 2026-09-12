// src/app/(pages)/acts-and-rules/_components/ActsHeroSection.jsx

import { Scale } from "lucide-react";
import { H1, P } from "@/components/ui/Typography";
import AmbientGlow from "@/components/ui/AmbientGlow";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function ActsHeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 pb-16 pt-10 text-white">
      <AmbientGlow />

      <div className="site-container relative z-10 text-center max-w-3xl mx-auto">
        <Breadcrumb
          dark
          items={[
            { label: "Home", href: "/" },
            { label: "Related Acts & Rules" },
          ]}
          className="justify-center mb-3"
        />

        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-blue-400 backdrop-blur-md">
          <Scale className="h-3.5 w-3.5" />
          <span>NATIONAL STATUTORY & REGULATORY COMPENDIUM</span>
        </div>

        <H1 color="white">
          <span>ACTS &</span>{" "}
          <span className="text-primary">RULES.</span>
        </H1>

        <P color="light" className="mt-3 max-w-xl mx-auto">
          Official legal gazettes, petroleum acts, explosives regulations, and ministerial directives governing the Liquefied Petroleum Gas (LPG) sector in Bangladesh.
        </P>
      </div>
    </section>
  );
}

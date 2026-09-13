// src/app/(pages)/verify-certificate/_components/VerifyHeroSection.jsx
"use client";

import { ShieldCheck } from "lucide-react";
import { H1, P } from "@/components/ui/Typography";
import AmbientGlow from "@/components/ui/AmbientGlow";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function VerifyHeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 pb-16 pt-10 text-white">
      <AmbientGlow />

      <div className="site-container relative z-10 text-center max-w-3xl mx-auto">
        <Breadcrumb
          dark
          items={[
            { label: "Home", href: "/" },
            { label: "Training & Quiz", href: "/courses" },
            { label: "Verify Certificate" },
          ]}
          className="justify-center mb-3"
        />

        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-blue-400 backdrop-blur-md">
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>NATIONAL RECOGNIZED REGISTRY</span>
        </div>

        <H1 color="white">
          <span>VERIFY</span>{" "}
          <span className="text-primary">CERTIFICATE.</span>
        </H1>

        <P color="light" className="mt-3 max-w-xl mx-auto">
          Instant digital validation for all LPG Safety & Regulatory compliance certificates issued
          under Safe LPG, Department of Explosives (DoE), and LOAB joint programs.
        </P>
      </div>
    </section>
  );
}

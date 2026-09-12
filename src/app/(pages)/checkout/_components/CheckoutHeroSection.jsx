// src/app/(pages)/checkout/_components/CheckoutHeroSection.jsx
"use client";

import { Lock } from "lucide-react";
import { H1, P } from "@/components/ui/Typography";
import AmbientGlow from "@/components/ui/AmbientGlow";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function CheckoutHeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 pb-12 pt-10 text-white">
      <AmbientGlow />

      <div className="site-container relative z-10 max-w-5xl mx-auto">
        <Breadcrumb
          dark
          items={[
            { label: "Home", href: "/" },
            { label: "Pricing", href: "/pricing" },
            { label: "Secure Checkout" },
          ]}
          className="mb-3"
        />

        <div className="flex items-center justify-between">
          <div>
            <H1 color="white" className="leading-tight text-xl sm:text-2xl md:text-3xl">
              <span>SECURE</span>{" "}
              <span className="text-primary">CHECKOUT.</span>
            </H1>
            <P size="xs" color="slate400" className="mt-1">
              256-bit SSL encrypted gateway powered by Bangladesh Bank recognized merchant channels.
            </P>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs text-emerald-400">
            <Lock className="h-3.5 w-3.5" />
            <span>Bank-Grade Encryption</span>
          </div>
        </div>
      </div>
    </section>
  );
}

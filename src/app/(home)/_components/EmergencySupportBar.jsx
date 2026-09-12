// src/app/(home)/_components/EmergencySupportBar.jsx

"use client";

import { PhoneCall, FileText } from "lucide-react";
import { LinkButton } from "@/components/ui/LinkButton";
import { H2, P } from "@/components/ui/Typography";

export default function EmergencySupportBar() {
  return (
    <section className="mt-14 pb-12">
      <div className="site-container">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-primary/30 bg-gradient-to-br from-tertiary via-[#0c1a33] to-tertiary px-6 py-12 sm:px-12 sm:py-16 text-center shadow-2xl shadow-tertiary/60">

          {/* Subtle Ambient Light Glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 h-72 w-72 sm:h-96 sm:w-96 rounded-full bg-primary/25 blur-3xl"
          />

          {/* Subtle Background Grid Texture */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(#1D4E91_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.07]"
          />

          <div className="relative z-10 mx-auto max-w-3xl">
            {/* Headline */}
            <H2 color="white">
              Prevent Costly Mistakes
            </H2>

            {/* Subtitle */}
            <P color="light" className="mt-3.5 max-w-xl mx-auto text-slate-300">
              Follow certified LPG handling protocols, ensure full regulatory compliance, and access 24/7 emergency response across Bangladesh.
            </P>

            {/* Action Buttons Row */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              {/* Primary Action Button (Emergency Highlight) */}
              <LinkButton
                href="tel:16137"
                size="lg"
                className="w-full sm:w-auto text-white"
              >
                <PhoneCall className="h-4 w-4" />
                <span>Call Emergency Hotline (16137)</span>
              </LinkButton>

              {/* Secondary Action Button (Frosted Pill) */}
              <LinkButton
                href="/safety-guidelines"
                variant="frosted"
                size="lg"
                className="w-full sm:w-auto"
              >
                <FileText className="h-4 w-4 text-slate-300" />
                <span>Explore Safety Guidelines</span>
              </LinkButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

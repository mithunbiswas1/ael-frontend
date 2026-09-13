// src/app/(home)/_components/HeroSection.jsx
"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/LinkButton";
import { H1, P } from "@/components/ui/Typography";
import AmbientGlow from "@/components/ui/AmbientGlow";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-tertiary via-[#0c1a33] to-tertiary pb-20 pt-10 md:pb-24 md:pt-14 border-b border-primary/20">
      {/* Reusable Subtle Background Glow */}
      <AmbientGlow color="primary" />

      {/* Subtle Radial grid pattern matching brand primary */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#1D4E91_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.08]"
      />

      <div className="site-container relative z-10">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-6">

          {/* Left Text & CTA (7 cols) */}
          <div className="flex flex-col items-start lg:col-span-7">
            <H1 color="white">
              <span>SAFETY FIRST.</span>
              <br />
              <span className="text-secondary">AWARENESS ALWAYS.</span>
            </H1>

            <P color="light" className="mt-5 max-w-xl text-slate-300">
              Promoting nationwide LPG safety awareness across Bangladesh for consumers,
              dealers, and industries — ensuring a safer today and sustainable tomorrow.
            </P>

            {/* CTAs */}
            <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <LinkButton
                href="/safety-guidelines"
                variant="primary"
                size="lg"
                className="w-full sm:w-auto shadow-md shadow-primary/25"
              >
                <span>Explore Safety Guidelines</span>
                <ArrowRight className="h-4 w-4" />
              </LinkButton>

              <LinkButton
                href="/courses"
                variant="frosted"
                size="lg"
                className="w-full sm:w-auto hover:border-primary/50"
              >
                <span>Start Training &amp; Quiz</span>
                <ArrowRight className="h-4 w-4" />
              </LinkButton>
            </div>
          </div>

          {/* Right Visual (5 cols) */}
          <div className="relative flex items-center justify-center lg:col-span-5">
            <div className="group relative aspect-4/3 w-full max-w-lg overflow-hidden rounded-xl border border-white/15 bg-tertiary/80 shadow-2xl backdrop-blur-sm">
              <Image
                src="/lpg-hero.jpg"
                alt="LPG Safety Storage Plant"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover object-center"
              />

              {/* Glassmorphic floating tag on image */}
              <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between rounded-lg border border-white/15 bg-tertiary/90 p-3 text-white backdrop-blur-md shadow-lg">
                <div>
                  <div className="mb-1 text-xs font-black tracking-wide text-white">
                    National LPG Safety Standards
                  </div>
                  <div className="text-[10px] text-slate-300">
                    Compliant with BERC &amp; Fire Service Regulations
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

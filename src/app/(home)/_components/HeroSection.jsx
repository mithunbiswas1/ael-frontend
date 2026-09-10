// src/app/(home)/_components/HeroSection.jsx
"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/LinkButton";
import { H1, P } from "@/components/ui/Typography";
import AmbientGlow from "@/components/ui/AmbientGlow";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 pb-20 pt-10 md:pb-24 md:pt-14">
      {/* Reusable Subtle Background Glow */}
      <AmbientGlow />

      <div className="site-container relative z-10">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-6">

          {/* Left Text & CTA (7 cols) */}
          <div className="flex flex-col items-start lg:col-span-7">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-blue-400 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-blue-400 shadow-sm shadow-blue-400 animate-pulse" />
              <span>NATIONWIDE LPG SAFETY PLATFORM</span>
            </div>

            <H1 color="white" className="leading-[1.08] tracking-tight">
              <span>SAFETY FIRST.</span>
              <br />
              <span className="text-primary">AWARENESS ALWAYS.</span>
            </H1>

            <P className="mt-5 max-w-xl text-slate-300 text-sm md:text-base leading-relaxed">
              Promoting nationwide LPG safety awareness across Bangladesh for consumers,
              dealers, and industries — ensuring a safer today and sustainable tomorrow.
            </P>

            {/* CTAs */}
            <div className="mt-7 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <LinkButton
                href="/safety-guidelines"
                variant="solid"
                size="lg"
                className="w-full sm:w-auto justify-center bg-primary hover:bg-blue-700 border-primary text-white rounded-lg font-bold text-xs md:text-sm px-5 py-3 shadow-xs transition-colors duration-200"
              >
                <span>Explore Safety Guidelines</span>
                <ArrowRight className="h-4 w-4" />
              </LinkButton>

              <LinkButton
                href="/courses"
                variant="outline"
                size="lg"
                className="w-full sm:w-auto justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white rounded-lg font-bold text-xs md:text-sm px-5 py-3 transition-colors duration-200"
              >
                <span>Start Training &amp; Quiz</span>
                <ArrowRight className="h-4 w-4" />
              </LinkButton>
            </div>
          </div>

          {/* Right Visual (5 cols) */}
          <div className="relative flex items-center justify-center lg:col-span-5">
            <div className="group relative aspect-4/3 w-full max-w-lg overflow-hidden rounded-xl border border-white/15 bg-slate-800/80 shadow-md backdrop-blur-sm">
              <Image
                src="/lpg-hero.jpg"
                alt="LPG Safety Storage Plant"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover object-center"
              />

              {/* Glassmorphic floating tag on image */}
              <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between rounded-lg border border-white/20 bg-slate-950/70 p-3 text-white backdrop-blur-md">
                <div>
                  <div className="text-xs font-black tracking-wide text-white">
                    National LPG Safety Standards
                  </div>
                  <div className="text-[10px] text-slate-300">
                    Compliant with BERC &amp; Fire Service Regulations
                  </div>
                </div>
                <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

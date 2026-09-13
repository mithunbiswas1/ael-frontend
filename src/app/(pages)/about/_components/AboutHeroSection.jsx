// src/app/(pages)/about/_components/AboutHeroSection.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { LinkButton } from "@/components/ui/LinkButton";
import { ArrowRight } from "lucide-react";
import { H1, P } from "@/components/ui/Typography";
import Breadcrumb from "@/components/ui/Breadcrumb";
import AmbientGlow from "@/components/ui/AmbientGlow";

export default function AboutHeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 pb-16 pt-10 md:pb-20 md:pt-14 text-white">
      <AmbientGlow />

      <div className="site-container relative z-10">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-8">
          {/* Left Column */}
          <div className="flex flex-col items-start lg:col-span-7">
            {/* Breadcrumb */}
            <Breadcrumb
              dark
              items={[
                { label: "Home", href: "/" },
                { label: "About Us" },
              ]}
              className="mb-3"
            />

            {/* Pill tag */}
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-blue-400 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400 animate-pulse" />
              <span>NATIONAL LPG SAFETY MISSION</span>
            </div>

            {/* Dual-tone H1 */}
            <H1 color="white">
              <span>ABOUT</span>{" "}
              <span className="text-primary">US.</span>
            </H1>

            <P color="light" className="mt-4 max-w-xl">
              Dedicated to promoting nationwide safety, building public awareness, and strengthening
              Bangladesh’s LPG sector through knowledge, technical training, and institutional collaboration.
            </P>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <LinkButton
                href="/courses"
                variant="primary"
                size="default"
              >
                <span>Explore Training Courses</span>
                <ArrowRight className="h-4 w-4" />
              </LinkButton>
              <LinkButton
                href="/contact"
                variant="frosted"
                size="default"
              >
                <span>Contact Our Team</span>
              </LinkButton>
            </div>
          </div>

          {/* Right Column: Visual */}
          <div className="relative flex items-center justify-center lg:col-span-5">
            <div className="group relative aspect-4/3 w-full max-w-lg overflow-hidden rounded-xl border border-white/15 bg-slate-800/80 shadow-md backdrop-blur-sm">
              <Image
                src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop"
                alt="LPG Storage and Cylinders"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

              {/* Floating info tag */}
              <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between rounded-lg border border-white/20 bg-slate-950/75 p-3 text-white backdrop-blur-md">
                <div>
                  <div className="text-xs font-black tracking-wide text-white">
                    Nationwide Awareness Network
                  </div>
                  <div className="text-[10px] text-slate-300">
                    Standardizing safety across all 64 districts
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

// src/app/(pages)/courses/_components/CoursesHeroSection.jsx
"use client";

import Link from "next/link";
import { GraduationCap, Clock, HelpCircle, Award, CheckCircle2, ArrowRight } from "lucide-react";
import { H1, H3, P } from "@/components/ui/Typography";
import AmbientGlow from "@/components/ui/AmbientGlow";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function CoursesHeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 pb-16 pt-10 md:pb-20 md:pt-14 text-white">
      <AmbientGlow />

      <div className="site-container relative z-10">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-8">
          {/* Left Column */}
          <div className="flex flex-col items-start lg:col-span-7">
            <Breadcrumb
              dark
              items={[
                { label: "Home", href: "/" },
                { label: "Training & Quiz" },
              ]}
              className="mb-3"
            />

            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-blue-400 backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400 animate-pulse" />
              <span>ONLINE LMS &amp; CERTIFICATION</span>
            </div>

            <H1 color="white" className="leading-[1.08] tracking-tight">
              <span>TRAINING &amp;</span>{" "}
              <span className="text-primary">QUIZ.</span>
            </H1>

            <P className="mt-4 max-w-xl text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
              Industry-aligned LPG safety training for regular consumers, commercial dealers, and industrial operators. Learn at your own pace, take the quiz, and earn your verified certificate.
            </P>

            {/* 4 Feature Badges */}
            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary border border-primary/30">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <span className="text-[11px]">Expert Courses</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary border border-primary/30">
                  <Clock className="h-4 w-4" />
                </div>
                <span className="text-[11px]">Self-Paced</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary border border-primary/30">
                  <HelpCircle className="h-4 w-4" />
                </div>
                <span className="text-[11px]">Dynamic Quiz</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary border border-primary/30">
                  <Award className="h-4 w-4" />
                </div>
                <span className="text-[11px]">QR Certificate</span>
              </div>
            </div>
          </div>

          {/* Right Column: Floating LMS Card */}
          <div className="relative flex items-center justify-center lg:col-span-5">
            <div className="w-full max-w-md rounded-xl border border-white/15 bg-slate-900/80 p-5 sm:p-6 text-white backdrop-blur-xl shadow-md">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                    LEARN ANYWHERE
                  </span>
                  <H3 color="white" className="text-base font-bold">
                    Digital Academy
                  </H3>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white shadow-xs">
                  <GraduationCap className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-4 space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Self-paced video modules with safety guidelines</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Instant score grading &amp; re-attempt option</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-200">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Trusted by 25,000+ certified nationwide users</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-white/10">
                <Link
                  href="#catalog"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-blue-700"
                >
                  <span>Browse Courses Below</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// src/app/(home)/_components/SafetyTickerRibbon.jsx
"use client";

import { Flame, ShieldCheck, PhoneCall, Award, CheckCircle2, Truck } from "lucide-react";

const tickerItems = [
  { icon: PhoneCall, label: "24/7 EMERGENCY HOTLINE 16137" },
  { icon: ShieldCheck, label: "BERC REGULATORY COMPLIANCE" },
  { icon: Flame, label: "SAFE CYLINDER HANDLING PROTOCOLS" },
  { icon: Truck, label: "CERTIFIED LPG DISTRIBUTORS" },
  { icon: Award, label: "ACCREDITED SAFETY LMS CERTIFICATION" },
  { icon: CheckCircle2, label: "NATIONWIDE INSPECTION STANDARDS" },
];

export default function SafetyTickerRibbon() {
  return (
    <div className="relative overflow-hidden border-y border-slate-800 bg-slate-950 py-3 text-slate-300">
      {/* Subtle side fading gradient masks */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-slate-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-slate-950 to-transparent" />

      <div className="flex w-max animate-[marquee_28s_linear_infinite] items-center gap-8 whitespace-nowrap">
        {[...tickerItems, ...tickerItems, ...tickerItems].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={idx}
              className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-widest text-slate-300 transition-colors hover:text-white"
            >
              <span className="text-primary font-bold">/</span>
              <Icon className="h-3.5 w-3.5 text-primary" strokeWidth={2.2} />
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

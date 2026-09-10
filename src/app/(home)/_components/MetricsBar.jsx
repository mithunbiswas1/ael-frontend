// src/app/(home)/_components/MetricsBar.jsx
"use client";

import { Users, GraduationCap, FileText, ShieldCheck } from "lucide-react";
import { H3, P } from "@/components/ui/Typography";

const metrics = [
  {
    id: 1,
    icon: Users,
    value: "25,340+",
    label: "Registered Users",
  },
  {
    id: 2,
    icon: GraduationCap,
    value: "1,250+",
    label: "Safety Trainings",
  },
  {
    id: 3,
    icon: FileText,
    value: "820+",
    label: "Safety Resources",
  },
  {
    id: 4,
    icon: ShieldCheck,
    value: "120+",
    label: "Incidents Reported",
  },
];

export default function MetricsBar() {
  return (
    <div className="relative z-20 -mt-8 sm:-mt-10 mx-auto w-full max-w-6xl px-4">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 rounded-xl border border-slate-200/80 bg-white/95 p-5 sm:p-6 shadow-xs backdrop-blur-xl md:grid-cols-4 md:gap-6">
        {metrics.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="flex items-center gap-3.5 rounded-lg p-2.5 transition-colors duration-200 hover:bg-slate-50/80"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20 shadow-xs">
                <Icon className="h-5 w-5" strokeWidth={2.5} />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {item.value}
                </div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  {item.label}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// src/app/(pages)/about/_components/AboutStatsSection.jsx

import { Users, GraduationCap, FileText, ShieldCheck } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "25,340+",
    label: "Registered Users",
  },
  {
    icon: GraduationCap,
    value: "1,250+",
    label: "Safety Trainings",
  },
  {
    icon: FileText,
    value: "820+",
    label: "Resources & Guides",
  },
  {
    icon: ShieldCheck,
    value: "120+",
    label: "Incidents Reported",
  },
];

export default function AboutStatsSection() {
  return (
    <section className="py-10 bg-white border-t border-slate-200/80">
      <div className="site-container">
        <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-200/80 bg-slate-50/70 p-5 sm:p-6 md:grid-cols-4 md:gap-6">
          {stats.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20 shadow-xs">
                  <Icon className="h-5 w-5" strokeWidth={2.2} />
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
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
    </section>
  );
}

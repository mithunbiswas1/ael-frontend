// src/app/(pages)/about/_components/AboutStatsSection.jsx
"use client";

import { Users, GraduationCap, FileText, ShieldCheck } from "lucide-react";
import { useDictionary } from "@/context/DictionaryContext";

export default function AboutStatsSection({ data }) {
  const { locale } = useDictionary();
  const isBn = locale === "bn";

  if (!data) return null;

  const rawStats = [
    {
      icon: Users,
      value: isBn ? data?.certifiedLearnersBn : data?.certifiedLearners,
      label: isBn ? data?.certifiedLearnersLabelBn : data?.certifiedLearnersLabel,
    },
    {
      icon: GraduationCap,
      value: isBn ? data?.districtsCoveredBn : data?.districtsCovered,
      label: isBn ? data?.districtsCoveredLabelBn : data?.districtsCoveredLabel,
    },
    {
      icon: FileText,
      value: isBn ? data?.incidentReductionBn : data?.incidentReduction,
      label: isBn ? data?.incidentReductionLabelBn : data?.incidentReductionLabel,
    },
    {
      icon: ShieldCheck,
      value: isBn ? data?.partnerOrganizationsBn : data?.partnerOrganizations,
      label: isBn ? data?.partnerOrganizationsLabelBn : data?.partnerOrganizationsLabel,
    },
  ];

  const stats = rawStats.filter((s) => Boolean(s.value));
  if (stats.length === 0) return null;

  return (
    <section className="py-10 bg-white border-t border-slate-200/80">
      <div className="site-container">
        <div className={`grid grid-cols-2 gap-4 rounded-xl border border-slate-200/80 bg-slate-50/70 p-5 sm:p-6 ${stats.length > 2 ? "md:grid-cols-4" : "md:grid-cols-2"} md:gap-6`}>
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
                  {item.label && (
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      {item.label}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

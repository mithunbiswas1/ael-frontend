// src/app/(dashboard)/admin/pages/about/_components/StatsEditorTab.jsx
"use client";

import { useState } from "react";
import { Users, GraduationCap, FileText, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { H3 } from "@/components/ui/Typography";

export default function StatsEditorTab({
  data = {},
  onChange = () => { },
}) {
  const [previewLang, setPreviewLang] = useState("en");
  const isBn = previewLang === "bn";

  const updateField = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const rawStats = [
    {
      icon: Users,
      value: isBn ? data?.certifiedLearnersBn : data?.certifiedLearners,
      label: (isBn ? data?.certifiedLearnersLabelBn : data?.certifiedLearnersLabel) || (isBn ? "প্রত্যয়িত প্রশিক্ষণার্থী" : "Certified Learners"),
    },
    {
      icon: GraduationCap,
      value: isBn ? data?.districtsCoveredBn : data?.districtsCovered,
      label: (isBn ? data?.districtsCoveredLabelBn : data?.districtsCoveredLabel) || (isBn ? "দেশব্যাপী কভারেজ" : "Districts Covered"),
    },
    {
      icon: FileText,
      value: isBn ? data?.incidentReductionBn : data?.incidentReduction,
      label: (isBn ? data?.incidentReductionLabelBn : data?.incidentReductionLabel) || (isBn ? "ঝুঁকি হ্রাস সূচক" : "Risk Mitigation"),
    },
    {
      icon: ShieldCheck,
      value: isBn ? data?.partnerOrganizationsBn : data?.partnerOrganizations,
      label: (isBn ? data?.partnerOrganizationsLabelBn : data?.partnerOrganizationsLabel) || (isBn ? "সহযোগী নিয়ন্ত্রক সংস্থা" : "Partner Regulators"),
    },
  ];

  const activeStats = rawStats.filter((s) => Boolean(s.value));

  return (
    <div className="space-y-8">
      {/* 1. Real-Time Front-Panel Matched Live Storefront Preview */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2">

            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Live Front Panel Storefront Preview (National Stats)
            </span>
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-mono text-slate-600">
              Real-time Sync
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Preview Language:</span>
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5">
              <Button
                type="button"
                variant="unstyled"
                onClick={() => setPreviewLang("en")}
                className={`px-3 py-1 text-xs rounded-md font-semibold transition-all cursor-pointer ${previewLang === "en"
                    ?"bg-primary text-white"
                    : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                English
              </Button>
              <Button
                type="button"
                variant="unstyled"
                onClick={() => setPreviewLang("bn")}
                className={`px-3 py-1 text-xs rounded-md font-semibold transition-all cursor-pointer ${previewLang === "bn"
                    ?"bg-primary text-white"
                    : "text-slate-600 hover:text-slate-900"
                  }`}
              >
                বাংলা
              </Button>
            </div>
          </div>
        </div>

        {/* Live Storefront Component Preview Container */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
          {activeStats.length === 0 ? (
            <div className="py-8 text-center text-slate-400">
              <p className="text-sm font-medium">No statistics values entered yet.</p>
              <p className="text-xs text-slate-400 mt-1">Enter statistic numbers below to preview.</p>
            </div>
          ) : (
            <div className={`grid grid-cols-2 gap-4 rounded-xl border border-slate-200/80 bg-slate-50/70 p-5 sm:p-6 ${activeStats.length > 2 ? "md:grid-cols-4" : "md:grid-cols-2"} md:gap-6`}>
              {activeStats.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
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
          )}
        </div>
      </div>

      {/* 2. Form Configuration */}
      <div className="space-y-6">
        {/* Metric 1 */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
              1
            </span>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <div>
                <H3 className="text-sm font-bold text-slate-900">Metric 1: Certified Learners</H3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Statistic Value"
              value={data?.certifiedLearners || ""}
              onChange={(e) => updateField("certifiedLearners", e.target.value)}
              placeholder="e.g. 25,000+"
            />
            <Input
              label="পরিসংখ্যান মান"
              value={data?.certifiedLearnersBn || ""}
              onChange={(e) => updateField("certifiedLearnersBn", e.target.value)}
              placeholder="যেমন: ২৫,০০০+"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Label"
              value={data?.certifiedLearnersLabel || ""}
              onChange={(e) => updateField("certifiedLearnersLabel", e.target.value)}
              placeholder="e.g. Certified Learners"
            />
            <Input
              label="লেবেল"
              value={data?.certifiedLearnersLabelBn || ""}
              onChange={(e) => updateField("certifiedLearnersLabelBn", e.target.value)}
              placeholder="যেমন: প্রত্যয়িত প্রশিক্ষণার্থী"
            />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
              2
            </span>
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" />
              <div>
                <H3 className="text-sm font-bold text-slate-900">Metric 2: Districts Covered</H3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Statistic Value"
              value={data?.districtsCovered || ""}
              onChange={(e) => updateField("districtsCovered", e.target.value)}
              placeholder="e.g. 64 Districts"
            />
            <Input
              label="পরিসংখ্যান মান"
              value={data?.districtsCoveredBn || ""}
              onChange={(e) => updateField("districtsCoveredBn", e.target.value)}
              placeholder="যেমন: ৬৪ জেলা"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Label"
              value={data?.districtsCoveredLabel || ""}
              onChange={(e) => updateField("districtsCoveredLabel", e.target.value)}
              placeholder="e.g. Districts Covered"
            />
            <Input
              label="লেবেল"
              value={data?.districtsCoveredLabelBn || ""}
              onChange={(e) => updateField("districtsCoveredLabelBn", e.target.value)}
              placeholder="যেমন: দেশব্যাপী কভারেজ"
            />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
              3
            </span>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <div>
                <H3 className="text-sm font-bold text-slate-900">Metric 3: Incident Risk Mitigation</H3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Statistic Value"
              value={data?.incidentReduction || ""}
              onChange={(e) => updateField("incidentReduction", e.target.value)}
              placeholder="e.g. 92%"
            />
            <Input
              label="পরিসংখ্যান মান"
              value={data?.incidentReductionBn || ""}
              onChange={(e) => updateField("incidentReductionBn", e.target.value)}
              placeholder="যেমন: ৯২%"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Label"
              value={data?.incidentReductionLabel || ""}
              onChange={(e) => updateField("incidentReductionLabel", e.target.value)}
              placeholder="e.g. Risk Mitigation"
            />
            <Input
              label="লেবেল"
              value={data?.incidentReductionLabelBn || ""}
              onChange={(e) => updateField("incidentReductionLabelBn", e.target.value)}
              placeholder="যেমন: ঝুঁকি হ্রাস সূচক"
            />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
              4
            </span>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <div>
                <H3 className="text-sm font-bold text-slate-900">Metric 4: Partner Regulators</H3>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Statistic Value"
              value={data?.partnerOrganizations || ""}
              onChange={(e) => updateField("partnerOrganizations", e.target.value)}
              placeholder="e.g. 15+"
            />
            <Input
              label="পরিসংখ্যান মান"
              value={data?.partnerOrganizationsBn || ""}
              onChange={(e) => updateField("partnerOrganizationsBn", e.target.value)}
              placeholder="যেমন: ১৫+"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Label"
              value={data?.partnerOrganizationsLabel || ""}
              onChange={(e) => updateField("partnerOrganizationsLabel", e.target.value)}
              placeholder="e.g. Partner Regulators"
            />
            <Input
              label="লেবেল"
              value={data?.partnerOrganizationsLabelBn || ""}
              onChange={(e) => updateField("partnerOrganizationsLabelBn", e.target.value)}
              placeholder="যেমন: সহযোগী নিয়ন্ত্রক সংস্থা"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

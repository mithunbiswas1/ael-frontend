"use client";

import { Input } from "@/components/ui/Input";
import { H3, P } from "@/components/ui/Typography";

export default function BercPricingEditorTab({ pricing = {}, onChange }) {
  const data = pricing || {};

  const handleChange = (field, value) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5">
      <div className="border-b border-slate-100 pb-3">
        <H3 className="text-sm font-bold text-slate-900">
          BERC Official Rate Announcement & Monthly Pulse
        </H3>
        <P className="text-xs text-slate-500 mt-0.5">
          Configure official consumer LPG rates, effective calendar cycles, and gazette order references.
        </P>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Standard 12KG Consumer Price"
          value={data.current12kgPrice || ""}
          onChange={(e) => handleChange("current12kgPrice", e.target.value)}
          placeholder="e.g. ৳ 1,455"
        />
        <Input
          label="Statutory Circular Number"
          value={data.statutoryCircularNo || ""}
          onChange={(e) => handleChange("statutoryCircularNo", e.target.value)}
          placeholder="e.g. BERC/LPG-RATE/2026/04"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Effective Cycle / Month"
          value={data.effectiveMonth || ""}
          onChange={(e) => handleChange("effectiveMonth", e.target.value)}
          placeholder="e.g. Current Month / June 2026"
        />
        <Input
          label="কার্যকর মাস / সময়কাল"
          value={data.effectiveMonthBn || ""}
          onChange={(e) => handleChange("effectiveMonthBn", e.target.value)}
          placeholder="যেমন: চলতি মাস / জুন ২০২৬"
        />
      </div>
    </div>
  );
}

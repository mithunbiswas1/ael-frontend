"use client";

import { FaPlus, FaTrash } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { H3, P } from "@/components/ui/Typography";

const STATUS_OPTIONS = [
  { value: "Resolved", label: "Resolved (সমাধানকৃত)" },
  { value: "Under Investigation", label: "Under Investigation (তদন্তাধীন)" },
  { value: "Pending Review", label: "Pending Review (পর্যালোচনার অপেক্ষায়)" },
];

const SEVERITY_OPTIONS = [
  { value: "Low", label: "Low (নিম্ন)" },
  { value: "Medium", label: "Medium (মাঝারি)" },
  { value: "High", label: "High (উচ্চ)" },
  { value: "Critical", label: "Critical (মারাত্মক)" },
];

export default function IncidentsEditorTab({ incidents = [], onChange }) {
  const list = Array.isArray(incidents) ? incidents : [];

  const handleAdd = () => {
    const next = [
      ...list,
      {
        id: `INC-2026-${String(Date.now()).slice(-4)}`,
        type: "Leakage",
        typeBn: "গ্যাস লিকেজ",
        location: "Dhaka",
        locationBn: "ঢাকা",
        specificLocation: "",
        specificLocationBn: "",
        date: "Current Date",
        dateBn: "আজকের তারিখ",
        status: "Under Investigation",
        statusBn: "তদন্তাধীন",
        severity: "Medium",
        severityBn: "মাঝারি",
        conductedBy: "DoE",
        details: "",
        detailsBn: "",
        casualties: "0 Casualties",
        casualtiesBn: "০ হতাহত",
        investigationReport: `INQ-2026-${String(Date.now()).slice(-3)}`,
      },
    ];
    onChange(next);
  };

  const handleRemove = (index) => {
    const next = list.filter((_, i) => i !== index);
    onChange(next);
  };

  const handleChange = (index, field, value) => {
    const next = list.map((item, i) => (i === index ? { ...item, [field]: value } : item));
    onChange(next);
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <H3 className="text-sm font-bold text-slate-900">
            Incident Telemetry & Inquiry Registry
          </H3>
          <P className="text-xs text-slate-500 mt-0.5">
            Log LPG fire/leakage occurrences, probe status, investigation reports, and safety resolutions.
          </P>
        </div>
        <Button
          type="button"
          variant="primary"
          size="sm"
          onClick={handleAdd}
          className="gap-2 text-xs font-bold"
        >
          <FaPlus className="h-3 w-3" />
          <span>Add Incident Report</span>
        </Button>
      </div>

      <div className="space-y-4">
        {list.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No incident reports recorded yet.
          </div>
        ) : (
          list.map((item, idx) => (
            <div
              key={item.id || idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-600">
                  {item.id} — {item.location} ({item.type})
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => handleRemove(idx)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5"
                  title="Remove incident"
                >
                  <FaTrash className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <Input
                  label="Incident Tracking ID"
                  value={item.id || ""}
                  onChange={(e) => handleChange(idx, "id", e.target.value)}
                  placeholder="INC-2026-101"
                />
                <Input
                  label="Incident Date"
                  value={item.date || ""}
                  onChange={(e) => handleChange(idx, "date", e.target.value)}
                  placeholder="May 20, 2026"
                />
                <Input
                  label="তারিখ (বাংলা)"
                  value={item.dateBn || ""}
                  onChange={(e) => handleChange(idx, "dateBn", e.target.value)}
                  placeholder="২০ মে, ২০২৬"
                />
                <Input
                  label="Investigation Report Code"
                  value={item.investigationReport || ""}
                  onChange={(e) => handleChange(idx, "investigationReport", e.target.value)}
                  placeholder="INQ-2026-77"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <Input
                  label="Incident Type (English)"
                  value={item.type || ""}
                  onChange={(e) => handleChange(idx, "type", e.target.value)}
                  placeholder="Leakage / Fire / Explosion"
                />
                <Input
                  label="ধরণ (বাংলা)"
                  value={item.typeBn || ""}
                  onChange={(e) => handleChange(idx, "typeBn", e.target.value)}
                  placeholder="গ্যাস লিকেজ / অগ্নিকাণ্ড"
                />
                <Input
                  label="District / Division"
                  value={item.location || ""}
                  onChange={(e) => handleChange(idx, "location", e.target.value)}
                  placeholder="Dhaka / Chattogram"
                />
                <Input
                  label="জেলা / বিভাগ (বাংলা)"
                  value={item.locationBn || ""}
                  onChange={(e) => handleChange(idx, "locationBn", e.target.value)}
                  placeholder="ঢাকা / চট্টগ্রাম"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Select
                  label="Investigation Status"
                  value={item.status || "Under Investigation"}
                  onChange={(e) => handleChange(idx, "status", e.target.value)}
                  options={STATUS_OPTIONS}
                />

                <Select
                  label="Severity Level"
                  value={item.severity || "Medium"}
                  onChange={(e) => handleChange(idx, "severity", e.target.value)}
                  options={SEVERITY_OPTIONS}
                />

                <Input
                  label="Investigating Authority"
                  value={item.conductedBy || ""}
                  onChange={(e) => handleChange(idx, "conductedBy", e.target.value)}
                  placeholder="DoE / Civil Defense / LOAB"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Specific Location (English)"
                  value={item.specificLocation || ""}
                  onChange={(e) => handleChange(idx, "specificLocation", e.target.value)}
                  placeholder="e.g. Patenga Depot Area, Chattogram"
                />
                <Input
                  label="নির্দিষ্ট অবস্থান (বাংলা)"
                  value={item.specificLocationBn || ""}
                  onChange={(e) => handleChange(idx, "specificLocationBn", e.target.value)}
                  placeholder="যেমন: পতেঙ্গা ডিপো এলাকা, চট্টগ্রাম"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Textarea
                  label="Incident Summary / Technical Findings (English)"
                  rows={2}
                  value={item.details || ""}
                  onChange={(e) => handleChange(idx, "details", e.target.value)}
                  placeholder="Describe technical events and control measures..."
                />
                <Textarea
                  label="ঘটনার বিবরণ / কারিগরি ফলাফল (বাংলা)"
                  rows={2}
                  value={item.detailsBn || ""}
                  onChange={(e) => handleChange(idx, "detailsBn", e.target.value)}
                  placeholder="ঘটনা ও গৃহীত ব্যবস্থা বাংলায় লিখুন..."
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

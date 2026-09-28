"use client";

import { FaPlus, FaTrash } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { H3, P } from "@/components/ui/Typography";

const STAKEHOLDER_TAB_OPTIONS = [
  { value: "all", label: "All Stakeholders (সকল)" },
  { value: "customer", label: "Consumers (ভোক্তা)" },
  { value: "dealer", label: "Dealers (ডিলার)" },
  { value: "distributor", label: "Distributors (পরিবেশক)" },
  { value: "investors", label: "Investors & Plants (বিনিয়োগকারী)" },
];

const ACCESS_OPTIONS = [
  { value: "Public", label: "Public (সবার জন্য উন্মুক্ত)" },
  { value: "Login Required", label: "Login Required (লগইন আবশ্যক)" },
];

export default function DocumentsEditorTab({ documents = [], onChange }) {
  const list = Array.isArray(documents) ? documents : [];

  const handleAdd = () => {
    const next = [
      ...list,
      {
        id: Date.now(),
        nameEn: "New Safety Guideline Document",
        nameBn: "নতুন নিরাপত্তা নির্দেশিকা দলিল",
        targetTab: "all",
        type: "PDF",
        access: "Public",
        fileName: "safety-guideline.pdf",
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
            Downloadable Safety Guidelines & Manuals
          </H3>
          <P className="text-xs text-slate-500 mt-0.5">
            Manage stakeholder manuals, target groups (Consumers, Dealers, Industrial), and access permissions.
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
          <span>Add Document</span>
        </Button>
      </div>

      <div className="space-y-4">
        {list.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No downloadable guideline documents added yet.
          </div>
        ) : (
          list.map((item, idx) => (
            <div
              key={item.id || idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-500">
                  Doc #{idx + 1}: {item.fileName || "File"}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => handleRemove(idx)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5"
                  title="Remove document"
                >
                  <FaTrash className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Document Name (English)"
                  value={item.nameEn || ""}
                  onChange={(e) => handleChange(idx, "nameEn", e.target.value)}
                  placeholder="LPG Handling & Storage Guidelines"
                />
                <Input
                  label="দলিলের নাম (বাংলা)"
                  value={item.nameBn || ""}
                  onChange={(e) => handleChange(idx, "nameBn", e.target.value)}
                  placeholder="এলপিজি হ্যান্ডলিং ও মজুত সংক্রান্ত নির্দেশিকা"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Select
                  label="Target Stakeholder Tab"
                  value={item.targetTab || "all"}
                  onChange={(e) => handleChange(idx, "targetTab", e.target.value)}
                  options={STAKEHOLDER_TAB_OPTIONS}
                />

                <Select
                  label="Access Permission"
                  value={item.access || "Public"}
                  onChange={(e) => handleChange(idx, "access", e.target.value)}
                  options={ACCESS_OPTIONS}
                />

                <Input
                  label="PDF Filename / Path"
                  value={item.fileName || ""}
                  onChange={(e) => handleChange(idx, "fileName", e.target.value)}
                  placeholder="e.g. lpg-guidelines.pdf"
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

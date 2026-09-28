"use client";

import { FaPlus, FaTrash } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { H3, P } from "@/components/ui/Typography";

export default function AgenciesEditorTab({ agencies = [], onChange }) {
  const list = Array.isArray(agencies) ? agencies : [];

  const handleAdd = () => {
    const next = [
      ...list,
      {
        id: `agency-${Date.now()}`,
        name: "New Agency",
        titleEn: "",
        titleBn: "",
        descEn: "",
        descBn: "",
        badgeBg: "bg-blue-50 text-blue-600 border-blue-200",
        href: "https://",
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
            Regulatory Agencies & Institutional Partners
          </H3>
          <P className="text-xs text-slate-500 mt-0.5">
            Manage Department of Explosives, Civil Defense, and LOAB stakeholder cards.
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
          <span>Add Agency</span>
        </Button>
      </div>

      <div className="space-y-4">
        {list.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No regulatory agencies added yet.
          </div>
        ) : (
          list.map((item, idx) => (
            <div
              key={item.id || idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-500">
                  Agency #{idx + 1}: {item.name || "Untitled"}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => handleRemove(idx)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5"
                  title="Remove agency"
                >
                  <FaTrash className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <Input
                  label="Short Name / Tag"
                  value={item.name || ""}
                  onChange={(e) => handleChange(idx, "name", e.target.value)}
                  placeholder="e.g. DoE"
                />
                <Input
                  label="Official Website URL"
                  value={item.href || ""}
                  onChange={(e) => handleChange(idx, "href", e.target.value)}
                  placeholder="https://explosives.gov.bd"
                />
                <Input
                  label="Agency Title (English)"
                  value={item.titleEn || ""}
                  onChange={(e) => handleChange(idx, "titleEn", e.target.value)}
                  placeholder="Department of Explosives"
                />
                <Input
                  label="সংস্থার নাম (বাংলা)"
                  value={item.titleBn || ""}
                  onChange={(e) => handleChange(idx, "titleBn", e.target.value)}
                  placeholder="বিস্ফোরক পরিদপ্তর"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Description (English)"
                  value={item.descEn || ""}
                  onChange={(e) => handleChange(idx, "descEn", e.target.value)}
                  placeholder="National regulatory authority under Ministry of Power & Energy."
                />
                <Input
                  label="বিবরণ (বাংলা)"
                  value={item.descBn || ""}
                  onChange={(e) => handleChange(idx, "descBn", e.target.value)}
                  placeholder="বিদ্যুৎ ও জ্বালানি মন্ত্রণালয়ের অধীনস্থ জাতীয় নিয়ন্ত্রক কর্তৃপক্ষ।"
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

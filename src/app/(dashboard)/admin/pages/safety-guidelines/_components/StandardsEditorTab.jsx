"use client";

import { FaPlus, FaTrash } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { H3, P } from "@/components/ui/Typography";

export default function StandardsEditorTab({ standards = [], onChange }) {
  const list = Array.isArray(standards) ? standards : [];

  const handleAdd = () => {
    const next = [...list, { en: "", bn: "" }];
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
            National & International Standards List
          </H3>
          <P className="text-xs text-slate-500 mt-0.5">
            Configure ISO, EN, NFPA, and BSTI regulatory standards displayed on the guidelines page.
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
          <span>Add Standard</span>
        </Button>
      </div>

      <div className="space-y-3">
        {list.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No standards added yet. Click &quot;Add Standard&quot; to create one.
          </div>
        ) : (
          list.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row items-center gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/70"
            >
              <span className="text-xs font-mono font-bold text-slate-400 shrink-0">
                #{idx + 1}
              </span>
              <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Standard (English)"
                  value={item.en || ""}
                  onChange={(e) => handleChange(idx, "en", e.target.value)}
                  placeholder="e.g. ISO 14246: LPG Equipment & Valves"
                />
                <Input
                  label="মানদণ্ড (বাংলা)"
                  value={item.bn || ""}
                  onChange={(e) => handleChange(idx, "bn", e.target.value)}
                  placeholder="যেমন: আইএসও ১৪২৪৬: এলপিজি সরঞ্জাম ও ভালভ"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={() => handleRemove(idx)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 self-end sm:self-center"
                title="Remove standard"
              >
                <FaTrash className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

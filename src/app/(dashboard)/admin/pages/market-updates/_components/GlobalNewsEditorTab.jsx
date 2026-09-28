"use client";

import { FaPlus, FaTrash } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { H3, P } from "@/components/ui/Typography";

export default function GlobalNewsEditorTab({ news = [], onChange }) {
  const list = Array.isArray(news) ? news : [];

  const handleAdd = () => {
    const next = [
      ...list,
      {
        id: `GLOBAL-2026-${String(Date.now()).slice(-4)}`,
        slug: `GLOBAL-2026-${String(Date.now()).slice(-4)}`,
        title: "International LPG Market Indicator",
        titleBn: "আন্তর্জাতিক এলপিজি মার্কেট সূচক",
        date: "Current Date",
        dateBn: "আজকের তারিখ",
        tag: "Global CP",
        tagBn: "আন্তর্জাতিক সিপি",
        summary: "",
        summaryBn: "",
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
            Global Market Trends & Shipping Benchmarks
          </H3>
          <P className="text-xs text-slate-500 mt-0.5">
            Manage Saudi Aramco Contract Prices (CP), VLGC freight rates, and international import cost analysis.
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
          <span>Add Global Market Item</span>
        </Button>
      </div>

      <div className="space-y-4">
        {list.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No international market items added yet.
          </div>
        ) : (
          list.map((item, idx) => (
            <div
              key={item.id || idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-500">
                  Item #{idx + 1}: {item.title || "Untitled"}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => handleRemove(idx)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5"
                  title="Remove item"
                >
                  <FaTrash className="h-3.5 w-3.5" />
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <Input
                  label="Item Slug / ID"
                  value={item.slug || item.id || ""}
                  onChange={(e) => {
                    handleChange(idx, "slug", e.target.value);
                    handleChange(idx, "id", e.target.value);
                  }}
                  placeholder="GLOBAL-2026-01"
                />
                <Input
                  label="Category / Tag (English)"
                  value={item.tag || ""}
                  onChange={(e) => handleChange(idx, "tag", e.target.value)}
                  placeholder="Aramco CP / Freight"
                />
                <Input
                  label="ট্যাগ (বাংলা)"
                  value={item.tagBn || ""}
                  onChange={(e) => handleChange(idx, "tagBn", e.target.value)}
                  placeholder="আরামকো সিপি / ফ্রেইট"
                />
                <Input
                  label="Date / Month"
                  value={item.date || ""}
                  onChange={(e) => handleChange(idx, "date", e.target.value)}
                  placeholder="June 2026"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Headline (English)"
                  value={item.title || ""}
                  onChange={(e) => handleChange(idx, "title", e.target.value)}
                  placeholder="Saudi Aramco Sets Contract Price for June"
                />
                <Input
                  label="শিরোনাম (বাংলা)"
                  value={item.titleBn || ""}
                  onChange={(e) => handleChange(idx, "titleBn", e.target.value)}
                  placeholder="জুন মাসের জন্য সৌদি আরামকো সিপি নির্ধারণ"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Textarea
                  label="Market Analysis Summary (English)"
                  rows={2}
                  value={item.summary || ""}
                  onChange={(e) => handleChange(idx, "summary", e.target.value)}
                  placeholder="Propane set at $580/MT, Butane at $565/MT..."
                />
                <Textarea
                  label="বাজার বিশ্লেষণের সারসংক্ষেপ (বাংলা)"
                  rows={2}
                  value={item.summaryBn || ""}
                  onChange={(e) => handleChange(idx, "summaryBn", e.target.value)}
                  placeholder="প্রোপেন ও বিউটেন মূল্য বিশ্লেষণ বাংলায় লিখুন..."
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

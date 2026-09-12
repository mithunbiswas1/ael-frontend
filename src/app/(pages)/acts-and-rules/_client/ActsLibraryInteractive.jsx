"use client";

import { useState } from "react";
import { Download, Search } from "lucide-react";
import { toast } from "sonner";
import Input from "@/components/ui/Input";

export const STATUTES_DATA = [
  {
    id: "act-1",
    title: "The Explosives Act, 1884 (Act No. IV of 1884)",
    subtitle: "Principal statutory foundation for manufacture, possession, and transport of compressed gas",
    category: "Explosives Rules",
    authority: "Department of Explosives (Ministry of Power & Energy)",
    gazetteRef: "Law Ministry Gazette Vol. 4",
    year: "1884 (Amended 2018)",
    fileSize: "2.8 MB",
  },
  {
    id: "act-2",
    title: "The Gas Cylinder Rules, 1991 (With 2004 Amendments)",
    subtitle: "Detailed statutory rules on cylinder thickness, hydro-testing, valves, and manifold safety",
    category: "Gas Rules",
    authority: "Chief Inspector of Explosives",
    gazetteRef: "S.R.O. No. 128-Law/2004",
    year: "1991 (Amended 2004)",
    fileSize: "4.1 MB",
  },
  {
    id: "act-3",
    title: "Bangladesh Energy Regulatory Commission Act, 2003",
    subtitle: "Mandating BERC for tariff fixing, consumer pricing, fair competition, and licensing",
    category: "BERC Regulations",
    authority: "Bangladesh Energy Regulatory Commission (BERC)",
    gazetteRef: "Act No. 13 of 2003",
    year: "2003",
    fileSize: "3.4 MB",
  },
  {
    id: "act-4",
    title: "Fire Prevention and Extinguishing Act, 2003",
    subtitle: "Mandatory fire protection clearance, building egress, and warehouse inspection guidelines",
    category: "Fire Codes",
    authority: "Directorate General of Fire Service & Civil Defense",
    gazetteRef: "Act No. 7 of 2003",
    year: "2003 (Amended 2019)",
    fileSize: "2.1 MB",
  },
  {
    id: "act-5",
    title: "LPG (Auto Gas) Operational Guidelines & Station Licensing 2016",
    subtitle: "Standard operating procedures for vehicle conversion, dispenser maintenance, and safety zones",
    category: "Auto Gas",
    authority: "Energy and Mineral Resources Division",
    gazetteRef: "Govt Order 28.00.0000.024.18.002",
    year: "2016",
    fileSize: "1.9 MB",
  },
  {
    id: "act-6",
    title: "BSTI BDS 1499:2018 Standard for LPG Steel Cylinders",
    subtitle: "Material specifications, longitudinal welds, and burst pressure testing benchmarks",
    category: "BSTI Standards",
    authority: "Bangladesh Standards and Testing Institution",
    gazetteRef: "BDS 1499:2018",
    year: "2018",
    fileSize: "3.7 MB",
  },
];

export default function ActsLibraryInteractive() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredActs = STATUTES_DATA.filter((act) => {
    const matchesSearch =
      !searchTerm ||
      act.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      act.authority.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      act.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-8 shadow-2xs mb-6">
      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search by act name, gazette reference, or authority..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="sm"
            prefix={<Search className="h-4 w-4 text-slate-400" />}
            className="bg-slate-50/70 text-xs"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {["all", "Explosives Rules", "Gas Rules", "BERC Regulations", "Fire Codes"].map(
            (cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-white shadow-2xs"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {cat === "all" ? "All Categories" : cat}
              </button>
            )
          )}
        </div>
      </div>

      {/* Statutes List */}
      <div className="space-y-4">
        {filteredActs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No statutes or regulations found matching your query.
          </div>
        ) : (
          filteredActs.map((act) => (
            <div
              key={act.id}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 sm:p-5 transition-all hover:bg-white hover:border-primary/40 hover:shadow-2xs"
            >
              <div className="space-y-1 max-w-2xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-blue-50 border border-blue-100 px-2 py-0.5 text-[10px] font-bold text-primary">
                    {act.category}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {act.gazetteRef} • Enacted: {act.year}
                  </span>
                </div>

                <h2 className="text-sm font-bold text-slate-900 leading-snug">
                  {act.title}
                </h2>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {act.subtitle}
                </p>

                <div className="text-[11px] text-slate-500 font-medium">
                  Enforcing Authority: <strong className="text-slate-700">{act.authority}</strong>
                </div>
              </div>

              <div className="shrink-0 w-full sm:w-auto">
                <button
                  onClick={() =>
                    toast.success(
                      `Downloading official gazette PDF for ${act.title} (${act.fileSize})...`
                    )
                  }
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-white border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:border-primary hover:text-primary transition-colors shadow-2xs w-full sm:w-auto"
                >
                  <Download className="h-3.5 w-3.5 text-blue-600" />
                  <span>Download Gazette PDF</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

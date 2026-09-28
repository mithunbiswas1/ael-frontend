// src/app/(pages)/market-updates/_components/MarketUpdatesTabsSection.jsx
"use client";

import { Shield, BellRing, Globe2 } from "lucide-react";
import { useDictionary } from "@/context/DictionaryContext";

export const MARKET_UPDATE_TABS = [
  { id: "incidents", label: "Incidents", labelBn: "দুর্ঘটনা রেজিস্ট্রি", icon: Shield },
  { id: "berc", label: "Message from BERC", labelBn: "বিইআরসি বার্তা", icon: BellRing },
  { id: "global", label: "Global Market Update", labelBn: "বৈশ্বিক মার্কেট আপডেট", icon: Globe2 },
];

export default function MarketUpdatesTabsSection({ activeTab, setActiveTab }) {
  const { locale, dict } = useDictionary();
  const isBn = locale === "bn";
  const mu = dict?.marketUpdates || {};

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 sm:p-2 rounded-xl border border-slate-200/80 bg-white shadow-xs backdrop-blur-md scrollbar-none sm:flex-wrap sm:justify-between mb-6">
      {MARKET_UPDATE_TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const label =
          tab.id === "incidents"
            ? mu.incidentsTab || (isBn ? tab.labelBn : tab.label)
            : tab.id === "berc"
            ? mu.bercTab || (isBn ? tab.labelBn : tab.label)
            : mu.globalTab || (isBn ? tab.labelBn : tab.label);

        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex shrink-0 sm:flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-bold transition-all whitespace-nowrap min-w-[130px] sm:min-w-[140px] ${
              isActive
                ? "bg-primary text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

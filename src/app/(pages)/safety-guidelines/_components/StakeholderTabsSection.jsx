// src/app/(pages)/safety-guidelines/_components/StakeholderTabsSection.jsx
"use client";

import { ShieldCheck, Truck, Factory, User } from "lucide-react";
import { useDictionary } from "@/context/DictionaryContext";

export const STAKEHOLDER_TABS = [
  { id: "investors", label: "Investors", icon: Factory },
  { id: "dealer", label: "Dealer", icon: ShieldCheck },
  { id: "distributor", label: "Distributor", icon: Truck },
  { id: "customer", label: "Customer", icon: User },
];

export default function StakeholderTabsSection({ activeTab, setActiveTab }) {
  const { locale, dict } = useDictionary();
  const isBn = locale === "bn";
  const guidelinesDict = dict?.home?.safetyGuidelines || {};

  const tabs = [
    {
      id: "investors",
      label: guidelinesDict.investors?.badge || (isBn ? "শিল্প ও বিনিয়োগকারী" : "Investors"),
      icon: Factory,
    },
    {
      id: "dealer",
      label: guidelinesDict.dealer?.badge || (isBn ? "ডিলার" : "Dealer"),
      icon: ShieldCheck,
    },
    {
      id: "distributor",
      label: guidelinesDict.distributor?.badge || (isBn ? "পরিবেশক" : "Distributor"),
      icon: Truck,
    },
    {
      id: "customer",
      label: guidelinesDict.customer?.badge || (isBn ? "ভোক্তা ও পরিবার" : "Customer"),
      icon: User,
    },
  ];

  return (
    <section className="relative z-20 -mt-6 sm:-mt-7 mx-auto w-full max-w-6xl px-4">
      <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 sm:p-2 rounded-xl border border-slate-200/80 bg-white shadow-xs backdrop-blur-md scrollbar-none sm:flex-wrap sm:justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
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
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

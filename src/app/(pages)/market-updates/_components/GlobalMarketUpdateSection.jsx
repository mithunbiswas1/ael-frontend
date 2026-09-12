// src/app/(pages)/market-updates/_client/GlobalMarketUpdateSection.jsx
"use client";

import { Globe2, TrendingUp, ArrowUpRight, ArrowDownRight, ExternalLink, Newspaper, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";

const GLOBAL_BENCHMARKS = [
  {
    name: "Saudi Aramco Propane CP",
    code: "CP-PROPANE",
    value: "$580.00",
    unit: "per Metric Ton (MT)",
    change: "+$15.00 (+2.6%)",
    isPositive: true,
    source: "Saudi Aramco Monthly Settle",
  },
  {
    name: "Saudi Aramco Butane CP",
    code: "CP-BUTANE",
    value: "$565.00",
    unit: "per Metric Ton (MT)",
    change: "+$10.00 (+1.8%)",
    isPositive: true,
    source: "Saudi Aramco Monthly Settle",
  },
  {
    name: "Brent Crude Oil",
    code: "ICE-BRENT",
    value: "$82.40",
    unit: "per Barrel (bbl)",
    change: "-$0.85 (-1.0%)",
    isPositive: false,
    source: "Intercontinental Exchange",
  },
  {
    name: "US Mont Belvieu Propane",
    code: "MB-LPG",
    value: "78.50 ¢",
    unit: "per Gallon (gal)",
    change: "+1.20 ¢ (+1.5%)",
    isPositive: true,
    source: "US Energy Information Admin",
  },
  {
    name: "VLGC Maritime Freight (AG - Far East)",
    code: "BALTIC-BLPG1",
    value: "$68.50",
    unit: "per Metric Ton (MT)",
    change: "+$2.30 (+3.4%)",
    isPositive: true,
    source: "Baltic Exchange LPG Index",
  },
];

const GLOBAL_NEWS_ARTICLES = [
  {
    id: "g-1",
    title: "Saudi Aramco Contract Prices (CP) Settle Firm for June 2024",
    source: "Saudi Aramco CP",
    sourceCategory: "Official Benchmark",
    time: "2 days ago",
    date: "June 01, 2024",
    summary:
      "Saudi Aramco has set its June contract price for propane at $580/MT, up $15 from May, while butane settled at $565/MT, up $10. Increased Asian petrochemical cracker demand and steady Indian subcontinent import nominations supported firm price levels.",
    impact: "High Import Cost Impact",
    impactColor: "text-amber-800 bg-amber-50 border-amber-200",
  },
  {
    id: "g-2",
    title: "Asia-Pacific LPG Demand Projected to Grow by 12% in 2024",
    source: "Argus Media",
    sourceCategory: "Market Analytics",
    time: "4 days ago",
    date: "May 29, 2024",
    summary:
      "Expanding petrochemical appetite in China, coupled with residential clean cooking subsidies across South Asian economies including Bangladesh and India, are fueling strong baseline cargo demand throughout Q2 and Q3.",
    impact: "Sustained Regional Demand",
    impactColor: "text-blue-800 bg-blue-50 border-blue-200",
  },
  {
    id: "g-3",
    title: "US Propane Inventories Decline Unexpectedly Amid Record Gulf Exports",
    source: "EIA Energy",
    sourceCategory: "Supply Data",
    time: "1 week ago",
    date: "May 24, 2024",
    summary:
      "US commercial propane inventories fell by 1.4 million barrels to 64.2 million barrels, defying historical seasonal build expectations as Gulf Coast waterborne terminals loaded maximum capacity VLGC shipments bound for Asia.",
    impact: "Tight Prompt Balances",
    impactColor: "text-emerald-800 bg-emerald-50 border-emerald-200",
  },
  {
    id: "g-4",
    title: "Middle East Terminal Expansions Add New Loading Berths in UAE & Qatar",
    source: "Platts S&P Global",
    sourceCategory: "Infrastructure",
    time: "2 weeks ago",
    date: "May 18, 2024",
    summary:
      "State energy operators in the Arabian Gulf have commissioned two additional deepwater loading arms. The enhanced logistical throughput helps offset Red Sea routing adjustments and reduces vessel demurrage times.",
    impact: "Logistics Optimization",
    impactColor: "text-indigo-800 bg-indigo-50 border-indigo-200",
  },
  {
    id: "g-5",
    title: "Global VLGC Fleet Additions to Ease Long-Haul Freight Pressures",
    source: "Vortexa Maritime Freight",
    sourceCategory: "Shipping Analysis",
    time: "3 weeks ago",
    date: "May 10, 2024",
    summary:
      "Over 14 newly constructed Very Large Gas Carriers (VLGCs) are scheduled for delivery in the second half of 2024, which shipping analysts anticipate will normalize ocean freight rates across the Middle East-to-Chittagong supply corridor.",
    impact: "Freight Relief Expected",
    impactColor: "text-slate-800 bg-slate-100 border-slate-200",
  },
];

export default function GlobalMarketUpdateSection() {
  const handleRefreshFeed = () => {
    toast.success("Global LPG indices synchronized with real-time international commodity feeds.");
  };

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Global Benchmark Header & Ticker Grid */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-xs">
              <Globe2 className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-700 border border-emerald-200/60">
                  Live CP Index
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Global Energy Feeds
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-slate-900 mt-1">
                GLOBAL MARKET UPDATE
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                International contract prices, ocean freight parity, and commodity benchmarks
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshFeed}
            className="self-start sm:self-center inline-flex items-center gap-2 text-xs font-bold"
          >
            <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
            <span>Sync Live Feeds</span>
          </Button>
        </div>

        {/* Benchmarks Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {GLOBAL_BENCHMARKS.map((item) => (
            <div
              key={item.code}
              className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-4 hover:bg-white hover:border-primary/40 hover:shadow-2xs transition-all"
            >
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                {item.code}
              </div>
              <div className="text-xs font-bold text-slate-900 line-clamp-1">
                {item.name}
              </div>
              <div className="mt-2 text-xl font-black text-slate-900">
                {item.value}
              </div>
              <div className="text-[10px] text-slate-500">{item.unit}</div>

              <div className="mt-2 flex items-center justify-between border-t border-slate-200/60 pt-2">
                <span
                  className={`inline-flex items-center gap-0.5 text-[11px] font-bold ${
                    item.isPositive ? "text-emerald-700" : "text-rose-600"
                  }`}
                >
                  {item.isPositive ? (
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5" />
                  )}
                  <span>{item.change}</span>
                </span>
                <span className="text-[9px] text-slate-600 font-medium">MoM</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Global News & Analysis Articles */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-6">
          <div>
            <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Newspaper className="h-4 w-4 text-primary" />
              <span>MARKET INTELLIGENCE & REPORTS</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Verified updates from Saudi Aramco, Argus Media, S&P Global, and EIA Energy
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600">
            Showing 5 Latest Dispatches
          </span>
        </div>

        <div className="flex flex-col divide-y divide-slate-100">
          {GLOBAL_NEWS_ARTICLES.map((article) => (
            <div key={article.id} className="py-5 first:pt-0 last:pb-0">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-800">
                    {article.source}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    • {article.sourceCategory}
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-medium">
                  {article.date} ({article.time})
                </div>
              </div>

              <h4 className="text-sm sm:text-base font-bold text-slate-900 hover:text-primary transition-colors cursor-pointer">
                {article.title}
              </h4>

              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {article.summary}
              </p>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3 pt-2">
                <span
                  className={`inline-block rounded px-2 py-0.5 text-[10px] font-bold border ${article.impactColor}`}
                >
                  {article.impact}
                </span>

                <button
                  onClick={() =>
                    toast.info(
                      `Accessing full intelligence dossier from ${article.source}...`
                    )
                  }
                  className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                  <span>Read Full Dispatch</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

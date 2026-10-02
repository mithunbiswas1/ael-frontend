// src/app/(dashboard)/admin/_components/DashboardRevenueChart.jsx
"use client";

import { BarChart3, TrendingUp } from "lucide-react";

export default function DashboardRevenueChart({ monthlyGrowth }) {
  const data = monthlyGrowth && monthlyGrowth.length > 0 ? monthlyGrowth : [];
  const maxRevenue = Math.max(...data.map((d) => d.revenue || 0), 1000);

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-primary" />
            <span>Monthly Revenue & Member Acquisition</span>
          </h4>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-primary" />
            <span className="text-slate-600 font-medium">Revenue (BDT)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-sm bg-indigo-200" />
            <span className="text-slate-600 font-medium">New Learners</span>
          </div>
        </div>
      </div>

      {/* Bar graph visualizer */}
      <div className="grid grid-cols-6 gap-2 sm:gap-4 items-end h-48 pt-6 border-b border-slate-100">
        {data.map((item) => {
          const heightPercent =
            item.revenue > 0 ? Math.min(Math.round((item.revenue / maxRevenue) * 100), 100) : 0;
          return (
            <div
              key={item.month}
              title={`${item.month}: ৳${Number(item.revenue || 0).toLocaleString()} revenue • ${item.users || 0} registered learners`}
              className="flex flex-col items-center h-full justify-end group cursor-pointer"
            >
              <div className="text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity mb-1 font-bold">
                ৳{(item.revenue / 1000).toFixed(1)}k
              </div>
              <div className="w-full max-w-[42px] bg-slate-100 rounded-t-lg relative flex items-end overflow-hidden h-full">
                <div
                  className={`w-full transition-all rounded-t-lg ${item.revenue > 0 ? "bg-primary/90 group-hover:bg-primary" : "bg-slate-200"
                    }`}
                  style={{
                    height: item.revenue > 0 ? `${Math.max(heightPercent, 10)}%` : "4px",
                  }}
                />
              </div>
              <span className="text-xs font-bold text-slate-700 mt-2">{item.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

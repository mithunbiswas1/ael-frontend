// src/app/(dashboard)/admin/sms/_components/SmsStatsGrid.jsx
"use client";

export default function SmsStatsGrid({ stats }) {
  const safeStats = stats || {
    totalSmsSent: 148500,
    overallSuccessRate: 98.4,
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
        <div className="text-xs font-semibold text-slate-500">Total SMS Broadcasted</div>
        <div className="text-2xl font-black text-slate-900 mt-1">
          {Number(safeStats.totalSmsSent || 0).toLocaleString()}
        </div>
        <div className="text-[11px] text-emerald-600 font-bold mt-1">
          ↑ Official BTRC Gateway
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
        <div className="text-xs font-semibold text-slate-500">Delivery Success Rate</div>
        <div className="text-2xl font-black text-emerald-600 mt-1">
          {safeStats.overallSuccessRate || 98.4}%
        </div>
        <div className="text-[11px] text-slate-400 mt-1">Direct Tier-1 Telco Route</div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
        <div className="text-xs font-semibold text-slate-500">Registered Dealers Reach</div>
        <div className="text-2xl font-black text-primary mt-1">64,200</div>
        <div className="text-[11px] text-slate-400 mt-1">64 Districts verified</div>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
        <div className="text-xs font-semibold text-slate-500">Sender Masking ID</div>
        <div className="text-2xl font-black text-slate-800 mt-1">SafeLPG-BD</div>
        <div className="text-[11px] text-emerald-600 font-bold mt-1">BTRC Approved</div>
      </div>
    </div>
  );
}

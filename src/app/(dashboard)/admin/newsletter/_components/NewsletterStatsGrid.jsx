// src/app/(dashboard)/admin/newsletter/_components/NewsletterStatsGrid.jsx
"use client";

import { Users, CheckCircle2, Globe, UserCheck } from "lucide-react";

export default function NewsletterStatsGrid({ stats }) {
  const safeStats = stats || {
    totalSubscribers: 0,
    totalActive: 0,
    totalWebsite: 0,
    totalRegistered: 0,
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total Subscribers */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Subscribers
            </p>
            <h3 className="mt-1 text-2xl font-black text-slate-900">
              {safeStats.totalSubscribers.toLocaleString()}
            </h3>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Users className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Active Subscribers */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Readers
            </p>
            <h3 className="mt-1 text-2xl font-black text-emerald-600">
              {safeStats.totalActive.toLocaleString()}
            </h3>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Newsletter Users */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Newsletter Users
            </p>
            <h3 className="mt-1 text-2xl font-black text-blue-600">
              {safeStats.totalWebsite.toLocaleString()}
            </h3>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <Globe className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Registered Users */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Registered Users
            </p>
            <h3 className="mt-1 text-2xl font-black text-purple-600">
              {safeStats.totalRegistered.toLocaleString()}
            </h3>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
            <UserCheck className="h-5 w-5" />
          </div>
        </div>
      </div>
    </div>
  );
}

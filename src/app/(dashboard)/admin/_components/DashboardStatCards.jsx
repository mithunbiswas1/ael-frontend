// src/app/(dashboard)/admin/_components/DashboardStatCards.jsx
"use client";

import {
  Users,
  CreditCard,
  GraduationCap,
  DollarSign,
  Newspaper,
  Megaphone,
  Award,
  MessageSquare,
} from "lucide-react";

export default function DashboardStatCards({ counters }) {
  const safeCounters = counters || {
    totalUsers: 0,
    activeSubscribers: 0,
    totalCourses: 0,
    totalBlogs: 0,
    totalCampaigns: 0,
    totalCertificates: 0,
    totalMessages: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    todayRevenue: 0,
    newRegistrationsToday: 0,
  };

  const cards = [
    {
      title: "Total Registered Users",
      value: Number(safeCounters.totalUsers || 0).toLocaleString(),
      subtext: `${safeCounters.newRegistrationsToday || 0} registered today`,
      icon: Users,
      color: "from-blue-600 to-indigo-600",
      bgLight: "bg-blue-50 text-blue-700",
    },
    {
      title: "Active Subscriptions",
      value: Number(safeCounters.activeSubscribers || 0).toLocaleString(),
      subtext: "Verified Paid Accounts",
      icon: CreditCard,
      color: "from-emerald-600 to-teal-600",
      bgLight: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Courses Published",
      value: Number(safeCounters.totalCourses || 0).toLocaleString(),
      subtext: `${safeCounters.totalCertificates || 0} Certificates Issued`,
      icon: GraduationCap,
      color: "from-amber-600 to-orange-600",
      bgLight: "bg-amber-50 text-amber-700",
    },
    {
      title: "Total Platform Revenue",
      value: `৳${Number(safeCounters.totalRevenue || 0).toLocaleString()}`,
      subtext: `This Month: ৳${Number(safeCounters.monthlyRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "from-purple-600 to-pink-600",
      bgLight: "bg-purple-50 text-purple-700",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.title}
              className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-xl ${card.bgLight}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-2 flex items-baseline gap-2">
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                  {card.value}
                </h3>
              </div>

              <div className="mt-2 pt-2 border-t border-slate-100">
                <span className="text-[11px] text-slate-500 font-medium">{card.subtext}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Operational Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200/90 rounded-xl p-3 flex items-center gap-3 shadow-2xs">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
            <Newspaper className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-black text-slate-900">{safeCounters.totalBlogs || 0}</div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Articles & Blogs</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3 flex items-center gap-3 shadow-2xs">
          <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
            <Megaphone className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-black text-slate-900">{safeCounters.totalCampaigns || 0}</div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Broadcast Campaigns</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3 flex items-center gap-3 shadow-2xs">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
            <Award className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-black text-slate-900">{safeCounters.totalCertificates || 0}</div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Issued Certificates</div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3 flex items-center gap-3 shadow-2xs">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
            <MessageSquare className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-black text-slate-900">{safeCounters.totalMessages || 0}</div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Support Inquiries</div>
          </div>
        </div>
      </div>
    </div>
  );
}

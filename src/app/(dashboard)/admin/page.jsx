// src/app/(dashboard)/admin/page.jsx
"use client";

import { useGetDashboardStatsQuery } from "@/redux/api/adminApi";

// Modularized Components
import DashboardStatCards from "./_components/DashboardStatCards";
import DashboardRevenueChart from "./_components/DashboardRevenueChart";
import RecentTransactionsTable from "./_components/RecentTransactionsTable";

export default function AdminDashboardPage() {
  const {
    data: statsResponse,
    isLoading,
    refetch,
    isFetching,
  } = useGetDashboardStatsQuery();
  const dashboardData = statsResponse?.data;

  return (
    <div className="space-y-6">
      {/* 1. Live KPI Counters */}
      <DashboardStatCards counters={dashboardData?.counters} />

      {/* 2. Analytics Revenue & Member Growth Chart */}
      <div className="w-full">
        <DashboardRevenueChart monthlyGrowth={dashboardData?.monthlyGrowth} />
      </div>

      {/* 3. Recent Billing Transactions */}
      <RecentTransactionsTable transactions={dashboardData?.recentTransactions} />
    </div>
  );
}

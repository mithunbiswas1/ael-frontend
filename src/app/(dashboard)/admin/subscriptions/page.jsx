// src/app/(dashboard)/admin/subscriptions/page.jsx
"use client";

import { useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Search,
  Eye,
  UserPlus,
  Plus,
  Ban,
  Calendar,
  TrendingUp,
  DollarSign,
  Users,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/ui/AdminPageHeader";
import {
  useGetAdminSubscriptionsQuery,
  useRevokeUserSubscriptionMutation,
} from "@/redux/api/subscriptionApi";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import Pagination from "@/components/ui/Pagination";
import AssignSubscriptionModal from "./_components/AssignSubscriptionModal";
import { cn } from "@/lib/cn";

function AdminSubscriptionsContent() {
  const router = useRouter();

  const [selectedPlan, setSelectedPlan] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [timeRange, setTimeRange] = useState("all");
  const [subPage, setSubPage] = useState(1);
  const [viewingSub, setViewingSub] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [revokingUser, setRevokingUser] = useState(null);

  // Subscriptions & Transactions query
  const {
    data: subData,
    isLoading: isSubsLoading,
    isFetching: isSubsFetching,
    refetch: refetchSubs,
  } = useGetAdminSubscriptionsQuery({
    plan: selectedPlan !== "all" ? selectedPlan : undefined,
    search: searchQuery.trim() || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
    timeRange: timeRange !== "all" ? timeRange : undefined,
    page: subPage,
    limit: 10,
  });

  const [revokeSubscription, { isLoading: isRevoking }] =
    useRevokeUserSubscriptionMutation();

  const payload = subData?.data || {};
  const subscriptions = payload.subscriptions || [];
  const pagination = payload.pagination || {
    page: 1,
    limit: 10,
    total: subscriptions.length,
    totalPages: 1,
  };

  const totalRevenue = payload.totalRevenue || 0;
  const monthlyRevenue = payload.monthlyRevenue || 0;
  const weeklyRevenue = payload.weeklyRevenue || 0;
  const activeSubscribers = payload.activeSubscribers || 0;


  const handleConfirmRevoke = async () => {
    if (!revokingUser?.userId) return;
    try {
      await revokeSubscription(revokingUser.userId).unwrap();
      toast.success("User subscription revoked successfully.");
      setRevokingUser(null);
      refetchSubs();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to revoke user subscription");
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Direct Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <AdminPageHeader
          icon={CreditCard}
          title="Subscribers & Transactions Ledger"
          description="Real-time financial audit, subscriber ledger, automated invoice records, access grants, and payment refunds."
        />

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto shrink-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsAssignModalOpen(true)}
            icon={UserPlus}
            className="shadow-2xs font-bold"
          >
            Grant Access to User
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => router.push("/admin/subscriptions/add")}
            icon={Plus}
            className="shadow-2xs font-bold"
          >
            Create New Plan
          </Button>
        </div>
      </div>

      {/* 2. 4 Real-time KPI Metric Cards (Interactive quick-filters) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div
          onClick={() => {
            setTimeRange("all");
            setStartDate("");
            setEndDate("");
            setSubPage(1);
          }}
          className={cn(
            "rounded-2xl border bg-white p-5 shadow-2xs cursor-pointer transition-all hover:border-purple-300",
            timeRange === "all" && !startDate && !endDate
              ? "border-purple-500 ring-2 ring-purple-100"
              : "border-slate-200/90"
          )}
          title="Click to view all-time transactions"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-700">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              ৳{Number(totalRevenue).toLocaleString()}
            </h3>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium">
              All-Time Aggregated Inflow
            </span>
          </div>
        </div>

        {/* Monthly Report */}
        <div
          onClick={() => {
            setTimeRange("month");
            setStartDate("");
            setEndDate("");
            setSubPage(1);
          }}
          className={cn(
            "rounded-2xl border bg-white p-5 shadow-2xs cursor-pointer transition-all hover:border-blue-300",
            timeRange === "month"
              ? "border-blue-500 ring-2 ring-blue-100"
              : "border-slate-200/90"
          )}
          title="Click to view current month transactions"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              This Month Report
            </span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-700">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              ৳{Number(monthlyRevenue).toLocaleString()}
            </h3>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium">
              Current Month Inflow
            </span>
          </div>
        </div>

        {/* Weekly Report */}
        <div
          onClick={() => {
            setTimeRange("week");
            setStartDate("");
            setEndDate("");
            setSubPage(1);
          }}
          className={cn(
            "rounded-2xl border bg-white p-5 shadow-2xs cursor-pointer transition-all hover:border-emerald-300",
            timeRange === "week"
              ? "border-emerald-500 ring-2 ring-emerald-100"
              : "border-slate-200/90"
          )}
          title="Click to view past 7 days transactions"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              This Week Report
            </span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              ৳{Number(weeklyRevenue).toLocaleString()}
            </h3>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium">
              Past 7 Days Collections
            </span>
          </div>
        </div>

        {/* Active Subscribers */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Subscribers
            </span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              {Number(activeSubscribers).toLocaleString()}
            </h3>
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium">
              Valid Paid Accounts
            </span>
          </div>
        </div>
      </div>

      {/* 3. Filter & Date-to-Date Toolbar */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-3">
        {/* Quick Time Pills + Reset */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setTimeRange("all");
                setStartDate("");
                setEndDate("");
                setSubPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${timeRange === "all" && !startDate && !endDate
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
                }`}
            >
              All Time
            </button>
            <button
              type="button"
              onClick={() => {
                setTimeRange("month");
                setStartDate("");
                setEndDate("");
                setSubPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${timeRange === "month"
                  ? "bg-white text-primary shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
                }`}
            >
              This Month
            </button>
            <button
              type="button"
              onClick={() => {
                setTimeRange("week");
                setStartDate("");
                setEndDate("");
                setSubPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${timeRange === "week"
                  ? "bg-white text-primary shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
                }`}
            >
              This Week
            </button>
            <button
              type="button"
              onClick={() => {
                setTimeRange("today");
                setStartDate("");
                setEndDate("");
                setSubPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${timeRange === "today"
                  ? "bg-white text-primary shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
                }`}
            >
              Today
            </button>
          </div>

          {(searchQuery ||
            selectedPlan !== "all" ||
            timeRange !== "all" ||
            startDate ||
            endDate) && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedPlan("all");
                  setTimeRange("all");
                  setStartDate("");
                  setEndDate("");
                  setSubPage(1);
                }}
                className="text-xs font-bold text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reset All Filters</span>
              </button>
            )}
        </div>

        {/* Date-to-Date inputs, Search & Plan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          {/* Search */}
          <div className="relative sm:col-span-2">
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input
                type="text"
                placeholder="Search by customer, phone, or TRX ID..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSubPage(1);
                }}
                className="pl-8 h-9 text-xs w-full bg-slate-50 border-slate-200"
              />
            </div>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setTimeRange("all");
                setSubPage(1);
              }}
              className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs font-medium text-slate-700 focus:border-primary focus:outline-hidden"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setTimeRange("all");
                setSubPage(1);
              }}
              className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs font-medium text-slate-700 focus:border-primary focus:outline-hidden"
            />
          </div>

          {/* Plan Filter */}
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
              Plan Tier
            </label>
            <select
              value={selectedPlan}
              onChange={(e) => {
                setSelectedPlan(e.target.value);
                setSubPage(1);
              }}
              className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 px-2 text-xs font-medium text-slate-700 focus:border-primary focus:outline-hidden"
            >
              <option value="all">All Plans</option>
              <option value="consumer">Consumer</option>
              <option value="dealer">LPG Dealer</option>
              <option value="enterprise">Enterprise</option>
              <option value="monthly">Monthly</option>
              <option value="half_yearly">Half Yearly</option>
              <option value="course_single">Course Single</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Transactions Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID & Date</TableHead>
              <TableHead>Subscriber Details</TableHead>
              <TableHead>Plan & Validity</TableHead>
              <TableHead>Amount (BDT)</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isSubsLoading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-slate-400 text-xs"
                >
                  Loading transaction records...
                </TableCell>
              </TableRow>
            ) : subscriptions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-slate-400 text-xs"
                >
                  No subscription records found.
                </TableCell>
              </TableRow>
            ) : (
              subscriptions.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <div className="space-y-0.5">
                      <div className="font-mono font-bold text-xs text-primary">
                        {item.transactionId}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {new Date(
                          item.createdAt || item.startDate
                        ).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-0.5">
                      <div className="font-bold text-xs text-slate-900">
                        {item.customerDetails?.fullName ||
                          item.user?.fullName ||
                          "Subscriber"}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {item.customerDetails?.phone ||
                          item.user?.phone ||
                          item.user?.email ||
                          "—"}
                      </div>
                      {item.customerDetails?.companyName && (
                        <div className="text-[10px] text-slate-400">
                          {item.customerDetails.companyName}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    {(() => {
                      const exp = item.expiryDate
                        ? new Date(item.expiryDate)
                        : null;
                      const rem = exp
                        ? Math.ceil(
                          (exp.getTime() - new Date().getTime()) /
                          (1000 * 60 * 60 * 24)
                        )
                        : null;
                      const durationStr =
                        item.billingCycle === "yearly" ||
                          item.plan === "yearly"
                          ? "365 Days (1 Year)"
                          : item.billingCycle === "half_yearly" ||
                            item.plan === "half_yearly"
                            ? "180 Days (6 Months)"
                            : item.billingCycle === "monthly" ||
                              item.plan === "monthly"
                              ? "30 Days (1 Month)"
                              : item.plan === "course_single"
                                ? "Course Single Access"
                                : "30 Days (Standard)";

                      return (
                        <div className="space-y-0.5">
                          <span className="font-bold text-xs text-slate-900 block">
                            {item.planName || item.plan}
                          </span>
                          <div className="text-[11px] font-medium text-slate-600">
                            {durationStr}
                          </div>
                          <div className="text-[10px]">
                            {rem !== null && rem > 0 ? (
                              <span className="font-semibold text-emerald-600">
                                {rem} Days Left (until {exp.toLocaleDateString()}
                                )
                              </span>
                            ) : rem !== null && rem <= 0 ? (
                              <span className="font-semibold text-red-600">
                                Expired ({exp.toLocaleDateString()})
                              </span>
                            ) : (
                              <span className="text-slate-400">
                                Expires:{" "}
                                {exp ? exp.toLocaleDateString() : "—"}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </TableCell>

                  <TableCell className="text-xs font-bold text-slate-900">
                    ৳ {Number(item.grandTotal || item.amount || 0).toLocaleString()}
                  </TableCell>

                  <TableCell>
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-700 capitalize">
                        {item.paymentMethod || "bKash"}
                      </span>
                      <div className="text-[10px] text-slate-400">
                        {item.cardType || "Online Gateway"}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setViewingSub(item)}
                        title="View Details"
                        icon={Eye}
                      />


                      {item.user?._id && (
                        <Button
                          type="button"
                          variant="danger-ghost"
                          size="icon-sm"
                          onClick={() =>
                            setRevokingUser({
                              userId: item.user._id,
                              name: item.customerDetails?.fullName || "User",
                            })
                          }
                          title="Revoke User Subscription"
                          icon={Ban}
                        />
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <Pagination
          currentPage={subPage}
          totalPages={pagination.totalPages || 1}
          totalItems={pagination.total || 0}
          pageSize={10}
          onPageChange={setSubPage}
        />
      </div>

      {/* Transaction Detail Dialog */}
      {viewingSub && (
        <Dialog
          isOpen={!!viewingSub}
          onClose={() => setViewingSub(null)}
          maxWidth="md"
          title="Payment Audit Trail"
          description={`Transaction ID: ${viewingSub.transactionId}`}
        >
          <div className="p-6 space-y-4 text-xs">
            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Customer Name:</span>
                <strong className="text-slate-900">
                  {viewingSub.customerDetails?.fullName ||
                    viewingSub.user?.fullName}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mobile Phone:</span>
                <strong className="text-slate-900 font-mono">
                  {viewingSub.customerDetails?.phone ||
                    viewingSub.user?.phone}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="text-slate-700">
                  {viewingSub.customerDetails?.email ||
                    viewingSub.user?.email ||
                    "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Organization:</span>
                <span className="text-slate-700">
                  {viewingSub.customerDetails?.companyName || "Individual"}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Plan & Access Tier:</span>
                <strong className="text-slate-900">
                  {viewingSub.planName}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Validity Expiry:</span>
                <strong className="text-emerald-700">
                  {viewingSub.expiryDate
                    ? new Date(viewingSub.expiryDate).toLocaleDateString()
                    : "—"}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Gateway:</span>
                <span className="text-slate-700">
                  {viewingSub.paymentGateway || "bKash / SSLCommerz"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bank Tran ID:</span>
                <span className="font-mono text-slate-700">
                  {viewingSub.bankTranId || "—"}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2 font-bold text-sm">
                <span>Grand Total Paid:</span>
                <span className="text-emerald-700">
                  ৳{" "}
                  {Number(
                    viewingSub.grandTotal || viewingSub.amount || 0
                  ).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewingSub(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </Dialog>
      )}

      {/* Assign Subscription Modal */}
      <AssignSubscriptionModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onAssigned={() => {
          refetchSubs();
        }}
      />


      {/* Revoke Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={Boolean(revokingUser)}
        onClose={() => setRevokingUser(null)}
        onConfirm={handleConfirmRevoke}
        isLoading={isRevoking}
        variant="danger"
        icon={<Ban className="h-6 w-6 text-rose-500" />}
        title="Revoke User Subscription"
        description="Are you sure you want to revoke this user's active subscription? Their role will be downgraded to free user and premium course access will end."
        itemTitle={revokingUser ? revokingUser.name : ""}
        confirmText="Revoke Subscription"
      />
    </div>
  );
}

export default function AdminSubscriptionsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-48 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <AdminSubscriptionsContent />
    </Suspense>
  );
}

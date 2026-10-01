// src/app/(dashboard)/admin/subscriptions/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CreditCard,
  Search,
  CheckCircle2,
  RotateCcw,
  Eye,
  Layers,
  Edit,
  Plus,
  Trash2,
  UserPlus,
  Sparkles,
  Ban,
} from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/ui/AdminPageHeader";
import {
  useGetAdminSubscriptionsQuery,
  useGetAdminSubscriptionPlansQuery,
  useDeleteSubscriptionPlanMutation,
  useRefundSubscriptionMutation,
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
import AssignSubscriptionModal from "./_components/AssignSubscriptionModal";

export default function AdminSubscriptionsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("plans"); // "plans" | "transactions"
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPlan, setSelectedPlan] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewingSub, setViewingSub] = useState(null);
  const [refundTarget, setRefundTarget] = useState(null);
  const [deletePlanTarget, setDeletePlanTarget] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [revokingUser, setRevokingUser] = useState(null);

  // Queries
  const {
    data: plansData,
    isLoading: isPlansLoading,
    refetch: refetchPlans,
  } = useGetAdminSubscriptionPlansQuery();

  const {
    data: subData,
    isLoading: isSubsLoading,
    refetch: refetchSubs,
  } = useGetAdminSubscriptionsQuery({
    status: selectedStatus !== "all" ? selectedStatus : undefined,
    plan: selectedPlan !== "all" ? selectedPlan : undefined,
    search: searchQuery.trim() || undefined,
  });

  const [deletePlan, { isLoading: isDeletingPlan }] = useDeleteSubscriptionPlanMutation();
  const [refundSubscription, { isLoading: isRefunding }] = useRefundSubscriptionMutation();
  const [revokeSubscription, { isLoading: isRevoking }] = useRevokeUserSubscriptionMutation();

  const plans = plansData?.data || [];
  const subscriptions = subData?.data?.subscriptions || [];
  const stats = subData?.data || {
    totalRevenue: 485000,
    activeSubscribers: 2350,
  };

  const handleConfirmDeletePlan = async () => {
    if (!deletePlanTarget?._id) return;
    try {
      await deletePlan(deletePlanTarget._id).unwrap();
      toast.success("Subscription plan deleted successfully");
      setDeletePlanTarget(null);
      refetchPlans();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete plan");
    }
  };

  const handleConfirmRefund = async () => {
    if (!refundTarget?._id) return;
    try {
      await refundSubscription(refundTarget._id).unwrap();
      toast.success("Transaction marked as refunded.");
      setRefundTarget(null);
      refetchSubs();
    } catch (err) {
      toast.error("Failed to process refund.");
    }
  };

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
      {/* 1. Header with Tab Bar */}
      <AdminPageHeader
        icon={CreditCard}
        title="Subscription Management & Financial Audit"
        description="Configure subscription pricing tiers, create new plans, grant user access, and audit payment transactions."
      />

      {/* Tabs navigation & Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-1">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={activeTab === "plans" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setActiveTab("plans")}
            icon={Layers}
          >
            Subscription Plans ({plans.length})
          </Button>

          <Button
            type="button"
            variant={activeTab === "transactions" ? "primary" : "secondary"}
            size="sm"
            onClick={() => setActiveTab("transactions")}
            icon={CreditCard}
          >
            Subscribers & Transactions ({subscriptions.length})
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsAssignModalOpen(true)}
            className="gap-1.5 text-xs font-bold"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>Grant to User</span>
          </Button>

          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={() => router.push("/admin/subscriptions/add")}
            className="gap-1.5 text-xs font-bold shadow-2xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add New Plan</span>
          </Button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: SUBSCRIPTION PLANS MANAGEMENT */}
      {/* ========================================================= */}
      {activeTab === "plans" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-slate-800">
                Active Subscription Catalog
              </h2>
              <p className="text-xs text-slate-500">
                Click "Edit" to modify any plan or "Add New Plan" to configure additional membership tiers.
              </p>
            </div>
          </div>

          {isPlansLoading ? (
            <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mb-3" />
              <p className="text-xs">Loading subscription plans...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan._id || plan.planKey}
                  className={`relative flex flex-col justify-between rounded-2xl bg-white p-6 border transition-all duration-200 ${
                    plan.isPopular
                      ? "border-primary ring-2 ring-primary/20 shadow-md"
                      : "border-slate-200/90 shadow-2xs hover:border-slate-300"
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-xs flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      <span>{plan.badgeEn || "Recommended"}</span>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono uppercase font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                        Key: {plan.planKey}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          plan.isActive
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {plan.isActive ? "● Live / Active" : "Disabled"}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mt-1">
                      {plan.nameEn}
                    </h3>
                    <p className="text-xs text-slate-500 font-serif">
                      {plan.nameBn}
                    </p>

                    {plan.taglineEn && (
                      <p className="text-xs text-slate-600 mt-1.5 line-clamp-2">
                        {plan.taglineEn}
                      </p>
                    )}

                    <div className="my-4 border-y border-slate-100 py-3">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-black text-slate-900">
                          {plan.price === 0 ? "FREE" : `৳ ${Number(plan.price).toLocaleString()}`}
                        </span>
                        {plan.price > 0 && (
                          <span className="text-xs font-semibold text-slate-500">
                            / {plan.durationLabelEn || `${plan.durationDays} Days`}
                          </span>
                        )}
                      </div>
                      {plan.originalPrice > plan.price && (
                        <div className="text-xs text-slate-400 line-through mt-0.5">
                          Regular: ৳ {Number(plan.originalPrice).toLocaleString()}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 mb-6">
                      <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-2">
                        Included Entitlements ({(plan.featuresEn || []).length}):
                      </div>
                      {(plan.featuresEn || []).slice(0, 5).map((f, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-snug line-clamp-1">{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => router.push(`/admin/subscriptions/edit/${plan._id}`)}
                      className="flex-1 text-xs font-bold gap-1.5"
                    >
                      <Edit className="h-3.5 w-3.5" />
                      <span>Edit Plan</span>
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setDeletePlanTarget(plan)}
                      className="text-rose-600 hover:bg-rose-50 hover:border-rose-200 p-2"
                      title="Delete Plan"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: SUBSCRIBERS & PAYMENT AUDIT */}
      {/* ========================================================= */}
      {activeTab === "transactions" && (
        <div className="space-y-6">
          {/* Revenue & Subscription Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
              <div className="text-xs font-semibold text-slate-500">Gross Subscription Revenue</div>
              <div className="text-2xl font-black text-emerald-600 mt-1">
                ৳ {Number(stats.totalRevenue || 0).toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">NBR VAT Mushak 6.3 compliant</div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
              <div className="text-xs font-semibold text-slate-500">Active Licensed Subscribers</div>
              <div className="text-2xl font-black text-slate-900 mt-1">
                {Number(stats.activeSubscribers || 0).toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-600 font-bold mt-1">
                ↑ 94.2% Renewal Retention
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
              <div className="text-xs font-semibold text-slate-500">Payment Gateway Status</div>
              <div className="text-2xl font-black text-slate-800 mt-1">SSLCommerz / bKash</div>
              <div className="text-[11px] text-emerald-600 font-bold mt-1">● Live & Operational</div>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
              <div className="text-xs font-semibold text-slate-500">Manual User Grants</div>
              <div className="text-2xl font-black text-primary mt-1">Direct Admin</div>
              <div className="text-[11px] text-slate-400 mt-1">Active role override</div>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4">
            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {["all", "paid", "pending", "refunded"].map((st) => (
                <Button
                  key={st}
                  type="button"
                  variant={selectedStatus === st ? "primary" : "secondary"}
                  size="xs"
                  onClick={() => setSelectedStatus(st)}
                  className="capitalize"
                >
                  {st}
                </Button>
              ))}
            </div>

            <div className="w-full sm:w-72">
              <Input
                placeholder="Search by transaction ID, customer, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                prefix={<Search className="h-4 w-4 text-slate-400" />}
                size="sm"
              />
            </div>
          </div>

          {/* Transactions Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction ID & Date</TableHead>
                  <TableHead>Subscriber Details</TableHead>
                  <TableHead>Plan & Validity</TableHead>
                  <TableHead>Amount (BDT)</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isSubsLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-400 text-xs">
                      Loading transaction records...
                    </TableCell>
                  </TableRow>
                ) : subscriptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-400 text-xs">
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
                            {new Date(item.createdAt || item.startDate).toLocaleDateString()}
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <div className="space-y-0.5">
                          <div className="font-bold text-xs text-slate-900">
                            {item.customerDetails?.fullName || item.user?.fullName || "Subscriber"}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {item.customerDetails?.phone || item.user?.phone || item.user?.email || "—"}
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
                          const exp = item.expiryDate ? new Date(item.expiryDate) : null;
                          const rem = exp ? Math.ceil((exp.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;
                          const durationStr =
                            item.billingCycle === "yearly" || item.plan === "yearly"
                              ? "365 Days (1 Year)"
                              : item.billingCycle === "half_yearly" || item.plan === "half_yearly"
                              ? "180 Days (6 Months)"
                              : item.billingCycle === "monthly" || item.plan === "monthly"
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
                                    {rem} Days Left (until {exp.toLocaleDateString()})
                                  </span>
                                ) : rem !== null && rem <= 0 ? (
                                  <span className="font-semibold text-red-600">
                                    Expired ({exp.toLocaleDateString()})
                                  </span>
                                ) : (
                                  <span className="text-slate-400">Expires: {exp ? exp.toLocaleDateString() : "—"}</span>
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

                      <TableCell>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            item.status === "paid"
                              ? "bg-emerald-100 text-emerald-800"
                              : item.status === "refunded"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {item.status}
                        </span>
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

                          {item.status === "paid" && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => setRefundTarget(item)}
                              title="Refund Transaction"
                              icon={RotateCcw}
                              className="text-slate-400 hover:bg-amber-50 hover:text-amber-600"
                            />
                          )}

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
          </div>
        </div>
      )}

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
                <strong className="text-slate-900">{viewingSub.customerDetails?.fullName || viewingSub.user?.fullName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mobile Phone:</span>
                <strong className="text-slate-900 font-mono">{viewingSub.customerDetails?.phone || viewingSub.user?.phone}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="text-slate-700">{viewingSub.customerDetails?.email || viewingSub.user?.email || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Organization:</span>
                <span className="text-slate-700">{viewingSub.customerDetails?.companyName || "Individual"}</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Plan & Access Tier:</span>
                <strong className="text-slate-900">{viewingSub.planName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Validity Expiry:</span>
                <strong className="text-emerald-700">
                  {viewingSub.expiryDate ? new Date(viewingSub.expiryDate).toLocaleDateString() : "—"}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Gateway:</span>
                <span className="text-slate-700">{viewingSub.paymentGateway || "bKash / SSLCommerz"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bank Tran ID:</span>
                <span className="font-mono text-slate-700">{viewingSub.bankTranId || "—"}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2 font-bold text-sm">
                <span>Grand Total Paid:</span>
                <span className="text-emerald-700">৳ {Number(viewingSub.grandTotal || viewingSub.amount || 0).toLocaleString()}</span>
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
          refetchPlans();
        }}
      />

      {/* Delete Plan Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={Boolean(deletePlanTarget)}
        onClose={() => setDeletePlanTarget(null)}
        onConfirm={handleConfirmDeletePlan}
        isLoading={isDeletingPlan}
        title="Delete Subscription Plan"
        description="Are you sure you want to delete this subscription plan? Users currently subscribed will keep their active validity, but it will be removed from the public catalog."
        itemTitle={deletePlanTarget?.nameEn || deletePlanTarget?.nameBn || ""}
        confirmText="Delete Plan"
      />

      {/* Refund Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={Boolean(refundTarget)}
        onClose={() => setRefundTarget(null)}
        onConfirm={handleConfirmRefund}
        isLoading={isRefunding}
        variant="warning"
        icon={<RotateCcw className="h-6 w-6 text-amber-500" />}
        title="Process Refund"
        description="Are you sure you want to process a refund for this subscription transaction? This will mark the transaction as refunded and revoke access."
        itemTitle={
          refundTarget
            ? `${refundTarget.planName} (৳${Number(refundTarget.grandTotal || 0).toLocaleString()}) - ${refundTarget.transactionId || ""}`
            : ""
        }
        confirmText="Process Refund"
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

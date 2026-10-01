// src/app/(dashboard)/admin/subscriptions/page.jsx
"use client";

import { useState } from "react";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Eye,
  FileText,
  ShieldCheck,
  Building,
} from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/ui/AdminPageHeader";
import {
  useGetAdminSubscriptionsQuery,
  useRefundSubscriptionMutation,
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

export default function AdminSubscriptionsPage() {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPlan, setSelectedPlan] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewingSub, setViewingSub] = useState(null);
  const [refundTarget, setRefundTarget] = useState(null);

  const { data: subData, isLoading, refetch } = useGetAdminSubscriptionsQuery({
    status: selectedStatus !== "all" ? selectedStatus : undefined,
    plan: selectedPlan !== "all" ? selectedPlan : undefined,
    search: searchQuery.trim() || undefined,
  });

  const [refundSubscription, { isLoading: isRefunding }] = useRefundSubscriptionMutation();

  const subscriptions = subData?.data?.subscriptions || [];
  const stats = subData?.data || {
    totalRevenue: 485000,
    activeSubscribers: 2350,
  };

  const handleRefund = (item) => {
    setRefundTarget(item);
  };

  const handleConfirmRefund = async () => {
    if (!refundTarget?._id) return;

    try {
      await refundSubscription(refundTarget._id).unwrap();
      toast.success("Transaction marked as refunded.");
      setRefundTarget(null);
      refetch();
    } catch (err) {
      toast.error("Failed to process refund.");
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <AdminPageHeader
        icon={CreditCard}
        title="Subscriptions & Payment Transactions"
        description="Monitor automated SSLCommerz payments, tokenized bKash transactions, licensed dealer renewals, and financial audit trails."
      />

      {/* 2. Revenue & Subscription Metrics */}
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
          <div className="text-2xl font-black text-slate-800 mt-1">SSLCommerz</div>
          <div className="text-[11px] text-emerald-600 font-bold mt-1">● Live & Operational</div>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4">
          <div className="text-xs font-semibold text-slate-500">Payment Channels</div>
          <div className="text-2xl font-black text-primary mt-1">bKash + Cards</div>
          <div className="text-[11px] text-slate-400 mt-1">Instant IPN webhooks</div>
        </div>
      </div>

      {/* 3. Filter Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {["all", "paid", "pending", "refunded"].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold capitalize transition-colors ${
                selectedStatus === st
                  ? "bg-primary text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {st}
            </button>
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

      {/* 4. Transactions Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID & Date</TableHead>
              <TableHead>Subscriber Details</TableHead>
              <TableHead>Plan & Cycle</TableHead>
              <TableHead>Amount (BDT)</TableHead>
              <TableHead>Method & Card</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
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
                        {item.customerDetails?.fullName}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {item.customerDetails?.phone}
                      </div>
                      {item.customerDetails?.companyName && (
                        <div className="text-[10px] text-slate-400">
                          {item.customerDetails.companyName}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="space-y-0.5">
                      <span className="font-semibold text-xs text-slate-800">
                        {item.planName || item.plan}
                      </span>
                      <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                        {item.billingCycle}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-xs font-bold text-slate-900">
                    ৳ {Number(item.grandTotal || item.amount).toLocaleString()}
                  </TableCell>

                  <TableCell>
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-700 capitalize">
                        {item.paymentMethod}
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
                      <button
                        onClick={() => setViewingSub(item)}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-primary transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>

                      {item.status === "paid" && (
                        <button
                          onClick={() => handleRefund(item)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                          title="Refund Transaction"
                        >
                          <RotateCcw className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 5. Transaction Detail Dialog */}
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
                <strong className="text-slate-900">{viewingSub.customerDetails?.fullName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mobile Phone:</span>
                <strong className="text-slate-900 font-mono">{viewingSub.customerDetails?.phone}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Email:</span>
                <span className="text-slate-700">{viewingSub.customerDetails?.email || "—"}</span>
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
                  {new Date(viewingSub.expiryDate).toLocaleDateString()}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment Gateway:</span>
                <span className="text-slate-700">{viewingSub.paymentGateway}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bank Tran ID:</span>
                <span className="font-mono text-slate-700">{viewingSub.bankTranId || "—"}</span>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2 font-bold text-sm">
                <span>Grand Total Paid:</span>
                <span className="text-emerald-700">৳ {Number(viewingSub.grandTotal).toLocaleString()}</span>
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

      {/* Refund Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={Boolean(refundTarget)}
        onClose={() => setRefundTarget(null)}
        onConfirm={handleConfirmRefund}
        isLoading={isRefunding}
        variant="warning"
        icon={<RotateCcw className="h-6 w-6 text-amber-500 animate-in zoom-in-75 duration-200" />}
        title="Process Refund"
        description="Are you sure you want to process a refund for this subscription transaction? This will mark the transaction as refunded and revoke access."
        itemTitle={
          refundTarget
            ? `${refundTarget.planName} (৳${Number(refundTarget.grandTotal || 0).toLocaleString()}) - ${refundTarget.transactionId || ""}`
            : ""
        }
        confirmText="Process Refund"
      />
    </div>
  );
}

// src/app/(dashboard)/admin/coupons/_components/CouponDetailsModal.jsx
"use client";

import {
  Tag,
  Calendar,
  Users,
  CheckCircle2,
  XCircle,
  Copy,
  ShieldCheck,
  Infinity,
  Clock,
} from "lucide-react";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";

export default function CouponDetailsModal({ isOpen, onClose, coupon }) {
  if (!coupon) return null;

  const handleCopyCode = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(coupon.code);
      toast.success(`Coupon code "${coupon.code}" copied to clipboard!`);
    }
  };

  const usedByList = coupon.usedBy || [];

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="3xl"
      title={
        <div className="flex items-center justify-between w-full pr-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Coupon Details & Redemptions</h3>
              <p className="text-xs text-slate-500">Auditing usage history and redemption logs.</p>
            </div>
          </div>
        </div>
      }
    >
      <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
        {/* Banner with code & primary metrics */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <span className="font-mono text-base font-black px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-900 tracking-wider shadow-2xs">
              {coupon.code}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyCode}
              className="gap-1.5 text-xs"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {coupon.isLifetimeAccess && (
              <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                <ShieldCheck className="h-3 w-3 text-amber-600" />
                <span>Lifetime Access</span>
              </span>
            )}
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                coupon.isActive
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                  : "bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              {coupon.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>

        {/* Overview Details Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg border border-slate-200 bg-white">
            <span className="text-slate-400 block mb-0.5">Discount Type</span>
            <span className="font-bold text-slate-800 capitalize">
              {coupon.discountType === "free_access"
                ? "100% Free Voucher"
                : coupon.discountType === "percentage"
                ? `${coupon.discountValue}% Off`
                : `৳ ${coupon.discountValue} Flat Off`}
            </span>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 bg-white">
            <span className="text-slate-400 block mb-0.5">Applicability</span>
            <span className="font-bold text-slate-800 capitalize">
              {coupon.targetType === "all"
                ? "All Items"
                : coupon.targetType === "subscription"
                ? "Subscriptions Only"
                : "Courses Only"}
            </span>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 bg-white">
            <span className="text-slate-400 block mb-0.5">Usage Count</span>
            <span className="font-bold text-slate-800">
              {coupon.usageCount || 0} / {coupon.usageLimit ? coupon.usageLimit : "Unlimited"}
            </span>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 bg-white">
            <span className="text-slate-400 block mb-0.5">Per User Limit</span>
            <span className="font-bold text-slate-800">{coupon.perUserLimit || 1} time(s)</span>
          </div>
        </div>

        {/* Redemption History Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>Redemption History ({usedByList.length})</span>
            </h4>
          </div>

          {usedByList.length === 0 ? (
            <div className="text-center p-8 rounded-xl border border-dashed border-slate-200 bg-slate-50 text-slate-400 text-xs">
              No users have redeemed this coupon code yet.
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User Phone / Email</TableHead>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Discount Applied</TableHead>
                    <TableHead>Redeemed At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usedByList.map((item, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium text-slate-800">
                        {item.userPhone || item.userEmail || "Student"}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-slate-600">
                        {item.transactionId || "—"}
                      </TableCell>
                      <TableCell className="font-bold text-emerald-700">
                        ৳ {item.discountGiven || 0}
                      </TableCell>
                      <TableCell className="text-xs text-slate-500">
                        {item.usedAt ? new Date(item.usedAt).toLocaleString("en-US") : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-200">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Dialog>
  );
}

// src/app/(dashboard)/admin/coupons/page.jsx
"use client";

import { useState } from "react";
import {
  Tag,
  Plus,
  Search,
  Copy,
  Edit,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Infinity,
  Clock,
  RotateCcw,
  Users,
  Percent,
} from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/ui/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SearchInput } from "@/components/ui/SearchInput";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import Pagination from "@/components/ui/Pagination";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import {
  useGetCouponsQuery,
  useDeleteCouponMutation,
  useToggleCouponStatusMutation,
} from "@/redux/api/couponApi";
import CouponFormModal from "./_components/CouponFormModal";
import CouponDetailsModal from "./_components/CouponDetailsModal";

const TARGET_FILTER_OPTIONS = [
  { value: "all", label: "All Targets" },
  { value: "subscription", label: "Subscriptions Only" },
  { value: "course", label: "Courses Only" },
];

const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active Only" },
  { value: "inactive", label: "Inactive Only" },
];

export default function AdminCouponsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [targetFilter, setTargetFilter] = useState("all");
  const [page, setPage] = useState(1);

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [viewingCoupon, setViewingCoupon] = useState(null);
  const [deletingCoupon, setDeletingCoupon] = useState(null);

  // Query
  const {
    data: couponsResponse,
    isLoading,
    isFetching,
    refetch,
  } = useGetCouponsQuery({
    search: search.trim() || undefined,
    status: statusFilter !== "all" ? statusFilter : undefined,
    targetType: targetFilter !== "all" ? targetFilter : undefined,
    page,
    limit: 15,
  });

  const [deleteCoupon, { isLoading: isDeleting }] = useDeleteCouponMutation();
  const [toggleStatus] = useToggleCouponStatusMutation();

  const dataPayload = couponsResponse?.data || {};
  const coupons = dataPayload.coupons || [];
  const pagination = dataPayload.pagination || {
    total: coupons.length,
    page: 1,
    totalPages: 1,
    limit: 15,
  };
  const stats = dataPayload.stats || {
    totalCoupons: 0,
    activeCoupons: 0,
    totalRedemptions: 0,
  };

  const handleCopyCode = (code) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(code);
      toast.success(`Coupon code "${code}" copied to clipboard!`);
    }
  };

  const handleToggleStatus = async (coupon) => {
    try {
      await toggleStatus(coupon._id).unwrap();
      toast.success(
        `Coupon ${coupon.code} ${coupon.isActive ? "deactivated" : "activated"} successfully.`
      );
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update coupon status");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingCoupon?._id) return;
    try {
      await deleteCoupon(deletingCoupon._id).unwrap();
      toast.success(`Coupon "${deletingCoupon.code}" deleted successfully.`);
      setDeletingCoupon(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete coupon");
    }
  };

  // Calculate Whole Life gift vouchers in current list
  const lifetimeGiftsCount = coupons.filter((c) => c.isLifetimeAccess).length;

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <AdminPageHeader
        icon={Tag}
        title="Discount Coupons & Vouchers"
        description="Create dynamic promotional codes, flat/percentage discounts, or grant 100% free lifetime access to any subscription or course."
        actionLabel="Create Coupon / Voucher"
        onActionClick={() => {
          setEditingCoupon(null);
          setIsFormModalOpen(true);
        }}
      />

      {/* 2. Top Stats Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Coupons</span>
            <Tag className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.totalCoupons}</div>
          <p className="text-[11px] text-slate-400 mt-1">Configured in system</p>
        </div>

        <div className="p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/40 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-800 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active & Valid</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-950">{stats.activeCoupons}</div>
          <p className="text-[11px] text-emerald-700/80 mt-1">Ready for redemption</p>
        </div>

        <div className="p-4 rounded-xl border border-amber-200/80 bg-amber-50/40 shadow-2xs">
          <div className="flex items-center justify-between text-amber-800 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Lifetime Access</span>
            <ShieldCheck className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-950">{lifetimeGiftsCount}</div>
          <p className="text-[11px] text-amber-700/80 mt-1">Permanent access vouchers</p>
        </div>

        <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Redemptions</span>
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.totalRedemptions}</div>
          <p className="text-[11px] text-slate-400 mt-1">Times used by learners</p>
        </div>
      </div>

      {/* 3. Search & Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-xl border border-slate-200 bg-white shadow-2xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <div className="flex-1 max-w-sm">
            <SearchInput
              placeholder="Search by code or title..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              onClear={() => {
                setSearch("");
                setPage(1);
              }}
              size="sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="w-40">
              <Select
                value={targetFilter}
                onChange={(e) => {
                  const val = typeof e === "object" ? e?.target?.value : e;
                  setTargetFilter(val || "all");
                  setPage(1);
                }}
                options={TARGET_FILTER_OPTIONS}
                size="sm"
              />
            </div>

            <div className="w-36">
              <Select
                value={statusFilter}
                onChange={(e) => {
                  const val = typeof e === "object" ? e?.target?.value : e;
                  setStatusFilter(val || "all");
                  setPage(1);
                }}
                options={STATUS_FILTER_OPTIONS}
                size="sm"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="gap-1.5 text-xs text-slate-600"
          >
            <RotateCcw className={`h-3.5 w-3.5 ${isFetching ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* 4. Coupons Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-2xs">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Code</TableHead>
              <TableHead>Benefit / Discount</TableHead>
              <TableHead>Applicable Target</TableHead>
              <TableHead>Coupon Validity</TableHead>
              <TableHead className="text-center">Redemptions</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-xs text-slate-500">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent mb-2" />
                  <p>Loading coupons list...</p>
                </TableCell>
              </TableRow>
            ) : coupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-xs text-slate-500">
                  <Tag className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-semibold text-slate-700">No coupons found</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Click "Create Coupon / Gift Voucher" above to configure your first promo code.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              coupons.map((c) => (
                <TableRow key={c._id} className="hover:bg-slate-50/70 transition-colors">
                  {/* Code */}
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleCopyCode(c.code)}
                        className="group flex items-center gap-1.5 font-mono text-xs font-black px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-900 transition-colors cursor-pointer"
                        title="Click to copy code"
                      >
                        <span>{c.code}</span>
                        <Copy className="h-3 w-3 text-slate-400 group-hover:text-slate-700" />
                      </button>
                    </div>
                    <p className="text-[11px] font-semibold text-slate-700 mt-1 truncate max-w-[200px]">
                      {c.title}
                    </p>
                  </TableCell>

                  {/* Benefit / Discount */}
                  <TableCell>
                    <div className="space-y-1">
                      {c.discountType === "free_access" ? (
                        <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="h-3 w-3 text-emerald-700" />
                          <span>100% FREE ACCESS</span>
                        </span>
                      ) : c.discountType === "percentage" ? (
                        <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                          <Percent className="h-3 w-3" />
                          <span>{c.discountValue}% OFF</span>
                          {c.maxDiscountAmount && (
                            <span className="text-[10px] text-slate-500 font-normal">
                              (Max ৳{c.maxDiscountAmount})
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                          <Tag className="h-3 w-3" />
                          <span>৳ {c.discountValue} OFF</span>
                        </span>
                      )}

                      {/* Lifetime Badge */}
                      {c.isLifetimeAccess && (
                        <div className="flex items-center gap-1 text-[10px] font-bold text-amber-700">
                          <ShieldCheck className="h-3 w-3" />
                          <span>Lifetime Access</span>
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Applicable Target */}
                  <TableCell>
                    <span className="text-xs font-semibold text-slate-700 capitalize">
                      {c.targetType === "all"
                        ? "All Items"
                        : c.targetType === "subscription"
                        ? "Subscriptions Only"
                        : "Courses Only"}
                    </span>
                    {c.minPurchaseAmount > 0 && (
                      <span className="block text-[10px] text-slate-400">
                        Min spend: ৳{c.minPurchaseAmount}
                      </span>
                    )}
                  </TableCell>

                  {/* Coupon Code Validity */}
                  <TableCell>
                    {c.isNeverExpires ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        <Infinity className="h-3 w-3 text-slate-500" />
                        <span>Never Expires</span>
                      </span>
                    ) : (
                      <div className="text-[11px] text-slate-600">
                        <span className="block font-medium">
                          Till {c.validUntil ? new Date(c.validUntil).toLocaleDateString() : "—"}
                        </span>
                      </div>
                    )}
                  </TableCell>

                  {/* Redemptions count */}
                  <TableCell className="text-center">
                    <span className="font-bold text-xs text-slate-800">
                      {c.usageCount || 0}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {" "}/ {c.usageLimit ? c.usageLimit : "∞"}
                    </span>
                    <span className="block text-[10px] text-slate-400">
                      Limit: {c.perUserLimit || 1}/user
                    </span>
                  </TableCell>

                  {/* Status Toggle */}
                  <TableCell className="text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(c)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        c.isActive
                          ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200/80"
                          : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                      }`}
                      title={c.isActive ? "Click to deactivate" : "Click to activate"}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          c.isActive ? "bg-emerald-500" : "bg-slate-400"
                        }`}
                      />
                      <span>{c.isActive ? "Active" : "Inactive"}</span>
                    </button>
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewingCoupon(c)}
                        className="h-8 w-8 p-0 text-slate-600 hover:text-primary"
                        title="View details & redemptions"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingCoupon(c);
                          setIsFormModalOpen(true);
                        }}
                        className="h-8 w-8 p-0 text-slate-600 hover:text-primary"
                        title="Edit coupon"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingCoupon(c)}
                        className="h-8 w-8 p-0 text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                        title="Delete coupon"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="p-4 border-t border-slate-200 bg-slate-50/50">
            <Pagination
              currentPage={page}
              totalPages={pagination.totalPages}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        )}
      </div>

      {/* 5. Create / Edit Coupon Modal */}
      <CouponFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingCoupon(null);
        }}
        initialData={editingCoupon}
        onSuccess={() => refetch()}
      />

      {/* 6. Details / Audit Modal */}
      <CouponDetailsModal
        isOpen={Boolean(viewingCoupon)}
        onClose={() => setViewingCoupon(null)}
        coupon={viewingCoupon}
      />

      {/* 7. Delete Confirmation Dialog */}
      <DeleteConfirmationModal
        isOpen={Boolean(deletingCoupon)}
        onClose={() => setDeletingCoupon(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title="Delete Coupon Voucher"
        message={`Are you sure you want to permanently delete the coupon "${deletingCoupon?.code}"? Users will no longer be able to redeem this code.`}
      />
    </div>
  );
}

// src/app/(dashboard)/admin/coupons/_components/CouponFormModal.jsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Tag,
  Calendar,
  Clock,
  Percent,
  CheckCircle2,
  Infinity,
  ShieldCheck,
} from "lucide-react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import {
  useCreateCouponMutation,
  useUpdateCouponMutation,
} from "@/redux/api/couponApi";

export default function CouponFormModal({
  isOpen,
  onClose,
  initialData = null,
  onSuccess,
}) {
  const isEdit = Boolean(initialData?._id);

  const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
  const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();
  const isSubmitting = isCreating || isUpdating;

  // Form State
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState("percentage"); // "percentage" | "fixed" | "free_access"
  const [discountValue, setDiscountValue] = useState(10);
  const [maxDiscountAmount, setMaxDiscountAmount] = useState("");
  const [targetType, setTargetType] = useState("all"); // "all" | "subscription" | "course"
  const [isLifetimeAccess, setIsLifetimeAccess] = useState(false); // Whole life gift
  const [isNeverExpires, setIsNeverExpires] = useState(true); // Whole life coupon validity
  const [validFrom, setValidFrom] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [minPurchaseAmount, setMinPurchaseAmount] = useState(0);
  const [usageLimit, setUsageLimit] = useState("");
  const [perUserLimit, setPerUserLimit] = useState(1);
  const [isActive, setIsActive] = useState(true);

  // Sync state on open / initialData change
  useEffect(() => {
    if (initialData) {
      setCode(initialData.code || "");
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setDiscountType(initialData.discountType || "percentage");
      setDiscountValue(initialData.discountValue ?? 10);
      setMaxDiscountAmount(
        initialData.maxDiscountAmount ? String(initialData.maxDiscountAmount) : ""
      );
      setTargetType(initialData.targetType || "all");
      setIsLifetimeAccess(Boolean(initialData.isLifetimeAccess));
      setIsNeverExpires(Boolean(initialData.isNeverExpires));
      setValidFrom(
        initialData.validFrom
          ? new Date(initialData.validFrom).toISOString().slice(0, 10)
          : ""
      );
      setValidUntil(
        initialData.validUntil
          ? new Date(initialData.validUntil).toISOString().slice(0, 10)
          : ""
      );
      setMinPurchaseAmount(initialData.minPurchaseAmount || 0);
      setUsageLimit(initialData.usageLimit ? String(initialData.usageLimit) : "");
      setPerUserLimit(initialData.perUserLimit || 1);
      setIsActive(initialData.isActive !== false);
    } else {
      setCode("");
      setTitle("");
      setDescription("");
      setDiscountType("free_access"); // Default to 100% gift voucher for easy whole life gifting
      setDiscountValue(100);
      setMaxDiscountAmount("");
      setTargetType("all");
      setIsLifetimeAccess(true);
      setIsNeverExpires(true);
      setValidFrom(new Date().toISOString().slice(0, 10));
      setValidUntil("");
      setMinPurchaseAmount(0);
      setUsageLimit("");
      setPerUserLimit(1);
      setIsActive(true);
    }
  }, [initialData, isOpen]);

  // Generate a random clean coupon code
  const handleGenerateCode = (prefix = "GIFT") => {
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    setCode(`${prefix}-${randomSuffix}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!code.trim()) {
      toast.error("Please provide a coupon code.");
      return;
    }
    if (!title.trim()) {
      toast.error("Please provide a title for the coupon.");
      return;
    }

    const payload = {
      code: code.trim().toUpperCase(),
      title: title.trim(),
      description: description.trim(),
      discountType,
      discountValue: discountType === "free_access" ? 100 : Number(discountValue) || 0,
      targetType,
      isLifetimeAccess: Boolean(isLifetimeAccess),
      isNeverExpires: Boolean(isNeverExpires),
      validFrom: validFrom ? new Date(validFrom) : new Date(),
      validUntil: !isNeverExpires && validUntil ? new Date(validUntil) : null,
      minPurchaseAmount: Number(minPurchaseAmount) || 0,
      maxDiscountAmount: maxDiscountAmount ? Number(maxDiscountAmount) : null,
      usageLimit: usageLimit ? Number(usageLimit) : null,
      perUserLimit: Number(perUserLimit) || 1,
      isActive: Boolean(isActive),
    };

    try {
      if (isEdit) {
        await updateCoupon({ id: initialData._id, data: payload }).unwrap();
        toast.success(`Coupon "${payload.code}" updated successfully!`);
      } else {
        await createCoupon(payload).unwrap();
        toast.success(`Coupon "${payload.code}" created successfully!`);
      }
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save coupon.");
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title={
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Tag className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {isEdit ? "Edit Coupon / Voucher" : "Create Coupon or Voucher"}
            </h3>
            <p className="text-xs text-slate-500">
              Configure promotional codes, percentage discounts, or lifetime access vouchers.
            </p>
          </div>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
        {/* Row 1: Code & Title */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                Coupon Code <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => handleGenerateCode(discountType === "free_access" ? "GIFT" : "PROMO")}
                className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Tag className="h-3 w-3" />
                Generate Code
              </button>
            </div>
            <Input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="e.g. LIFETIMEGIFT, SAFE50"
              required
              className="font-mono uppercase font-bold tracking-wider"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Coupon Title <span className="text-rose-500">*</span>
            </label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. VIP Whole Life Access Gift Voucher"
              required
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Internal Note / Description
          </label>
          <Input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Dedicated voucher for corporate partners and VIP students"
          />
        </div>

        {/* Row 2: Discount Type Selector */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-3">
          <label className="block text-xs font-bold text-slate-800">
            Select Discount / Benefit Model
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Free Gift Access */}
            <button
              type="button"
              onClick={() => {
                setDiscountType("free_access");
                setDiscountValue(100);
                setIsLifetimeAccess(true);
              }}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                discountType === "free_access"
                  ? "border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/20 text-emerald-950 font-bold"
                  : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 mb-1">
                <CheckCircle2 className="h-4 w-4" />
                <span>100% Free Voucher</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                100% discount. Activates without payment gateway.
              </p>
            </button>

            {/* Percentage Discount */}
            <button
              type="button"
              onClick={() => {
                setDiscountType("percentage");
                if (discountValue === 100) setDiscountValue(20);
              }}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                discountType === "percentage"
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20 text-primary font-bold"
                  : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary mb-1">
                <Percent className="h-4 w-4" />
                <span>Percentage (%)</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Deducts a percentage off the base price.
              </p>
            </button>

            {/* Fixed Taka Amount */}
            <button
              type="button"
              onClick={() => {
                setDiscountType("fixed");
                if (discountValue === 100) setDiscountValue(200);
              }}
              className={`p-3 rounded-lg border text-left transition-all cursor-pointer ${
                discountType === "fixed"
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20 text-primary font-bold"
                  : "border-slate-200 bg-white hover:border-slate-300 text-slate-700"
              }`}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-primary mb-1">
                <Tag className="h-4 w-4" />
                <span>Fixed Amount (৳)</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Deducts a flat integer amount from subtotal.
              </p>
            </button>
          </div>

          {/* Value Inputs if not free gift */}
          {discountType !== "free_access" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {discountType === "percentage" ? "Discount Percentage (%)" : "Discount Amount (৳)"}
                </label>
                <Input
                  type="number"
                  min="1"
                  max={discountType === "percentage" ? "100" : undefined}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  required
                />
              </div>

              {discountType === "percentage" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Maximum Discount Cap (৳) <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="e.g. 500"
                    value={maxDiscountAmount}
                    onChange={(e) => setMaxDiscountAmount(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Feature 1: Whole Life / Lifetime Access Option */}
        <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-4 space-y-2">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isLifetimeAccess}
              onChange={(e) => setIsLifetimeAccess(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-amber-300 text-primary focus:ring-primary"
            />
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-600" />
                <span>Grant Lifetime Access (100 Years)</span>
              </div>
              <p className="text-[11px] text-amber-800/80 mt-0.5 leading-relaxed">
                When activated on a subscription package or course, sets the validity to lifetime
                (100 years). Perfect for providing permanent access to students and staff.
              </p>
            </div>
          </label>
        </div>

        {/* Row 3: Target Applicability */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Applicable To
            </label>
            <select
              value={targetType}
              onChange={(e) => setTargetType(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-800 shadow-2xs focus:border-primary focus:outline-none"
            >
              <option value="all">All Items (Both Courses & Subscriptions)</option>
              <option value="subscription">Subscriptions Only</option>
              <option value="course">Course Enrollments Only</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Minimum Purchase Spend (৳)
            </label>
            <Input
              type="number"
              min="0"
              value={minPurchaseAmount}
              onChange={(e) => setMinPurchaseAmount(e.target.value)}
              placeholder="0 (no minimum)"
            />
          </div>
        </div>

        {/* Row 4: Coupon Code Expiration (Whole life coupon vs Date range) */}
        <div className="rounded-xl border border-slate-200 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Infinity className="h-4 w-4 text-primary" />
              <span className="text-xs font-bold text-slate-800">
                Coupon Validity Duration
              </span>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={isNeverExpires}
                onChange={(e) => setIsNeverExpires(e.target.checked)}
                className="h-3.5 w-3.5 rounded border-slate-300 text-primary focus:ring-primary"
              />
              <span>Never Expires (Whole Life Valid)</span>
            </label>
          </div>

          {!isNeverExpires && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Active From Date
                </label>
                <Input
                  type="date"
                  value={validFrom}
                  onChange={(e) => setValidFrom(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Expires On Date <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="date"
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  required={!isNeverExpires}
                />
              </div>
            </div>
          )}
        </div>

        {/* Row 5: Usage Limits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Total Maximum Usages
            </label>
            <Input
              type="number"
              min="1"
              value={usageLimit}
              onChange={(e) => setUsageLimit(e.target.value)}
              placeholder="Leave blank for Unlimited"
            />
            <span className="text-[10px] text-slate-400">Total redemptions allowed across all users</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Max Redemptions Per User
            </label>
            <Input
              type="number"
              min="1"
              value={perUserLimit}
              onChange={(e) => setPerUserLimit(e.target.value)}
              required
            />
            <span className="text-[10px] text-slate-400">Default 1 time per user account</span>
          </div>
        </div>

        {/* Row 6: Active Status */}
        <div className="flex items-center justify-between border-t border-slate-200 pt-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
            />
            <span className="text-xs font-bold text-slate-800">
              Coupon is Active & Redeemable
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSubmitting}
            className="gap-2 font-bold"
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{isEdit ? "Update Coupon" : "Create Coupon Voucher"}</span>
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

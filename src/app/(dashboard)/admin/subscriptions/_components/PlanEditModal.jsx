// src/app/(dashboard)/admin/subscriptions/_components/PlanEditModal.jsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { useUpdateSubscriptionPlanMutation } from "@/redux/api/subscriptionApi";

export default function PlanEditModal({ plan, isOpen, onClose, onUpdated }) {
  const [updatePlan, { isLoading: isUpdating }] = useUpdateSubscriptionPlanMutation();

  const [formData, setFormData] = useState({
    nameEn: "",
    nameBn: "",
    taglineEn: "",
    taglineBn: "",
    durationDays: 30,
    durationLabelEn: "",
    durationLabelBn: "",
    price: 0,
    originalPrice: 0,
    badgeEn: "",
    badgeBn: "",
    featuresEnText: "",
    featuresBnText: "",
    isPopular: false,
    isActive: true,
  });

  useEffect(() => {
    if (plan) {
      setFormData({
        nameEn: plan.nameEn || "",
        nameBn: plan.nameBn || "",
        taglineEn: plan.taglineEn || "",
        taglineBn: plan.taglineBn || "",
        durationDays: plan.durationDays ?? 30,
        durationLabelEn: plan.durationLabelEn || "",
        durationLabelBn: plan.durationLabelBn || "",
        price: plan.price ?? 0,
        originalPrice: plan.originalPrice ?? 0,
        badgeEn: plan.badgeEn || "",
        badgeBn: plan.badgeBn || "",
        featuresEnText: Array.isArray(plan.featuresEn) ? plan.featuresEn.join("\n") : "",
        featuresBnText: Array.isArray(plan.featuresBn) ? plan.featuresBn.join("\n") : "",
        isPopular: Boolean(plan.isPopular),
        isActive: plan.isActive !== false,
      });
    }
  }, [plan]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!plan?._id) return;

    const payload = {
      id: plan._id,
      nameEn: formData.nameEn.trim(),
      nameBn: formData.nameBn.trim(),
      taglineEn: formData.taglineEn.trim(),
      taglineBn: formData.taglineBn.trim(),
      durationDays: Number(formData.durationDays),
      durationLabelEn: formData.durationLabelEn.trim(),
      durationLabelBn: formData.durationLabelBn.trim(),
      price: Number(formData.price),
      originalPrice: Number(formData.originalPrice),
      badgeEn: formData.badgeEn.trim(),
      badgeBn: formData.badgeBn.trim(),
      featuresEn: formData.featuresEnText
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
      featuresBn: formData.featuresBnText
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
      isPopular: formData.isPopular,
      isActive: formData.isActive,
    };

    try {
      await updatePlan(payload).unwrap();
      toast.success("Subscription plan updated successfully!");
      if (onUpdated) onUpdated();
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update subscription plan");
    }
  };

  if (!plan) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="2xl"
      title={`Edit Plan: ${plan.nameEn} (${plan.planKey})`}
      description="Update pricing, validity duration, English/Bengali features, and marketing badges."
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Plan Name"
            value={formData.nameEn}
            onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
            placeholder="e.g. Monthly Premium"
            required
          />
          <Input
            label="প্ল্যান শিরোনাম"
            value={formData.nameBn}
            onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
            placeholder="যেমন: মাসিক প্রিমিয়াম"
            required
          />
        </div>

        {/* Pricing Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Selling Price (BDT ৳)"
            type="number"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="990"
            required
          />
          <Input
            label="Original / Regular Price (BDT ৳)"
            type="number"
            min="0"
            value={formData.originalPrice}
            onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
            placeholder="1200"
          />
        </div>

        {/* Duration Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input
            label="Duration in Days"
            type="number"
            min="0"
            value={formData.durationDays}
            onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
            placeholder="30"
            required
          />
          <Input
            label="Duration Label"
            value={formData.durationLabelEn}
            onChange={(e) => setFormData({ ...formData, durationLabelEn: e.target.value })}
            placeholder="30 Days (1 Month)"
          />
          <Input
            label="মেয়াদ লেবেল"
            value={formData.durationLabelBn}
            onChange={(e) => setFormData({ ...formData, durationLabelBn: e.target.value })}
            placeholder="৩০ দিন (১ মাস)"
          />
        </div>

        {/* Tagline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Tagline"
            value={formData.taglineEn}
            onChange={(e) => setFormData({ ...formData, taglineEn: e.target.value })}
            placeholder="Short highlight for card..."
          />
          <Input
            label="ট্যাগলাইন"
            value={formData.taglineBn}
            onChange={(e) => setFormData({ ...formData, taglineBn: e.target.value })}
            placeholder="সংক্ষিপ্ত বিবরণ..."
          />
        </div>

        {/* Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Marketing Badge"
            value={formData.badgeEn}
            onChange={(e) => setFormData({ ...formData, badgeEn: e.target.value })}
            placeholder="e.g. Best Value, Recommended"
          />
          <Input
            label="মার্কেটিং ব্যাজ"
            value={formData.badgeBn}
            onChange={(e) => setFormData({ ...formData, badgeBn: e.target.value })}
            placeholder="যেমন: সেরা পছন্দ"
          />
        </div>

        {/* Features Textarea (English & Bengali) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              Features (English - One per line)
            </label>
            <textarea
              rows={5}
              value={formData.featuresEnText}
              onChange={(e) => setFormData({ ...formData, featuresEnText: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-primary focus:outline-hidden"
              placeholder="All courses included&#10;Verifiable QR Certificate&#10;Full PDF downloads"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">
              সুবিধাসমূহ (বাংলা - প্রতি লাইনে একটি)
            </label>
            <textarea
              rows={5}
              value={formData.featuresBnText}
              onChange={(e) => setFormData({ ...formData, featuresBnText: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-primary focus:outline-hidden"
              placeholder="সকল কোর্সে প্রবেশাধিকার&#10;যাচাইযোগ্য ডিজিটাল সনদ&#10;পিডিএফ সার্কুলার ডাউনলোড"
            />
          </div>
        </div>

        {/* Toggles: Popular & Active */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
            <div>
              <span className="text-xs font-bold text-slate-900 block">Featured / Popular Plan</span>
              <span className="text-[11px] text-slate-500">Highlights card on pricing page</span>
            </div>
            <input
              type="checkbox"
              checked={formData.isPopular}
              onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
            <div>
              <span className="text-xs font-bold text-slate-900 block">Plan Active Status</span>
              <span className="text-[11px] text-slate-500">Allows public subscription checkout</span>
            </div>
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20"
            />
          </label>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" disabled={isUpdating}>
            {isUpdating ? "Saving..." : "Save Plan Changes"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

// src/app/(dashboard)/admin/subscriptions/_components/SubscriptionPlanForm.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowLeft,
  Save,
  Layers,
  DollarSign,
  Clock,
  CheckCircle2,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import {
  useCreateSubscriptionPlanMutation,
  useUpdateSubscriptionPlanMutation,
} from "@/redux/api/subscriptionApi";

export default function SubscriptionPlanForm({ initialData = null, isEdit = false }) {
  const router = useRouter();
  const [createPlan, { isLoading: isCreating }] = useCreateSubscriptionPlanMutation();
  const [updatePlan, { isLoading: isUpdating }] = useUpdateSubscriptionPlanMutation();

  const isSaving = isCreating || isUpdating;

  const [formData, setFormData] = useState({
    planKey: "",
    nameEn: "",
    nameBn: "",
    taglineEn: "",
    taglineBn: "",
    durationDays: 30,
    durationLabelEn: "30 Days (1 Month)",
    durationLabelBn: "৩০ দিন (১ মাস)",
    price: 990,
    originalPrice: 1200,
    badgeEn: "",
    badgeBn: "",
    featuresEnText: "",
    featuresBnText: "",
    isPopular: false,
    isActive: true,
    order: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        planKey: initialData.planKey || "",
        nameEn: initialData.nameEn || "",
        nameBn: initialData.nameBn || "",
        taglineEn: initialData.taglineEn || "",
        taglineBn: initialData.taglineBn || "",
        durationDays: initialData.durationDays ?? 30,
        durationLabelEn: initialData.durationLabelEn || "",
        durationLabelBn: initialData.durationLabelBn || "",
        price: initialData.price ?? 0,
        originalPrice: initialData.originalPrice ?? 0,
        badgeEn: initialData.badgeEn || "",
        badgeBn: initialData.badgeBn || "",
        featuresEnText: Array.isArray(initialData.featuresEn) ? initialData.featuresEn.join("\n") : "",
        featuresBnText: Array.isArray(initialData.featuresBn) ? initialData.featuresBn.join("\n") : "",
        isPopular: Boolean(initialData.isPopular),
        isActive: initialData.isActive !== false,
        order: initialData.order || 0,
      });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nameEn.trim()) {
      toast.error("English plan title is required");
      return;
    }
    if (!formData.nameBn.trim()) {
      toast.error("Bengali plan title is required");
      return;
    }
    if (!isEdit && !formData.planKey.trim()) {
      toast.error("Unique plan key is required (e.g. monthly, yearly)");
      return;
    }

    const payload = {
      planKey: formData.planKey.toLowerCase().trim().replace(/\s+/g, "_"),
      nameEn: formData.nameEn.trim(),
      nameBn: formData.nameBn.trim(),
      taglineEn: formData.taglineEn.trim(),
      taglineBn: formData.taglineBn.trim(),
      durationDays: Number(formData.durationDays),
      durationLabelEn: formData.durationLabelEn.trim() || `${formData.durationDays} Days`,
      durationLabelBn: formData.durationLabelBn.trim() || `${formData.durationDays} দিন`,
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
      order: Number(formData.order) || 0,
    };

    try {
      if (isEdit && initialData?._id) {
        await updatePlan({ id: initialData._id, ...payload }).unwrap();
        toast.success("Subscription plan updated successfully!");
      } else {
        await createPlan(payload).unwrap();
        toast.success("New subscription plan created successfully!");
      }
      router.push("/admin/pages/subscription");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save subscription plan");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Header / Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/pages/subscription"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              {isEdit ? `Edit Plan: ${formData.nameEn}` : "Create New Subscription Plan"}
            </h1>
            <p className="text-xs text-slate-500">
              {isEdit
                ? "Update pricing, validity cycle, and feature entitlements"
                : "Add a new subscription tier with custom duration and perks"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/admin/pages/subscription"
            className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isSaving}
            className="gap-2 font-bold shadow-xs"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? "Saving..." : isEdit ? "Save Changes" : "Publish Plan"}</span>
          </Button>
        </div>
      </div>

      {/* Main Grid: 8 Cols Form / 4 Cols Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Plan Identity */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Layers className="h-4 w-4 text-primary" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                1. Plan Identification & Display Titles
              </h2>
            </div>

            {/* Plan Key (Internal Identifier) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Plan System Key * (e.g. monthly, yearly, professional)
              </label>
              <Input
                value={formData.planKey}
                onChange={(e) => setFormData({ ...formData, planKey: e.target.value })}
                placeholder="e.g. monthly, half_yearly, enterprise"
                disabled={isEdit}
                required
              />
              {isEdit && (
                <p className="text-[11px] text-slate-400">
                  Plan system key cannot be altered once created to preserve subscriber associations.
                </p>
              )}
            </div>

            {/* Names (English & Bengali) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Plan Name *
                </label>
                <Input
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                  placeholder="e.g. Monthly Premium"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 font-bengali">
                  প্ল্যান নাম *
                </label>
                <Input
                  value={formData.nameBn}
                  onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                  placeholder="যেমন: মাসিক প্রিমিয়াম"
                  required
                />
              </div>
            </div>

            {/* Taglines */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Tagline / Subtitle
                </label>
                <Input
                  value={formData.taglineEn}
                  onChange={(e) => setFormData({ ...formData, taglineEn: e.target.value })}
                  placeholder="Brief one-line summary..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 font-bengali">
                  ট্যাগলাইন
                </label>
                <Input
                  value={formData.taglineBn}
                  onChange={(e) => setFormData({ ...formData, taglineBn: e.target.value })}
                  placeholder="সংক্ষিপ্ত বিবরণ..."
                />
              </div>
            </div>
          </div>

          {/* Card 2: Pricing & Validity */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <DollarSign className="h-4 w-4 text-emerald-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                2. Pricing & Validity Duration
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Selling Price (BDT ৳) *
                </label>
                <Input
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="990"
                  required
                />
                <p className="text-[10px] text-slate-400">
                  Set to 0 for Free / Newsletter ongoing tier.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Original / Regular Price (BDT ৳)
                </label>
                <Input
                  type="number"
                  min="0"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  placeholder="1200"
                />
                <p className="text-[10px] text-slate-400">
                  Used to display crossed-out discount calculations on cards.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Validity Duration (Days) *
                </label>
                <Input
                  type="number"
                  min="0"
                  value={formData.durationDays}
                  onChange={(e) => setFormData({ ...formData, durationDays: e.target.value })}
                  placeholder="30"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Duration Label
                </label>
                <Input
                  value={formData.durationLabelEn}
                  onChange={(e) => setFormData({ ...formData, durationLabelEn: e.target.value })}
                  placeholder="30 Days (1 Month)"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 font-bengali">
                  মেয়াদ লেবেল
                </label>
                <Input
                  value={formData.durationLabelBn}
                  onChange={(e) => setFormData({ ...formData, durationLabelBn: e.target.value })}
                  placeholder="৩০ দিন (১ মাস)"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Included Features */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                3. Included Features & Entitlements
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  Features (English - One per line)
                </label>
                <textarea
                  rows={6}
                  value={formData.featuresEnText}
                  onChange={(e) => setFormData({ ...formData, featuresEnText: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-primary focus:outline-hidden"
                  placeholder="Access to all video courses&#10;Verifiable QR Certificate&#10;Download official PDF reports&#10;Priority safety hotline support"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">
                  সুবিধাসমূহ (বাংলা - প্রতি লাইনে একটি)
                </label>
                <textarea
                  rows={6}
                  value={formData.featuresBnText}
                  onChange={(e) => setFormData({ ...formData, featuresBnText: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-primary focus:outline-hidden"
                  placeholder="সকল ভিডিও কোর্সে প্রবেশাধিকার&#10;কিউআর কোডযুক্ত ভেরিফায়েড সার্টিফিকেট&#10;অফিসিয়াল সার্কুলার পিডিএফ ডাউনলোড&#10;জরুরি টেকনিক্যাল সাপোর্ট"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Publishing & Marketing Badges */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
              Marketing & Status
            </h3>

            {/* Is Active Toggle */}
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Plan Active</span>
                <span className="text-[11px] text-slate-500">Live on public pricing page</span>
              </div>
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20"
              />
            </label>

            {/* Is Popular Toggle */}
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Popular / Highlighted</span>
                <span className="text-[11px] text-slate-500">Elevated styling on card</span>
              </div>
              <input
                type="checkbox"
                checked={formData.isPopular}
                onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20"
              />
            </label>

            {/* Sort Order */}
            <div className="space-y-1.5 pt-2 border-t border-slate-100">
              <label className="text-xs font-bold text-slate-700">Display Order</label>
              <Input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                placeholder="1"
              />
              <p className="text-[10px] text-slate-400">Lower numbers appear first on the pricing grid.</p>
            </div>

            {/* Badges */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Badge Text</label>
                <Input
                  value={formData.badgeEn}
                  onChange={(e) => setFormData({ ...formData, badgeEn: e.target.value })}
                  placeholder="e.g. Best Value, Recommended"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 font-bengali">ব্যাজ টেক্সট</label>
                <Input
                  value={formData.badgeBn}
                  onChange={(e) => setFormData({ ...formData, badgeBn: e.target.value })}
                  placeholder="যেমন: সেরা পছন্দ"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

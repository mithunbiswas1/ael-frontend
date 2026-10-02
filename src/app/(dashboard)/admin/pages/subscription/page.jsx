// src/app/(dashboard)/admin/pages/subscription/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  FaImage,
  FaTags,
  FaPlus,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaCreditCard,
  FaLayerGroup,
} from "react-icons/fa";
import PageConfigShell from "../_components/PageConfigShell";
import BannerEditorTab from "../_components/BannerEditorTab";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { H3, P } from "@/components/ui/Typography";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import {
  useGetPageByKeyQuery,
  useUpdatePageByKeyMutation,
} from "@/redux/api/pageApi";
import {
  useGetAdminSubscriptionPlansQuery,
  useDeleteSubscriptionPlanMutation,
} from "@/redux/api/subscriptionApi";

export default function AdminSubscriptionPageConfig() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("banner");

  // Page CMS Data
  const { data: pageData, isLoading: isPageLoading } =
    useGetPageByKeyQuery("subscription");
  const [updatePage, { isLoading: isSaving }] = useUpdatePageByKeyMutation();

  // Subscription Plans
  const {
    data: plansData,
    isLoading: isPlansLoading,
    refetch: refetchPlans,
  } = useGetAdminSubscriptionPlansQuery();
  const [deletePlan, { isLoading: isDeletingPlan }] =
    useDeleteSubscriptionPlanMutation();

  const [deleteTarget, setDeleteTarget] = useState(null);

  const [formData, setFormData] = useState({
    title: "Subscription & Plans",
    titleBn: "সাবস্ক্রিপশন ও মূল্যতালিকা",
    banner: {
      type: "centered",
      title: "FLEXIBLE SAFETY",
      titleBn: "নিরাপত্তা ও প্রশিক্ষণ",
      accent: "PLANS.",
      accentBn: "প্যাকেজসমূহ।",
      description:
        "Choose the safety, training, and regulatory compliance package tailored for your home, retail outlet, auto gas station, or manufacturing facility.",
      descriptionBn:
        "ভোক্তা, রিটেল গ্যাস ডিলার এবং শিল্প কারখানার জন্য উপযোগী নিরাপত্তা প্রশিক্ষণ ও সংবিধিবদ্ধ কমপ্লায়েন্স সাবস্ক্রিপশন প্যাকেজ বেছে নিন।",
      imageSrc: "",
      imageAlt: "Subscription & Plans",
    },
    sections: {},
  });

  useEffect(() => {
    if (pageData?.data) {
      setFormData((prev) => ({
        ...prev,
        ...pageData.data,
        banner: {
          type: pageData.data.banner?.type || "centered",
          title: pageData.data.banner?.title || "",
          titleBn: pageData.data.banner?.titleBn || "",
          accent: pageData.data.banner?.accent || "",
          accentBn: pageData.data.banner?.accentBn || "",
          description: pageData.data.banner?.description || "",
          descriptionBn: pageData.data.banner?.descriptionBn || "",
          imageSrc: pageData.data.banner?.imageSrc || "",
          imageAlt: pageData.data.banner?.imageAlt || "Subscription & Plans",
          imageAltBn: pageData.data.banner?.imageAltBn || "",
        },
        sections: pageData.data.sections || {},
      }));
    }
  }, [pageData]);

  const handleSave = async () => {
    try {
      await updatePage({
        pageKey: "subscription",
        body: formData,
      }).unwrap();
      toast.success("Subscription page configuration saved successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save page configuration");
    }
  };

  const handleConfirmDeletePlan = async () => {
    if (!deleteTarget?._id) return;
    try {
      await deletePlan(deleteTarget._id).unwrap();
      toast.success("Subscription plan deleted successfully");
      setDeleteTarget(null);
      refetchPlans();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete plan");
    }
  };

  const plans = plansData?.data || [];

  return (
    <PageConfigShell
      pageKey="subscription"
      title="Subscription Page & Plans Configuration"
      subtitle="Manage the hero banner and configure public membership tiers"
      previewUrl="/subscription"
      tabs={[
        { id: "banner", label: "Page Hero Banner", icon: FaImage },
        { id: "plans", label: `Subscription Plans (${plans.length})`, icon: FaTags },
      ]}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onSave={handleSave}
      isSaving={isSaving}
    >
      {/* TAB 1: HERO BANNER CONFIG */}
      {activeTab === "banner" && (
        <BannerEditorTab
          banner={formData.banner}
          onChange={(newBanner) =>
            setFormData((prev) => ({ ...prev, banner: newBanner }))
          }
          bannerType="centered"
          previewBreadcrumb="Subscription & Plans"
          previewBreadcrumbBn="সাবস্ক্রিপশন প্যাকেজ"
        />
      )}

      {/* TAB 2: SUBSCRIPTION PLANS MANAGEMENT */}
      {activeTab === "plans" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
            <div>
              <H3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <FaLayerGroup className="text-primary h-5 w-5" />
                <span>Active Subscription Packages</span>
              </H3>
              <P className="text-xs text-slate-500 mt-0.5">
                Plans displayed here appear dynamically on the public <code>/subscription</code> page.
              </P>
            </div>

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => router.push("/admin/subscriptions/create")}
              icon={FaPlus}
              className="self-start sm:self-auto"
            >
              Create New Plan
            </Button>
          </div>

          {isPlansLoading ? (
            <div className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : plans.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border border-dashed border-slate-200 bg-white p-8">
              <FaCreditCard className="mx-auto h-12 w-12 text-slate-300 mb-3" />
              <H3 className="text-base font-bold text-slate-700">No Subscription Plans Found</H3>
              <P className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No active membership plans are created yet. Click the button below to add your first tier.
              </P>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => router.push("/admin/subscriptions/create")}
                icon={FaPlus}
                className="mt-4"
              >
                Create First Plan
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <div
                  key={plan._id}
                  className={`relative flex flex-col justify-between rounded-2xl border bg-white p-6 transition-all duration-200 ${
                    plan.isPopular
                      ? "border-primary ring-2 ring-primary/20 shadow-md"
                      : "border-slate-200/90 shadow-2xs hover:border-slate-300"
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-xs">
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

                    <h4 className="text-lg font-black text-slate-900">{plan.nameEn}</h4>
                    {plan.nameBn && (
                      <p className="text-xs font-semibold text-slate-500">{plan.nameBn}</p>
                    )}
                    {plan.taglineEn && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
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
                          <FaCheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
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
                      <FaEdit className="h-3.5 w-3.5" />
                      <span>Edit Plan</span>
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteTarget(plan)}
                      className="text-rose-600 hover:bg-rose-50 hover:border-rose-200 p-2"
                      title="Delete Plan"
                    >
                      <FaTrash className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDeletePlan}
        isLoading={isDeletingPlan}
        title="Delete Subscription Plan"
        description="Are you sure you want to delete this subscription plan? Users currently subscribed will keep their active validity, but it will be removed from the public catalog."
        itemTitle={deleteTarget?.nameEn || deleteTarget?.nameBn || ""}
        confirmText="Delete Plan"
      />
    </PageConfigShell>
  );
}

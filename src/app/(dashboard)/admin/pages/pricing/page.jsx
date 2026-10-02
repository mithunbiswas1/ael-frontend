// src/app/(dashboard)/admin/pages/pricing/page.jsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FaImage, FaTags } from "react-icons/fa";
import PageConfigShell from "../_components/PageConfigShell";
import BannerEditorTab from "../_components/BannerEditorTab";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { H3 } from "@/components/ui/Typography";
import {
  useGetPageByKeyQuery,
  useUpdatePageByKeyMutation,
} from "@/redux/api/pageApi";

export default function AdminPricingPage() {
  const [activeTab, setActiveTab] = useState("banner");
  const { data: pageData, isLoading } = useGetPageByKeyQuery("pricing");
  const [updatePage, { isLoading: isSaving }] = useUpdatePageByKeyMutation();

  const [formData, setFormData] = useState({
    title: "Pricing & Subscription",
    banner: {
      title: "PREMIUM",
      titleBn: "সাবস্ক্রিপশন ও",
      accent: "PLANS.",
      accentBn: "মূল্যতালিকা।",
      description:
        "Flexible subscription tiers for individual learners, retail gas dealers, and industrial fleet operators.",
      descriptionBn:
        "ভোক্তা, রিটেল ডিলার এবং শিল্প কারখানার জন্য উপযোগী সাবস্ক্রিপশন প্যাকেজ।",
      imageSrc:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=800&auto=format&fit=crop",
      imageAlt: "Membership Pricing",
    },
    sections: {
      plans: {
        consumerPrice: "৳ 0",
        consumerLabel: "Citizen Safety Plan",
        dealerPrice: "৳ 1,999",
        dealerLabel: "Dealer Compliance Pass",
        corporatePrice: "৳ 9,999",
        corporateLabel: "Enterprise Bulk Training",
      },
    },
  });

  useEffect(() => {
    if (pageData?.data) {
      setFormData((prev) => ({
        ...prev,
        ...pageData.data,
        banner: { ...prev.banner, ...(pageData.data.banner || {}) },
        sections: { ...prev.sections, ...(pageData.data.sections || {}) },
      }));
    }
  }, [pageData]);

  const handleSave = async () => {
    try {
      await updatePage({
        pageKey: "pricing",
        data: formData,
      }).unwrap();
      toast.success("Pricing page configuration updated successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update pricing page");
    }
  };

  const tabs = [
    { id: "banner", label: "Pricing Hero Banner", icon: FaImage },
    { id: "plans", label: "Subscription Tiers", icon: FaTags },
  ];

  return (
    <PageConfigShell
      pageKey="pricing"
      title="Pricing & Subscription Page Configuration"
      subtitle="Configure pricing hero visual banner and subscription packages for consumers and dealers."
      previewUrl="/subscription"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onSave={handleSave}
      isSaving={isSaving || isLoading}
    >
      {activeTab === "banner" && (
        <BannerEditorTab
          banner={formData.banner}
          onChange={(updatedBanner) =>
            setFormData((prev) => ({ ...prev, banner: updatedBanner }))
          }
        />
      )}

      {activeTab === "plans" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <H3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Subscription Pricing Tiers
          </H3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div className="font-bold text-xs text-slate-800">
                Tier 1: Free Consumer
              </div>
              <Input
                label="Package Name"
                value={formData.sections.plans?.consumerLabel || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    sections: {
                      ...prev.sections,
                      plans: {
                        ...(prev.sections?.plans || {}),
                        consumerLabel: e.target.value,
                      },
                    },
                  }))
                }
              />
              <Input
                label="Price Display"
                value={formData.sections.plans?.consumerPrice || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    sections: {
                      ...prev.sections,
                      plans: {
                        ...(prev.sections?.plans || {}),
                        consumerPrice: e.target.value,
                      },
                    },
                  }))
                }
              />
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div className="font-bold text-xs text-slate-800">
                Tier 2: Dealer Compliance
              </div>
              <Input
                label="Package Name"
                value={formData.sections.plans?.dealerLabel || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    sections: {
                      ...prev.sections,
                      plans: {
                        ...(prev.sections?.plans || {}),
                        dealerLabel: e.target.value,
                      },
                    },
                  }))
                }
              />
              <Input
                label="Price Display"
                value={formData.sections.plans?.dealerPrice || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    sections: {
                      ...prev.sections,
                      plans: {
                        ...(prev.sections?.plans || {}),
                        dealerPrice: e.target.value,
                      },
                    },
                  }))
                }
              />
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
              <div className="font-bold text-xs text-slate-800">
                Tier 3: Corporate Enterprise
              </div>
              <Input
                label="Package Name"
                value={formData.sections.plans?.corporateLabel || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    sections: {
                      ...prev.sections,
                      plans: {
                        ...(prev.sections?.plans || {}),
                        corporateLabel: e.target.value,
                      },
                    },
                  }))
                }
              />
              <Input
                label="Price Display"
                value={formData.sections.plans?.corporatePrice || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    sections: {
                      ...prev.sections,
                      plans: {
                        ...(prev.sections?.plans || {}),
                        corporatePrice: e.target.value,
                      },
                    },
                  }))
                }
              />
            </div>
          </div>
        </div>
      )}
    </PageConfigShell>
  );
}

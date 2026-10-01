// src/app/(dashboard)/admin/pages/market-updates/page.jsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FaImage } from "react-icons/fa";
import PageConfigShell from "../_components/PageConfigShell";
import BannerEditorTab from "../_components/BannerEditorTab";
import {
  useGetPageByKeyQuery,
  useUpdatePageByKeyMutation,
} from "@/redux/api/pageApi";

export default function AdminMarketUpdatesPage() {
  const [activeTab, setActiveTab] = useState("banner");
  const { data: pageData, isLoading } = useGetPageByKeyQuery("market-updates");
  const [updatePage, { isLoading: isSaving }] = useUpdatePageByKeyMutation();

  const [formData, setFormData] = useState({
    title: "LPG Market Updates",
    banner: {
      type: "visual",
      title: "",
      titleBn: "",
      accent: "",
      accentBn: "",
      description: "",
      descriptionBn: "",
      imageSrc: "",
      imageAlt: "",
      imageAltBn: "",
    },
    sections: {},
  });

  useEffect(() => {
    if (pageData?.data) {
      setFormData((prev) => ({
        ...prev,
        ...pageData.data,
        banner: {
          type: pageData.data.banner?.type || "visual",
          title: pageData.data.banner?.title || "",
          titleBn: pageData.data.banner?.titleBn || "",
          accent: pageData.data.banner?.accent || "",
          accentBn: pageData.data.banner?.accentBn || "",
          description: pageData.data.banner?.description || "",
          descriptionBn: pageData.data.banner?.descriptionBn || "",
          imageSrc: pageData.data.banner?.imageSrc || "",
          imageAlt: pageData.data.banner?.imageAlt || "",
          imageAltBn: pageData.data.banner?.imageAltBn || "",
        },
        sections: pageData.data.sections || prev.sections || {},
      }));
    }
  }, [pageData]);

  const handleSave = async () => {
    try {
      await updatePage({
        pageKey: "market-updates",
        data: formData,
      }).unwrap();
      toast.success("Market Updates hero banner updated successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update market updates page");
    }
  };

  const tabs = [{ id: "banner", label: "Hero Banner", icon: FaImage }];

  return (
    <PageConfigShell
      pageKey="market-updates"
      title="Market Updates Page Configuration"
      subtitle="Customize the market updates visual hero banner, headlines, and imagery."
      previewUrl="/market-updates"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onSave={handleSave}
      isSaving={isSaving || isLoading}
    >
      <BannerEditorTab
        banner={formData.banner}
        onChange={(updatedBanner) =>
          setFormData((prev) => ({ ...prev, banner: updatedBanner }))
        }
        previewBreadcrumb="LPG Market Update"
        previewBreadcrumbBn="এলপিজি মার্কেট আপডেট"
      />
    </PageConfigShell>
  );
}

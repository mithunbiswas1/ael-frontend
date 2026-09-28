// src/app/(dashboard)/admin/pages/market-updates/page.jsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FaImage, FaChartLine, FaExclamationTriangle, FaBell, FaGlobeAmericas } from "react-icons/fa";
import PageConfigShell from "../_components/PageConfigShell";
import BannerEditorTab from "../_components/BannerEditorTab";
import BercPricingEditorTab from "./_components/BercPricingEditorTab";
import IncidentsEditorTab from "./_components/IncidentsEditorTab";
import BercMessagesEditorTab from "./_components/BercMessagesEditorTab";
import GlobalNewsEditorTab from "./_components/GlobalNewsEditorTab";
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
    sections: {
      bercPricing: {
        current12kgPrice: "",
        effectiveMonth: "",
        effectiveMonthBn: "",
        statutoryCircularNo: "",
      },
      incidents: [],
      bercMessages: [],
      globalNews: [],
    },
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
        sections: {
          bercPricing: pageData.data.sections?.bercPricing || prev.sections.bercPricing,
          incidents: pageData.data.sections?.incidents || [],
          bercMessages: pageData.data.sections?.bercMessages || [],
          globalNews: pageData.data.sections?.globalNews || [],
          ...(pageData.data.sections || {}),
        },
      }));
    }
  }, [pageData]);

  const handleSave = async () => {
    try {
      await updatePage({
        pageKey: "market-updates",
        data: formData,
      }).unwrap();
      toast.success("Market Updates page configuration updated successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update market updates page");
    }
  };

  const tabs = [
    { id: "banner", label: "Hero Banner", icon: FaImage },
    { id: "pricing", label: "BERC Price & Pulse", icon: FaChartLine },
    { id: "incidents", label: "Incident Telemetry", icon: FaExclamationTriangle },
    { id: "notices", label: "BERC Official Notices", icon: FaBell },
    { id: "global", label: "Global Trends & CP", icon: FaGlobeAmericas },
  ];

  return (
    <PageConfigShell
      pageKey="market-updates"
      title="Market Updates Page Configuration"
      subtitle="Configure market update visual banner, BERC price notifications, incident telemetry, and global trends."
      previewUrl="/market-updates"
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
          previewBreadcrumb="LPG Market Update"
          previewBreadcrumbBn="এলপিজি মার্কেট আপডেট"
        />
      )}

      {activeTab === "pricing" && (
        <BercPricingEditorTab
          pricing={formData.sections?.bercPricing}
          onChange={(newPricing) =>
            setFormData((prev) => ({
              ...prev,
              sections: { ...prev.sections, bercPricing: newPricing },
            }))
          }
        />
      )}

      {activeTab === "incidents" && (
        <IncidentsEditorTab
          incidents={formData.sections?.incidents}
          onChange={(newIncidents) =>
            setFormData((prev) => ({
              ...prev,
              sections: { ...prev.sections, incidents: newIncidents },
            }))
          }
        />
      )}

      {activeTab === "notices" && (
        <BercMessagesEditorTab
          messages={formData.sections?.bercMessages}
          onChange={(newMessages) =>
            setFormData((prev) => ({
              ...prev,
              sections: { ...prev.sections, bercMessages: newMessages },
            }))
          }
        />
      )}

      {activeTab === "global" && (
        <GlobalNewsEditorTab
          news={formData.sections?.globalNews}
          onChange={(newNews) =>
            setFormData((prev) => ({
              ...prev,
              sections: { ...prev.sections, globalNews: newNews },
            }))
          }
        />
      )}
    </PageConfigShell>
  );
}

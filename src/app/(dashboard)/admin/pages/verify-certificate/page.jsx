// src/app/(dashboard)/admin/pages/verify-certificate/page.jsx
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

export default function AdminVerifyCertificatePage() {
  const [activeTab, setActiveTab] = useState("banner");
  const { data: pageData, isLoading } = useGetPageByKeyQuery("verify-certificate");
  const [updatePage, { isLoading: isSaving }] = useUpdatePageByKeyMutation();

  const [formData, setFormData] = useState({
    title: "Verify Certificate",
    banner: {
      type: "centered",
      icon: "shield",
      title: "",
      titleBn: "",
      accent: "",
      accentBn: "",
      description: "",
      descriptionBn: "",
    },
  });

  useEffect(() => {
    if (pageData?.data) {
      setFormData((prev) => ({
        ...prev,
        ...pageData.data,
        banner: {
          type: "centered",
          icon: pageData.data.banner?.icon || "shield",
          title: pageData.data.banner?.title || "",
          titleBn: pageData.data.banner?.titleBn || "",
          accent: pageData.data.banner?.accent || "",
          accentBn: pageData.data.banner?.accentBn || "",
          description: pageData.data.banner?.description || "",
          descriptionBn: pageData.data.banner?.descriptionBn || "",
        },
      }));
    }
  }, [pageData]);

  const handleSave = async () => {
    try {
      await updatePage({
        pageKey: "verify-certificate",
        data: {
          ...formData,
          banner: {
            ...formData.banner,
            type: "centered",
          },
        },
      }).unwrap();
      toast.success("Verify Certificate page updated successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update verify certificate page");
    }
  };

  const tabs = [
    { id: "banner", label: "Centered Hero Banner", icon: FaImage },
  ];

  return (
    <PageConfigShell
      pageKey="verify-certificate"
      title="Verify Certificate Page Configuration"
      subtitle="Configure centered hero banner with shield icon for the national certification verification portal."
      previewUrl="/verify-certificate"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onSave={handleSave}
      isSaving={isSaving || isLoading}
    >
      {activeTab === "banner" && (
        <BannerEditorTab
          banner={formData.banner}
          bannerType="centered"
          onChange={(updatedBanner) =>
            setFormData((prev) => ({
              ...prev,
              banner: { ...updatedBanner, type: "centered" },
            }))
          }
        />
      )}
    </PageConfigShell>
  );
}

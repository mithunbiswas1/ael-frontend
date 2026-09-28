// src/app/(dashboard)/admin/pages/safety-guidelines/page.jsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FaImage, FaAward, FaBuilding, FaFilePdf } from "react-icons/fa";
import PageConfigShell from "../_components/PageConfigShell";
import BannerEditorTab from "../_components/BannerEditorTab";
import StandardsEditorTab from "./_components/StandardsEditorTab";
import AgenciesEditorTab from "./_components/AgenciesEditorTab";
import DocumentsEditorTab from "./_components/DocumentsEditorTab";
import {
  useGetPageByKeyQuery,
  useUpdatePageByKeyMutation,
} from "@/redux/api/pageApi";

export default function AdminSafetyGuidelinesPage() {
  const [activeTab, setActiveTab] = useState("banner");
  const { data: pageData, isLoading } = useGetPageByKeyQuery("safety-guidelines");
  const [updatePage, { isLoading: isSaving }] = useUpdatePageByKeyMutation();

  const [formData, setFormData] = useState({
    title: "Safety Guidelines",
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
      standardsList: [],
      regulatoryAgencies: [],
      documentDownloads: [],
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
          standardsList: pageData.data.sections?.standardsList || [],
          regulatoryAgencies: pageData.data.sections?.regulatoryAgencies || [],
          documentDownloads: pageData.data.sections?.documentDownloads || [],
          ...(pageData.data.sections || {}),
        },
      }));
    }
  }, [pageData]);

  const handleSave = async () => {
    try {
      await updatePage({
        pageKey: "safety-guidelines",
        data: formData,
      }).unwrap();
      toast.success("Safety guidelines configuration updated successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update safety guidelines");
    }
  };

  const tabs = [
    { id: "banner", label: "Hero Banner", icon: FaImage },
    { id: "standards", label: "Standards List", icon: FaAward },
    { id: "agencies", label: "Regulatory Agencies", icon: FaBuilding },
    { id: "documents", label: "Downloadable Documents", icon: FaFilePdf },
  ];

  return (
    <PageConfigShell
      pageKey="safety-guidelines"
      title="Safety Guidelines Configuration"
      subtitle="Manage hero banner, regulatory standards (ISO/EN/NFPA), enforcing agencies, and downloadable guidelines."
      previewUrl="/safety-guidelines"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onSave={handleSave}
      isSaving={isSaving || isLoading}
    >
      {activeTab === "banner" && (
        <BannerEditorTab
          banner={formData.banner}
          onChange={(newBanner) =>
            setFormData((prev) => ({ ...prev, banner: newBanner }))
          }
          previewBreadcrumb="Safety Guidelines"
          previewBreadcrumbBn="নিরাপত্তা নির্দেশিকা"
        />
      )}

      {activeTab === "standards" && (
        <StandardsEditorTab
          standards={formData.sections?.standardsList}
          onChange={(newList) =>
            setFormData((prev) => ({
              ...prev,
              sections: { ...prev.sections, standardsList: newList },
            }))
          }
        />
      )}

      {activeTab === "agencies" && (
        <AgenciesEditorTab
          agencies={formData.sections?.regulatoryAgencies}
          onChange={(newList) =>
            setFormData((prev) => ({
              ...prev,
              sections: { ...prev.sections, regulatoryAgencies: newList },
            }))
          }
        />
      )}

      {activeTab === "documents" && (
        <DocumentsEditorTab
          documents={formData.sections?.documentDownloads}
          onChange={(newList) =>
            setFormData((prev) => ({
              ...prev,
              sections: { ...prev.sections, documentDownloads: newList },
            }))
          }
        />
      )}
    </PageConfigShell>
  );
}

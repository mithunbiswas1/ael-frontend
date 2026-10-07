// src/app/(dashboard)/admin/pages/safety-guidelines/page.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { FaImage, FaFilePdf, FaArrowRight } from "react-icons/fa";
import PageConfigShell from "../_components/PageConfigShell";
import BannerEditorTab from "../_components/BannerEditorTab";
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
      const { _id, createdAt, updatedAt, __v, ...cleanFormData } = formData;
      await updatePage({
        pageKey: "safety-guidelines",
        data: cleanFormData,
      }).unwrap();
      toast.success("Safety guidelines banner configuration updated successfully!");
    } catch (err) {
      toast.error(err?.data?.message || err?.message || "Failed to update safety guidelines");
    }
  };

  const tabs = [
    { id: "banner", label: "Hero Banner", icon: FaImage },
  ];

  return (
    <PageConfigShell
      pageKey="safety-guidelines"
      title="Safety Guidelines Configuration"
      subtitle="Configure hero banner presentation for the public safety guidelines page."
      previewUrl="/safety-guidelines"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onSave={handleSave}
      isSaving={isSaving || isLoading}
    >
      {/* Quick Navigation notice for dedicated Top-level Module */}
      <div className="mb-6">
        <Link
          href="/admin/safety-guidelines"
          className="group p-4 rounded-xl border border-slate-200 bg-white hover:border-primary hover:shadow-xs transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
              <FaFilePdf className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-800 group-hover:text-primary transition-colors flex items-center gap-2">
                <span>Manage Safety Guidelines & Regulatory Authorities</span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-blue-50 text-primary border border-blue-200">
                  Unified Module
                </span>
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Upload new PDFs, manage downloadable SOPs by stakeholder category (Investors, Dealer, Distributor, Customer), and authorities.
              </p>
            </div>
          </div>
          <FaArrowRight className="h-4 w-4 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

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
    </PageConfigShell>
  );
}

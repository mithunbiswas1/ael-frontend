// src/app/(dashboard)/admin/pages/blogs/page.jsx
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

export default function AdminBlogsPage() {
  const [activeTab, setActiveTab] = useState("banner");
  const { data: pageData, isLoading } = useGetPageByKeyQuery("blogs");
  const [updatePage, { isLoading: isSaving }] = useUpdatePageByKeyMutation();

  const [formData, setFormData] = useState({
    title: "Blogs",
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
      }));
    }
  }, [pageData]);

  const handleSave = async () => {
    try {
      await updatePage({
        pageKey: "blogs",
        data: formData,
      }).unwrap();
      toast.success("Blog page banner updated successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update blog banner");
    }
  };

  const tabs = [{ id: "banner", label: "Blog Hero Banner", icon: FaImage }];

  return (
    <PageConfigShell
      pageKey="blogs"
      title="Blog Page Configuration"
      subtitle="Customize the blog hero visual banner, headlines, and imagery."
      previewUrl="/blogs"
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
      />
    </PageConfigShell>
  );
}

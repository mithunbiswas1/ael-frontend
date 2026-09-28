// src/app/(dashboard)/admin/pages/home/page.jsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FaImage } from "react-icons/fa";
import PageConfigShell from "../_components/PageConfigShell";
import HomeHeroEditorTab from "./_components/HomeHeroEditorTab";
import {
  useGetHomeBannerQuery,
  useUpdateHomeBannerMutation,
} from "@/redux/api/homeBannerApi";

export default function AdminHomePage() {
  const [activeTab, setActiveTab] = useState("banner");
  const { data: bannerData, isLoading } = useGetHomeBannerQuery();
  const [updateHomeBanner, { isLoading: isSaving }] =
    useUpdateHomeBannerMutation();

  const [banner, setBanner] = useState({
    title: "",
    titleBn: "",
    accent: "",
    accentBn: "",
    description: "",
    descriptionBn: "",
    btnPrimaryText: "",
    btnPrimaryTextBn: "",
    btnPrimaryHref: "",
    btnSecondaryText: "",
    btnSecondaryTextBn: "",
    btnSecondaryHref: "",
    slides: [],
  });

  useEffect(() => {
    if (bannerData?.data) {
      setBanner(bannerData.data);
    }
  }, [bannerData]);

  const handleSave = async () => {
    try {
      await updateHomeBanner(banner).unwrap();
      toast.success("Home page hero banner updated successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update home banner");
    }
  };

  const tabs = [{ id: "banner", label: "Hero Banner & Carousel", icon: FaImage }];

  return (
    <PageConfigShell
      pageKey="home"
      title="Home Page Configuration"
      previewUrl="/"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onSave={handleSave}
      isSaving={isSaving || isLoading}
    >
      <HomeHeroEditorTab
        banner={banner}
        onChange={(updatedBanner) => setBanner(updatedBanner)}
      />
    </PageConfigShell>
  );
}

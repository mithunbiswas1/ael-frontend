// src/app/(dashboard)/admin/settings/page.jsx
"use client";

import { useState, useEffect } from "react";
import { Settings, Palette, Phone, Share2, Globe } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/ui/AdminPageHeader";
import {
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
} from "@/redux/api/adminApi";

// Modularized Components
import BrandingSettingsTab from "./_components/BrandingSettingsTab";
import ContactSettingsTab from "./_components/ContactSettingsTab";
import SocialSettingsTab from "./_components/SocialSettingsTab";
import SeoSettingsTab from "./_components/SeoSettingsTab";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("branding");
  const [formData, setFormData] = useState({});
  const [logoFiles, setLogoFiles] = useState({});
  const [previewUrls, setPreviewUrls] = useState({});

  const { data: settingsResponse, isLoading, refetch } = useGetSystemSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateSystemSettingsMutation();

  useEffect(() => {
    if (settingsResponse?.data) {
      setFormData(settingsResponse.data);
    }
  }, [settingsResponse]);

  const handleSave = async () => {
    try {
      const data = new FormData();

      // Append files if selected
      if (logoFiles.siteLogo) data.append("siteLogo", logoFiles.siteLogo);
      if (logoFiles.footerLogo) data.append("footerLogo", logoFiles.footerLogo);
      if (logoFiles.favicon) data.append("favicon", logoFiles.favicon);

      // Append all other form fields
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== undefined && formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      await updateSettings(data).unwrap();
      toast.success("Platform settings updated successfully!");
      setLogoFiles({});
      setPreviewUrls({});
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save platform settings");
    }
  };

  const tabs = [
    { id: "branding", label: "Branding & Logos", icon: Palette },
    { id: "contact", label: "Topbar & Contacts", icon: Phone },
    { id: "social", label: "Social Media", icon: Share2 },
    { id: "seo", label: "SEO & Metadata", icon: Globe },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <AdminPageHeader
        icon={Settings}
        title="Platform Control & Settings Center"
        description="Configure website identity, logo assets, topbar contacts, social networks, and global SEO metadata."
      />

      {/* 2. Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200/80 w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-white text-slate-900 shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Tab Panes */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
          Loading platform configurations...
        </div>
      ) : (
        <>
          {activeTab === "branding" && (
            <BrandingSettingsTab
              formData={formData}
              setFormData={setFormData}
              logoFiles={logoFiles}
              setLogoFiles={setLogoFiles}
              previewUrls={previewUrls}
              setPreviewUrls={setPreviewUrls}
              onSave={handleSave}
              isUpdating={isUpdating}
            />
          )}

          {activeTab === "contact" && (
            <ContactSettingsTab
              formData={formData}
              setFormData={setFormData}
              onSave={handleSave}
              isUpdating={isUpdating}
            />
          )}

          {activeTab === "social" && (
            <SocialSettingsTab
              formData={formData}
              setFormData={setFormData}
              onSave={handleSave}
              isUpdating={isUpdating}
            />
          )}

          {activeTab === "seo" && (
            <SeoSettingsTab
              formData={formData}
              setFormData={setFormData}
              onSave={handleSave}
              isUpdating={isUpdating}
            />
          )}
        </>
      )}
    </div>
  );
}

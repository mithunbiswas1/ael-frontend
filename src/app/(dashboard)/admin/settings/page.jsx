// src/app/(dashboard)/admin/settings/page.jsx
"use client";

import { useState, useEffect } from "react";
import { Settings, Sliders, Radio, Globe } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/ui/AdminPageHeader";
import {
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
} from "@/redux/api/adminApi";

// Modularized Components
import GeneralSettingsTab from "./_components/GeneralSettingsTab";
import GatewaySettingsTab from "./_components/GatewaySettingsTab";
import SeoSettingsTab from "./_components/SeoSettingsTab";

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general"); // "general" | "gateways" | "seo"
  const [formData, setFormData] = useState({});

  const { data: settingsResponse, isLoading, refetch } = useGetSystemSettingsQuery();
  const [updateSettings, { isLoading: isUpdating }] = useUpdateSystemSettingsMutation();

  useEffect(() => {
    if (settingsResponse?.data) {
      setFormData(settingsResponse.data);
    }
  }, [settingsResponse]);

  const handleSave = async () => {
    try {
      await updateSettings(formData).unwrap();
      toast.success("System settings updated successfully!");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save settings");
    }
  };

  const tabs = [
    { id: "general", label: "General & Identity", icon: Sliders },
    { id: "gateways", label: "Gateways (SMS & SMTP)", icon: Radio },
    { id: "seo", label: "SEO & Search Indexers", icon: Globe },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <AdminPageHeader
        icon={Settings}
        title="Platform Control & Settings Center"
        description="Configure enterprise site identity, BTRC SMS Gateway masking, SMTP delivery, and global SEO metadata."
      />

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200/80 w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
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
          {activeTab === "general" && (
            <GeneralSettingsTab
              formData={formData}
              setFormData={setFormData}
              onSave={handleSave}
              isUpdating={isUpdating}
            />
          )}

          {activeTab === "gateways" && (
            <GatewaySettingsTab
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

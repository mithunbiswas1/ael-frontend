// src/app/(dashboard)/admin/settings/_components/GeneralSettingsTab.jsx
"use client";

import { Save } from "lucide-react";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function GeneralSettingsTab({
  formData,
  setFormData,
  onSave,
  isUpdating,
}) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs space-y-5">
      <div>
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Platform Identity & General Contact
        </h4>
        <p className="text-xs text-slate-500 mt-0.5">
          Public portal name, official communication emails, and hotline contacts.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Site / Platform Title *
          </label>
          <Input
            name="siteName"
            value={formData.siteName || ""}
            onChange={handleChange}
            placeholder="AEL SafeLPG Bangladesh"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Official Support Email *
          </label>
          <Input
            name="siteEmail"
            type="email"
            value={formData.siteEmail || ""}
            onChange={handleChange}
            placeholder="support@safelpg.com"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Official Hotline Phone *
          </label>
          <Input
            name="sitePhone"
            value={formData.sitePhone || ""}
            onChange={handleChange}
            placeholder="+880 9603 44 66 89"
          />
        </div>

        <div className="flex items-center gap-3 pt-6">
          <input
            type="checkbox"
            id="maintCheck"
            name="maintenanceMode"
            checked={Boolean(formData.maintenanceMode)}
            onChange={handleChange}
            className="h-4 w-4 rounded border-slate-300 text-primary"
          />
          <label htmlFor="maintCheck" className="text-xs font-bold text-slate-800">
            Activate Maintenance Mode (Temporarily lock public access)
          </label>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex justify-end">
        <Button
          type="button"
          variant="primary"
          size="default"
          onClick={onSave}
          isLoading={isUpdating}
          className="gap-2"
        >
          <Save className="h-4 w-4" />
          <span>Save General Settings</span>
        </Button>
      </div>
    </div>
  );
}

// src/app/(dashboard)/admin/settings/_components/GatewaySettingsTab.jsx
"use client";

import { Save, Radio, Mail, AlertTriangle, ShieldCheck } from "lucide-react";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function GatewaySettingsTab({
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
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs space-y-7">
      {/* 1. Maintenance Mode */}
      <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-4 space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-700 mt-0.5">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                System Maintenance Mode
              </h5>
              <p className="text-xs text-amber-700/80 mt-0.5">
                When activated, non-admin visitors see a maintenance screen with your custom notice.
              </p>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="maintenanceMode"
              checked={Boolean(formData.maintenanceMode)}
              onChange={handleChange}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
          </label>
        </div>

        {formData.maintenanceMode && (
          <div className="pt-2">
            <label className="block text-xs font-bold text-amber-900 mb-1">
              Maintenance Notice Banner Message
            </label>
            <Input
              name="maintenanceNotice"
              value={formData.maintenanceNotice || ""}
              onChange={handleChange}
              placeholder="We are currently undergoing scheduled maintenance..."
            />
          </div>
        )}
      </div>

      {/* 2. SMS Telephony Gateway Settings */}
      <div className="space-y-4">
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Radio className="h-4 w-4 text-primary" />
            <span>Cellular SMS Gateway Configuration</span>
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Configures sender masking and provider routing (Greenweb, MimSMS, or Generic REST).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              BTRC Approved Sender Masking ID *
            </label>
            <Input
              name="smsSenderId"
              value={formData.smsSenderId || "SafeLPG-BD"}
              onChange={handleChange}
              placeholder="e.g. SafeLPG-BD"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              SMS Provider Engine
            </label>
            <select
              name="smsProvider"
              value={formData.smsProvider || "generic"}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-hidden focus:border-primary"
            >
              <option value="generic">Generic REST Gateway (JSON)</option>
              <option value="greenweb">Greenweb Bangladesh</option>
              <option value="mimsms">MimSMS Enterprise</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              SMS API Key / Token
            </label>
            <Input
              name="smsApiKey"
              type="password"
              value={formData.smsApiKey || ""}
              onChange={handleChange}
              placeholder="••••••••••••"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100" />

      {/* 3. SMTP Outbound Email Settings */}
      <div className="space-y-4">
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" />
            <span>SMTP Outbound Identity & Server</span>
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Default sender display name, from address, and mail delivery server.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Sender From Name *
            </label>
            <Input
              name="smtpFromName"
              value={formData.smtpFromName || "AEL SafeLPG Bangladesh"}
              onChange={handleChange}
              placeholder="AEL SafeLPG Bangladesh"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Sender From Email *
            </label>
            <Input
              name="smtpFromEmail"
              type="email"
              value={formData.smtpFromEmail || "newsletter@safelpg.com"}
              onChange={handleChange}
              placeholder="newsletter@safelpg.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              SMTP Host (Optional)
            </label>
            <Input
              name="smtpHost"
              value={formData.smtpHost || ""}
              onChange={handleChange}
              placeholder="smtp.mailgun.org or smtp.gmail.com"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              SMTP Port (Optional)
            </label>
            <Input
              name="smtpPort"
              value={formData.smtpPort || ""}
              onChange={handleChange}
              placeholder="587 or 465"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
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
          <span>Save Gateway Settings</span>
        </Button>
      </div>
    </div>
  );
}

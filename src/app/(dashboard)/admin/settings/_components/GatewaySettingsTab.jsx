// src/app/(dashboard)/admin/settings/_components/GatewaySettingsTab.jsx
"use client";

import { Save, Radio, Mail } from "lucide-react";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function GatewaySettingsTab({
  formData,
  setFormData,
  onSave,
  isUpdating,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs space-y-6">
      {/* 1. SMS Telephony Gateway Settings */}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </div>
      </div>

      <div className="border-t border-slate-100" />

      {/* 2. SMTP Outbound Email Settings */}
      <div className="space-y-4">
        <div>
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" />
            <span>SMTP Outbound Identity</span>
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Default sender display name and from address stamped onto newsletters and broadcasts.
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
          <span>Save Gateway Configurations</span>
        </Button>
      </div>
    </div>
  );
}

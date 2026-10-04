// src/app/(dashboard)/admin/settings/_components/ContactSettingsTab.jsx
"use client";

import { Save, Phone, Mail, MapPin, Clock, MessageSquare, Megaphone } from "lucide-react";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function ContactSettingsTab({
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
      {/* Header */}
      <div>
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Phone className="h-4 w-4 text-primary" />
          <span>Topbar Hotline & Contact Information</span>
        </h4>
        <p className="text-xs text-slate-500 mt-0.5">
          Phone hotlines, emergency support contacts, official emails, office address, and topbar banner configuration.
        </p>
      </div>

      {/* 1. Phone & Emergency Hotlines */}
      <div className="space-y-4">
        <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <Phone className="h-3.5 w-3.5 text-primary" />
          <span>Hotline & Telephony</span>
        </h5>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Primary Topbar Hotline *
            </label>
            <Input
              name="sitePhone"
              value={formData.sitePhone || ""}
              onChange={handleChange}
              placeholder="+880 9603 44 66 89"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Hotline Badge / Label
            </label>
            <Input
              name="hotlineLabel"
              value={formData.hotlineLabel || ""}
              onChange={handleChange}
              placeholder="e.g.Hotline"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              National Emergency Dial
            </label>
            <Input
              name="emergencyPhone"
              value={formData.emergencyPhone || ""}
              onChange={handleChange}
              placeholder="e.g. 999"
            />
          </div>
        </div>
      </div>

      {/* 2. Direct Channels (Email & WhatsApp) */}
      <div className="space-y-4">
        <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <Mail className="h-3.5 w-3.5 text-primary" />
          <span>Official Messaging & Inquiries</span>
        </h5>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              WhatsApp Support Number
            </label>
            <Input
              name="whatsappNumber"
              value={formData.whatsappNumber || ""}
              onChange={handleChange}
              placeholder="+880 1711 00 00 00"
            />
          </div>
        </div>
      </div>

      {/* 3. Physical Office & Working Hours */}
      <div className="space-y-4">
        <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          <span>Head Office Location & Hours</span>
        </h5>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Physical Street Address
            </label>
            <Input
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              placeholder="House # 12, Road # 7, Dhanmondi, Dhaka-1205"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Office Hours / Schedule
            </label>
            <Input
              name="workingHours"
              value={formData.workingHours || ""}
              onChange={handleChange}
              placeholder="Sat - Thu: 9:00 AM - 6:00 PM"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Google Maps Embed iframe URL
          </label>
          <Input
            name="mapEmbedUrl"
            value={formData.mapEmbedUrl || ""}
            onChange={handleChange}
            placeholder="https://www.google.com/maps/embed?pb=..."
          />
        </div>
      </div>

      {/* 4. Topbar Banner Configuration */}
      <div className="space-y-4 pt-2">
        <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <Megaphone className="h-3.5 w-3.5 text-primary" />
          <span>Topbar Announcement Bar</span>
        </h5>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="topbarEnabledCheck"
            name="topbarEnabled"
            checked={formData.topbarEnabled !== false}
            onChange={handleChange}
            className="h-4 w-4 rounded border-slate-300 text-primary cursor-pointer"
          />
          <label htmlFor="topbarEnabledCheck" className="text-xs font-bold text-slate-800 cursor-pointer">
            Display Topbar on Public Storefront / Portal
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Announcement Message (Optional)
            </label>
            <Input
              name="topbarAnnouncement"
              value={formData.topbarAnnouncement || ""}
              onChange={handleChange}
              placeholder="e.g. Free LPG Safety Seminar registration now open!"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Announcement Target Link (Optional)
            </label>
            <Input
              name="topbarAnnouncementUrl"
              value={formData.topbarAnnouncementUrl || ""}
              onChange={handleChange}
              placeholder="e.g. /courses or https://..."
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
          <span>Save Contact Settings</span>
        </Button>
      </div>
    </div>
  );
}

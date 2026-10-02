// src/app/(dashboard)/admin/settings/_components/SocialSettingsTab.jsx
"use client";

import { Save, Share2, ExternalLink } from "lucide-react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube, FaInstagram } from "react-icons/fa";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function SocialSettingsTab({
  formData,
  setFormData,
  onSave,
  isUpdating,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const socialFields = [
    {
      name: "facebookUrl",
      label: "Facebook Official Page",
      placeholder: "https://facebook.com/safelpgbd",
      icon: FaFacebookF,
      badgeColor: "bg-blue-600 text-white",
    },
    {
      name: "twitterUrl",
      label: "Twitter / X Profile",
      placeholder: "https://twitter.com/safelpgbd",
      icon: FaTwitter,
      badgeColor: "bg-sky-500 text-white",
    },
    {
      name: "linkedinUrl",
      label: "LinkedIn Organization",
      placeholder: "https://linkedin.com/company/safelpgbd",
      icon: FaLinkedinIn,
      badgeColor: "bg-blue-700 text-white",
    },
    {
      name: "youtubeUrl",
      label: "YouTube Channel",
      placeholder: "https://youtube.com/@safelpgbd",
      icon: FaYoutube,
      badgeColor: "bg-red-600 text-white",
    },
    {
      name: "instagramUrl",
      label: "Instagram Profile",
      placeholder: "https://instagram.com/safelpgbd",
      icon: FaInstagram,
      badgeColor: "bg-pink-600 text-white",
    },
  ];

  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-2xs space-y-7">
      {/* Header */}
      <div>
        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Share2 className="h-4 w-4 text-primary" />
          <span>Social Media Networks & Channels</span>
        </h4>
        <p className="text-xs text-slate-500 mt-0.5">
          Provide links to your official social profiles. These icons appear in the topbar, mobile navigation drawer, and website footer.
        </p>
      </div>

      {/* Social Media Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {socialFields.map((item) => {
          const Icon = item.icon;
          const currentUrl = formData[item.name] || "";

          return (
            <div key={item.name} className="space-y-1.5">
              <label className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-2">
                  <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] ${item.badgeColor}`}>
                    <Icon />
                  </span>
                  <span>{item.label}</span>
                </span>
                {currentUrl && (
                  <a
                    href={currentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-medium text-primary hover:underline flex items-center gap-0.5"
                  >
                    <span>Test</span>
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                )}
              </label>

              <Input
                name={item.name}
                value={currentUrl}
                onChange={handleChange}
                placeholder={item.placeholder}
              />
            </div>
          );
        })}
      </div>

      {/* Live Preview Card */}
      <div className="rounded-xl border border-slate-200/90 bg-slate-50 p-4">
        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2">
          Live Topbar & Footer Icon Preview
        </span>
        <div className="flex items-center gap-2">
          {socialFields.map((item) => {
            const Icon = item.icon;
            const currentUrl = formData[item.name];
            const isSet = Boolean(currentUrl && currentUrl.trim().length > 0);

            return (
              <div
                key={item.name}
                title={isSet ? currentUrl : "Not configured"}
                className={`h-7 w-7 rounded-full flex items-center justify-center transition-all ${
                  isSet
                    ? `${item.badgeColor} shadow-2xs cursor-pointer`
                    : "bg-slate-200 text-slate-400 opacity-60"
                }`}
              >
                <Icon className="h-3 w-3" />
              </div>
            );
          })}
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
          <span>Save Social Settings</span>
        </Button>
      </div>
    </div>
  );
}

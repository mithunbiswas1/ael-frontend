// src/app/(dashboard)/admin/pages/contact/page.jsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FaImage, FaPhoneAlt, FaEnvelopeOpenText } from "react-icons/fa";
import PageConfigShell from "../_components/PageConfigShell";
import BannerEditorTab from "../_components/BannerEditorTab";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { LinkButton } from "@/components/ui/LinkButton";
import { H3 } from "@/components/ui/Typography";
import {
  useGetPageByKeyQuery,
  useUpdatePageByKeyMutation,
} from "@/redux/api/pageApi";

export default function AdminContactPage() {
  const [activeTab, setActiveTab] = useState("banner");
  const { data: pageData, isLoading } = useGetPageByKeyQuery("contact");
  const [updatePage, { isLoading: isSaving }] = useUpdatePageByKeyMutation();

  const [formData, setFormData] = useState({
    title: "Contact Us",
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
    sections: {
      contactInfo: {
        hotline: "",
        email: "",
        officeAddress: "",
        officeAddressBn: "",
        operatingHours: "",
        operatingHoursBn: "",
      },
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
        sections: { ...prev.sections, ...(pageData.data.sections || {}) },
      }));
    }
  }, [pageData]);

  const updateContactInfo = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        contactInfo: {
          ...(prev.sections?.contactInfo || {}),
          [field]: value,
        },
      },
    }));
  };

  const handleSave = async () => {
    try {
      await updatePage({
        pageKey: "contact",
        data: formData,
      }).unwrap();
      toast.success("Contact page configuration updated successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update contact page");
    }
  };

  const tabs = [
    { id: "banner", label: "Contact Hero Banner", icon: FaImage },
    { id: "info", label: "Office & Helplines", icon: FaPhoneAlt },
  ];

  return (
    <PageConfigShell
      pageKey="contact"
      title="Contact Page Configuration"
      subtitle="Configure contact hero banner, support helplines, addresses, and view user inquiries."
      previewUrl="/contact"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onSave={handleSave}
      isSaving={isSaving || isLoading}
    >
      <div className="mb-5 flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
        <div className="flex items-center gap-2.5">
          <FaEnvelopeOpenText className="h-4 w-4 text-emerald-700" />
          <span className="text-xs font-bold text-slate-900">
            View Citizen Inquiries & Form Messages
          </span>
        </div>
        <LinkButton
          href="/admin/messages"
          variant="secondary"
          size="xs"
          className="gap-1.5 border-emerald-300 text-emerald-800 bg-white"
        >
          <span>Open Messages Inbox</span>
        </LinkButton>
      </div>

      {activeTab === "banner" && (
        <BannerEditorTab
          bannerData={formData.banner}
          onChange={(updatedBanner) =>
            setFormData((prev) => ({ ...prev, banner: updatedBanner }))
          }
          previewBreadcrumb="Contact Us"
          previewBreadcrumbBn="যোগাযোগ"
        />
      )}

      {activeTab === "info" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
          <H3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Official Helplines & Institutional Office Details
          </H3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <Input
                label="Emergency Hotline Number"
                value={formData.sections.contactInfo?.hotline || ""}
                onChange={(e) => updateContactInfo("hotline", e.target.value)}
              />
              <Input
                label="Support Email Address"
                value={formData.sections.contactInfo?.email || ""}
                onChange={(e) => updateContactInfo("email", e.target.value)}
              />
              <Textarea
                label="Physical Office Address"
                rows={2}
                value={formData.sections.contactInfo?.officeAddress || ""}
                onChange={(e) => updateContactInfo("officeAddress", e.target.value)}
              />
              <Input
                label="Operating Hours"
                value={formData.sections.contactInfo?.operatingHours || ""}
                onChange={(e) => updateContactInfo("operatingHours", e.target.value)}
              />
            </div>
            <div className="space-y-3">
              <Textarea
                label="অফিসের ঠিকানা"
                rows={2}
                value={formData.sections.contactInfo?.officeAddressBn || ""}
                onChange={(e) => updateContactInfo("officeAddressBn", e.target.value)}
              />
              <Input
                label="কার্যদিবস ও সময়"
                value={formData.sections.contactInfo?.operatingHoursBn || ""}
                onChange={(e) => updateContactInfo("operatingHoursBn", e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
    </PageConfigShell>
  );
}

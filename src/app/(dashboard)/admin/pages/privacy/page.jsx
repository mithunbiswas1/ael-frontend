// src/app/(dashboard)/admin/pages/privacy/page.jsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FaImage, FaLock } from "react-icons/fa";
import PageConfigShell from "../_components/PageConfigShell";
import BannerEditorTab from "../_components/BannerEditorTab";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { H3 } from "@/components/ui/Typography";
import {
  useGetPageByKeyQuery,
  useUpdatePageByKeyMutation,
} from "@/redux/api/pageApi";
export default function AdminPrivacyPage() {
  const [activeTab, setActiveTab] = useState("content");
  const { data: pageData, isLoading } = useGetPageByKeyQuery("privacy");
  const [updatePage, { isLoading: isSaving }] = useUpdatePageByKeyMutation();

  const [formData, setFormData] = useState({
    title: "Privacy Policy",
    banner: {
      type: "centered",
      icon: "lock",
      title: "",
      titleBn: "",
      accent: "",
      accentBn: "",
      description: "",
      descriptionBn: "",
    },
    contentHtml: "",
    contentHtmlBn: "",
  });

  useEffect(() => {
    if (pageData?.data) {
      setFormData((prev) => ({
        ...prev,
        ...pageData.data,
        banner: {
          type: "centered",
          icon: pageData.data.banner?.icon || "lock",
          title: pageData.data.banner?.title || "",
          titleBn: pageData.data.banner?.titleBn || "",
          accent: pageData.data.banner?.accent || "",
          accentBn: pageData.data.banner?.accentBn || "",
          description: pageData.data.banner?.description || "",
          descriptionBn: pageData.data.banner?.descriptionBn || "",
        },
        contentHtml: pageData.data.contentHtml || "",
        contentHtmlBn: pageData.data.contentHtmlBn || "",
      }));
    }
  }, [pageData]);

  const handleSave = async () => {
    try {
      await updatePage({
        pageKey: "privacy",
        data: {
          ...formData,
          banner: {
            ...formData.banner,
            type: "centered",
          },
        },
      }).unwrap();
      toast.success("Privacy Policy page updated successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update privacy policy");
    }
  };

  const tabs = [
    { id: "content", label: "React Quill Policy Text", icon: FaLock },
    { id: "banner", label: "Centered Hero Banner", icon: FaImage },
  ];

  return (
    <PageConfigShell
      pageKey="privacy"
      title="Privacy Policy Configuration"
      subtitle="Edit legal privacy policy using React Quill rich text editor and configure centered hero banner."
      previewUrl="/privacy"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onSave={handleSave}
      isSaving={isSaving || isLoading}
    >
      {activeTab === "content" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <H3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>English Privacy Policy (React Quill)</span>
              <span className="text-[11px] font-semibold text-primary">
                Rich Text
              </span>
            </H3>
            <RichTextEditor
              value={formData.contentHtml}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, contentHtml: val }))
              }
              placeholder="Enter official English privacy policy..."
            />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <H3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>বাংলা গোপনীয়তা নীতি (React Quill)</span>
              <span className="text-[11px] font-semibold text-primary">
                রিচ টেক্সট
              </span>
            </H3>
            <RichTextEditor
              value={formData.contentHtmlBn}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, contentHtmlBn: val }))
              }
              placeholder="বাংলায় গোপনীয়তা নীতিমালা লিখুন..."
            />
          </div>
        </div>
      )}

      {activeTab === "banner" && (
        <BannerEditorTab
          banner={formData.banner}
          bannerType="centered"
          onChange={(updatedBanner) =>
            setFormData((prev) => ({
              ...prev,
              banner: { ...updatedBanner, type: "centered" },
            }))
          }
        />
      )}
    </PageConfigShell>
  );
}

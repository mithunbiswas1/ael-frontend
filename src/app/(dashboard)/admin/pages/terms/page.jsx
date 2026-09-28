// src/app/(dashboard)/admin/pages/terms/page.jsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FaImage, FaBalanceScale } from "react-icons/fa";
import PageConfigShell from "../_components/PageConfigShell";
import BannerEditorTab from "../_components/BannerEditorTab";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { H3 } from "@/components/ui/Typography";
import {
  useGetPageByKeyQuery,
  useUpdatePageByKeyMutation,
} from "@/redux/api/pageApi";
export default function AdminTermsPage() {
  const [activeTab, setActiveTab] = useState("content");
  const { data: pageData, isLoading } = useGetPageByKeyQuery("terms");
  const [updatePage, { isLoading: isSaving }] = useUpdatePageByKeyMutation();

  const [formData, setFormData] = useState({
    title: "Terms of Use",
    banner: {
      type: "centered",
      icon: "scale",
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
          icon: pageData.data.banner?.icon || "scale",
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
        pageKey: "terms",
        data: {
          ...formData,
          banner: {
            ...formData.banner,
            type: "centered",
          },
        },
      }).unwrap();
      toast.success("Terms of Use page updated successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update terms of use");
    }
  };

  const tabs = [
    { id: "content", label: "React Quill Terms Text", icon: FaBalanceScale },
    { id: "banner", label: "Centered Hero Banner", icon: FaImage },
  ];

  return (
    <PageConfigShell
      pageKey="terms"
      title="Terms of Use Configuration"
      subtitle="Edit terms of service using React Quill rich text editor and configure centered hero banner."
      previewUrl="/terms"
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
              <span>English Terms of Use (React Quill)</span>
              <span className="text-[11px] font-semibold text-primary">
                Rich Text
              </span>
            </H3>
            <RichTextEditor
              value={formData.contentHtml}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, contentHtml: val }))
              }
              placeholder="Enter official English terms of use..."
            />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <H3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>বাংলা ব্যবহারের শর্তাবলী (React Quill)</span>
              <span className="text-[11px] font-semibold text-primary">
                রিচ টেক্সট
              </span>
            </H3>
            <RichTextEditor
              value={formData.contentHtmlBn}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, contentHtmlBn: val }))
              }
              placeholder="বাংলায় ব্যবহারের শর্তাবলী লিখুন..."
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

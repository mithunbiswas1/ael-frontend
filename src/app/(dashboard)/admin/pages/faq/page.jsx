// src/app/(dashboard)/admin/pages/faq/page.jsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FaImage, FaQuestionCircle, FaPlus, FaTrash } from "react-icons/fa";
import PageConfigShell from "../_components/PageConfigShell";
import BannerEditorTab from "../_components/BannerEditorTab";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { H3, P } from "@/components/ui/Typography";
import {
  useGetPageByKeyQuery,
  useUpdatePageByKeyMutation,
} from "@/redux/api/pageApi";
export default function AdminFaqPage() {
  const [activeTab, setActiveTab] = useState("items");
  const { data: pageData, isLoading } = useGetPageByKeyQuery("faq");
  const [updatePage, { isLoading: isSaving }] = useUpdatePageByKeyMutation();

  const [formData, setFormData] = useState({
    title: "FAQ & Help Center",
    banner: {
      type: "centered",
      icon: "help",
      title: "",
      titleBn: "",
      accent: "",
      accentBn: "",
      description: "",
      descriptionBn: "",
    },
    sections: {
      faqItems: [],
    },
  });

  useEffect(() => {
    if (pageData?.data) {
      setFormData((prev) => ({
        ...prev,
        ...pageData.data,
        banner: {
          type: "centered",
          icon: pageData.data.banner?.icon || "help",
          title: pageData.data.banner?.title || "",
          titleBn: pageData.data.banner?.titleBn || "",
          accent: pageData.data.banner?.accent || "",
          accentBn: pageData.data.banner?.accentBn || "",
          description: pageData.data.banner?.description || "",
          descriptionBn: pageData.data.banner?.descriptionBn || "",
        },
        sections: {
          faqItems: pageData.data.sections?.faqItems || [],
          ...(pageData.data.sections || {}),
        },
      }));
    }
  }, [pageData]);

  const handleSave = async () => {
    try {
      await updatePage({
        pageKey: "faq",
        data: formData,
      }).unwrap();
      toast.success("FAQ page configuration updated successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update FAQ page");
    }
  };

  const handleAddFaq = () => {
    const newItem = {
      id: String(Date.now()),
      question: "New FAQ Question?",
      questionBn: "নতুন সাধারণ জিজ্ঞাসা?",
      answer: "Provide detailed answer here.",
      answerBn: "এখানে বিস্তারিত উত্তর লিখুন।",
      category: "General",
    };
    setFormData((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        faqItems: [...(prev.sections?.faqItems || []), newItem],
      },
    }));
  };

  const handleRemoveFaq = (id) => {
    setFormData((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        faqItems: (prev.sections?.faqItems || []).filter((f) => f.id !== id),
      },
    }));
  };

  const handleFaqChange = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        faqItems: (prev.sections?.faqItems || []).map((f) =>
          f.id === id ? { ...f, [field]: value } : f
        ),
      },
    }));
  };

  const tabs = [
    { id: "items", label: "Questions & Answers", icon: FaQuestionCircle },
    { id: "banner", label: "Hero Banner", icon: FaImage },
  ];

  return (
    <PageConfigShell
      pageKey="faq"
      title="FAQ & Help Center Configuration"
      subtitle="Configure hero banner and maintain the library of frequently asked citizen and operator questions."
      previewUrl="/faq"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onSave={handleSave}
      isSaving={isSaving || isLoading}
    >
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

      {activeTab === "items" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <H3 className="text-sm font-bold text-slate-900">
                Frequently Asked Questions ({formData.sections?.faqItems?.length || 0})
              </H3>
              <P className="text-xs text-slate-500 mt-0.5">
                Add, edit, or remove Q&A items displayed on the public help center.
              </P>
            </div>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleAddFaq}
              className="gap-2 text-xs font-bold"
            >
              <FaPlus className="h-3 w-3" />
              <span>Add New Question</span>
            </Button>
          </div>

          <div className="space-y-4">
            {(formData.sections?.faqItems || []).map((faq, idx) => (
              <div
                key={faq.id || idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-500">
                    Question #{idx + 1}
                  </span>
                  <Button
                    type="button"
                    variant="danger"
                    size="xs"
                    onClick={() => handleRemoveFaq(faq.id)}
                    className="p-1.5"
                    title="Remove Question"
                  >
                    <FaTrash className="h-3 w-3" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    label="Question"
                    value={faq.question || ""}
                    onChange={(e) =>
                      handleFaqChange(faq.id, "question", e.target.value)
                    }
                  />
                  <Input
                    label="প্রশ্ন"
                    value={faq.questionBn || ""}
                    onChange={(e) =>
                      handleFaqChange(faq.id, "questionBn", e.target.value)
                    }
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Textarea
                    label="Answer"
                    rows={3}
                    value={faq.answer || ""}
                    onChange={(e) =>
                      handleFaqChange(faq.id, "answer", e.target.value)
                    }
                  />
                  <Textarea
                    label="উত্তর"
                    rows={3}
                    value={faq.answerBn || ""}
                    onChange={(e) =>
                      handleFaqChange(faq.id, "answerBn", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </PageConfigShell>
  );
}

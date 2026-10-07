// src/app/(dashboard)/admin/pages/acts-and-rules/page.jsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FaImage, FaFileAlt, FaBookOpen, FaPlus, FaTrash } from "react-icons/fa";
import PageConfigShell from "../_components/PageConfigShell";
import BannerEditorTab from "../_components/BannerEditorTab";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { H3, P } from "@/components/ui/Typography";
import {
  useGetPageByKeyQuery,
  useUpdatePageByKeyMutation,
} from "@/redux/api/pageApi";

export default function AdminActsAndRulesPage() {
  const [activeTab, setActiveTab] = useState("banner");
  const { data: pageData, isLoading } = useGetPageByKeyQuery("acts-and-rules");
  const [updatePage, { isLoading: isSaving }] = useUpdatePageByKeyMutation();

  const [formData, setFormData] = useState({
    title: "Acts & Rules",
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
    sections: {
      gazettes: [],
    },
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
        sections: {
          gazettes: pageData.data.sections?.gazettes || [],
          ...(pageData.data.sections || {}),
        },
      }));
    }
  }, [pageData]);

  const handleSave = async () => {
    try {
      await updatePage({
        pageKey: "acts-and-rules",
        data: formData,
      }).unwrap();
      toast.success("Acts & Rules page updated successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update page");
    }
  };

  const handleAddGazette = () => {
    const newGazette = {
      id: `act-${Date.now()}`,
      title: "New Statutory Gazette Act",
      titleBn: "নতুন সংবিধিবদ্ধ গেজেট আইন",
      subtitle: "",
      subtitleBn: "",
      category: "Official Gazette",
      categoryBn: "সরকারি গেজেট",
      authority: "Department of Explosives",
      authorityBn: "বিস্ফোরক পরিদপ্তর",
      gazetteRef: `Gazette ${new Date().getFullYear()}`,
      year: new Date().getFullYear().toString(),
      yearBn: "",
      fileSize: "Official PDF",
      fileUrl: "",
    };
    setFormData((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        gazettes: [newGazette, ...(prev.sections?.gazettes || [])],
      },
    }));
  };

  const handleRemoveGazette = (id) => {
    setFormData((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        gazettes: (prev.sections?.gazettes || []).filter((g) => g.id !== id),
      },
    }));
  };

  const handleGazetteChange = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        gazettes: (prev.sections?.gazettes || []).map((g) =>
          g.id === id ? { ...g, [field]: value } : g
        ),
      },
    }));
  };

  const tabs = [
    { id: "banner", label: "Hero Banner", icon: FaImage },
    { id: "library", label: "Acts & Rules Gazettes List", icon: FaBookOpen },
    { id: "description", label: "Legal Description (Rich Text)", icon: FaFileAlt },
  ];

  return (
    <PageConfigShell
      pageKey="acts-and-rules"
      title="Acts & Rules Compendium Configuration"
      subtitle="Edit hero banner, manage downloadable gazette acts, and customize statutory legal descriptions."
      previewUrl="/acts-and-rules"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onSave={handleSave}
      isSaving={isSaving || isLoading}
    >
      {/* Tab 1: Hero Banner */}
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
          previewBreadcrumb="Related Acts & Rules"
          previewBreadcrumbBn="আইন ও বিধিমালা"
        />
      )}

      {/* Tab 2: Gazettes List */}
      {activeTab === "library" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <H3 className="text-sm font-bold text-slate-900">
                Official Gazettes & Statutory Library
              </H3>
              <P className="text-xs text-slate-500 mt-0.5">
                Manage downloadable Acts, SROs, and circular files displayed in the search and filter catalog.
              </P>
            </div>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={handleAddGazette}
              className="gap-2 text-xs font-bold"
            >
              <FaPlus className="h-3 w-3" />
              <span>Add Gazette / Act</span>
            </Button>
          </div>

          <div className="space-y-4">
            {(formData.sections?.gazettes || []).map((gazette, idx) => (
              <div
                key={gazette.id || idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-600">
                    Act #{idx + 1}: {gazette.title || "Untitled"}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={() => handleRemoveGazette(gazette.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5"
                    title="Remove Gazette"
                  >
                    <FaTrash className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    label="Act / Gazette Title"
                    value={gazette.title || ""}
                    onChange={(e) =>
                      handleGazetteChange(gazette.id, "title", e.target.value)
                    }
                    placeholder="The Explosives Act, 1884"
                  />
                  <Input
                    label="আইন / গেজেটের শিরোনাম"
                    value={gazette.titleBn || ""}
                    onChange={(e) =>
                      handleGazetteChange(gazette.id, "titleBn", e.target.value)
                    }
                    placeholder="দ্য এক্সপ্লোসিভস অ্যাক্ট, ১৮৮৪"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    label="Subtitle / Legal Scope"
                    value={gazette.subtitle || ""}
                    onChange={(e) =>
                      handleGazetteChange(gazette.id, "subtitle", e.target.value)
                    }
                    placeholder="Principal statutory foundation for manufacture and transport..."
                  />
                  <Input
                    label="সংক্ষিপ্ত বিবরণ"
                    value={gazette.subtitleBn || ""}
                    onChange={(e) =>
                      handleGazetteChange(gazette.id, "subtitleBn", e.target.value)
                    }
                    placeholder="সংকুচিত ও তরলীকৃত গ্যাস উৎপাদন, সংরক্ষণ ও পরিবহনের মূল আইন..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <Input
                    label="Category"
                    value={gazette.category || ""}
                    onChange={(e) =>
                      handleGazetteChange(gazette.id, "category", e.target.value)
                    }
                    placeholder="Explosives Rules / Gas Rules"
                  />
                  <Input
                    label="ক্যাটাগরি"
                    value={gazette.categoryBn || ""}
                    onChange={(e) =>
                      handleGazetteChange(gazette.id, "categoryBn", e.target.value)
                    }
                    placeholder="বিস্ফোরক বিধিমালা / গ্যাস বিধিমালা"
                  />
                  <Input
                    label="Issuing Authority"
                    value={gazette.authority || ""}
                    onChange={(e) =>
                      handleGazetteChange(gazette.id, "authority", e.target.value)
                    }
                    placeholder="Department of Explosives"
                  />
                  <Input
                    label="কর্তৃপক্ষ"
                    value={gazette.authorityBn || ""}
                    onChange={(e) =>
                      handleGazetteChange(gazette.id, "authorityBn", e.target.value)
                    }
                    placeholder="বিস্ফোরক পরিদপ্তর"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Input
                    label="Gazette Reference"
                    value={gazette.gazetteRef || ""}
                    onChange={(e) =>
                      handleGazetteChange(gazette.id, "gazetteRef", e.target.value)
                    }
                    placeholder="Law Ministry Gazette Vol. 4"
                  />
                  <Input
                    label="Year Enacted"
                    value={gazette.year || ""}
                    onChange={(e) =>
                      handleGazetteChange(gazette.id, "year", e.target.value)
                    }
                    placeholder="1884 (Amended 2018)"
                  />
                  <Input
                    label="PDF / File URL"
                    placeholder="e.g. /gazettes/explosives-act-1884.pdf"
                    value={gazette.fileUrl || ""}
                    onChange={(e) =>
                      handleGazetteChange(gazette.id, "fileUrl", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: React Quill Description Box */}
      {activeTab === "description" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <H3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>English Statutory Description (React Quill Rich Editor)</span>
              <span className="text-[11px] font-semibold text-primary">
                HTML Formatted
              </span>
            </H3>
            <RichTextEditor
              value={formData.contentHtml}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, contentHtml: val }))
              }
              placeholder="Write official legal description in English..."
            />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-4">
            <H3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>বাংলা সংবিধিবদ্ধ বিবরণ (React Quill রিচ টেক্সট এডিটর)</span>
              <span className="text-[11px] font-semibold text-primary">
                এইচটিএমএল ফরম্যাট
              </span>
            </H3>
            <RichTextEditor
              value={formData.contentHtmlBn}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, contentHtmlBn: val }))
              }
              placeholder="বাংলায় আইনি বিবরণ লিখুন..."
            />
          </div>
        </div>
      )}
    </PageConfigShell>
  );
}

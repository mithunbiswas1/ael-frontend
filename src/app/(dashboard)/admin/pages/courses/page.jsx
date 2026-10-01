// src/app/(dashboard)/admin/pages/courses/page.jsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FaImage, FaGraduationCap, FaExternalLinkAlt, FaBookOpen } from "react-icons/fa";
import PageConfigShell from "../_components/PageConfigShell";
import BannerEditorTab from "../_components/BannerEditorTab";
import { LinkButton } from "@/components/ui/LinkButton";
import { H3, P } from "@/components/ui/Typography";
import {
  useGetPageByKeyQuery,
  useUpdatePageByKeyMutation,
} from "@/redux/api/pageApi";

export default function AdminCoursesPage() {
  const [activeTab, setActiveTab] = useState("banner");
  const { data: pageData, isLoading } = useGetPageByKeyQuery("courses");
  const [updatePage, { isLoading: isSaving }] = useUpdatePageByKeyMutation();

  const [formData, setFormData] = useState({
    title: "Training & Quiz",
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
    sections: {},
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
        sections: pageData.data.sections || {},
      }));
    }
  }, [pageData]);

  const handleSave = async () => {
    try {
      await updatePage({
        pageKey: "courses",
        data: formData,
      }).unwrap();
      toast.success("Training & Quiz page banner updated successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update training & quiz banner");
    }
  };

  const tabs = [
    { id: "banner", label: "Hero Banner", icon: FaImage },
    { id: "lms", label: "LMS Curriculum Integration", icon: FaBookOpen },
  ];

  return (
    <PageConfigShell
      pageKey="courses"
      title="Training & Quiz Page Configuration"
      subtitle="Configure hero banner and manage LMS courses, quizzes, and learner certificates."
      previewUrl="/courses"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onSave={handleSave}
      isSaving={isSaving || isLoading}
    >
      {activeTab === "banner" && (
        <BannerEditorTab
          banner={formData.banner}
          onChange={(updatedBanner) =>
            setFormData((prev) => ({ ...prev, banner: updatedBanner }))
          }
          previewBreadcrumb="Training & Quiz"
          previewBreadcrumbBn="প্রশিক্ষণ ও কুইজ"
        />
      )}

      {activeTab === "lms" && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <H3 className="text-sm font-bold text-slate-900">
              LMS Curriculum & Course Catalog
            </H3>
            <P className="text-xs text-slate-500 mt-0.5">
              The public /courses page dynamically renders active courses, lesson playlists, and MCQ assessments from the LMS engine.
            </P>
          </div>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <FaGraduationCap className="h-5 w-5" />
                <span>Full LMS Management Suite</span>
              </div>
              <p className="text-xs text-slate-600 max-w-lg leading-relaxed">
                Add video lessons, manage module syllabi, configure passing criteria (80%), and review auto-generated completion certificates.
              </p>
            </div>
            <LinkButton
              href="/admin/courses"
              variant="primary"
              size="sm"
              className="gap-2 shrink-0"
            >
              <span>Open Course Manager</span>
              <FaExternalLinkAlt className="h-3 w-3" />
            </LinkButton>
          </div>
        </div>
      )}
    </PageConfigShell>
  );
}

// src/app/(dashboard)/admin/pages/about/page.jsx
"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  FaImage,
  FaShieldAlt,
  FaBullseye,
  FaUserTie,
  FaChartBar,
} from "react-icons/fa";
import PageConfigShell from "../_components/PageConfigShell";
import BannerEditorTab from "../_components/BannerEditorTab";
import WhoWeAreEditorTab from "./_components/WhoWeAreEditorTab";
import MissionVisionEditorTab from "./_components/MissionVisionEditorTab";
import TrainersEditorTab from "./_components/TrainersEditorTab";
import StatsEditorTab from "./_components/StatsEditorTab";
import {
  useGetPageByKeyQuery,
  useUpdatePageByKeyMutation,
} from "@/redux/api/pageApi";

export default function AdminAboutPage() {
  const [activeTab, setActiveTab] = useState("banner");
  const { data: pageData, isLoading } = useGetPageByKeyQuery("about");
  const [updatePage, { isLoading: isSaving }] = useUpdatePageByKeyMutation();

  const [formData, setFormData] = useState({
    title: "About Us",
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
      lpgSafety: {
        tag: "",
        tagBn: "",
        title: "",
        titleBn: "",
        accent: "",
        accentBn: "",
        leadText: "",
        leadTextBn: "",
        paragraphs: "",
        paragraphsBn: "",
        features: [],
      },
      missionVision: {
        tag: "",
        tagBn: "",
        title: "",
        titleBn: "",
        accent: "",
        accentBn: "",
        subtitle: "",
        subtitleBn: "",
        missionBadge: "",
        missionBadgeBn: "",
        missionHead: "",
        missionHeadBn: "",
        mission: "",
        missionBn: "",
        visionBadge: "",
        visionBadgeBn: "",
        visionHead: "",
        visionHeadBn: "",
        vision: "",
        visionBn: "",
      },
      expertTrainers: {
        tag: "",
        tagBn: "",
        title: "",
        titleBn: "",
        subtitle: "",
        subtitleBn: "",
        trainers: [],
      },
      stats: {
        certifiedLearners: "",
        certifiedLearnersBn: "",
        certifiedLearnersLabel: "",
        certifiedLearnersLabelBn: "",
        districtsCovered: "",
        districtsCoveredBn: "",
        districtsCoveredLabel: "",
        districtsCoveredLabelBn: "",
        incidentReduction: "",
        incidentReductionBn: "",
        incidentReductionLabel: "",
        incidentReductionLabelBn: "",
        partnerOrganizations: "",
        partnerOrganizationsBn: "",
        partnerOrganizationsLabel: "",
        partnerOrganizationsLabelBn: "",
      },
    },
  });

  useEffect(() => {
    if (pageData?.data) {
      setFormData((prev) => ({
        ...prev,
        title: pageData.data.title || prev.title,
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
        sections: {
          lpgSafety: {
            ...prev.sections.lpgSafety,
            ...(pageData.data.sections?.lpgSafety || {}),
            features: pageData.data.sections?.lpgSafety?.features || [],
          },
          missionVision: {
            ...prev.sections.missionVision,
            ...(pageData.data.sections?.missionVision || {}),
          },
          expertTrainers: {
            ...prev.sections.expertTrainers,
            ...(pageData.data.sections?.expertTrainers || {}),
            trainers: pageData.data.sections?.expertTrainers?.trainers || [],
          },
          stats: {
            ...prev.sections.stats,
            ...(pageData.data.sections?.stats || {}),
          },
        },
      }));
    }
  }, [pageData]);

  const updateSection = (sectionKey, newSectionData) => {
    setFormData((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionKey]: newSectionData,
      },
    }));
  };

  const handleSave = async () => {
    try {
      await updatePage({
        pageKey: "about",
        data: formData,
      }).unwrap();
      toast.success("About page configuration updated successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update about page");
    }
  };

  const tabs = [
    { id: "banner", label: "Hero Banner", icon: FaImage },
    { id: "lpgSafety", label: "LPG Safety (Who We Are)", icon: FaShieldAlt },
    { id: "missionVision", label: "Mission & Vision", icon: FaBullseye },
    { id: "expertTrainers", label: "Expert Trainers", icon: FaUserTie },
    { id: "stats", label: "National Stats", icon: FaChartBar },
  ];

  return (
    <PageConfigShell
      pageKey="about"
      title="About Us Page Configuration"
      subtitle="Configure hero banner, LPG safety overview, mission & vision, expert trainers, and metrics."
      previewUrl="/about"
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
          onChange={(updatedBanner) =>
            setFormData((prev) => ({ ...prev, banner: updatedBanner }))
          }
        />
      )}

      {/* Tab 2: LPG Safety / Who We Are */}
      {activeTab === "lpgSafety" && (
        <WhoWeAreEditorTab
          data={formData.sections.lpgSafety}
          onChange={(newData) => updateSection("lpgSafety", newData)}
        />
      )}

      {/* Tab 3: Mission & Vision */}
      {activeTab === "missionVision" && (
        <MissionVisionEditorTab
          data={formData.sections.missionVision}
          onChange={(newData) => updateSection("missionVision", newData)}
        />
      )}

      {/* Tab 4: Expert Trainers */}
      {activeTab === "expertTrainers" && (
        <TrainersEditorTab
          data={formData.sections.expertTrainers}
          onChange={(newData) => updateSection("expertTrainers", newData)}
        />
      )}

      {/* Tab 5: National Stats */}
      {activeTab === "stats" && (
        <StatsEditorTab
          data={formData.sections.stats}
          onChange={(newData) => updateSection("stats", newData)}
        />
      )}
    </PageConfigShell>
  );
}

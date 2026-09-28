// src/app/(pages)/about/page.jsx

import VisualHeroBanner from "@/components/ui/VisualHeroBanner";
import WhoWeAreSection from "./_components/WhoWeAreSection";
import MissionVisionSection from "./_components/MissionVisionSection";
import ExpertTrainersSection from "./_components/ExpertTrainersSection";
import AboutStatsSection from "./_components/AboutStatsSection";
import { getLocale } from "@/lib/i18n";
import { getPageContent } from "@/next-api/getPageContent";

export async function generateMetadata() {
  const locale = await getLocale();
  if (locale === "bn") {
    return {
      title: "আমাদের সম্পর্কে | এলপিজি নিরাপত্তা ও সচেতনতা বাংলাদেশ",
      description:
        "সমগ্র বাংলাদেশে এলপিজি খাতে নিরাপত্তা, জনসচেতনতা এবং প্রযুক্তিগত দক্ষতা বৃদ্ধির লক্ষ্যে নিবেদিত জাতীয় প্ল্যাটফর্ম।",
    };
  }
  return {
    title: "About Us | LPG Safety & Awareness Bangladesh",
    description:
      "Dedicated to promoting nationwide safety, public awareness, and technical expertise across Bangladesh’s LPG ecosystem.",
  };
}

export default async function AboutPage() {
  const { banner, sections } = await getPageContent("about");

  return (
    <main className="min-h-screen bg-slate-50">
      <VisualHeroBanner data={banner} />
      <WhoWeAreSection data={sections?.lpgSafety} />
      <MissionVisionSection data={sections?.missionVision} />
      <ExpertTrainersSection data={sections?.expertTrainers} />
      <AboutStatsSection data={sections?.stats} />
    </main>
  );
}

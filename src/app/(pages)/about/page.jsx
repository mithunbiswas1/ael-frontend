// src/app/(pages)/about/page.jsx
import AboutHeroSection from "./_components/AboutHeroSection";
import WhoWeAreSection from "./_components/WhoWeAreSection";
import MissionVisionSection from "./_components/MissionVisionSection";
import ExpertTrainersSection from "./_components/ExpertTrainersSection";
import AboutStatsSection from "./_components/AboutStatsSection";

export const metadata = {
  title: "About Us | LPG Safety & Awareness Bangladesh",
  description:
    "Dedicated to promoting nationwide safety, public awareness, and technical expertise across Bangladesh’s LPG ecosystem.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <AboutHeroSection />
      <WhoWeAreSection />
      <MissionVisionSection />
      <ExpertTrainersSection />
      <AboutStatsSection />
    </main>
  );
}

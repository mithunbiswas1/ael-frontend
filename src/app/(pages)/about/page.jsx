// src/app/(pages)/about/page.jsx

import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/LinkButton";
import GlobalHeroSection from "@/_components/GlobalHeroSection";
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
      <GlobalHeroSection
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "About Us" },
        ]}
        badgeText="NATIONAL LPG SAFETY MISSION"
        title="ABOUT"
        accent="US."
        description="Dedicated to promoting nationwide safety, building public awareness, and strengthening Bangladesh’s LPG sector through knowledge, technical training, and institutional collaboration."
        imageSrc="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop"
        imageAlt="LPG Storage and Cylinders"
        infoTag={{
          title: "Nationwide Awareness Network",
          subtitle: "Standardizing safety across all 64 districts",
        }}
      />
      <WhoWeAreSection />
      <MissionVisionSection />
      <ExpertTrainersSection />
      <AboutStatsSection />
    </main>
  );
}

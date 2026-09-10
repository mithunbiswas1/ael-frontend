// src/app/(home)/page.jsx - updated 2026-09-10T13:29
import HeroSection from "./_components/HeroSection";
import SafetyTickerRibbon from "./_components/SafetyTickerRibbon";
import MetricsBar from "./_components/MetricsBar";
import SafetyGuidelinesSection from "./_components/SafetyGuidelinesSection";
import MarketUpdatesSection from "./_components/MarketUpdatesSection";
import LatestBlogsSection from "./_components/LatestBlogsSection";
import FeaturedTrainingSection from "./_components/FeaturedTrainingSection";
import NewsletterSection from "./_components/NewsletterSection";
import EmergencySupportBar from "./_components/EmergencySupportBar";

export const metadata = {
  title: "Safety First. Awareness Always. | LPG Safety & Awareness Bangladesh",
  description:
    "Promoting LPG safety awareness across Bangladesh for consumers, dealers, auto-gas stations, and industrial users. Access safety guidelines, market updates, and digital LMS training.",
};

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 selection:bg-primary/20 selection:text-primary">
      <HeroSection />
      <MetricsBar />
      <SafetyGuidelinesSection />
      <section className="py-6">
        <div className="site-container">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="flex flex-col lg:col-span-8">
              <MarketUpdatesSection />
              <LatestBlogsSection />
            </div>
            <div className="flex flex-col lg:col-span-4">
              <FeaturedTrainingSection />
              <NewsletterSection />
            </div>
          </div>
        </div>
      </section>
      <EmergencySupportBar />
    </main>
  );
}

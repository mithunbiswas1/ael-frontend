// src/app/(home)/page.jsx

import HeroSection from "./_components/HeroSection";
import MetricsBar from "./_components/MetricsBar";
import SafetyGuidelinesSection from "./_components/SafetyGuidelinesSection";
import MarketUpdatesSection from "./_components/MarketUpdatesSection";
import LatestBlogsSection from "./_components/LatestBlogsSection";
import FeaturedTrainingSection from "./_components/FeaturedTrainingSection";
import NewsletterSection from "./_components/NewsletterSection";
import EmergencySupportBar from "./_components/EmergencySupportBar";
import AdSlot from "@/components/shared/AdSlot";
import { getLocale, getDict } from "@/lib/i18n";
import { getBlogs } from "@/next-api/getBlogs";
import { getCourses } from "@/next-api/getCourses";
import { getHomeBanner } from "@/next-api/getHomeBanner";
import { getMarketUpdates } from "@/next-api/getMarketUpdates";

export async function generateMetadata() {
  const locale = await getLocale();
  if (locale === "bn") {
    return {
      title: "নিরাপত্তা সবার আগে। সচেতনতা সর্বদা। | এলপিজি নিরাপত্তা ও সচেতনতা বাংলাদেশ",
      description:
        "ভোক্তা, ডিলার, অটো-গ্যাস স্টেশন এবং শিল্পের জন্য সমগ্র বাংলাদেশে এলপিজি নিরাপত্তা সচেতনতা বৃদ্ধি। নিরাপত্তা নির্দেশিকা, মার্কেট আপডেট এবং ডিজিটাল এলএমএস প্রশিক্ষণ এক প্ল্যাটফর্মে।",
    };
  }
  return {
    title: "Safety First. Awareness Always. | LPG Safety & Awareness Bangladesh",
    description:
      "Promoting LPG safety awareness across Bangladesh for consumers, dealers, auto-gas stations, and industrial users. Access safety guidelines, market updates, and digital LMS training.",
  };
}

export default async function HomePage() {
  const [locale, dict, liveBlogs, liveCourses, homeBanner, liveMarketUpdates] =
    await Promise.all([
      getLocale(),
      getDict(),
      getBlogs({ limit: 3 }),
      getCourses(),
      getHomeBanner(),
      getMarketUpdates({ limit: 4 }),
    ]);
  const homeDict = dict?.home || {};
  const featuredCourse = liveCourses && liveCourses.length > 0 ? liveCourses[0] : null;

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-50 selection:bg-primary/20 selection:text-primary">
      <HeroSection locale={locale} banner={homeBanner} />
      {/* <MetricsBar dict={homeDict.metrics} locale={locale} /> */}
      <AdSlot slot="mid_content" />
      <SafetyGuidelinesSection
        dict={homeDict.safetyGuidelines}
        locale={locale}
      />
      <section className="py-6">
        <div className="site-container">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="flex flex-col lg:col-span-8">
              <MarketUpdatesSection
                dict={homeDict.marketUpdates}
                liveUpdates={liveMarketUpdates}
                locale={locale}
              />
              <LatestBlogsSection
                dict={homeDict.latestBlogs}
                liveBlogs={liveBlogs}
                locale={locale}
              />
            </div>
            <div className="flex flex-col lg:col-span-4">
              <FeaturedTrainingSection
                dict={homeDict.featuredTraining}
                liveCourse={featuredCourse}
                locale={locale}
              />
              <NewsletterSection
                dict={homeDict.newsletter}
                locale={locale}
              />
              <AdSlot slot="sidebar_ad" />
            </div>
          </div>
        </div>
      </section>
      <AdSlot slot="footer_banner" />
      <EmergencySupportBar dict={homeDict.emergencyBar} locale={locale} />
    </main>
  );
}

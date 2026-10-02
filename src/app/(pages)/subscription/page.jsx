import CenteredHeroBanner from "@/components/ui/CenteredHeroBanner";
import VisualHeroBanner from "@/components/ui/VisualHeroBanner";
import PricingCardsSection from "./_components/PricingCardsSection";
import { getLocale } from "@/lib/i18n";
import { getPageContent } from "@/next-api/getPageContent";

export async function generateMetadata() {
  const locale = await getLocale();
  if (locale === "bn") {
    return {
      title: "সাবস্ক্রিপশন ও মূল্যতালিকা | সেইফ এলপিজি বাংলাদেশ",
      description:
        "ভোক্তা, রিটেল ডিলার এবং শিল্প কারখানার জন্য উপযোগী নিরাপত্তা প্রশিক্ষণ ও কমপ্লায়েন্স সাবস্ক্রিপশন প্যাকেজ।",
    };
  }
  return {
    title: "Subscription & Plans | Safe LPG Platform",
    description:
      "Flexible subscription tiers for individual learners, retail gas dealers, and industrial fleet operators in Bangladesh.",
  };
}

export default async function SubscriptionPage() {
  const locale = await getLocale();
  const isBn = locale === "bn";
  const subContent = await getPageContent("subscription");
  const cmsData = subContent?.banner?.title ? subContent : await getPageContent("pricing");

  const bannerData = {
    breadcrumb: {
      en: "Subscription & Plans",
      bn: "সাবস্ক্রিপশন প্যাকেজ",
    },
    title: cmsData?.banner?.title || "FLEXIBLE SAFETY",
    titleBn: cmsData?.banner?.titleBn || "নিরাপত্তা ও প্রশিক্ষণ",
    accent: cmsData?.banner?.accent || "PLANS.",
    accentBn: cmsData?.banner?.accentBn || "প্যাকেজসমূহ।",
    description:
      cmsData?.banner?.description ||
      "Choose the safety, training, and regulatory compliance package tailored for your home, retail outlet, auto gas station, or manufacturing facility.",
    descriptionBn:
      cmsData?.banner?.descriptionBn ||
      "ভোক্তা, রিটেল গ্যাস ডিলার এবং শিল্প কারখানার জন্য উপযোগী নিরাপত্তা প্রশিক্ষণ ও সংবিধিবদ্ধ কমপ্লায়েন্স সাবস্ক্রিপশন প্যাকেজ বেছে নিন।",
    ...cmsData?.banner,
  };

  const isVisualBanner = bannerData.type === "visual" && Boolean(bannerData.imageSrc);

  return (
    <main className="min-h-screen bg-slate-50/70 pb-24">
      {/* Dynamic Banner: Visual (split with image) or Centered */}
      {isVisualBanner ? (
        <VisualHeroBanner data={bannerData} />
      ) : (
        <CenteredHeroBanner data={bannerData} />
      )}

      {/* Subscription Pricing Cards: 3 cards per row on LG screen matching front page aesthetics */}
      <PricingCardsSection />
    </main>
  );
}

// src/app/(pages)/pricing/page.jsx
import PricingClientView from "./_components/PricingClientView";
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
    title: "Pricing & Plans | Safe LPG Platform",
    description:
      "Flexible subscription tiers for individual learners, retail gas dealers, and industrial fleet operators in Bangladesh.",
  };
}

export default async function PricingPage() {
  const cmsData = await getPageContent("pricing");

  return (
    <main className="min-h-screen bg-slate-50">
      <PricingClientView
        banner={cmsData.banner}
        plansConfig={cmsData.sections?.plans}
      />
    </main>
  );
}

// src/app/(pages)/faq/page.jsx

import CenteredHeroBanner from "@/components/ui/CenteredHeroBanner";
import FaqAccordionSection from "./_components/FaqAccordionSection";
import { getLocale } from "@/lib/i18n";
import { getPageContent } from "@/next-api/getPageContent";

export async function generateMetadata() {
  const locale = await getLocale();
  if (locale === "bn") {
    return {
      title: "সাধারণ জিজ্ঞাসা ও সহায়তা কেন্দ্র | এলপিজি নিরাপত্তা বাংলাদেশ",
      description:
        "বাসাবাড়িতে এলপিজি ব্যবহার, রেগুলেটর রক্ষণাবেক্ষণ, ডিলার কমপ্লায়েন্স এবং জরুরি প্রোটোকল সম্পর্কিত নির্ভরযোগ্য দিকনির্দেশনা।",
    };
  }
  return {
    title: "Frequently Asked Questions | FAQ & Help Center | LPG Safety Bangladesh",
    description:
      "Authoritative guidance on LPG household handling, regulator maintenance, commercial compliance, and emergency protocols in Bangladesh.",
  };
}

export default async function FaqPage() {
  const { banner, sections } = await getPageContent("faq");

  return (
    <main className="min-h-screen bg-slate-50">
      <CenteredHeroBanner data={banner} />
      <FaqAccordionSection items={sections?.faqItems} />
    </main>
  );
}

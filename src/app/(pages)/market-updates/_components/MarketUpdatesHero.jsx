// src/app/(pages)/market-updates/_components/MarketUpdatesHero.jsx

import VisualHeroBanner from "@/components/ui/VisualHeroBanner";
import { getLocale, getDict } from "@/lib/i18n";

export default async function MarketUpdatesHero() {
  const [locale, dict] = await Promise.all([getLocale(), getDict()]);
  const isBn = locale === "bn";
  const common = dict?.common || {};
  const market = dict?.marketUpdates || {};

  return (
    <VisualHeroBanner
      breadcrumbItems={[
        { label: common.home || (isBn ? "হোম" : "Home"), href: "/" },
        {
          label:
            dict?.navbar?.navLinks?.marketUpdates ||
            (isBn ? "এলপিজি মার্কেট আপডেট" : "LPG Market Update"),
        },
      ]}
      badge={
        market.badge ||
        (isBn
          ? "অফিশিয়াল শিল্প রেজিস্ট্রি ও মার্কেট পালস"
          : "OFFICIAL INDUSTRY REGISTRY & MARKET PULSE")
      }
      title={isBn ? "এলপিজি মার্কেট" : "LPG MARKET"}
      accent={isBn ? "আপডেট।" : "UPDATE."}
      description={
        market.subtitle ||
        (isBn
          ? "বাংলাদেশে সর্বশেষ দুর্ঘটনা রিপোর্ট, তদন্ত, স্টেকহোল্ডার ঘোষণা, বিইআরসি মূল্য বিজ্ঞপ্তি এবং বৈশ্বিক এলপিজি বাজারের প্রবণতা সম্পর্কে অবগত থাকুন।"
          : "Stay informed with the latest incident reports, inquiries, stakeholder announcements, BERC price notifications, and global LPG market trends across Bangladesh.")
      }
      imageSrc="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop"
      imageAlt="Industrial LPG Terminal and Storage Facility"
    />
  );
}

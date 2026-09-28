// src/app/(pages)/faq/_components/FaqHeroSection.jsx
"use client";

import { HelpCircle } from "lucide-react";
import CenteredHeroBanner from "@/components/ui/CenteredHeroBanner";
import { useDictionary } from "@/context/DictionaryContext";

export default function FaqHeroSection() {
  const { dict, locale } = useDictionary();
  const isBn = locale === "bn";
  const faq = dict?.faq || {};
  const common = dict?.common || {};

  return (
    <CenteredHeroBanner
      breadcrumbItems={[
        { label: common.home || (isBn ? "হোম" : "Home"), href: "/" },
        {
          label:
            dict?.footer?.resources?.faq ||
            (isBn ? "সাধারণ জিজ্ঞাসা" : "FAQ & Help Center"),
        },
      ]}
      badge={
        faq.badge ||
        (isBn
          ? "অফিসিয়াল তথ্য ও সহায়তা কেন্দ্র"
          : "OFFICIAL KNOWLEDGE & HELP CENTER")
      }
      badgeIcon={<HelpCircle className="h-3.5 w-3.5" />}
      title={faq.title || (isBn ? "সাধারণ" : "FREQUENTLY ASKED")}
      accent={faq.accent || (isBn ? "জিজ্ঞাসা।" : "QUESTIONS.")}
      description={
        faq.description ||
        (isBn
          ? "বাসাবাড়িতে এলপিজি সিলিন্ডার ব্যবহার, রেগুলেটর রক্ষণাবেক্ষণ, ডিলার কমপ্লায়েন্স এবং জরুরি প্রোটোকল সম্পর্কিত নির্ভরযোগ্য পরামর্শ।"
          : "Clear, authoritative guidance on LPG household handling, regulator maintenance, commercial compliance, and emergency protocols.")
      }
    />
  );
}

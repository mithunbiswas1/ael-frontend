// src/app/(pages)/acts-and-rules/_components/ActsHeroSection.jsx
"use client";

import { Scale } from "lucide-react";
import CenteredHeroBanner from "@/components/ui/CenteredHeroBanner";
import { useDictionary } from "@/context/DictionaryContext";

export default function ActsHeroSection() {
  const { dict, locale } = useDictionary();
  const isBn = locale === "bn";
  const acts = dict?.actsAndRules || {};
  const common = dict?.common || {};

  return (
    <CenteredHeroBanner
      breadcrumbItems={[
        { label: common.home || (isBn ? "হোম" : "Home"), href: "/" },
        {
          label:
            dict?.footer?.resources?.actsRules ||
            (isBn ? "আইন ও বিধিমালা" : "Related Acts & Rules"),
        },
      ]}
      badge={
        acts.badge ||
        (isBn
          ? "জাতীয় সংবিধিবদ্ধ ও নিয়ন্ত্রক বিধিমালা সংকলন"
          : "NATIONAL STATUTORY & REGULATORY COMPENDIUM")
      }
      badgeIcon={<Scale className="h-3.5 w-3.5" />}
      title={acts.title || (isBn ? "আইন ও" : "ACTS &")}
      accent={acts.accent || (isBn ? "বিধিমালা।" : "RULES.")}
      description={
        acts.description ||
        (isBn
          ? "বাংলাদেশে তরলীকৃত পেট্রোলিয়াম গ্যাস (এলপিজি) খাত পরিচালনাকারী সরকারি গেজেট, আইন, বিধিমালা এবং মন্ত্রণালয়ের নির্দেশনা।"
          : "Official legal gazettes, petroleum acts, explosives regulations, and ministerial directives governing the Liquefied Petroleum Gas (LPG) sector in Bangladesh.")
      }
    />
  );
}

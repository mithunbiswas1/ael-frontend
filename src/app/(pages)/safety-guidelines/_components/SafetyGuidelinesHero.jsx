// src/app/(pages)/safety-guidelines/_components/SafetyGuidelinesHero.jsx
"use client";

import VisualHeroBanner from "@/components/ui/VisualHeroBanner";
import { useDictionary } from "@/context/DictionaryContext";

export default function SafetyGuidelinesHero() {
  const { locale, dict } = useDictionary();
  const isBn = locale === "bn";
  const sg = dict?.safetyGuidelines || {};
  const common = dict?.common || {};

  return (
    <VisualHeroBanner
      breadcrumbItems={[
        { label: common.home || (isBn ? "হোম" : "Home"), href: "/" },
        {
          label:
            dict?.navbar?.navLinks?.safetyGuidelines ||
            (isBn ? "নিরাপত্তা নির্দেশিকা" : "Safety Guidelines"),
        },
      ]}
      badge={
        sg.badge ||
        (isBn
          ? "জাতীয় নিরাপত্তা প্রোটোকল"
          : "NATIONWIDE SAFETY PROTOCOLS")
      }
      title={sg.title || (isBn ? "নিরাপত্তা" : "SAFETY")}
      accent={sg.accent || (isBn ? "নির্দেশিকা।" : "GUIDELINES.")}
      description={
        sg.subtitle ||
        (isBn
          ? "সকল সেক্টরে এলপিজির নিরাপদ হ্যান্ডলিং, মজুত এবং ব্যবহারের নির্দেশিকা। বিইআরসি, বিস্ফোরক পরিদপ্তর (ডিওই) এবং ফায়ার সার্ভিসের প্রবিধানের সাথে সামঞ্জস্যপূর্ণ।"
          : "Guidelines for safe handling, storage and use of LPG across all sectors. Compliant with BERC, Department of Explosives (DoE), and Fire Service regulations.")
      }
      imageSrc="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop"
      imageAlt="LPG Storage Tanks and Cylinders"
    />
  );
}

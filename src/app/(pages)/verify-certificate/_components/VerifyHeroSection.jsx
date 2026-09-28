// src/app/(pages)/verify-certificate/_components/VerifyHeroSection.jsx
"use client";

import { ShieldCheck } from "lucide-react";
import CenteredHeroBanner from "@/components/ui/CenteredHeroBanner";
import { useDictionary } from "@/context/DictionaryContext";

export default function VerifyHeroSection() {
  const { dict, locale } = useDictionary();
  const isBn = locale === "bn";
  const cert = dict?.verifyCertificate || {};
  const common = dict?.common || {};

  return (
    <CenteredHeroBanner
      breadcrumbItems={[
        { label: common.home || (isBn ? "হোম" : "Home"), href: "/" },
        {
          label:
            dict?.navbar?.navLinks?.trainingQuiz ||
            (isBn ? "প্রশিক্ষণ ও কুইজ" : "Training & Quiz"),
          href: "/courses",
        },
        {
          label: cert.title
            ? `${cert.title} ${cert.accent || ""}`
            : isBn
            ? "সার্টিফিকেট যাচাইকরণ"
            : "Verify Certificate",
        },
      ]}
      badge={
        cert.badge ||
        (isBn ? "জাতীয় স্বীকৃত রেজিস্ট্রি" : "NATIONAL RECOGNIZED REGISTRY")
      }
      badgeIcon={<ShieldCheck className="h-3.5 w-3.5" />}
      title={cert.title || (isBn ? "সার্টিফিকেট" : "VERIFY")}
      accent={cert.accent || (isBn ? "যাচাইকরণ।" : "CERTIFICATE.")}
      description={
        cert.description ||
        (isBn
          ? "সেইফ এলপিজি, বিস্ফোরক পরিদপ্তর (ডিওই) এবং লোয়াব-এর যৌথ কার্যক্রমে প্রদত্ত সকল নিরাপত্তা সার্টিফিকেটের তাৎক্ষণিক ডিজিটাল যাচাইকরণ।"
          : "Instant digital validation for all LPG Safety & Regulatory compliance certificates issued under Safe LPG, Department of Explosives (DoE), and LOAB joint programs.")
      }
    />
  );
}

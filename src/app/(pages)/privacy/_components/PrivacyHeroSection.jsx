// src/app/(pages)/privacy/_components/PrivacyHeroSection.jsx

import { Lock } from "lucide-react";
import CenteredHeroBanner from "@/components/ui/CenteredHeroBanner";
import { getLocale, getDict } from "@/lib/i18n";

export default async function PrivacyHeroSection() {
  const [locale, dict] = await Promise.all([getLocale(), getDict()]);
  const isBn = locale === "bn";
  const common = dict?.common || {};

  return (
    <CenteredHeroBanner
      breadcrumbItems={[
        { label: common.home || (isBn ? "হোম" : "Home"), href: "/" },
        {
          label:
            dict?.footer?.resources?.privacy ||
            (isBn ? "গোপনীয়তা নীতি" : "Privacy Policy"),
        },
      ]}
      badge={
        isBn
          ? "তথ্য নিরাপত্তা ও ব্যবহারকারীর গোপনীয়তা"
          : "DATA INTEGRITY & USER CONFIDENTIALITY"
      }
      badgeIcon={<Lock className="h-3.5 w-3.5" />}
      title={isBn ? "গোপনীয়তা" : "PRIVACY"}
      accent={isBn ? "নীতিমালা।" : "POLICY."}
      description={
        isBn
          ? "সেইফ এলপিজি কীভাবে ব্যক্তিগত প্রশিক্ষণের রেকর্ড, সার্টিফিকেট এবং দুর্ঘটনা সংক্রান্ত তথ্য নিরাপদে সংরক্ষণ ও পরিচালনা করে।"
          : "How Safe LPG collects, stores, and safeguards personal training records, certification credentials, and incident reports in accordance with statutory digital standards."
      }
    />
  );
}

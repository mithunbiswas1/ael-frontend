// src/app/(pages)/terms/_components/TermsHeroSection.jsx

import { Scale } from "lucide-react";
import CenteredHeroBanner from "@/components/ui/CenteredHeroBanner";
import { getLocale, getDict } from "@/lib/i18n";

export default async function TermsHeroSection() {
  const [locale, dict] = await Promise.all([getLocale(), getDict()]);
  const isBn = locale === "bn";
  const common = dict?.common || {};

  return (
    <CenteredHeroBanner
      breadcrumbItems={[
        { label: common.home || (isBn ? "হোম" : "Home"), href: "/" },
        {
          label:
            dict?.footer?.resources?.terms ||
            (isBn ? "ব্যবহারের শর্তাবলী" : "Terms of Use"),
        },
      ]}
      badge={isBn ? "ব্যবহারের শর্তাবলী ও নীতিমালা" : "TERMS & USER CONDUCT AGREEMENT"}
      badgeIcon={<Scale className="h-3.5 w-3.5" />}
      title={isBn ? "ব্যবহারের" : "TERMS OF"}
      accent={isBn ? "শর্তাবলী।" : "SERVICE."}
      description={
        isBn
          ? "সেইফ এলপিজি প্ল্যাটফর্ম ব্যবহার, সার্টিফিকেট ইস্যু এবং শিক্ষামূলক কনটেন্ট ব্যবহারের ক্ষেত্রে প্রযোজ্য নিয়মাবলী।"
          : "Statutory conditions governing portal access, certification issuance, educational content utilization, and subscriber obligations."
      }
    />
  );
}

import { Suspense } from "react";
import VerifyCertificateContent from "./_view/VerifyCertificateContent";
import { getLocale } from "@/lib/i18n";
import { getPageContent } from "@/next-api/getPageContent";

export async function generateMetadata() {
  const locale = await getLocale();
  if (locale === "bn") {
    return {
      title: "সার্টিফিকেট যাচাইকরণ | জাতীয় নিরাপত্তা রেজিস্ট্রি বাংলাদেশ",
      description:
        "সেইফ এলপিজি, বিস্ফোরক পরিদপ্তর এবং লোয়াব-এর যৌথ কার্যক্রমে প্রদত্ত সকল নিরাপত্তা সার্টিফিকেটের তাৎক্ষণিক ডিজিটাল যাচাইকরণ।",
    };
  }
  return {
    title: "Verify Certificate | National Recognized Registry Bangladesh",
    description:
      "Instant digital validation for all LPG Safety & Regulatory compliance certificates issued under Safe LPG, Department of Explosives (DoE), and LOAB joint programs.",
  };
}

export default async function VerifyCertificatePage() {
  const [locale, pageCms] = await Promise.all([
    getLocale(),
    getPageContent("verify-certificate"),
  ]);

  const bannerData = pageCms?.banner;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-xs font-bold text-slate-500 animate-pulse">
            {locale === "bn"
              ? "সার্টিফিকেট যাচাইকরণ লোড হচ্ছে..."
              : "Loading Certificate Verification..."}
          </div>
        </div>
      }
    >
      <VerifyCertificateContent bannerData={bannerData} />
    </Suspense>
  );
}

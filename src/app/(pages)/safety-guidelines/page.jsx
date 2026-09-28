import { Suspense } from "react";
import VisualHeroBanner from "@/components/ui/VisualHeroBanner";
import SafetyGuidelinesContent from "./_view/SafetyGuidelinesContent";
import { getLocale } from "@/lib/i18n";
import { getPageContent } from "@/next-api/getPageContent";

export async function generateMetadata() {
  const locale = await getLocale();
  if (locale === "bn") {
    return {
      title: "নিরাপত্তা নির্দেশিকা | দেশব্যাপী এলপিজি নিরাপত্তা প্রোটোকল",
      description:
        "সকল খাতের জন্য এলপিজির নিরাপদ ব্যবহার ও মজুতকরণের নির্দেশিকা। বিইআরসি এবং বিস্ফোরক পরিদপ্তর কর্তৃক নির্ধারিত মানদণ্ড।",
    };
  }
  return {
    title: "Safety Guidelines | Nationwide LPG Safety Protocols Bangladesh",
    description:
      "Guidelines for safe handling, storage and use of LPG across all sectors. Compliant with BERC, Department of Explosives (DoE), and Fire Service regulations.",
  };
}

export default async function SafetyGuidelinesPage() {
  const [locale, pageCms] = await Promise.all([
    getLocale(),
    getPageContent("safety-guidelines"),
  ]);

  const bannerData = pageCms?.banner;

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-xs font-bold text-slate-500 animate-pulse">
            {locale === "bn"
              ? "নিরাপত্তা নির্দেশিকা লোড হচ্ছে..."
              : "Loading Safety Guidelines..."}
          </div>
        </div>
      }
    >
      <VisualHeroBanner data={bannerData} />
      <SafetyGuidelinesContent sections={pageCms?.sections} />
    </Suspense>
  );
}

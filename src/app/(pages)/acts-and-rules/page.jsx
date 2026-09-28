

import CenteredHeroBanner from "@/components/ui/CenteredHeroBanner";
import ActsLibrarySection from "./_components/ActsLibrarySection";
import { getLocale } from "@/lib/i18n";
import { getPageContent } from "@/next-api/getPageContent";

export async function generateMetadata() {
  const locale = await getLocale();
  if (locale === "bn") {
    return {
      title: "আইন ও বিধিমালা | জাতীয় এলপিজি সংবিধিবদ্ধ সংকলন",
      description:
        "বাংলাদেশে তরলীকৃত পেট্রোলিয়াম গ্যাস (এলপিজি) খাত পরিচালনাকারী সরকারি গেজেট, পেট্রোলিয়াম আইন, বিস্ফোরক বিধিমালা এবং নির্দেশিকা।",
    };
  }
  return {
    title: "Related Acts & Rules | LPG Statutory Compendium Bangladesh",
    description:
      "Official legal gazettes, petroleum acts, explosives regulations, and ministerial directives governing the LPG sector in Bangladesh.",
  };
}

export default async function ActsAndRulesPage() {
  const locale = await getLocale();
  const isBn = locale === "bn";
  const { banner, contentHtml, contentHtmlBn, sections } = await getPageContent("acts-and-rules");

  const displayDescription = isBn && contentHtmlBn ? contentHtmlBn : contentHtml;

  return (
    <main className="min-h-screen bg-slate-50">
      <CenteredHeroBanner data={banner} />

      {displayDescription && (
        <section className="relative z-20 -mt-6 mx-auto w-full max-w-5xl px-4">
          <div className="rounded-xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xs mb-6">
            <div
              className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: displayDescription }}
            />
          </div>
        </section>
      )}

      <ActsLibrarySection gazettes={sections?.gazettes} />
    </main>
  );
}


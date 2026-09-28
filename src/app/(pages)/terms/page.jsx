// src/app/(pages)/terms/page.jsx
import CenteredHeroBanner from "@/components/ui/CenteredHeroBanner";
import TermsContentSection from "./_components/TermsContentSection";
import { getLocale } from "@/lib/i18n";
import { getPageContent } from "@/next-api/getPageContent";

export const metadata = {
  title: "Terms of Use | Safe LPG Platform",
  description:
    "Terms and conditions governing LMS training participation, certificate verification, and user conduct.",
};

export default async function TermsOfUsePage() {
  const locale = await getLocale();
  const isBn = locale === "bn";
  const { banner, contentHtml, contentHtmlBn } = await getPageContent("terms");
  const displayHtml = isBn && contentHtmlBn ? contentHtmlBn : contentHtml;

  return (
    <main className="min-h-screen bg-slate-50">
      <CenteredHeroBanner data={banner} />
      {displayHtml ? (
        <section className="relative z-20 -mt-8 mx-auto w-full max-w-4xl px-4 pb-20">
          <div className="rounded-xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-2xs">
            <div
              className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: displayHtml }}
            />
          </div>
        </section>
      ) : (
        <TermsContentSection />
      )}
    </main>
  );
}


// src/app/(pages)/faq/page.jsx
import FaqHeroSection from "./_components/FaqHeroSection";
import FaqAccordionSection from "./_components/FaqAccordionSection";

export const metadata = {
  title: "Frequently Asked Questions | FAQ & Help Center | LPG Safety Bangladesh",
  description:
    "Authoritative guidance on LPG household handling, regulator maintenance, commercial compliance, and emergency protocols in Bangladesh.",
};

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <FaqHeroSection />
      <FaqAccordionSection />
    </main>
  );
}

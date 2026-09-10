// src/app/(pages)/acts-and-rules/page.jsx
import ActsHeroSection from "./_components/ActsHeroSection";
import ActsLibrarySection from "./_components/ActsLibrarySection";

export const metadata = {
  title: "Related Acts & Rules | LPG Statutory Compendium Bangladesh",
  description:
    "Official legal gazettes, petroleum acts, explosives regulations, and ministerial directives governing the LPG sector in Bangladesh.",
};

export default function ActsAndRulesPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <ActsHeroSection />
      <ActsLibrarySection />
    </main>
  );
}

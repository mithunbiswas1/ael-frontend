// src/app/(pages)/acts-and-rules/page.jsx
import { Scale } from "lucide-react";
import SharedHeroSection from "@/components/shared/SharedHeroSection";
import ActsLibrarySection from "./_components/ActsLibrarySection";

export const metadata = {
  title: "Related Acts & Rules | LPG Statutory Compendium Bangladesh",
  description:
    "Official legal gazettes, petroleum acts, explosives regulations, and ministerial directives governing the LPG sector in Bangladesh.",
};

export default function ActsAndRulesPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SharedHeroSection
        variant="others"
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Related Acts & Rules" },
        ]}
        title="ACTS &"
        accent="RULES."
        description="Official legal gazettes, petroleum acts, explosives regulations, and ministerial directives governing the Liquefied Petroleum Gas (LPG) sector in Bangladesh."
      />
      <ActsLibrarySection />
    </main>
  );
}

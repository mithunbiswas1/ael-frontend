// src/app/(pages)/faq/page.jsx
import { HelpCircle } from "lucide-react";
import SharedHeroSection from "@/components/shared/SharedHeroSection";
import FaqAccordionSection from "./_components/FaqAccordionSection";

export const metadata = {
  title: "Frequently Asked Questions | FAQ & Help Center | LPG Safety Bangladesh",
  description:
    "Authoritative guidance on LPG household handling, regulator maintenance, commercial compliance, and emergency protocols in Bangladesh.",
};

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SharedHeroSection
        variant="others"
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "FAQ & Help Center" },
        ]}
        title="FREQUENTLY ASKED"
        accent="QUESTIONS."
        description="Clear, authoritative guidance on LPG household handling, regulator maintenance, commercial compliance, and emergency protocols."
      />
      <FaqAccordionSection />
    </main>
  );
}

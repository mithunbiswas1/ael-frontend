// src/app/(pages)/terms/page.jsx
import { Scale } from "lucide-react";
import SharedHeroSection from "@/components/shared/SharedHeroSection";
import TermsContentSection from "./_components/TermsContentSection";

export const metadata = {
  title: "Terms of Use | Safe LPG Platform",
  description: "Terms and conditions governing LMS training participation, certificate verification, and user conduct.",
};

export default function TermsOfUsePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SharedHeroSection
        variant="others"
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Terms of Use" },
        ]}
        title="TERMS OF"
        accent="SERVICE."
        description="Statutory conditions governing portal access, certification issuance, educational content utilization, and subscriber obligations."
      />
      <TermsContentSection />
    </main>
  );
}

// src/app/(pages)/privacy/page.jsx
import { Lock } from "lucide-react";
import SharedHeroSection from "@/components/shared/SharedHeroSection";
import PrivacyContentSection from "./_components/PrivacyContentSection";

export const metadata = {
  title: "Privacy Policy | Safe LPG Platform",
  description: "Official privacy statement, data protection principles, and learner confidentiality protocols.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SharedHeroSection
        variant="others"
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Privacy Policy" },
        ]}
        title="PRIVACY"
        accent="POLICY."
        description="How Safe LPG collects, stores, and safeguards personal training records, certification credentials, and incident reports in accordance with statutory digital standards."
      />
      <PrivacyContentSection />
    </main>
  );
}

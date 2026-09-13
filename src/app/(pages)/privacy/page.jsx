// src/app/(pages)/privacy/page.jsx
import PrivacyHeroSection from "./_components/PrivacyHeroSection";
import PrivacyContentSection from "./_components/PrivacyContentSection";

export const metadata = {
  title: "Privacy Policy | Safe LPG Platform",
  description: "Official privacy statement, data protection principles, and learner confidentiality protocols.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <PrivacyHeroSection />
      <PrivacyContentSection />
    </main>
  );
}

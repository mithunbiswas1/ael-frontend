// src/app/(pages)/terms/page.jsx
import TermsHeroSection from "./_components/TermsHeroSection";
import TermsContentSection from "./_components/TermsContentSection";

export const metadata = {
  title: "Terms of Use | Safe LPG Platform",
  description: "Terms and conditions governing LMS training participation, certificate verification, and user conduct.",
};

export default function TermsOfUsePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <TermsHeroSection />
      <TermsContentSection />
    </main>
  );
}

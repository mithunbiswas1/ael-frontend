// src/app/(pages)/verify-certificate/_components/VerifyCertificateContent.jsx
import VerifyHeroSection from "./VerifyHeroSection";
import VerifyCertificateInteractive from "../_client/VerifyCertificateInteractive";

export default function VerifyCertificateContent() {
  return (
    <main className="min-h-screen bg-slate-50">
      <VerifyHeroSection />
      <VerifyCertificateInteractive />
    </main>
  );
}

// src/app/(pages)/verify-certificate/_components/VerifyCertificateContent.jsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ShieldCheck } from "lucide-react";
import SharedHeroSection from "@/components/shared/SharedHeroSection";
import VerifyFormSection, { VERIFIED_CERTIFICATES } from "./VerifyFormSection";

export default function VerifyCertificateContent() {
  const searchParams = useSearchParams();
  const urlCertId = searchParams.get("certId") || "";

  const [inputCertId, setInputCertId] = useState(urlCertId || "CERT-LPG-1-2024");
  const [result, setResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const performVerification = (idToVerify) => {
    const cleanId = (idToVerify || "").trim().toUpperCase();
    if (!cleanId) {
      toast.error("Please enter a Certificate ID.");
      return;
    }

    setHasSearched(true);
    const found = VERIFIED_CERTIFICATES[cleanId];

    if (found) {
      setResult(found);
      toast.success(`Valid Certificate Found: ${found.id}`);
    } else {
      setResult(null);
      toast.error("Certificate not found in central registry.");
    }
  };

  useEffect(() => {
    if (urlCertId) {
      performVerification(urlCertId);
    }
  }, [urlCertId]);

  return (
    <main className="min-h-screen bg-slate-50">
      <SharedHeroSection
        variant="others"
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Training & Quiz", href: "/courses" },
          { label: "Verify Certificate" },
        ]}
        title="VERIFY"
        accent="CERTIFICATE."
        description="Instant digital validation for all LPG Safety & Regulatory compliance certificates issued under Safe LPG, Department of Explosives (DoE), and LOAB joint programs."
      />

      <section className="py-12 sm:py-16">
        <div className="site-container max-w-4xl mx-auto">
          <VerifyFormSection
            inputCertId={inputCertId}
            setInputCertId={setInputCertId}
            onSearch={() => performVerification(inputCertId)}
            result={result}
            hasSearched={hasSearched}
          />
        </div>
      </section>
    </main>
  );
}

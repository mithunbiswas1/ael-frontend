// src/app/(pages)/verify-certificate/_components/VerifyCertificateContent.jsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import VerifyHeroSection from "./VerifyHeroSection";
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
      <VerifyHeroSection />
      <VerifyFormSection
        inputCertId={inputCertId}
        setInputCertId={setInputCertId}
        result={result}
        hasSearched={hasSearched}
        performVerification={performVerification}
      />
    </main>
  );
}

// src/app/(pages)/verify-certificate/_view/VerifyCertificateContent.jsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import CenteredHeroBanner from "@/components/ui/CenteredHeroBanner";
import VerifyFormSection from "../_components/VerifyFormSection";
import { verifyCertificateOnline } from "@/next-api/getCertificates";

export default function VerifyCertificateContent({ bannerData }) {
  const searchParams = useSearchParams();
  const urlCertId = searchParams.get("certId") || "";

  const [inputCertId, setInputCertId] = useState(urlCertId || "CERT-LPG-1-2024");
  const [result, setResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const performVerification = async (idToVerify) => {
    const cleanId = (idToVerify || "").trim().toUpperCase();
    if (!cleanId) {
      toast.error("Please enter a Certificate ID.");
      return;
    }

    setHasSearched(true);
    const found = await verifyCertificateOnline(cleanId);

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
      {/* 1. Centered Hero Banner passed from page */}
      {bannerData && <CenteredHeroBanner data={bannerData} />}

      {/* 2. Verification Form & Result */}
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

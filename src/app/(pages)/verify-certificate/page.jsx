// src/app/(pages)/verify-certificate/page.jsx
"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Search,
  Award,
  Calendar,
  CheckCircle2,
  XCircle,
  Download,
  Building,
  User,
  ExternalLink,
  QrCode,
  Share2,
} from "lucide-react";
import { toast } from "sonner";
import { H1, H2, H3, P } from "@/components/ui/Typography";
import AmbientGlow from "@/components/ui/AmbientGlow";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Input from "@/components/ui/Input";

const VERIFIED_CERTIFICATES = {
  "CERT-LPG-1-2024": {
    id: "CERT-LPG-1-2024",
    studentName: "Mohammad Tanvir Ahmed",
    courseTitle: "LPG Safety for Regular Consumers",
    issueDate: "May 20, 2024",
    validTill: "Lifetime Validity",
    grade: "Pass (92%)",
    status: "Verified & Valid",
    authorizedBy: "Engr. Mahmudul Hasan (DoE Lead Auditor)",
    issuingAuthority: "AEL in collaboration with Department of Explosives (DoE) & LOAB",
  },
  "CERT-LPG-2-2024": {
    id: "CERT-LPG-2-2024",
    studentName: "Abdur Rahim Khan",
    courseTitle: "LPG Dealer Safety & Regulatory Compliance",
    issueDate: "May 15, 2024",
    validTill: "May 15, 2027 (3 Years Renewal)",
    grade: "Distinction (96%)",
    status: "Verified & Valid",
    authorizedBy: "Sharmin Sultana (LOAB Compliance)",
    issuingAuthority: "AEL Regulatory Training Division",
  },
  "CERT-LPG-4-2024": {
    id: "CERT-LPG-4-2024",
    studentName: "Engr. Farhana Yasmin",
    courseTitle: "LPG Safety for High-Pressure Industrial Use",
    issueDate: "May 08, 2024",
    validTill: "May 08, 2026 (2 Years Industrial Validity)",
    grade: "Certified Safety Engineer (88%)",
    status: "Verified & Valid",
    authorizedBy: "Dr. Kazi Ariful Islam (BUET / Safety Consultant)",
    issuingAuthority: "AEL Industrial Safety Council",
  },
};

function VerifyCertificateContent() {
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
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 pb-16 pt-10 text-white">
        <AmbientGlow />

        <div className="site-container relative z-10 text-center max-w-3xl mx-auto">
          <Breadcrumb
            dark
            items={[
              { label: "Home", href: "/" },
              { label: "Training & Quiz", href: "/courses" },
              { label: "Verify Certificate" },
            ]}
            className="justify-center mb-3"
          />

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-blue-400 backdrop-blur-md">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>NATIONAL RECOGNIZED REGISTRY</span>
          </div>

          <H1 color="white" className="leading-tight">
            <span>VERIFY</span>{" "}
            <span className="text-primary">CERTIFICATE.</span>
          </H1>

          <P className="mt-3 text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Instant digital validation for all LPG Safety & Regulatory compliance certificates issued
            under AEL, Department of Explosives (DoE), and LOAB joint programs.
          </P>
        </div>
      </section>

      {/* 2. Verification Form Card */}
      <section className="relative z-20 -mt-8 mx-auto w-full max-w-2xl px-4 pb-20">
        <div className="rounded-xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-md">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Enter Certificate Number or Scan QR
          </label>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <Input
              placeholder="e.g. CERT-LPG-1-2024"
              value={inputCertId}
              onChange={(e) => setInputCertId(e.target.value)}
              prefix={<Search className="h-4 w-4 text-slate-400" />}
              size="md"
              className="bg-slate-50/70"
            />

            <button
              onClick={() => performVerification(inputCertId)}
              className="rounded-lg bg-primary px-6 py-2.5 text-xs font-bold text-white hover:bg-primary/90 transition-colors shadow-xs shrink-0 flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Verify Now</span>
            </button>
          </div>

          {/* Quick Click Sample IDs */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
            <span>Try sample IDs:</span>
            {Object.keys(VERIFIED_CERTIFICATES).map((key) => (
              <button
                key={key}
                onClick={() => {
                  setInputCertId(key);
                  performVerification(key);
                }}
                className="rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700 hover:bg-slate-200 transition-colors"
              >
                {key}
              </button>
            ))}
          </div>

          {/* Result Area */}
          {hasSearched && (
            <div className="mt-8 border-t border-slate-100 pt-6">
              {result ? (
                /* Valid Certificate Card */
                <div className="overflow-hidden rounded-xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-50/50 via-white to-emerald-50/20 p-6 shadow-xs">
                  <div className="flex items-start justify-between gap-3 border-b border-emerald-100 pb-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-xs">
                        <Award className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-black text-emerald-800 uppercase tracking-wider mb-0.5">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                          <span>{result.status}</span>
                        </div>
                        <h2 className="text-base font-bold text-slate-900">
                          {result.studentName}
                        </h2>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-mono">
                        ID: {result.id}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">
                        Course Program
                      </span>
                      <span className="text-slate-900 font-semibold mt-0.5 block">
                        {result.courseTitle}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">
                        Assessment Result
                      </span>
                      <span className="text-emerald-700 font-bold mt-0.5 block">
                        {result.grade}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">
                        Date of Issue
                      </span>
                      <span className="text-slate-800 font-medium mt-0.5 block">
                        {result.issueDate}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">
                        Validity Period
                      </span>
                      <span className="text-slate-800 font-medium mt-0.5 block">
                        {result.validTill}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-emerald-100 text-[11px] text-slate-600">
                    <span className="font-bold text-slate-800">Issuing Body:</span>{" "}
                    <span>{result.issuingAuthority}</span>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-emerald-100/70">
                    <button
                      onClick={() =>
                        toast.success(`Downloading verified PDF for ${result.id}...`)
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download Official PDF</span>
                    </button>

                    <Link
                      href="/courses"
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      Explore Other Safety Certifications →
                    </Link>
                  </div>
                </div>
              ) : (
                /* Not Found Card */
                <div className="rounded-xl border border-red-200 bg-red-50/50 p-6 text-center">
                  <XCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
                  <h2 className="text-sm font-bold text-slate-900">
                    Certificate Not Found
                  </h2>
                  <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                    We could not find any active or verified certificate matching ID{" "}
                    <strong className="text-red-600 font-mono">{inputCertId}</strong>. Please
                    double check the spelling or contact support.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default function VerifyCertificatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="flex items-center gap-3 text-slate-600 font-semibold text-sm">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span>Loading Certificate Registry...</span>
          </div>
        </div>
      }
    >
      <VerifyCertificateContent />
    </Suspense>
  );
}

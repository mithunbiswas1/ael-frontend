"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, ShieldCheck, Award, CheckCircle2, Download } from "lucide-react";
import { toast } from "sonner";
import Input from "@/components/ui/Input";

export const VERIFIED_CERTIFICATES = {
  "CERT-LPG-1-2024": {
    id: "CERT-LPG-1-2024",
    studentName: "Mohammad Tanvir Ahmed",
    courseTitle: "LPG Safety for Regular Consumers",
    issueDate: "May 20, 2024",
    validTill: "Lifetime Validity",
    grade: "Pass (92%)",
    status: "Verified & Valid",
    authorizedBy: "Engr. Mahmudul Hasan (DoE Lead Auditor)",
    issuingAuthority: "Safe LPG in collaboration with Department of Explosives (DoE) & LOAB",
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
    issuingAuthority: "Safe LPG Regulatory Training Division",
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
    issuingAuthority: "Safe LPG Industrial Safety Council",
  },
};

export default function VerifyCertificateInteractive() {
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
    <section className="relative z-20 -mt-8 mx-auto w-full max-w-2xl px-4 pb-20">
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-8 shadow-md">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          Enter Certificate Number or Scan QR
        </label>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <Input
            type="text"
            placeholder="e.g. CERT-LPG-1-2024"
            value={inputCertId}
            onChange={(e) => setInputCertId(e.target.value)}
            className="flex-1"
          />
          <button
            onClick={() => performVerification(inputCertId)}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-xs font-bold text-white hover:bg-blue-700 shadow-xs transition-colors"
          >
            <Search className="h-4 w-4" />
            <span>Verify</span>
          </button>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
          <span>Try sample IDs:</span>
          {Object.keys(VERIFIED_CERTIFICATES).map((cid) => (
            <button
              key={cid}
              onClick={() => {
                setInputCertId(cid);
                performVerification(cid);
              }}
              className="font-mono font-semibold text-primary underline hover:text-blue-700"
            >
              {cid}
            </button>
          ))}
        </div>

        {/* Verification Result State */}
        {hasSearched && (
          <div className="mt-8 border-t border-slate-100 pt-6 animate-in fade-in duration-200">
            {result ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5 sm:p-6">
                <div className="flex items-center justify-between border-b border-emerald-200/60 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-emerald-900">
                        {result.status}
                      </h3>
                      <p className="text-[10px] text-emerald-700 font-mono">
                        ID: {result.id}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-md bg-emerald-600 px-2.5 py-1 text-[10px] font-black uppercase text-white shadow-2xs">
                    {result.grade}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                      Student / Delegate Name
                    </span>
                    <span className="font-bold text-slate-900 text-sm">
                      {result.studentName}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                      Course Curriculum
                    </span>
                    <span className="font-bold text-slate-900">
                      {result.courseTitle}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                      Issue Date
                    </span>
                    <span className="text-slate-800">{result.issueDate}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                      Validity Period
                    </span>
                    <span className="text-slate-800">{result.validTill}</span>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-slate-500 block text-[10px] uppercase font-semibold">
                      Authorized Auditor
                    </span>
                    <span className="text-slate-800">{result.authorizedBy}</span>
                  </div>

                  <div className="sm:col-span-2 border-t border-emerald-200/60 pt-2 text-[10px] text-emerald-800">
                    Authority: {result.issuingAuthority}
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-emerald-200/60 pt-4">
                  <button
                    onClick={() =>
                      toast.success(`Downloading PDF certificate for ${result.id}...`)
                    }
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-800 transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download Official PDF</span>
                  </button>
                  <Link
                    href="/courses"
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline"
                  >
                    View All Academy Courses
                  </Link>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
                <ShieldCheck className="h-10 w-10 text-red-400 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-red-900">
                  Certificate Not Found
                </h3>
                <p className="mt-1 text-xs text-red-700 max-w-md mx-auto">
                  The ID &quot;{inputCertId}&quot; could not be verified in the national database. Please verify the registration number printed on your paper certificate.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

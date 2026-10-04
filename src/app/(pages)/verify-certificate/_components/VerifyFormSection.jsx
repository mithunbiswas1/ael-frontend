// src/app/(pages)/verify-certificate/_components/VerifyFormSection.jsx
"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Search,
  ShieldCheck,
  Award,
  CheckCircle2,
  Download,
  Image as ImageIcon,
} from "lucide-react";
import { toast } from "sonner";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useDictionary } from "@/context/DictionaryContext";
import CertificateDocument from "@/components/shared/CertificateDocument";
import { downloadCertificateAsImage } from "@/lib/certificateExporter";
import { cn } from "@/lib/cn";

export const VERIFIED_CERTIFICATES = {
  "CERT-LPG-524": {
    id: "CERT-LPG-524",
    certificateId: "CERT-LPG-524",
    studentName: "wwww",
    studentNameBn: "ww",
    courseTitle:
      "Comprehensive LPG Cylinder Safety, Handling & Emergency Response",
    courseTitleBn: "এলপিজি সিলিন্ডার ব্যবহার, হ্যান্ডলিং ও জরুরি নিরাপত্তা",
    issueDate: "Oct 1, 2026",
    issueDateBn: "১/১০/২০২৬",
    validTill: "Lifetime Validity",
    validTillBn: "আজীবন মেয়াদ",
    grade: "Pass (90%)",
    status: "Verified & Valid",
    authorizedBy: "Engr. Mahmudul Hasan (DoE Lead Auditor)",
    issuingAuthority:
      "Safe LPG in collaboration with Department of Explosives (DoE) & LOAB",
  },
  "CERT-LPG-1-2024": {
    id: "CERT-LPG-1-2024",
    certificateId: "CERT-LPG-1-2024",
    studentName: "Mohammad Tanvir Ahmed",
    studentNameBn: "মোহাম্মদ তানভীর আহমেদ",
    courseTitle: "LPG Safety for Regular Consumers",
    courseTitleBn: "সাধারণ ভোক্তাদের জন্য এলপিজি নিরাপত্তা",
    issueDate: "May 20, 2024",
    issueDateBn: "২০ মে, ২০২৪",
    validTill: "Lifetime Validity",
    validTillBn: "আজীবন মেয়াদ",
    grade: "Pass (92%)",
    status: "Verified & Valid",
    authorizedBy: "Engr. Mahmudul Hasan (DoE Lead Auditor)",
    issuingAuthority:
      "Safe LPG in collaboration with Department of Explosives (DoE) & LOAB",
  },
  "CERT-LPG-2-2024": {
    id: "CERT-LPG-2-2024",
    certificateId: "CERT-LPG-2-2024",
    studentName: "Abdur Rahim Khan",
    studentNameBn: "আব্দুর রহিম খান",
    courseTitle: "LPG Dealer Safety & Regulatory Compliance",
    courseTitleBn: "এলপিজি ডিলার নিরাপত্তা ও নিয়ন্ত্রক সম্মতি",
    issueDate: "May 15, 2024",
    issueDateBn: "১৫ মে, ২০২৪",
    validTill: "May 15, 2027 (3 Years Renewal)",
    validTillBn: "১৫ মে, ২০২৭ (৩ বছর মেয়াদ)",
    grade: "Distinction (96%)",
    status: "Verified & Valid",
    authorizedBy: "Sharmin Sultana (LOAB Compliance)",
    issuingAuthority: "Safe LPG Regulatory Training Division",
  },
  "CERT-LPG-4-2024": {
    id: "CERT-LPG-4-2024",
    certificateId: "CERT-LPG-4-2024",
    studentName: "Engr. Farhana Yasmin",
    studentNameBn: "প্রকৌশলী ফারহানা ইয়াসমিন",
    courseTitle: "LPG Safety for High-Pressure Industrial Use",
    courseTitleBn: "শিল্পে উচ্চচাপ এলপিজি ব্যবহারের সার্বিক নিরাপত্তা",
    issueDate: "May 08, 2024",
    issueDateBn: "০৮ মে, ২০২৪",
    validTill: "May 08, 2026 (2 Years Industrial Validity)",
    validTillBn: "০৮ মে, ২০২৬ (২ বছর শিল্প মেয়াদ)",
    grade: "Certified Safety Engineer (88%)",
    status: "Verified & Valid",
    authorizedBy: "Dr. Kazi Ariful Islam (BUET / Safety Consultant)",
    issuingAuthority: "Safe LPG Industrial Safety Council",
  },
};

export default function VerifyFormSection({
  inputCertId,
  setInputCertId,
  result,
  hasSearched,
  performVerification,
}) {
  const { locale, dict } = useDictionary();
  const isBn = locale === "bn";
  const cert = dict?.verifyCertificate || {};

  const certDocRef = useRef(null);
  const [isExportingImage, setIsExportingImage] = useState(false);

  const handleDownloadImage = async () => {
    if (!certDocRef.current || !result) {
      toast.error(
        isBn
          ? "সার্টিফিকেট ডকুমেন্ট প্রস্তুত হয়নি।"
          : "Certificate document element is not ready."
      );
      return;
    }

    setIsExportingImage(true);
    try {
      const recipient = (
        result.studentName ||
        result.recipientName ||
        "recipient"
      ).replace(/[^a-zA-Z0-9]/g, "_");
      const certId = (result.certificateId || result.id || "AEL").replace(
        /[^a-zA-Z0-9]/g,
        "_"
      );
      const filename = `Certificate-${certId}-${recipient}`;
      await downloadCertificateAsImage(certDocRef.current, filename);
    } catch (err) {
      console.error("[handleDownloadImage]", err);
      toast.error(
        isBn
          ? "ইমেজ ডাউনলোড ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।"
          : "Failed to download certificate image. Please try again."
      );
    } finally {
      setIsExportingImage(false);
    }
  };

  return (
    <section
      className={cn(
        "relative z-20 -mt-8 mx-auto w-full px-4 pb-20 transition-all duration-300",
        result ? "max-w-5xl" : "max-w-2xl"
      )}
    >
      <div className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-8 shadow-md">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
          {isBn
            ? "সার্টিফিকেট নম্বর প্রবেশ করান বা কিউআর কোড স্ক্যান করুন"
            : "Enter Certificate Number or Scan QR"}
        </label>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <Input
            placeholder={
              cert.inputPlaceholder ||
              "Enter 10-digit Certificate ID (e.g. CERT-LPG-524)"
            }
            value={inputCertId}
            onChange={(e) => setInputCertId(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") performVerification(inputCertId);
            }}
            prefix={<Search className="h-4 w-4 text-slate-400" />}
            size="md"
            className="flex-1"
          />

          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={() => performVerification(inputCertId)}
            icon={ShieldCheck}
            className="whitespace-nowrap cursor-pointer"
          >
            {cert.verifyBtn || (isBn ? "যাচাই করুন" : "Verify Certificate")}
          </Button>
        </div>

        {/* Verification Result Card */}
        {hasSearched && (
          <div className="mt-6 border-t border-slate-100 pt-6">
            {result ? (
              <div className="space-y-6">
                {/* 1. Status Verification Card */}
                <div className="rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-b from-emerald-50/50 to-white p-6 shadow-lg animate-in fade-in duration-200">
                  {/* Header Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-200/80 pb-4">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      <span>
                        {isBn
                          ? "সরকারি স্বীকৃতিপ্রাপ্ত ও বৈধ সার্টিফিকেট"
                          : "VERIFIED & VALID CERTIFICATE"}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold bg-white border border-emerald-300 px-3 py-1 rounded-md text-emerald-900 shadow-2xs">
                      {result.id || result.certificateId}
                    </span>
                  </div>

                  {/* Certificate Content + QR Code */}
                  <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                    <div className="md:col-span-2 space-y-3.5 text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                          {isBn ? "অংশগ্রহণকারীর নাম:" : "Issued To:"}
                        </span>
                        <strong className="text-slate-900 text-base font-bold">
                          {isBn
                            ? result.studentNameBn || result.studentName
                            : result.studentName}
                        </strong>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                          {isBn ? "কোর্সের নাম:" : "Course Title:"}
                        </span>
                        <strong className="text-slate-900 text-sm font-semibold">
                          {isBn
                            ? result.courseTitleBn || result.courseTitle
                            : result.courseTitle}
                        </strong>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-1">
                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                            {isBn ? "ইস্যুর তারিখ:" : "Date of Issue:"}
                          </span>
                          <span className="text-slate-700 font-medium">
                            {isBn
                              ? result.issueDateBn || result.issueDate
                              : result.issueDate}
                          </span>
                        </div>

                        <div>
                          <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                            {isBn ? "বৈধতার মেয়াদ:" : "Validity Status:"}
                          </span>
                          <span className="text-emerald-700 font-bold">
                            {isBn
                              ? result.validTillBn || result.validTill
                              : result.validTill}
                          </span>
                        </div>
                      </div>

                      <div className="pt-1">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                          {isBn
                            ? "অনুমোদনকারী কর্তৃপক্ষ:"
                            : "Issuing Authority:"}
                        </span>
                        <span className="text-slate-600 text-[11px] leading-relaxed">
                          {result.issuingAuthority || result.authorizedBy}
                        </span>
                      </div>
                    </div>

                    {/* Dynamic QR Code */}
                    <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-white border border-slate-200/80 shadow-2xs text-center">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=${encodeURIComponent(
                          typeof window !== "undefined"
                            ? `${window.location.origin}/verify-certificate?id=${
                                result.certificateId || result.id
                              }`
                            : `http://localhost:3000/verify-certificate?id=${
                                result.certificateId || result.id
                              }`
                        )}`}
                        alt="Certificate Verification QR Code"
                        className="h-28 w-28 rounded-lg border border-slate-100 object-contain"
                        loading="lazy"
                        crossOrigin="anonymous"
                      />
                      <span className="mt-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        {isBn ? "যাচাইকরণ কিউআর" : "Scan to Verify"}
                      </span>
                      <span className="text-[9px] text-slate-400 font-mono">
                        {result.certificateId || result.id}
                      </span>
                    </div>
                  </div>

                  {/* Verification Actions Bar */}
                  <div className="mt-6 pt-4 border-t border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <span className="text-[11px] text-slate-500">
                      {isBn ? "স্বাক্ষর:" : "Authorized Signature:"}{" "}
                      <strong className="text-slate-700">
                        {result.authorizedBy}
                      </strong>
                    </span>

                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={handleDownloadImage}
                      isLoading={isExportingImage}
                      disabled={isExportingImage}
                      icon={Download}
                      className="bg-[#7C481A] hover:bg-[#5C3411] text-white shadow-xs font-bold text-xs"
                    >
                      <span>
                        {isExportingImage
                          ? isBn
                            ? "ইমেজ তৈরি হচ্ছে..."
                            : "Generating Image..."
                          : isBn
                          ? "সার্টিফিকেট ডাউনলোড (ছবি)"
                          : "Download Certificate (Image)"}
                      </span>
                    </Button>
                  </div>
                </div>

                {/* 2. Official Certificate Document Display */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-100">
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <Award className="h-4 w-4 text-amber-600" />
                        <span>
                          {isBn
                            ? "অফিসিয়াল সার্টিফিকেট ভিউ"
                            : "Official Certificate Document"}
                        </span>
                      </h3>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {isBn
                          ? "ডাউনলোড বাটনে ক্লিক করলে শুধুমাত্র এই সার্টিফিকেটটি হাই-রেজোলিউশন ইমেজ (PNG) ফরম্যাটে সেভ হবে।"
                          : "Clicking download exports only this official certificate as a high-resolution PNG image."}
                      </p>
                    </div>

                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={handleDownloadImage}
                      isLoading={isExportingImage}
                      disabled={isExportingImage}
                      icon={Download}
                      className="bg-[#7C481A] hover:bg-[#5C3411] text-white shadow-xs font-bold text-xs"
                    >
                      <span>
                        {isExportingImage
                          ? isBn
                            ? "ইমেজ তৈরি হচ্ছে..."
                            : "Generating Image..."
                          : isBn
                          ? "সার্টিফিকেট ডাউনলোড (ছবি)"
                          : "Download Certificate (Image)"}
                      </span>
                    </Button>
                  </div>

                  {/* Certificate Canvas Container */}
                  <div className="w-full overflow-x-auto p-2 sm:p-4 bg-slate-100/70 rounded-xl border border-slate-200 flex justify-center">
                    <div className="min-w-[680px] w-full max-w-[950px]">
                      <CertificateDocument
                        ref={certDocRef}
                        certificate={result}
                        className="rounded-xl shadow-lg border border-slate-200"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-red-200 bg-red-50/50 p-5 text-center text-xs text-red-700">
                <strong>
                  {isBn
                    ? "সার্টিফিকেট পাওয়া যায়নি!"
                    : "Certificate Not Found!"}
                </strong>
                <p className="mt-1 text-slate-600">
                  {isBn
                    ? "অনুগ্রহ করে সার্টিফিকেট নম্বরটি পুনরায় পরীক্ষা করুন অথবা আমাদের হেল্পলাইনে যোগাযোগ করুন।"
                    : "The Certificate ID entered does not match any authenticated record in the National Registry."}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Verification Instructions */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-white p-5 text-xs text-slate-600 leading-relaxed shadow-xs">
        <h4 className="font-bold text-slate-900 mb-2">
          {cert.howItWorksTitle ||
            (isBn ? "যাচাইকরণ প্রক্রিয়া" : "How Verification Works")}
        </h4>
        <ol className="list-decimal ml-4 space-y-1.5 text-slate-500">
          <li>
            {cert.step1 ||
              "Enter the unique Certificate ID printed on the bottom right of your official certificate."}
          </li>
          <li>
            {cert.step2 ||
              "Our cryptographic ledger confirms the issuing authority, participant name, and validity date."}
          </li>
          <li>
            {cert.step3 ||
              "Download the verified digital certificate image or share the public verification link."}
          </li>
        </ol>
      </div>
    </section>
  );
}

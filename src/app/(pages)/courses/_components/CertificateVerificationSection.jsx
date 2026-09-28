// src/app/(pages)/courses/_components/CertificateVerificationSection.jsx
"use client";

import { Check } from "lucide-react";
import { H3, H4 } from "@/components/ui/Typography";
import Input from "@/components/ui/Input";
import { useDictionary } from "@/context/DictionaryContext";

export default function CertificateVerificationSection({
  verifyId,
  setVerifyId,
  handleVerify,
}) {
  const { locale } = useDictionary();
  const isBn = locale === "bn";

  return (
    <section className="py-12 sm:py-16 bg-slate-950 text-white">
      <div className="site-container">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          {/* Left USPs (4 cols) */}
          <div className="lg:col-span-4">
            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-blue-400 backdrop-blur-md">
              {isBn ? "প্রামাণিকতার নিশ্চয়তা" : "AUTHENTICITY GUARANTEED"}
            </span>
            <H3 color="white" className="text-lg font-black uppercase tracking-wider">
              {isBn ? "যাচাইকৃত" : "VERIFIED"}{" "}
              <span className="text-primary">{isBn ? "সার্টিফিকেট।" : "CERTIFICATE."}</span>
            </H3>

            <div className="mt-4 space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>
                  {isBn
                    ? "উত্তীর্ণ স্কোর অর্জনের সাথে সাথে স্বয়ংক্রিয়ভাবে তৈরি"
                    : "Auto-generated upon achieving passing score"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>
                  {isBn
                    ? "জালিয়াতি-রোধী অনন্য সিরিয়াল ও কিউআর যাচাই ব্যবস্থা"
                    : "Tamper-evident unique serial & QR verification"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>
                  {isBn
                    ? "নিয়োগকর্তা বা নিয়ন্ত্রক সংস্থার জন্য সরাসরি যাচাই পোর্টাল"
                    : "Direct employer or regulatory validation portal"}
                </span>
              </div>
            </div>
          </div>

          {/* Middle Mockup (4 cols) */}
          <div className="flex justify-center lg:col-span-4">
            <div className="relative aspect-4/3 w-full max-w-xs rounded-lg border-2 border-amber-300/50 bg-white p-4 text-slate-900 shadow-xl">
              <div className="text-center">
                <div className="text-[10px] font-black uppercase text-primary">
                  {isBn ? "সেইফ এলপিজি একাডেমি" : "SAFE LPG ACADEMY"}
                </div>
                <div className="mt-0.5 text-xs font-black text-slate-900 uppercase">
                  {isBn ? "সনদপত্র" : "Certificate of Completion"}
                </div>
                <div className="mt-1 text-[8px] text-slate-500">
                  {isBn ? "প্রত্যয়ন করা যাচ্ছে যে" : "This certifies that"}
                </div>
                <div className="mt-0.5 text-xs font-black underline text-slate-800">
                  {isBn ? "মোঃ রফিকুল ইসলাম" : "Md. Rafiqul Islam"}
                </div>
                <div className="mt-1 text-[8px] text-slate-500">
                  {isBn ? "সফলভাবে সম্পন্ন করেছেন" : "has completed"}
                </div>
                <div className="text-[9px] font-bold text-primary">
                  {isBn
                    ? "সাধারণ ভোক্তাদের জন্য এলপিজি নিরাপত্তা"
                    : "LPG Safety for Regular Consumers"}
                </div>
                <div className="mt-1 text-[8px] text-slate-400">
                  {isBn ? "মে ২০২৪ • আইডি: SAFE-2024-8849" : "May 2024 • ID: SAFE-2024-8849"}
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-1.5 text-[8px] text-slate-500">
                <span>{isBn ? "অনুমোদিত স্বাক্ষর" : "Authorized Signature"}</span>
                <span className="font-bold text-emerald-600">
                  {isBn ? "✓ কিউআর যাচাইকৃত" : "✓ QR Authentic"}
                </span>
              </div>
            </div>
          </div>

          {/* Right Verification Input (4 cols) */}
          <div className="lg:col-span-4">
            <div className="rounded-xl border border-white/15 bg-white/5 p-5 backdrop-blur-md">
              <H4 className="text-xs font-black uppercase tracking-wider text-white">
                {isBn ? "সার্টিফিকেট যাচাই করুন" : "VERIFY ANY CERTIFICATE"}
              </H4>
              <p className="mt-1 text-[11px] text-slate-400">
                {isBn
                  ? "তাৎক্ষণিক সত্যতা যাচাইয়ের জন্য সার্টিফিকেট আইডি লিখুন।"
                  : "Enter Certificate ID to verify instant authenticity."}
              </p>

              <form onSubmit={handleVerify} className="mt-3.5 flex gap-2">
                <Input
                  type="text"
                  placeholder={isBn ? "যেমন: SAFE-2024-8849" : "e.g. SAFE-2024-8849"}
                  value={verifyId}
                  onChange={(e) => setVerifyId(e.target.value)}
                  variant="dark"
                  className="flex-1"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-xs"
                >
                  {isBn ? "যাচাই" : "Verify"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

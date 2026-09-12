// src/app/(pages)/courses/_components/CertificateVerificationSection.jsx
import { Check } from "lucide-react";
import { H3, H4 } from "@/components/ui/Typography";
import CertificateVerificationForm from "../_client/CertificateVerificationForm";

export default function CertificateVerificationSection() {
  return (
    <section className="py-12 sm:py-16 bg-slate-950 text-white">
      <div className="site-container">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          {/* Left USPs (4 cols) */}
          <div className="lg:col-span-4">
            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-blue-400 backdrop-blur-md">
              AUTHENTICITY GUARANTEED
            </span>
            <H3 color="white" className="text-lg font-black uppercase tracking-wider">
              VERIFIED <span className="text-primary">CERTIFICATE.</span>
            </H3>

            <div className="mt-4 space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Auto-generated upon achieving passing score</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Tamper-evident unique serial &amp; QR verification</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Direct employer or regulatory validation portal</span>
              </div>
            </div>
          </div>

          {/* Middle Mockup (4 cols) */}
          <div className="flex justify-center lg:col-span-4">
            <div className="relative aspect-4/3 w-full max-w-xs rounded-lg border-2 border-amber-300/50 bg-white p-4 text-slate-900 shadow-xl">
              <div className="text-center">
                <div className="text-[10px] font-black uppercase text-primary">
                  SAFE LPG ACADEMY
                </div>
                <div className="mt-0.5 text-xs font-black text-slate-900 uppercase">
                  Certificate of Completion
                </div>
                <div className="mt-1 text-[8px] text-slate-500">
                  This certifies that
                </div>
                <div className="mt-0.5 text-xs font-black underline text-slate-800">
                  Md. Rafiqul Islam
                </div>
                <div className="mt-1 text-[8px] text-slate-500">
                  has completed
                </div>
                <div className="text-[9px] font-bold text-primary">
                  LPG Safety for Regular Consumers
                </div>
                <div className="mt-1 text-[8px] text-slate-400">
                  May 2024 • ID: SAFE-2024-8849
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-1.5 text-[8px] text-slate-500">
                <span>Authorized Signature</span>
                <span className="font-bold text-emerald-600">✓ QR Authentic</span>
              </div>
            </div>
          </div>

          {/* Right Verification Input (4 cols) */}
          <div className="lg:col-span-4">
            <div className="rounded-xl border border-white/15 bg-white/5 p-5 backdrop-blur-md">
              <H4 className="text-xs font-black uppercase tracking-wider text-white">
                VERIFY ANY CERTIFICATE
              </H4>
              <p className="mt-1 text-[11px] text-slate-400">
                Enter Certificate ID to verify instant authenticity.
              </p>

              <CertificateVerificationForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

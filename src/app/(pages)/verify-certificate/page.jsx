// src/app/(pages)/verify-certificate/page.jsx
import { Suspense } from "react";
import VerifyCertificateContent from "./_components/VerifyCertificateContent";

export const metadata = {
  title: "Verify Certificate | National Recognized Registry Bangladesh",
  description:
    "Instant digital validation for all LPG Safety & Regulatory compliance certificates issued under AEL, Department of Explosives (DoE), and LOAB joint programs.",
};

export default function VerifyCertificatePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-xs font-bold text-slate-500 animate-pulse">
            Loading Certificate Verification...
          </div>
        </div>
      }
    >
      <VerifyCertificateContent />
    </Suspense>
  );
}

// src/app/(pages)/privacy/page.jsx
import Link from "next/link";
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from "lucide-react";
import { H1, H2, H3, P } from "@/components/ui/Typography";
import AmbientGlow from "@/components/ui/AmbientGlow";
import Breadcrumb from "@/components/ui/Breadcrumb";

export const metadata = {
  title: "Privacy Policy | AEL LPG Safety Platform",
  description: "Official privacy statement, data protection principles, and learner confidentiality protocols.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 pb-16 pt-10 text-white">
        <AmbientGlow />

        <div className="site-container relative z-10 text-center max-w-3xl mx-auto">
          <Breadcrumb
            dark
            items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
            className="justify-center mb-3"
          />

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-blue-400 backdrop-blur-md">
            <Lock className="h-3.5 w-3.5" />
            <span>DATA INTEGRITY & USER CONFIDENTIALITY</span>
          </div>

          <H1 color="white" className="leading-tight">
            <span>PRIVACY</span>{" "}
            <span className="text-primary">POLICY.</span>
          </H1>

          <P className="mt-3 text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            How AEL collects, stores, and safeguards personal training records, certification credentials, and incident reports in accordance with statutory digital standards.
          </P>
        </div>
      </section>

      {/* 2. Policy Articles */}
      <section className="relative z-20 -mt-8 mx-auto w-full max-w-4xl px-4 pb-20">
        <div className="rounded-xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-2xs space-y-8 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <div>
            <span className="text-[11px] font-bold text-slate-400 block uppercase mb-1">
              Effective Date: May 1, 2024
            </span>
            <h2 className="text-base font-bold text-slate-900">
              1. Information We Collect
            </h2>
            <p className="mt-2">
              We collect information to facilitate certified LPG safety education, maintain national incident registries, and authenticate regulatory dealer licenses:
            </p>
            <ul className="mt-3 list-disc pl-5 space-y-1.5 text-slate-700">
              <li>
                <strong>Learner Account Information:</strong> Full name, national identity/passport reference, mobile number, email address, and institutional or dealership affiliation.
              </li>
              <li>
                <strong>Academic & Assessment Records:</strong> Video lesson completion timestamps, quiz scores, certificate verification hashes, and badge issuances.
              </li>
              <li>
                <strong>Incident & Technical Inquiries:</strong> Geographical coordinates, eyewitness reports, media attachments, and emergency logs submitted to the national incident registry.
              </li>
            </ul>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-base font-bold text-slate-900">
              2. How We Use Collected Data
            </h2>
            <p className="mt-2">
              Data collected is strictly utilized for educational verification and statutory safety monitoring:
            </p>
            <ul className="mt-3 list-disc pl-5 space-y-1.5 text-slate-700">
              <li>Issuing verifiable QR-coded certificates recognized by DoE and LOAB.</li>
              <li>Transmitting emergency safety bulletins and BERC price adjustment SMS notifications.</li>
              <li>Conducting anonymized epidemiological safety research to reduce cylinder-related fire incidents.</li>
              <li>We <strong>never sell or rent</strong> personal contact details to third-party commercial advertisers.</li>
            </ul>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-base font-bold text-slate-900">
              3. Data Security & Encryption
            </h2>
            <p className="mt-2">
              All interactions between your browser and our servers are encrypted via Transport Layer Security (TLS 1.3 / 256-bit SSL). Payment gateway interactions through bKash, Nagad, and partner acquiring banks are processed through PCI-DSS Level 1 compliant secure tokenization.
            </p>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h2 className="text-base font-bold text-slate-900">
              4. Contact the Data Protection Officer
            </h2>
            <p className="mt-2">
              For questions regarding privacy, deletion of account data, or regulatory data sharing requests, contact:
            </p>
            <div className="mt-3 rounded-lg bg-slate-50 p-4 border border-slate-200/70 text-xs">
              <strong>Data Privacy & Compliance Cell</strong>
              <br />
              AEL LPG Platform, House # 13, Road # 13, Sector # 03, Uttara, Dhaka-1230
              <br />
              Email: <span className="text-primary font-medium">privacy@lpgsafety.org.bd</span> | Phone: +880 1812-345678
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

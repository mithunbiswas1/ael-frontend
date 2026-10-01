// src/app/(dashboard)/subscriber/certificates/page.jsx
"use client";

import Link from "next/link";
import {
  FaAward,
  FaCheckCircle,
  FaExternalLinkAlt,
  FaDownload,
  FaGraduationCap,
  FaShieldAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { AdminPageHeader } from "@/components/ui/AdminPageHeader";
import { H1, H2, H3, P } from "@/components/ui/Typography";

const MOCK_CERTIFICATES = [
  {
    certificateId: "CERT-LPG-1-2024",
    courseTitle: "LPG Safety & Hazard Mitigation Professional Certification",
    courseTitleBn: "এলপিজি নিরাপত্তা ও ঝুঁকি প্রশমন পেশাদার সার্টিফিকেশন",
    issueDate: "2024-05-20",
    grade: "Pass (92%)",
    status: "Verified & Authentic",
    issuingAuthority: "Safe LPG Bangladesh in collaboration with DoE & LOAB",
  },
];

export default function SubscriberCertificatesPage() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        icon={FaAward}
        title="My Verified Certificates"
        description="Review, download, and publicly verify your regulatory compliance credentials and professional LPG safety training certificates."
      />

      {/* Certificate Cards */}
      <div className="space-y-4">
        {MOCK_CERTIFICATES.map((cert) => (
          <div
            key={cert.certificateId}
            className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white"
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between p-6 gap-6">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white">
                  <FaAward className="h-7 w-7" />
                </div>

                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-md">
                      {cert.certificateId}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-secondary/10 px-2 py-0.5 text-[11px] font-bold text-secondary border border-secondary/20">
                      <FaCheckCircle className="h-3 w-3" />
                      <span>{cert.status}</span>
                    </span>
                  </div>

                  <H2 className="text-base sm:text-lg font-bold text-slate-900">
                    {cert.courseTitle}
                  </H2>

                  <P className="text-xs text-slate-500">
                    Recipient: <strong className="text-slate-700">{user?.fullName || "Student Learner"}</strong> • Grade: <strong className="text-slate-700">{cert.grade}</strong>
                  </P>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                    <div className="flex items-center gap-1">
                      <FaCalendarAlt className="h-3.5 w-3.5 text-slate-400" />
                      <span>Issued: {cert.issueDate}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaShieldAlt className="h-3.5 w-3.5 text-secondary" />
                      <span>{cert.issuingAuthority}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 shrink-0 pt-2 lg:pt-0">
                <LinkButton
                  href={`/verify-certificate?id=${cert.certificateId}`}
                  target="_blank"
                  variant="primary"
                  size="default"
                  className="gap-2"
                >
                  <FaExternalLinkAlt className="h-3.5 w-3.5" />
                  <span>Verify Online Registry</span>
                </LinkButton>

                <Button
                  type="button"
                  onClick={() => window.print()}
                  variant="secondary"
                  size="default"
                  className="gap-2 border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                >
                  <FaDownload className="h-3.5 w-3.5 text-slate-500" />
                  <span>Download / Print</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info Notice */}
      <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-5 text-xs text-blue-900">
        <div className="flex items-start gap-3">
          <FaGraduationCap className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <H3 className="font-bold text-sm text-blue-950">Looking to earn more certificates?</H3>
            <P className="text-xs text-blue-700">
              Complete remaining modules in your enrolled courses and score at least 80% on the final assessment quiz to automatically receive your certified badge and verification serial number.
            </P>
            <div className="pt-2">
              <Link
                href="/subscriber/courses"
                className="font-bold text-primary hover:underline text-xs"
              >
                Go to My Courses →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// src/app/(pages)/safety-guidelines/_components/GuidelinesGridSection.jsx
"use client";

import Link from "next/link";
import {
  CheckCircle2,
  Lightbulb,
  ArrowRight,
  Building2,
  ExternalLink,
  FileText,
  Download,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { H3, H4 } from "@/components/ui/Typography";
import SectionHeader from "@/components/ui/SectionHeader";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import { STAKEHOLDER_TABS } from "./StakeholderTabsSection";

const standardsList = [
  "ISO 14246: LPG Equipment & Cylinder Valves",
  "EN 589: LPG Automotive Fuel Specifications",
  "NFPA 58: Liquefied Petroleum Gas Code",
  "OIML Standards for Dispenser Measurement",
];

const regulatoryAgencies = [
  {
    id: "doe",
    name: "DoE",
    title: "Department of Explosives",
    description: "National regulatory authority under Ministry of Power & Energy.",
    badgeBg: "bg-red-50 text-red-700 border-red-200",
    href: "https://explosives.gov.bd",
  },
  {
    id: "fire",
    name: "Civil Defense",
    title: "Directorate General of Fire Service & Civil Defense",
    description: "Emergency fire codes, evacuation protocols and site inspections.",
    badgeBg: "bg-amber-50 text-amber-800 border-amber-300",
    href: "http://fireservice.gov.bd",
  },
  {
    id: "loab",
    name: "LOAB",
    title: "LPG Operators Association of Bangladesh",
    description: "Industry body representing nationwide licensed LPG operators.",
    badgeBg: "bg-emerald-50 text-emerald-800 border-emerald-200",
    href: "https://loab.com.bd",
  },
];

const documentDownloads = [
  {
    id: 1,
    name: "LPG Handling & Storage Guidelines",
    audience: "All Stakeholders",
    targetTab: "all",
    type: "PDF",
    access: "Public",
    fileName: "lpg-handling-storage-guidelines.pdf",
  },
  {
    id: 2,
    name: "LPG Auto Gas Station Safety Manual",
    audience: "Auto Gas Station",
    targetTab: "auto-gas",
    type: "PDF",
    access: "Login Required",
    fileName: "auto-gas-station-safety-manual.pdf",
  },
  {
    id: 3,
    name: "Industrial LPG Installation Code & Pipe Specs",
    audience: "Industrial Customers",
    targetTab: "industrial",
    type: "PDF",
    access: "Login Required",
    fileName: "industrial-lpg-installation-code.pdf",
  },
  {
    id: 4,
    name: "LPG Cylinder Safety Tips (Household Consumer Guide)",
    audience: "Regular Consumers",
    targetTab: "consumer",
    type: "PDF",
    access: "Public",
    fileName: "consumer-lpg-safety-tips.pdf",
  },
  {
    id: 5,
    name: "Emergency Response & Gas Leakage Protocols",
    audience: "All Stakeholders",
    targetTab: "all",
    type: "PDF",
    access: "Login Required",
    fileName: "emergency-response-guidelines.pdf",
  },
  {
    id: 6,
    name: "Bulk Road Tanker & Hauler Transport Standard",
    audience: "Distributors",
    targetTab: "distributor",
    type: "PDF",
    access: "Login Required",
    fileName: "distributor-transportation-code.pdf",
  },
  {
    id: 7,
    name: "Dealer Warehouse Storage & Cylinder Inspection Norms",
    audience: "Dealers",
    targetTab: "dealer",
    type: "PDF",
    access: "Public",
    fileName: "dealer-storage-inspection-norms.pdf",
  },
];

export default function GuidelinesGridSection({ activeTab }) {
  const handleDownload = (doc) => {
    if (doc.access === "Login Required") {
      toast.error(`"${doc.name}" requires authentication. Please log in to download.`);
    } else {
      toast.success(`Starting download: ${doc.name} (PDF)`);
    }
  };

  const filteredDocs = documentDownloads.filter(
    (doc) => doc.targetTab === "all" || doc.targetTab === activeTab
  );

  return (
    <section className="py-12 sm:py-16">
      <div className="site-container">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-8">
          {/* Left Column (4 cols): Global Safety Standards & Safety Tip */}
          <div className="space-y-6 lg:col-span-4">
            {/* Global Standards Card */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs">
              <H3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                GLOBAL SAFETY STANDARDS
              </H3>

              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                We follow globally recognized practices and international safety standards to ensure
                LPG safety across Bangladesh.
              </p>

              <div className="mt-4 space-y-2.5 border-t border-slate-100 pt-4">
                {standardsList.map((std, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700 mt-0.5" />
                    <span>{std}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5">
                <button
                  onClick={() =>
                    toast.info("Accessing international LPG safety documentation database.")
                  }
                  className="w-full rounded-lg bg-primary py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-blue-700"
                >
                  View All Standards
                </button>
              </div>
            </div>

            {/* Safety Tip Card */}
            <div className="flex items-start gap-3.5 rounded-xl border border-amber-200 bg-amber-50/70 p-5 shadow-xs">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-500 text-white shadow-xs">
                <Lightbulb className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs font-black uppercase tracking-wider text-amber-900">
                  SAFETY TIP
                </div>
                <p className="mt-1 text-xs leading-relaxed text-amber-800">
                  Always inspect your LPG cylinder, regulator and hose before use. Look for cracks, smell
                  gas, and conduct regular soap-water leak checks.
                </p>
                <Link
                  href="/blogs"
                  className="mt-2.5 inline-flex items-center gap-1 text-xs font-bold text-amber-900 underline hover:text-amber-950"
                >
                  <span>Learn More Safety Tips</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column (8 cols): Regulatory Documents & Guidelines Downloads */}
          <div className="space-y-8 lg:col-span-8">
            {/* 1. Regulatory Documents */}
            <div>
              <SectionHeader
                tag="GOVERNMENT & INDUSTRY"
                title="REGULATORY"
                accent="DOCUMENTS."
                subtitle="Official circulars, clearance standards, and gazette notifications from governing bodies."
                className="mb-4"
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {regulatoryAgencies.map((agency) => (
                  <div
                    key={agency.id}
                    className="group flex flex-col justify-between rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs transition-colors duration-200 hover:border-primary/50"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`rounded-lg border px-2.5 py-1 text-xs font-black uppercase tracking-wider ${agency.badgeBg}`}
                        >
                          {agency.name}
                        </span>
                        <Building2 className="h-4 w-4 text-slate-500" />
                      </div>

                      <H4 className="mt-3 text-xs font-bold text-slate-900 leading-snug">
                        {agency.title}
                      </H4>

                      <p className="mt-1 text-[11px] leading-relaxed text-slate-500 line-clamp-2">
                        {agency.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <a
                        href={agency.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                      >
                        <span>View Documents</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Guidelines & Downloads Table */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs">
              <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <H3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                    GUIDELINES &amp; DOWNLOADS
                  </H3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Some documents are restricted and available for logged-in users only.
                  </p>
                </div>
                <span className="self-start sm:self-auto rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                  Showing: {STAKEHOLDER_TABS.find((t) => t.id === activeTab)?.label}
                </span>
              </div>

              {/* Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Document Name</TableHead>
                    <TableHead>Audience</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Access</TableHead>
                    <TableHead className="text-right">Download</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDocs.map((doc) => {
                    const isPublic = doc.access === "Public";
                    return (
                      <TableRow key={doc.id}>
                        <TableCell className="font-semibold text-slate-800">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 shrink-0 text-slate-500" />
                            <span>{doc.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-500">
                          {doc.audience}
                        </TableCell>
                        <TableCell>
                          <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                            {doc.type}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                              isPublic
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-blue-50 text-primary border border-blue-200"
                            }`}
                          >
                            {doc.access}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          {isPublic ? (
                            <button
                              onClick={() => handleDownload(doc)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-primary shadow-2xs hover:bg-primary hover:text-white transition-colors"
                              title="Download PDF"
                            >
                              <Download className="h-3.5 w-3.5" />
                            </button>
                          ) : (
                            <Link
                              href="/login"
                              onClick={() => handleDownload(doc)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-slate-500 hover:border-primary hover:text-primary transition-colors"
                              title="Login Required to Download"
                            >
                              <Lock className="h-3.5 w-3.5" />
                            </Link>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-500 font-medium">
                <span>Authorized by Ministry of Power, Energy &amp; Mineral Resources</span>
                <span>Updated: May 2024</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// src/app/(pages)/safety-guidelines/page.jsx
"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Truck,
  Fuel,
  Factory,
  User,
  CheckCircle2,
  Download,
  Lock,
  ExternalLink,
  Lightbulb,
  FileText,
  Building2,
  Flame,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { H1, H2, H3, H4, P } from "@/components/ui/Typography";
import AmbientGlow from "@/components/ui/AmbientGlow";
import Breadcrumb from "@/components/ui/Breadcrumb";
import SectionHeader from "@/components/ui/SectionHeader";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/Table";

const stakeholderTabs = [
  { id: "dealer", label: "Dealers", icon: ShieldCheck },
  { id: "distributor", label: "Distributors", icon: Truck },
  { id: "auto-gas", label: "Auto Gas Station", icon: Fuel },
  { id: "industrial", label: "Industrial Customers", icon: Factory },
  { id: "consumer", label: "Regular Consumers", icon: User },
];

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
    badgeBg: "bg-red-50 text-red-600 border-red-200",
    href: "https://explosives.gov.bd",
  },
  {
    id: "fire",
    name: "Civil Defense",
    title: "Directorate General of Fire Service & Civil Defense",
    description: "Emergency fire codes, evacuation protocols and site inspections.",
    badgeBg: "bg-amber-50 text-amber-600 border-amber-200",
    href: "http://fireservice.gov.bd",
  },
  {
    id: "loab",
    name: "LOAB",
    title: "LPG Operators Association of Bangladesh",
    description: "Industry body representing nationwide licensed LPG operators.",
    badgeBg: "bg-emerald-50 text-emerald-600 border-emerald-200",
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
    fileName: "dealer-warehouse-inspection-norms.pdf",
  },
];

function SafetyGuidelinesContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "dealer";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl && stakeholderTabs.some((t) => t.id === tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const handleDownload = (doc) => {
    if (doc.access === "Login Required") {
      toast.error(`"${doc.name}" requires authentication. Please log in to download.`);
    } else {
      toast.success(`Starting download: ${doc.name} (PDF)`);
    }
  };

  const filteredDocs = documentDownloads.filter(
    (doc) => doc.targetTab === "all" || doc.targetTab === activeTab,
  );

  return (
    <main className="min-h-screen bg-slate-50">
      {/* 1. Page Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 pb-16 pt-10 md:pb-20 md:pt-14 text-white">
        <AmbientGlow />

        <div className="site-container relative z-10">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-8">
            {/* Left Column */}
            <div className="flex flex-col items-start lg:col-span-7">
              <Breadcrumb
                dark
                items={[
                  { label: "Home", href: "/" },
                  { label: "Safety Guidelines" },
                ]}
                className="mb-3"
              />

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-blue-400 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400 animate-pulse" />
                <span>NATIONWIDE SAFETY PROTOCOLS</span>
              </div>

              <H1 color="white" className="leading-[1.08] tracking-tight">
                <span>SAFETY</span>{" "}
                <span className="text-primary">GUIDELINES.</span>
              </H1>

              <P className="mt-4 max-w-xl text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
                Guidelines for safe handling, storage and use of LPG across all sectors. Compliant with
                BERC, Department of Explosives (DoE), and Fire Service regulations.
              </P>
            </div>

            {/* Right Column: Visual */}
            <div className="relative flex items-center justify-center lg:col-span-5">
              <div className="group relative aspect-4/3 w-full max-w-lg overflow-hidden rounded-xl border border-white/15 bg-slate-800/80 shadow-md backdrop-blur-sm">
                <Image
                  src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop"
                  alt="LPG Storage Tanks and Cylinders"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 45vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                {/* Floating info tag */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between rounded-lg border border-white/20 bg-slate-950/75 p-3 text-white backdrop-blur-md">
                  <div>
                    <div className="text-xs font-black tracking-wide text-white">
                      Mandatory Operating Standards
                    </div>
                    <div className="text-[10px] text-slate-300">
                      Standard operating procedures for all 5 stakeholder groups
                    </div>
                  </div>
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Stakeholder Tabs Bar */}
      <section className="relative z-20 -mt-6 sm:-mt-7 mx-auto w-full max-w-6xl px-4">
        <div className="flex flex-wrap items-center justify-between gap-1.5 rounded-xl border border-slate-200/80 bg-white p-2 shadow-xs backdrop-blur-md">
          {stakeholderTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-bold transition-all min-w-[150px] ${
                  isActive
                    ? "bg-primary text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Main Guidelines Content Grid */}
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
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
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
                          <Building2 className="h-4 w-4 text-slate-400" />
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
                    Showing: {stakeholderTabs.find((t) => t.id === activeTab)?.label}
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
                              <FileText className="h-4 w-4 shrink-0 text-slate-400" />
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

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-[11px] text-slate-400">
                  <span>Authorized by Ministry of Power, Energy &amp; Mineral Resources</span>
                  <span>Updated: May 2024</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function SafetyGuidelinesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="text-xs font-bold text-slate-500 animate-pulse">
            Loading Safety Guidelines...
          </div>
        </div>
      }
    >
      <SafetyGuidelinesContent />
    </Suspense>
  );
}

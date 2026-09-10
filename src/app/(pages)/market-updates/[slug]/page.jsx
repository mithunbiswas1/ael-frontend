// src/app/(pages)/market-updates/[slug]/page.jsx
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  MapPin,
  ShieldAlert,
  FileText,
  Download,
  CheckCircle2,
  Building,
} from "lucide-react";
import { H1, H2, H3, P } from "@/components/ui/Typography";
import AmbientGlow from "@/components/ui/AmbientGlow";
import Breadcrumb from "@/components/ui/Breadcrumb";

const INCIDENTS_DATA = [
  {
    id: "INC-2024-125",
    slug: "INC-2024-125",
    type: "Leakage",
    location: "Chattogram",
    specificLocation: "Patenga Depot Area, Chattogram",
    date: "May 20, 2024",
    status: "Resolved",
    severity: "Medium",
    conductedBy: "DoE (Department of Explosives)",
    details:
      "A localized minor valve leak was reported during manifold pressure transfer at a primary refilling bay. Prompt emergency shutoff protocols were initiated within 3 minutes. Zero casualties, area safely purged.",
    casualties: "0 Casualties, 0 Hospitalized",
    investigationReport: "INQ-2024-77",
    preventiveAction:
      "Quarterly valve stem torque testing interval reduced from 90 days to 45 days. Secondary relief line check valves installed.",
  },
  {
    id: "INC-2024-124",
    slug: "INC-2024-124",
    type: "Fire",
    location: "Dhaka",
    specificLocation: "Rampura Road Retail Point, Dhaka",
    date: "May 19, 2024",
    status: "Resolved",
    severity: "High",
    conductedBy: "Civil Defense & Fire Service",
    details:
      "Electrical short circuit adjacent to unauthorized retail storage caused minor flare up. Civil Defense arrived on scene within 8 minutes and extinguished the flare using dry chemical powder (DCP). Two minor burn injuries treated at hospital.",
    casualties: "2 Minor Injuries (Treated & Discharged)",
    investigationReport: "INQ-2024-76",
    preventiveAction:
      "Strict separation clearance enforced between electrical junction boxes and retail cylinder storage stacks (minimum 3 meters).",
  },
  {
    id: "INC-2024-123",
    slug: "INC-2024-123",
    type: "Explosion",
    location: "Narayanganj",
    specificLocation: "Fatullah Industrial Substation, Narayanganj",
    date: "May 18, 2024",
    status: "Under Investigation",
    severity: "Critical",
    conductedBy: "LOAB & DoE Joint Technical Probe",
    details:
      "Substandard imported cylinder burst under unauthorized over-pressurization. Joint probe team comprising DoE and LOAB Technical Committee is inspecting site metallurgical fragments. Preliminary report expected within 7 working days.",
    casualties: "1 Injured (Stable in Hospital), Substantial Property Damage",
    investigationReport: "INQ-2024-75",
    preventiveAction:
      "Immediate nationwide advisory issued regarding illicit cylinder batches. Hydro-testing certifications mandated before supply clearance.",
  },
];

export function generateStaticParams() {
  return INCIDENTS_DATA.map((item) => ({
    slug: item.slug,
  }));
}

export default async function IncidentDetailPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const incident = INCIDENTS_DATA.find(
    (item) => item.slug.toLowerCase() === slug.toLowerCase()
  ) || {
    id: slug,
    slug: slug,
    type: "Incident Report",
    location: "Bangladesh",
    specificLocation: "Regional Depot / Customer Point",
    date: "May 2024",
    status: "Official Record",
    severity: "Standard",
    conductedBy: "Regulatory Authorities",
    details:
      "Detailed regulatory log and forensic docket registered under National LPG Safety Registry. Verified by inspection teams.",
    casualties: "Reported to Department of Explosives",
    investigationReport: `INQ-${slug}`,
    preventiveAction: "Complies with standard national safety procedures.",
  };

  const isResolved = incident.status === "Resolved";

  return (
    <main className="min-h-screen bg-slate-50">
      {/* 1. Page Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 pb-16 pt-10 text-white">
        <AmbientGlow />

        <div className="site-container relative z-10">
          <Breadcrumb
            dark
            items={[
              { label: "Home", href: "/" },
              { label: "LPG Market Update", href: "/market-updates" },
              { label: incident.id },
            ]}
            className="mb-4"
          />

          <Link
            href="/market-updates"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Market Updates</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span
              className={`rounded-full px-3 py-0.5 text-xs font-bold ${
                isResolved
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
              }`}
            >
              Status: {incident.status}
            </span>
            <span className="rounded-full bg-slate-800 border border-slate-700 px-3 py-0.5 text-xs font-bold text-slate-300">
              Type: {incident.type}
            </span>
          </div>

          <H1 color="white" className="leading-tight">
            <span>{incident.id}:</span>{" "}
            <span className="text-primary">{incident.type} in {incident.location}.</span>
          </H1>
        </div>
      </section>

      {/* 2. Main Content Card */}
      <section className="relative z-20 -mt-8 mx-auto w-full max-w-4xl px-4 pb-20">
        <div className="rounded-xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-slate-100">
            <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200/60">
              <span className="text-[11px] font-bold text-slate-500 block uppercase">
                Location
              </span>
              <span className="text-xs font-bold text-slate-900 mt-1 block">
                {incident.specificLocation}
              </span>
            </div>

            <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200/60">
              <span className="text-[11px] font-bold text-slate-500 block uppercase">
                Date of Incident
              </span>
              <span className="text-xs font-bold text-slate-900 mt-1 block">
                {incident.date}
              </span>
            </div>

            <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200/60">
              <span className="text-[11px] font-bold text-slate-500 block uppercase">
                Investigating Body
              </span>
              <span className="text-xs font-bold text-slate-900 mt-1 block">
                {incident.conductedBy}
              </span>
            </div>
          </div>

          <div className="py-6 space-y-6">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-2">
                Incident Summary & Initial Findings
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-lg border border-slate-200/80">
                {incident.details}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-2">
                Casualties & Impact Assessment
              </h3>
              <div className="rounded-lg border border-slate-200 bg-white p-4 text-xs font-medium text-slate-800">
                {incident.casualties}
              </div>
            </div>

            {incident.preventiveAction && (
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-2">
                  Corrective & Preventive Action (CAPA)
                </h3>
                <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4 text-xs text-slate-700 leading-relaxed">
                  {incident.preventiveAction}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-lg bg-blue-50/60 border border-blue-200 p-4">
              <div>
                <span className="text-xs font-bold text-blue-900 block">
                  Official Inquiry Dossier
                </span>
                <span className="text-[11px] text-blue-700">
                  Ref ID: {incident.investigationReport} (Certified by {incident.conductedBy})
                </span>
              </div>
              <a
                href="#"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary/90 transition-colors shadow-xs"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download Certified PDF</span>
              </a>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
            <Link
              href="/market-updates"
              className="text-xs font-bold text-primary hover:underline"
            >
              ← Back to Market Updates
            </Link>
            <Link
              href="/safety-guidelines"
              className="text-xs font-bold text-slate-600 hover:text-slate-900 hover:underline"
            >
              View Safety Guidelines →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

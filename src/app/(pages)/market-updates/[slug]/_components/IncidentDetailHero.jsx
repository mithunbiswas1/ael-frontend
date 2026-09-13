import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { H1 } from "@/components/ui/Typography";
import AmbientGlow from "@/components/ui/AmbientGlow";
import Breadcrumb from "@/components/ui/Breadcrumb";

export default function IncidentDetailHero({ incident }) {
  const isResolved = incident.status === "Resolved";

  return (
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
  );
}

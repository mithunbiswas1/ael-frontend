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

        <H1 color="white" className="leading-tight">
          {incident.category === "incident" ? (
            <>
              <span>{incident.id}:</span>{" "}
              <span className="text-primary">{incident.type} in {incident.location}.</span>
            </>
          ) : (
            <span className="text-primary">{incident.title}</span>
          )}
        </H1>
      </div>
    </section>
  );
}

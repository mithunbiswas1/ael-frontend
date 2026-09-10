// src/app/(pages)/market-updates/[slug]/page.jsx
import IncidentDetailHero from "./_components/IncidentDetailHero";
import IncidentDetailCard from "./_components/IncidentDetailCard";

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

  return (
    <main className="min-h-screen bg-slate-50">
      <IncidentDetailHero incident={incident} />
      <IncidentDetailCard incident={incident} />
    </main>
  );
}

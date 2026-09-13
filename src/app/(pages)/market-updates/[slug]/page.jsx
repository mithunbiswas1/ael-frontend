// src/app/(pages)/market-updates/[slug]/page.jsx
import IncidentDetailHero from "./_components/IncidentDetailHero";
import IncidentDetailCard from "./_components/IncidentDetailCard";

const INCIDENTS_DATA = [
  {
    id: "INC-2024-125",
    slug: "INC-2024-125",
    category: "incident",
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
    category: "incident",
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
    category: "incident",
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

const BERC_DATA = [
  {
    id: "BERC-2024-06",
    slug: "BERC-2024-06",
    category: "berc",
    title: "Monthly LPG Price Revision Circular",
    type: "Price Circular",
    location: "Bangladesh (Nationwide)",
    specificLocation: "All Registered LPG Marketing Companies",
    date: "May 28, 2024",
    status: "Published",
    conductedBy: "BERC (Bangladesh Energy Regulatory Commission)",
    details:
      "BERC has revised the standard 12kg cylinder LPG price effective from 1st June 2024. Please check the official circular for itemized pricing and regional auto-gas quotas.",
    casualties: "BDT 1,363 per 12kg cylinder, inclusive of VAT",
    investigationReport: "BERC/CIRC/2024/06",
    preventiveAction:
      "Marketing companies must update retail price displays within 3 working days of circular issuance.",
  },
  {
    id: "BERC-2024-05",
    slug: "BERC-2024-05",
    category: "berc",
    title: "Auto Gas Retail Margin Adjustment Notice",
    type: "Regulatory Notice",
    location: "Bangladesh (Nationwide)",
    specificLocation: "All Auto Gas Conversion Stations",
    date: "May 10, 2024",
    status: "Published",
    conductedBy: "BERC (Bangladesh Energy Regulatory Commission)",
    details:
      "Retail margin for auto gas conversion stations adjusted nationwide to align with revised distribution cost model.",
    casualties: "Revised margin: BDT 2.10/litre",
    investigationReport: "BERC/CIRC/2024/05",
    preventiveAction: "Stations must file updated margin compliance within 15 days.",
  },
  {
    id: "BERC-2024-04",
    slug: "BERC-2024-04",
    category: "berc",
    title: "Public Hearing on LPG Tariff Structure",
    type: "Public Hearing",
    location: "Dhaka",
    specificLocation: "BERC Head Office, Dhaka",
    date: "Apr 22, 2024",
    status: "Published",
    conductedBy: "BERC (Bangladesh Energy Regulatory Commission)",
    details:
      "BERC invites stakeholder submissions ahead of the scheduled public hearing on the proposed LPG tariff restructuring.",
    casualties: "Submission deadline: May 15, 2024",
    investigationReport: "BERC/CIRC/2024/04",
    preventiveAction: "Interested parties must register with BERC secretariat before the hearing date.",
  },
];

const GLOBAL_DATA = [
  {
    id: "GLOBAL-2024-01",
    slug: "GLOBAL-2024-01",
    category: "global",
    title: "Global LPG Prices See Moderate Rise in May 2024",
    type: "Contract Price (CP)",
    location: "Saudi Arabia",
    specificLocation: "Saudi Aramco CP Reference Market",
    date: "2 days ago",
    status: "Published",
    conductedBy: "Saudi Aramco CP",
    details:
      "May CP contract prices settled at $580/MT for Propane and $565/MT for Butane.",
    casualties: "Propane $580/MT, Butane $565/MT",
    investigationReport: "CP-2024-05",
    preventiveAction: "Importers advised to hedge forward positions against continued freight volatility.",
  },
  {
    id: "GLOBAL-2024-02",
    slug: "GLOBAL-2024-02",
    category: "global",
    title: "Asia LPG Demand to Grow by 12% in 2024",
    type: "Market Outlook",
    location: "Asia Pacific",
    specificLocation: "Regional Import Terminals",
    date: "4 days ago",
    status: "Published",
    conductedBy: "Argus Media",
    details:
      "Expanding petrochemical demand and household clean fuel transition drive robust import growth.",
    casualties: "Forecast growth: +12% YoY",
    investigationReport: "ARG-2024-02",
    preventiveAction: "Terminal operators advised to review berthing capacity for peak season.",
  },
  {
    id: "GLOBAL-2024-03",
    slug: "GLOBAL-2024-03",
    category: "global",
    title: "US Propane Inventories Decline Unexpectedly",
    type: "Supply Report",
    location: "United States",
    specificLocation: "US Gulf Coast",
    date: "1 week ago",
    status: "Published",
    conductedBy: "EIA Energy",
    details:
      "Heavier seasonal export volumes to Southeast Asia tightened Gulf Coast prompt balances.",
    casualties: "Inventory draw exceeded forecast",
    investigationReport: "EIA-2024-03",
    preventiveAction: "Buyers advised to monitor Gulf Coast loading schedules closely.",
  },
  {
    id: "GLOBAL-2024-04",
    slug: "GLOBAL-2024-04",
    category: "global",
    title: "Middle East LPG Exports Boost in Q2",
    type: "Trade Report",
    location: "Middle East",
    specificLocation: "UAE and Qatar Export Terminals",
    date: "2 weeks ago",
    status: "Published",
    conductedBy: "Platts S&P",
    details:
      "Expanded terminal loading capacities in UAE and Qatar support elevated regional maritime shipments.",
    casualties: "Export capacity up across Q2",
    investigationReport: "PLT-2024-04",
    preventiveAction: "Freight desks advised to reassess vessel availability for Q3 bookings.",
  },
];

const ALL_ENTRIES = [...INCIDENTS_DATA, ...BERC_DATA, ...GLOBAL_DATA];

export function generateStaticParams() {
  return ALL_ENTRIES.map((item) => ({
    slug: item.slug,
  }));
}

export default async function IncidentDetailPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const incident = ALL_ENTRIES.find(
    (item) => item.slug.toLowerCase() === slug.toLowerCase()
  ) || {
    id: slug,
    slug: slug,
    category: "incident",
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

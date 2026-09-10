// src/app/(pages)/market-updates/page.jsx
"use client";

import { useState, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Calendar,
  MapPin,
  Filter,
  Eye,
  Download,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  FileText,
  Building,
  Shield,
  TrendingUp,
  Globe2,
  ArrowRight,
  X,
  RefreshCw,
  BellRing,
} from "lucide-react";
import { toast } from "sonner";
import { H1, H2, H3, H4, P } from "@/components/ui/Typography";
import AmbientGlow from "@/components/ui/AmbientGlow";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/Table";

// --- Mock Data ---

const INCIDENT_DATA = [
  {
    id: "INC-2024-125",
    type: "Leakage",
    location: "Chattogram",
    specificLocation: "Patenga Depot Area, Chattogram",
    date: "May 20, 2024",
    status: "Resolved",
    severity: "Medium",
    conductedBy: "DoE",
    details:
      "A localized minor valve leak was reported during manifold pressure transfer at a primary refilling bay. Prompt emergency shutoff protocols were initiated within 3 minutes. Zero casualties, area safely purged.",
    casualties: "0 Casualties, 0 Hospitalized",
    investigationReport: "INQ-2024-77",
  },
  {
    id: "INC-2024-124",
    type: "Fire",
    location: "Dhaka",
    specificLocation: "Rampura Road Retail Point, Dhaka",
    date: "May 19, 2024",
    status: "Resolved",
    severity: "High",
    conductedBy: "Civil Defense",
    details:
      "Electrical short circuit adjacent to unauthorized retail storage caused minor flare up. Civil Defense arrived on scene within 8 minutes and extinguished the flare using dry chemical powder (DCP). Two minor burn injuries treated at hospital.",
    casualties: "2 Minor Injuries (Treated & Discharged)",
    investigationReport: "INQ-2024-76",
  },
  {
    id: "INC-2024-123",
    type: "Explosion",
    location: "Narayanganj",
    specificLocation: "Fatullah Industrial Substation, Narayanganj",
    date: "May 18, 2024",
    status: "Under Investigation",
    severity: "Critical",
    conductedBy: "LOAB & DoE",
    details:
      "Substandard imported cylinder burst under unauthorized over-pressurization. Joint probe team comprising DoE and LOAB Technical Committee is inspecting site metallurgical fragments. Preliminary report expected within 7 working days.",
    casualties: "1 Injured (Stable in Hospital), Substantial Property Damage",
    investigationReport: "INQ-2024-75",
  },
  {
    id: "INC-2024-122",
    type: "Leakage",
    location: "Khulna",
    specificLocation: "Mongla Port Feeder Line, Khulna",
    date: "May 17, 2024",
    status: "Resolved",
    severity: "Low",
    conductedBy: "DoE",
    details:
      "Routine preventive hydrocarbon sensor detected flange vapor seepage at tanker offloading dock. Gasket replaced under cold work permit protocol without loss of containment.",
    casualties: "None",
    investigationReport: "INQ-2024-74",
  },
  {
    id: "INC-2024-121",
    type: "Fire",
    location: "Gazipur",
    specificLocation: "Chowrasta Commercial Kitchen, Gazipur",
    date: "May 16, 2024",
    status: "Resolved",
    severity: "Medium",
    conductedBy: "Civil Defense",
    details:
      "Expired flexible rubber hose developed pinhole fissure near commercial high-pressure burner. Fire localized to kitchen enclosure and put out by in-house CO2 fire extinguishers prior to fire service arrival.",
    casualties: "None",
    investigationReport: "INQ-2024-73",
  },
  {
    id: "INC-2024-120",
    type: "Transport Accident",
    location: "Bogura",
    specificLocation: "Dhaka-Bogura Highway, Sherpur",
    date: "May 14, 2024",
    status: "Resolved",
    severity: "Medium",
    conductedBy: "Civil Defense & Police",
    details:
      "Bulk cylinder carrier truck suffered side collision with freight hauler. All transport safety lock pins held firm with zero cylinder rupture or gas leakage. Cylinders transferred safely to backup carrier.",
    casualties: "Driver sustained minor bruises",
    investigationReport: "INQ-2024-72",
  },
  {
    id: "INC-2024-119",
    type: "Leakage",
    location: "Barishal",
    specificLocation: "Rupatali Distribution Point, Barishal",
    date: "May 11, 2024",
    status: "Resolved",
    severity: "Low",
    conductedBy: "DoE",
    details:
      "Defective regulator pin caused slow leakage during residential delivery handoff. Dealer replaced regulator on site and safe venting completed in open-air courtyard.",
    casualties: "None",
    investigationReport: "INQ-2024-71",
  },
];

const INQUIRY_REPORTS = [
  {
    inquiryId: "INQ-2024-77",
    relatedIncident: "INC-2024-125",
    conductedBy: "DoE",
    agencyFull: "Department of Explosives",
    date: "May 22, 2024",
    fileSize: "1.8 MB",
  },
  {
    inquiryId: "INQ-2024-76",
    relatedIncident: "INC-2024-124",
    conductedBy: "Civil Defense",
    agencyFull: "Fire Service & Civil Defense",
    date: "May 21, 2024",
    fileSize: "2.4 MB",
  },
  {
    inquiryId: "INQ-2024-75",
    relatedIncident: "INC-2024-123",
    conductedBy: "LOAB",
    agencyFull: "LPG Operators Association Bangladesh",
    date: "May 20, 2024",
    fileSize: "3.1 MB",
  },
  {
    inquiryId: "INQ-2024-74",
    relatedIncident: "INC-2024-122",
    conductedBy: "DoE",
    agencyFull: "Department of Explosives",
    date: "May 18, 2024",
    fileSize: "1.4 MB",
  },
];

const STAKEHOLDER_ANNOUNCEMENTS = {
  LOAB: [
    {
      id: "l-1",
      title: "LOAB Safety Campaign 2024",
      description: "Promoting safe LPG cylinder usage & storage guidelines across 64 districts.",
      date: "May 18, 2024",
      tag: "Awareness Drive",
    },
    {
      id: "l-2",
      title: "Unified Cylinder Cross-Refilling Ban Resolution",
      description: "Strict enforcement of penalties on cross-filling other operators' cylinders.",
      date: "May 08, 2024",
      tag: "Policy",
    },
    {
      id: "l-3",
      title: "Annual LPG Technical Summit Dhaka 2024",
      description: "Registration opens for engineers and supply-chain logistics stakeholders.",
      date: "Apr 29, 2024",
      tag: "Event",
    },
  ],
  DoE: [
    {
      id: "d-1",
      title: "DoE Directive on LPG Import Standards",
      description: "New quality assurance guidelines issued for propane-butane ratio verification.",
      date: "May 15, 2024",
      tag: "Regulatory Notice",
    },
    {
      id: "d-2",
      title: "Mandatory Auto Gas Dispenser Recalibration",
      description: "All certified fuel stations must complete quarterly calibration by June 30.",
      date: "May 02, 2024",
      tag: "Compliance",
    },
  ],
  "Civil Defense": [
    {
      id: "c-1",
      title: "Civil Defense Nationwide Mock Drill",
      description: "Full-scale LPG storage depot evacuation drills scheduled across port regions.",
      date: "May 12, 2024",
      tag: "Field Exercise",
    },
    {
      id: "c-2",
      title: "Commercial Kitchen Fire Safety Advisory",
      description: "Mandatory installation of certified LPG gas detectors in restaurant kitchens.",
      date: "Apr 25, 2024",
      tag: "Safety Standard",
    },
  ],
  Others: [
    {
      id: "o-1",
      title: "BUET Chemical Engineering Seminar",
      description: "Research findings on cylinder wall metallurgy under high ambient humidity.",
      date: "May 04, 2024",
      tag: "Research",
    },
    {
      id: "o-2",
      title: "Consumer Rights Commission Public Notice",
      description: "Notice regarding adherence to BERC approved maximum retail price (MRP).",
      date: "Apr 20, 2024",
      tag: "Consumer Protection",
    },
  ],
};

const GLOBAL_NEWS = [
  {
    id: "g-1",
    title: "Global LPG Prices See Moderate Rise in May 2024",
    time: "2 days ago",
    source: "Saudi Aramco CP",
    summary: "May CP contract prices settled at $580/MT for Propane and $565/MT for Butane.",
  },
  {
    id: "g-2",
    title: "Asia LPG Demand to Grow by 12% in 2024",
    time: "4 days ago",
    source: "Argus Media",
    summary: "Expanding petrochemical demand and household clean fuel transition drive robust import growth.",
  },
  {
    id: "g-3",
    title: "US Propane Inventories Decline Unexpectedly",
    time: "1 week ago",
    source: "EIA Energy",
    summary: "Heavier seasonal export volumes to Southeast Asia tightened Gulf Coast prompt balances.",
  },
  {
    id: "g-4",
    title: "Middle East LPG Exports Boost in Q2",
    time: "2 weeks ago",
    source: "Platts S&P",
    summary: "Expanded terminal loading capacities in UAE and Qatar support elevated regional maritime shipments.",
  },
];

function MarketUpdatesContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Stakeholder Tab State
  const [activeStakeholderTab, setActiveStakeholderTab] = useState("LOAB");

  // Selected Incident for Modal Preview
  const [activeModalIncident, setActiveModalIncident] = useState(null);

  // Filtered Incidents
  const filteredIncidents = useMemo(() => {
    return INCIDENT_DATA.filter((item) => {
      const matchesSearch =
        !searchTerm ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.details.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        selectedType === "all" ||
        item.type.toLowerCase() === selectedType.toLowerCase();

      const matchesLocation =
        selectedLocation === "all" ||
        item.location.toLowerCase() === selectedLocation.toLowerCase();

      const matchesDate =
        !selectedDate || item.date.toLowerCase().includes(selectedDate.toLowerCase());

      return matchesSearch && matchesType && matchesLocation && matchesDate;
    });
  }, [searchTerm, selectedType, selectedLocation, selectedDate]);

  // Paginated Incidents
  const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage) || 1;
  const paginatedIncidents = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredIncidents.slice(start, start + itemsPerPage);
  }, [filteredIncidents, currentPage]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedType("all");
    setSelectedLocation("all");
    setSelectedDate("");
    setCurrentPage(1);
    toast.info("Incident filters cleared.");
  };

  const handleDownloadReport = (inquiry) => {
    toast.success(
      `Downloading inquiry report ${inquiry.inquiryId} (${inquiry.conductedBy} - ${inquiry.fileSize})...`
    );
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* 1. Page Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 pb-16 pt-10 md:pb-20 md:pt-14 text-white">
        <AmbientGlow />

        <div className="site-container relative z-10">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-8">
            {/* Left Info */}
            <div className="flex flex-col items-start lg:col-span-7">
              <Breadcrumb
                dark
                items={[
                  { label: "Home", href: "/" },
                  { label: "LPG Market Update" },
                ]}
                className="mb-3"
              />

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-blue-400 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400 animate-pulse" />
                <span>OFFICIAL INDUSTRY REGISTRY & MARKET PULSE</span>
              </div>

              <H1 color="white" className="leading-[1.08] tracking-tight">
                <span>LPG MARKET</span>{" "}
                <span className="text-primary">UPDATE.</span>
              </H1>

              <P className="mt-4 max-w-xl text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
                Stay informed with the latest incident reports, inquiries, stakeholder announcements,
                BERC price notifications, and global LPG market trends across Bangladesh.
              </P>
            </div>

            {/* Right Visual */}
            <div className="relative flex items-center justify-center lg:col-span-5">
              <div className="group relative aspect-4/3 w-full max-w-lg overflow-hidden rounded-xl border border-white/15 bg-slate-800/80 shadow-md backdrop-blur-sm">
                <Image
                  src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop"
                  alt="Industrial LPG Terminal and Storage Facility"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 45vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent" />

                {/* Floating Metric Indicator */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between rounded-lg border border-white/20 bg-slate-950/80 p-3 text-white backdrop-blur-md">
                  <div>
                    <div className="text-xs font-black tracking-wide text-white flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      Live National Incident Registry
                    </div>
                    <div className="text-[10px] text-slate-300">
                      Coordinated with DoE, Civil Defense & LOAB
                    </div>
                  </div>
                  <div className="rounded-md bg-blue-600/30 border border-blue-400/40 px-2 py-0.5 text-[10px] font-bold text-blue-300">
                    Q2 2024
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Body Content (8 cols Left / 4 cols Right) */}
      <section className="relative z-20 -mt-6 sm:-mt-7 mx-auto w-full max-w-6xl px-4 pb-20">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* ================= LEFT COLUMN: INCIDENT & INQUIRY REPORTS (8 COLS) ================= */}
          <div className="flex flex-col gap-6 lg:col-span-8">
            {/* CARD 1: INCIDENT REPORTS */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-4 mb-5">
                <div>
                  <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span>INCIDENT REPORTS</span>
                  </h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Real-time incident log across terminals, distribution centers, and retail channels
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-slate-500">
                    Showing{" "}
                    <strong className="text-slate-800">
                      {filteredIncidents.length}
                    </strong>{" "}
                    incidents
                  </span>
                  {(searchTerm ||
                    selectedType !== "all" ||
                    selectedLocation !== "all" ||
                    selectedDate) && (
                    <button
                      onClick={handleResetFilters}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline ml-1"
                    >
                      <RefreshCw className="h-3 w-3" /> Reset
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Controls Bar */}
              <div className="mb-6 rounded-lg border border-slate-100 bg-slate-50/70 p-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-2.5 items-end">
                  {/* Search Input */}
                  <div className="md:col-span-4">
                    <Input
                      placeholder="Search incidents..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                      }}
                      size="sm"
                      prefix={<Search className="h-3.5 w-3.5 text-slate-400" />}
                      className="bg-white text-xs h-9"
                    />
                  </div>

                  {/* Incident Type Select */}
                  <div className="md:col-span-3">
                    <Select
                      value={selectedType}
                      onChange={(e) => {
                        setSelectedType(e.target.value);
                        setCurrentPage(1);
                      }}
                      size="sm"
                      className="bg-white text-xs h-9"
                      options={[
                        { label: "All Types", value: "all" },
                        { label: "Leakage", value: "leakage" },
                        { label: "Fire", value: "fire" },
                        { label: "Explosion", value: "explosion" },
                        { label: "Transport Accident", value: "transport accident" },
                      ]}
                    />
                  </div>

                  {/* Location Select */}
                  <div className="md:col-span-3">
                    <Select
                      value={selectedLocation}
                      onChange={(e) => {
                        setSelectedLocation(e.target.value);
                        setCurrentPage(1);
                      }}
                      size="sm"
                      className="bg-white text-xs h-9"
                      options={[
                        { label: "All Locations", value: "all" },
                        { label: "Chattogram", value: "chattogram" },
                        { label: "Dhaka", value: "dhaka" },
                        { label: "Narayanganj", value: "narayanganj" },
                        { label: "Khulna", value: "khulna" },
                        { label: "Gazipur", value: "gazipur" },
                        { label: "Bogura", value: "bogura" },
                        { label: "Barishal", value: "barishal" },
                      ]}
                    />
                  </div>

                  {/* Search / Filter Button */}
                  <div className="md:col-span-2">
                    <button
                      onClick={() => setCurrentPage(1)}
                      className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-primary h-9 px-3 text-xs font-bold text-white hover:bg-primary/90 transition-colors shadow-xs"
                    >
                      <Search className="h-3.5 w-3.5" />
                      <span>Search</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Incidents Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Incident ID</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-center">View</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedIncidents.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-8 text-center text-slate-500">
                        No incidents found matching the selected filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedIncidents.map((incident) => {
                      const isResolved = incident.status === "Resolved";
                      return (
                        <TableRow key={incident.id}>
                          <TableCell className="font-semibold text-slate-900 whitespace-nowrap">
                            {incident.id}
                          </TableCell>
                          <TableCell className="text-slate-700 font-medium">
                            <span className="inline-flex items-center gap-1.5">
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  incident.type === "Explosion"
                                    ? "bg-red-500"
                                    : incident.type === "Fire"
                                    ? "bg-amber-500"
                                    : "bg-blue-500"
                                }`}
                              />
                              {incident.type}
                            </span>
                          </TableCell>
                          <TableCell className="text-slate-600">
                            {incident.location}
                          </TableCell>
                          <TableCell className="text-slate-500 whitespace-nowrap">
                            {incident.date}
                          </TableCell>
                          <TableCell className="whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                                isResolved
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                                  : "bg-amber-50 text-amber-700 border border-amber-200/60"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  isResolved ? "bg-emerald-500" : "bg-amber-500 animate-ping"
                                }`}
                              />
                              {incident.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-center">
                            <button
                              onClick={() => setActiveModalIncident(incident)}
                              title={`View details for ${incident.id}`}
                              className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:border-primary hover:bg-blue-50 hover:text-primary transition-colors"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
                <span>
                  Page <strong className="text-slate-900">{currentPage}</strong> of{" "}
                  <strong className="text-slate-900">{totalPages}</strong>
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="inline-flex h-8 px-2.5 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  >
                    &lt;
                  </button>

                  {Array.from({ length: totalPages }).map((_, idx) => {
                    const pageNum = idx + 1;
                    const isActive = pageNum === currentPage;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`inline-flex h-8 w-8 items-center justify-center rounded-lg font-bold text-xs transition-colors ${
                          isActive
                            ? "bg-primary text-white shadow-2xs"
                            : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="inline-flex h-8 px-2.5 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors"
                  >
                    &gt;
                  </button>
                </div>
              </div>
            </div>

            {/* CARD 2: INQUIRY REPORTS (Linked to Incidents) */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs">
              <div className="border-b border-slate-100 pb-4 mb-4">
                <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-600" />
                  <span>INQUIRY REPORTS</span>
                  <span className="text-xs font-medium text-slate-500 lowercase">
                    (linked to incidents)
                  </span>
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Formal investigation dockets published by authorized regulatory agencies
                </p>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Inquiry ID</TableHead>
                    <TableHead>Related Incident</TableHead>
                    <TableHead>Conducted By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-center">Report</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {INQUIRY_REPORTS.map((inq) => (
                    <TableRow key={inq.inquiryId}>
                      <TableCell className="font-semibold text-slate-900 whitespace-nowrap">
                        {inq.inquiryId}
                      </TableCell>
                      <TableCell className="text-primary font-medium whitespace-nowrap">
                        <button
                          onClick={() => {
                            const found = INCIDENT_DATA.find((x) => x.id === inq.relatedIncident);
                            if (found) setActiveModalIncident(found);
                          }}
                          className="hover:underline flex items-center gap-1 text-xs"
                        >
                          <span>{inq.relatedIncident}</span>
                          <ExternalLink className="h-3 w-3 opacity-70" />
                        </button>
                      </TableCell>
                      <TableCell className="text-slate-700 font-medium">
                        {inq.agencyFull} ({inq.conductedBy})
                      </TableCell>
                      <TableCell className="text-slate-500 whitespace-nowrap">
                        {inq.date}
                      </TableCell>
                      <TableCell className="text-center">
                        <button
                          onClick={() => handleDownloadReport(inq)}
                          title={`Download ${inq.inquiryId} PDF (${inq.fileSize})`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:border-primary hover:bg-blue-50 hover:text-primary transition-colors"
                        >
                          <Download className="h-3.5 w-3.5 text-blue-600" />
                          <span>PDF</span>
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: ANNOUNCEMENTS & BERC & GLOBAL (4 COLS) ================= */}
          <div className="flex flex-col gap-6 lg:col-span-4">
            {/* CARD 1: BERC MESSAGE / ANNOUNCEMENT */}
            <div className="relative overflow-hidden rounded-xl border border-amber-200/80 bg-gradient-to-br from-amber-50/80 via-white to-amber-50/30 p-5 shadow-2xs">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-white shadow-xs">
                    <BellRing className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      BERC ANNOUNCEMENT
                    </h3>
                    <p className="text-[10px] text-amber-700 font-semibold">
                      Bangladesh Energy Regulatory Commission
                    </p>
                  </div>
                </div>

                {/* BERC Seal Badge */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-emerald-600 bg-white p-1 shadow-2xs">
                  <div className="h-full w-full rounded-full bg-red-600 flex items-center justify-center text-[8px] font-black text-white text-center leading-none">
                    BERC
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-amber-200/60 bg-white/90 p-3.5 mb-3">
                <div className="text-xs font-bold text-slate-900 mb-1">
                  Monthly LPG Price Revision Circular
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  BERC has revised the standard 12kg cylinder LPG price effective from 1st June 2024. Please check the official circular for itemized pricing and regional auto-gas quotas.
                </p>
              </div>

              <button
                onClick={() =>
                  toast.info(
                    "BERC Circular #2024/06: Standard 12kg LPG price announced at BDT 1,363 inclusive of VAT."
                  )
                }
                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-900 hover:underline transition-colors"
              >
                <span>View Price Circular Details</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* CARD 2: STAKEHOLDER ANNOUNCEMENTS */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs">
              <div className="border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Building className="h-3.5 w-3.5 text-blue-600" />
                  <span>STAKEHOLDER ANNOUNCEMENTS</span>
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  Direct notices from certified regulatory and operator bodies
                </p>
              </div>

              {/* Stakeholder Mini Tabs */}
              <div className="grid grid-cols-4 gap-1 rounded-lg border border-slate-200 bg-slate-100/70 p-1 mb-4">
                {Object.keys(STAKEHOLDER_ANNOUNCEMENTS).map((tab) => {
                  const isActive = activeStakeholderTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveStakeholderTab(tab)}
                      className={`rounded-md py-1.5 text-[11px] font-bold text-center transition-all ${
                        isActive
                          ? "bg-white text-slate-900 shadow-2xs border border-slate-200/60"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {tab}
                    </button>
                  );
                })}
              </div>

              {/* Announcements List */}
              <div className="flex flex-col divide-y divide-slate-100">
                {STAKEHOLDER_ANNOUNCEMENTS[activeStakeholderTab]?.map((ann) => (
                  <div key={ann.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="inline-block rounded bg-blue-50 px-1.5 py-0.5 text-[9px] font-bold text-blue-700">
                        {ann.tag}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {ann.date}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 hover:text-primary transition-colors cursor-pointer">
                      {ann.title}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {ann.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() =>
                    toast.info(`Viewing all ${activeStakeholderTab} official archives.`)
                  }
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                >
                  <span>View All Announcements</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* CARD 3: GLOBAL LPG MARKET UPDATE */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs">
              <div className="border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Globe2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>GLOBAL LPG MARKET UPDATE</span>
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  International freight, contract price (CP), and commodity trends
                </p>
              </div>

              <div className="flex flex-col divide-y divide-slate-100">
                {GLOBAL_NEWS.map((news) => (
                  <div key={news.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-bold text-slate-700">
                        {news.source}
                      </span>
                      <span className="text-[10px] text-slate-500">{news.time}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 leading-snug hover:text-primary transition-colors cursor-pointer">
                      {news.title}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {news.summary}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() =>
                    toast.info("Connecting to International LPG Energy Index feed...")
                  }
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                >
                  <span>View All News</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Interactive Incident Detail Modal */}
      {activeModalIncident && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
          onClick={() => setActiveModalIncident(null)}
        >
          <div
            className="w-full max-w-xl rounded-xl border border-slate-200 bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-slate-900">
                    {activeModalIncident.id}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      activeModalIncident.status === "Resolved"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {activeModalIncident.status}
                  </span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                    {activeModalIncident.type}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  Recorded Date: {activeModalIncident.date}
                </div>
              </div>

              <button
                onClick={() => setActiveModalIncident(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="py-4 space-y-3.5 text-xs">
              <div>
                <span className="font-bold text-slate-700">Location:</span>{" "}
                <span className="text-slate-900">
                  {activeModalIncident.specificLocation}
                </span>
              </div>

              <div>
                <span className="font-bold text-slate-700">Severity Rating:</span>{" "}
                <span
                  className={`font-semibold ${
                    activeModalIncident.severity === "Critical"
                      ? "text-red-600"
                      : activeModalIncident.severity === "High"
                      ? "text-amber-600"
                      : "text-blue-600"
                  }`}
                >
                  {activeModalIncident.severity}
                </span>
              </div>

              <div>
                <span className="font-bold text-slate-700">Conducted By:</span>{" "}
                <span className="text-slate-900 font-medium">
                  {activeModalIncident.conductedBy}
                </span>
              </div>

              <div>
                <span className="font-bold text-slate-700">Casualties & Impact:</span>{" "}
                <span className="text-slate-900">
                  {activeModalIncident.casualties}
                </span>
              </div>

              <div className="rounded-lg bg-slate-50 p-3 border border-slate-200/80">
                <span className="font-bold text-slate-800 block mb-1">
                  Incident Narrative & Investigation Notes:
                </span>
                <p className="text-slate-600 leading-relaxed">
                  {activeModalIncident.details}
                </p>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-blue-50/70 p-3 border border-blue-100">
                <div className="text-xs text-blue-900 font-semibold">
                  Linked Inquiry Dossier:{" "}
                  <strong>{activeModalIncident.investigationReport}</strong>
                </div>
                <button
                  onClick={() => {
                    toast.success(
                      `Downloading dossier ${activeModalIncident.investigationReport}.pdf`
                    );
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-primary/90 transition-colors"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Report</span>
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end border-t border-slate-100 pt-3">
              <button
                onClick={() => setActiveModalIncident(null)}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function MarketUpdatesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="flex items-center gap-3 text-slate-600 font-semibold text-sm">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span>Loading Market Updates...</span>
          </div>
        </div>
      }
    >
      <MarketUpdatesContent />
    </Suspense>
  );
}

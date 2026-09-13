"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import MarketUpdatesHero from "./MarketUpdatesHero";
import IncidentRegistryTable from "./IncidentRegistryTable";
import InquiryReportsTable from "./InquiryReportsTable";
import StakeholderAnnouncementsSection from "./StakeholderAnnouncementsSection";
import IncidentDetailModal from "./IncidentDetailModal";

export const INCIDENT_DATA = [
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

export const INQUIRY_REPORTS = [
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

export const STAKEHOLDER_ANNOUNCEMENTS = {
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

export const GLOBAL_NEWS = [
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

export default function MarketUpdatesContent() {
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
      <MarketUpdatesHero />

      {/* 2. Main 2-Column Content Grid */}
      <section className="py-10 sm:py-14">
        <div className="site-container">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            
            {/* LEFT COLUMN: INCIDENT REGISTRY & INQUIRY REPORTS (8 COLS) */}
            <div className="flex flex-col gap-8 lg:col-span-8">
              <IncidentRegistryTable
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
                paginatedIncidents={paginatedIncidents}
                handleResetFilters={handleResetFilters}
                setActiveModalIncident={setActiveModalIncident}
              />

              <InquiryReportsTable
                inquiryReports={INQUIRY_REPORTS}
                incidentData={INCIDENT_DATA}
                setActiveModalIncident={setActiveModalIncident}
                handleDownloadReport={handleDownloadReport}
              />
            </div>

            {/* RIGHT COLUMN: ANNOUNCEMENTS & BERC & GLOBAL (4 COLS) */}
            <StakeholderAnnouncementsSection
              stakeholderAnnouncements={STAKEHOLDER_ANNOUNCEMENTS}
              globalNews={GLOBAL_NEWS}
              activeStakeholderTab={activeStakeholderTab}
              setActiveStakeholderTab={setActiveStakeholderTab}
            />

          </div>
        </div>
      </section>

      {/* 3. Interactive Incident Detail Modal */}
      <IncidentDetailModal
        activeModalIncident={activeModalIncident}
        setActiveModalIncident={setActiveModalIncident}
      />
    </main>
  );
}

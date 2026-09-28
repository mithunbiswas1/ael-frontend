// src/app/(pages)/market-updates/_view/MarketUpdatesContent.jsx
"use client";

import { useState, useMemo } from "react";
import { toast } from "sonner";
import VisualHeroBanner from "@/components/ui/VisualHeroBanner";
import IncidentRegistryTable from "../_components/IncidentRegistryTable";
import MarketUpdatesTabsSection from "../_components/MarketUpdatesTabsSection";
import BercMessagesSection from "../_components/BercMessagesSection";
import GlobalMarketSection from "../_components/GlobalMarketSection";
import { useDictionary } from "@/context/DictionaryContext";

export default function MarketUpdatesContent({ bannerData, sections = {} }) {
  const { locale, dict } = useDictionary();
  const isBn = locale === "bn";
  const mu = dict?.marketUpdates || {};
  const common = dict?.common || {};

  const incidentsList = Array.isArray(sections?.incidents) ? sections.incidents : [];
  const bercMessages = Array.isArray(sections?.bercMessages) ? sections.bercMessages : [];
  const globalNews = Array.isArray(sections?.globalNews) ? sections.globalNews : [];

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [activeTab, setActiveTab] = useState("incidents");

  // Localized incidents list
  const localizedIncidents = useMemo(() => {
    return incidentsList.map((item) => ({
      ...item,
      type: isBn ? item.typeBn || item.type : item.type,
      location: isBn ? item.locationBn || item.location : item.location,
      specificLocation: isBn ? item.specificLocationBn || item.specificLocation : item.specificLocation,
      date: isBn ? item.dateBn || item.date : item.date,
      status: isBn ? item.statusBn || item.status : item.status,
      severity: isBn ? item.severityBn || item.severity : item.severity,
      details: isBn ? item.detailsBn || item.details : item.details,
      casualties: isBn ? item.casualtiesBn || item.casualties : item.casualties,
    }));
  }, [incidentsList, isBn]);

  // Filtered Incidents
  const filteredIncidents = useMemo(() => {
    return localizedIncidents.filter((item) => {
      const matchesSearch =
        !searchTerm ||
        item.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.details?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        selectedType === "all" ||
        item.type?.toLowerCase() === selectedType.toLowerCase();

      const matchesLocation =
        selectedLocation === "all" ||
        item.location?.toLowerCase() === selectedLocation.toLowerCase();

      const matchesDate =
        !selectedDate || item.date?.toLowerCase().includes(selectedDate.toLowerCase());

      return matchesSearch && matchesType && matchesLocation && matchesDate;
    });
  }, [localizedIncidents, searchTerm, selectedType, selectedLocation, selectedDate]);

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

  return (
    <main className="min-h-screen bg-slate-50">
      {/* 1. Hero Banner passed from page */}
      {bannerData && <VisualHeroBanner data={bannerData} />}

      {/* 2. Tabbed Content */}
      <section className="py-10 sm:py-14">
        <div className="site-container">
          <MarketUpdatesTabsSection
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />

          {activeTab === "incidents" && (
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
            />
          )}

          {activeTab === "berc" && (
            <BercMessagesSection bercMessages={bercMessages} />
          )}

          {activeTab === "global" && (
            <GlobalMarketSection globalNews={globalNews} />
          )}
        </div>
      </section>
    </main>
  );
}

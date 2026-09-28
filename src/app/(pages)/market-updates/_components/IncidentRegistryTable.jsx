"use client";

import Link from "next/link";
import { Search, RotateCcw, Shield } from "lucide-react";
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
import { useDictionary } from "@/context/DictionaryContext";

export default function IncidentRegistryTable({
  searchTerm,
  setSearchTerm,
  selectedType,
  setSelectedType,
  selectedDate,
  setSelectedDate,
  currentPage,
  setCurrentPage,
  totalPages,
  paginatedIncidents,
  handleResetFilters,
}) {
  const { locale, dict } = useDictionary();
  const isBn = locale === "bn";
  const mu = dict?.marketUpdates || {};
  const common = dict?.common || {};

  const typeLabels = {
    all: mu.allTypes || (isBn ? "সকল দুর্ঘটনার ধরন" : "All Incident Types"),
    leakage: mu.leakage || (isBn ? "গ্যাস লিক" : "Leakage"),
    fire: mu.fire || (isBn ? "অগ্নি দুর্ঘটনা" : "Fire"),
    explosion: mu.explosion || (isBn ? "বিস্ফোরণ" : "Explosion"),
    "transport accident": mu.transportAccident || (isBn ? "পরিবহন দুর্ঘটনা" : "Transport Accident"),
  };

  const getIncidentTypeLabel = (type) => {
    const key = type.toLowerCase();
    return typeLabels[key] || type;
  };

  const getStatusLabel = (status) => {
    if (status === "Resolved") return isBn ? "সমাধানকৃত" : "Resolved";
    if (status === "Under Investigation") return isBn ? "তদন্তাধীন" : "Under Investigation";
    return status;
  };

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-2xs">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 mb-4">
        <div>
          <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span>{mu.incidentReportsTitle || (isBn ? "দুর্ঘটনা রিপোর্ট" : "INCIDENT REPORTS")}</span>
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            {mu.incidentReportsSub ||
              (isBn
                ? "সারাদেশে যাচাইকৃত নিরাপত্তা, গ্যাস লিক ও নিয়ন্ত্রণ সংক্রান্ত ঘটনাবলী"
                : "Verified safety, leakage, and containment occurrences nationwide")}
          </p>
        </div>

        <button
          onClick={handleResetFilters}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-medium self-start sm:self-auto"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span>{mu.resetFilters || (isBn ? "ফিল্টার রিসেট" : "Reset Filters")}</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-lg border border-slate-200/70 bg-slate-50/60 p-3 mb-4">
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-12">
          {/* Keyword Search */}
          <div className="md:col-span-5">
            <Input
              type="text"
              placeholder={
                mu.searchPlaceholder ||
                (isBn ? "আইডি বা কিওয়ার্ড দিয়ে খুঁজুন..." : "Search by ID, keyword...")
              }
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              prefix={<Search className="h-3.5 w-3.5" />}
              size="sm"
              className="bg-white text-xs h-9"
            />
          </div>

          {/* Type Select */}
          <div className="md:col-span-4">
            <Select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
              size="sm"
              className="bg-white text-xs h-9"
              options={[
                { label: typeLabels.all, value: "all" },
                { label: typeLabels.leakage, value: "leakage" },
                { label: typeLabels.fire, value: "fire" },
                { label: typeLabels.explosion, value: "explosion" },
                { label: typeLabels["transport accident"], value: "transport accident" },
              ]}
            />
          </div>

          {/* Search / Filter Button */}
          <div className="md:col-span-3">
            <button
              onClick={() => setCurrentPage(1)}
              className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-primary h-9 px-3 text-xs font-bold text-white hover:bg-primary/90 transition-colors shadow-xs"
            >
              <Search className="h-3.5 w-3.5" />
              <span>{common.search || (isBn ? "অনুসন্ধান" : "Search")}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Incidents Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{mu.colId || (isBn ? "ঘটনার আইডি" : "Incident ID")}</TableHead>
            <TableHead>{mu.colType || (isBn ? "ধরন" : "Type")}</TableHead>
            <TableHead>{isBn ? "তারিখ" : "Date"}</TableHead>
            <TableHead>{mu.colStatus || (isBn ? "অবস্থা" : "Status")}</TableHead>
            <TableHead className="text-center">{mu.colAction || (isBn ? "অ্যাকশন" : "View")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedIncidents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="py-8 text-center text-slate-500">
                {isBn
                  ? "নির্বাচিত ফিল্টারের সাথে মিলে এমন কোনো ঘটনা পাওয়া যায়নি।"
                  : "No incidents found matching the selected filters."}
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
                      {getIncidentTypeLabel(incident.type)}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-500 whitespace-nowrap">
                    {incident.date}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        isResolved
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {getStatusLabel(incident.status)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Link
                      href={`/market-updates/${incident.id}`}
                      className="inline-flex h-7 items-center justify-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 hover:border-primary hover:bg-blue-50 hover:text-primary transition-colors"
                    >
                      {mu.viewDetails || (isBn ? "দেখুন" : "View")}
                    </Link>
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
          {isBn ? "পৃষ্ঠা " : "Page "}
          <strong className="text-slate-900">{currentPage}</strong>{" "}
          {isBn ? "এর মধ্যে " : "of "}
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
  );
}
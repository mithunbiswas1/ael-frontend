// src/app/(dashboard)/admin/safety-guidelines/page.jsx
"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/ui/AdminPageHeader";
import {
  FaPlus,
  FaFilePdf,
  FaSearch,
  FaEdit,
  FaTrashAlt,
  FaDownload,
  FaEye,
  FaLock,
  FaUnlock,
  FaBuilding,
  FaShieldAlt,
  FaGlobe,
  FaLayerGroup,
  FaExternalLinkAlt,
  FaFilter,
} from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { Input } from "@/components/ui/Input";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import { H1, H3, P } from "@/components/ui/Typography";
import {
  useGetPageByKeyQuery,
  useUpdatePageByKeyMutation,
} from "@/redux/api/pageApi";
import PermissionGuard from "@/components/ui/PermissionGuard";
import Pagination from "@/components/ui/Pagination";

// The 4 Core Stakeholder Categories + All
const CATEGORY_TABS = [
  { id: "all", label: "All Categories", labelBn: "সকল ক্যাটাগরি" },
  { id: "investors", label: "Investors", labelBn: "বিনিয়োগকারী ও শিল্প" },
  { id: "dealer", label: "Dealer", labelBn: "ডিলার ও রিটেইলার" },
  { id: "distributor", label: "Distributor", labelBn: "পরিবেশক ও পরিবহন" },
  { id: "customer", label: "Customer", labelBn: "গৃহস্থালি ও ভোক্তা" },
];

const CATEGORY_BADGES = {
  investors: { label: "Investors", variant: "success", bg: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  dealer: { label: "Dealer", variant: "warning", bg: "bg-amber-50 text-amber-700 border-amber-200" },
  distributor: { label: "Distributor", variant: "primary", bg: "bg-blue-50 text-blue-700 border-blue-200" },
  customer: { label: "Customer", variant: "info", bg: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  all: { label: "All Stakeholders", variant: "default", bg: "bg-slate-100 text-slate-700 border-slate-200" },
};

export default function SafetyGuidelinesListPage() {
  const router = useRouter();
  const { data: pageData, isLoading } = useGetPageByKeyQuery("safety-guidelines");
  const [updatePage, { isLoading: isDeleting }] = useUpdatePageByKeyMutation();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all"); // "all" | "guideline" | "agency"
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [page, setPage] = useState(1);

  // Extract both collections from page sections
  const documents = useMemo(() => {
    return Array.isArray(pageData?.data?.sections?.documentDownloads)
      ? pageData.data.sections.documentDownloads.map((doc) => ({
          ...doc,
          itemType: "guideline",
          category: doc.targetTab || "investors",
          displayTitle: doc.nameEn,
          displayTitleBn: doc.nameBn,
        }))
      : [];
  }, [pageData]);

  const agencies = useMemo(() => {
    return Array.isArray(pageData?.data?.sections?.regulatoryAgencies)
      ? pageData.data.sections.regulatoryAgencies.map((agency) => ({
          ...agency,
          itemType: "agency",
          category: agency.targetTab || "investors",
          displayTitle: `${agency.name} — ${agency.titleEn}`,
          displayTitleBn: agency.titleBn,
        }))
      : [];
  }, [pageData]);

  // Unified items list
  const allItems = useMemo(() => {
    return [...documents, ...agencies];
  }, [documents, agencies]);

  // Filtered Items
  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      // Type Filter
      if (selectedType !== "all" && item.itemType !== selectedType) {
        return false;
      }

      // Category Filter (4 Categories: investors, dealer, distributor, customer)
      if (selectedCategory !== "all") {
        if (item.category !== selectedCategory && item.category !== "all") {
          return false;
        }
      }

      // Search Filter
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesEn = item.displayTitle?.toLowerCase().includes(q);
        const matchesBn = item.displayTitleBn?.toLowerCase().includes(q);
        const matchesName = item.name?.toLowerCase().includes(q);
        const matchesFile = item.fileName?.toLowerCase().includes(q);
        return matchesEn || matchesBn || matchesName || matchesFile;
      }

      return true;
    });
  }, [allItems, selectedType, selectedCategory, search]);

  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / 10) || 1;
  const paginatedItems = filteredItems.slice((page - 1) * 10, page * 10);


  // Handle Deletion
  const handleDelete = async () => {
    if (!deleteTarget || !pageData?.data) return;

    try {
      const existingSections = pageData.data.sections || {};
      let updatedDocs = existingSections.documentDownloads || [];
      let updatedAgencies = existingSections.regulatoryAgencies || [];

      if (deleteTarget.itemType === "guideline") {
        updatedDocs = updatedDocs.filter((d) => String(d.id) !== String(deleteTarget.id));
      } else {
        updatedAgencies = updatedAgencies.filter((a) => String(a.id) !== String(deleteTarget.id));
      }

      const updatedSections = {
        ...existingSections,
        documentDownloads: updatedDocs,
        regulatoryAgencies: updatedAgencies,
      };

      await updatePage({
        pageKey: "safety-guidelines",
        data: {
          ...pageData.data,
          sections: updatedSections,
        },
      }).unwrap();

      toast.success(
        `${deleteTarget.itemType === "guideline" ? "Safety guideline document" : "Regulatory agency entry"} deleted successfully!`
      );
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete item. Please try again.");
    }
  };

  return (
    <PermissionGuard module="safety_guidelines" action="view">
      <div className="space-y-6">
        {/* Top Header */}
        {/* Page Title & Action */}
        <AdminPageHeader
          icon={FaFilePdf}
          title="Safety Guidelines & Regulatory Authorities"
          action={
            <div className="flex items-center gap-2">
              <Link
                href="/safety-guidelines"
                target="_blank"
                className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition-colors"
              >
                <FaEye className="h-3.5 w-3.5" />
                <span>View Live Page</span>
              </Link>

              <PermissionGuard module="safety_guidelines" action="create">
                <Button
                  onClick={() => router.push("/admin/safety-guidelines/add")}
                  variant="primary"
                  size="default"
                  className="gap-2"
                >
                  <FaPlus className="h-3.5 w-3.5" />
                  <span>Add New Entry</span>
                </Button>
              </PermissionGuard>
            </div>
          }
        />

        {/* 4 Category Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1.5">
            <FaFilter className="h-3 w-3" />
            Category:
          </span>
          {CATEGORY_TABS.map((cat) => {
            const count =
              cat.id === "all"
                ? allItems.length
                : allItems.filter((i) => i.category === cat.id || i.category === "all").length;

            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setPage(1);
                }}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                  selectedCategory === cat.id
                    ? "bg-primary text-white shadow-2xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    selectedCategory === cat.id
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Secondary Type Filter - Matching Blog Filter Card */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/80">
          <div className="w-full sm:w-80">
            <SearchInput
              placeholder="Search by title, agency code, or filename..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              onClear={() => {
                setSearch("");
                setPage(1);
              }}
              size="sm"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setPage(1);
              }}
              className="text-xs font-semibold w-full sm:w-64"
            >
              <option value="all">All Content Types</option>
              <option value="guideline">Safety Guidelines & Manuals</option>
              <option value="agency">Regulatory Agencies & Authorities</option>
            </Select>

            {(search || selectedCategory !== "all" || selectedType !== "all") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("all");
                  setSelectedType("all");
                  setPage(1);
                }}
                className="text-xs font-bold text-slate-500 hover:text-primary underline shrink-0"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-xl border border-slate-200/90 bg-white shadow-2xs overflow-hidden">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <P className="text-xs text-slate-500">Loading safety & compliance entries...</P>
              </div>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
                <FaFilePdf className="h-6 w-6" />
              </div>
              <H3 className="text-sm font-bold text-slate-800">No safety entries found</H3>
              <P className="mt-1 text-xs text-slate-400 max-w-sm">
                No items match your filter criteria. Try choosing another category or click below to create one.
              </P>
              <PermissionGuard module="safety_guidelines" action="create">
                <LinkButton
                  href="/admin/safety-guidelines/add"
                  size="sm"
                  className="mt-4 gap-1.5"
                >
                  <FaPlus className="h-3 w-3" />
                  <span>Add First Entry</span>
                </LinkButton>
              </PermissionGuard>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80">
                  <TableHead className="font-bold text-slate-700">Type & Title / Name</TableHead>
                  <TableHead className="font-bold text-slate-700">Category</TableHead>
                  <TableHead className="font-bold text-slate-700">Access / Scope</TableHead>
                  <TableHead className="text-right font-bold text-slate-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedItems.map((item) => {
                  const isGuideline = item.itemType === "guideline";
                  const catBadge = CATEGORY_BADGES[item.category] || CATEGORY_BADGES.all;
                  const targetPdf = item.pdfUrl || (item.fileName ? `/public/upload/${item.fileName}` : null);
                  const fullPdfUrl = targetPdf
                    ? targetPdf.startsWith("http")
                      ? targetPdf
                      : `${process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") || "http://localhost:8005"}${targetPdf}`
                    : null;

                  return (
                    <TableRow key={item.id} className="hover:bg-slate-50/50">
                      {/* Title & Type */}
                      <TableCell className="max-w-md py-3.5">
                        <div className="flex items-start gap-2.5">
                          <div
                            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                              isGuideline
                                ? "bg-rose-50 text-rose-600 border border-rose-200"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            }`}
                          >
                            {isGuideline ? (
                              <FaFilePdf className="h-4 w-4" />
                            ) : (
                              <FaBuilding className="h-4 w-4" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="truncate text-xs font-bold text-slate-900">
                                {item.displayTitle}
                              </span>
                              <span
                                className={`rounded px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                                  isGuideline
                                    ? "bg-slate-100 text-slate-600"
                                    : item.badgeBg || "bg-blue-50 text-blue-700"
                                }`}
                              >
                                {isGuideline ? "Guideline" : item.name || "Authority"}
                              </span>
                            </div>

                            {item.displayTitleBn && (
                              <div className="truncate text-[11px] font-bengali text-slate-500 mt-0.5">
                                {item.displayTitleBn}
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>

                      {/* Category Badge */}
                      <TableCell>
                        <span
                          className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold ${catBadge.bg}`}
                        >
                          {catBadge.label}
                        </span>
                      </TableCell>

                      {/* Access / Scope */}
                      <TableCell>
                        {isGuideline ? (
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                              item.access === "Public"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {item.access === "Public" ? (
                              <>
                                <FaUnlock className="h-2.5 w-2.5" />
                                <span>Public Access</span>
                              </>
                            ) : (
                              <>
                                <FaLock className="h-2.5 w-2.5" />
                                <span>Login Required</span>
                              </>
                            )}
                          </span>
                        ) : (
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                          >
                            <FaGlobe className="h-3 w-3 text-slate-400" />
                            <span className="truncate max-w-[140px]">
                              {item.href?.replace(/^https?:\/\//, "")}
                            </span>
                            <FaExternalLinkAlt className="h-2.5 w-2.5 opacity-60" />
                          </a>
                        )}
                      </TableCell>


                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {fullPdfUrl && (
                            <a
                              href={fullPdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-2xs hover:bg-slate-50 hover:text-primary transition-colors"
                              title="Open PDF"
                            >
                              <FaEye className="h-3.5 w-3.5" />
                            </a>
                          )}

                          <PermissionGuard module="safety_guidelines" action="edit">
                            <Link
                              href={`/admin/safety-guidelines/edit/${item.id}?type=${item.itemType}`}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 shadow-2xs hover:bg-slate-50 hover:text-primary transition-colors"
                              title="Edit Entry"
                            >
                              <FaEdit className="h-3.5 w-3.5" />
                            </Link>
                          </PermissionGuard>

                          <PermissionGuard module="safety_guidelines" action="delete">
                            <button
                              type="button"
                              onClick={() => setDeleteTarget(item)}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 bg-white text-rose-600 shadow-2xs hover:bg-rose-50 transition-colors"
                              title="Delete Entry"
                            >
                              <FaTrashAlt className="h-3.5 w-3.5" />
                            </button>
                          </PermissionGuard>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}

          {totalItems > 0 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={10}
              onPageChange={setPage}
            />
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-2xs p-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center gap-3 text-rose-600 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-50">
                  <FaTrashAlt className="h-5 w-5" />
                </div>
                <div>
                  <H3 className="text-sm font-bold text-slate-900">
                    Confirm Deletion
                  </H3>
                  <P className="text-[11px] text-slate-500">
                    This action will remove the item from the public portal.
                  </P>
                </div>
              </div>

              <div className="rounded-lg bg-slate-50 p-3 text-xs text-slate-700 space-y-1 mb-5">
                <div className="font-bold text-slate-900">
                  {deleteTarget.displayTitle}
                </div>
                <div className="text-[11px] text-slate-500">
                  Type: {deleteTarget.itemType === "guideline" ? "Safety Guideline" : "Regulatory Agency"} • Category: {deleteTarget.category}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setDeleteTarget(null)}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="gap-1.5"
                >
                  <FaTrashAlt className="h-3 w-3" />
                  <span>{isDeleting ? "Deleting..." : "Delete Permanently"}</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </PermissionGuard>
  );
}

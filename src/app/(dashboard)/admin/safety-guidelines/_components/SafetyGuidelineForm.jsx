// src/app/(dashboard)/admin/safety-guidelines/_components/SafetyGuidelineForm.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  FaArrowLeft,
  FaSave,
  FaFilePdf,
  FaUpload,
  FaTrashAlt,
  FaEye,
  FaBuilding,
  FaGlobe,
  FaCheckCircle,
  FaShieldAlt,
  FaExternalLinkAlt,
  FaInfoCircle,
} from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { getMediaUrl } from "@/utils/mediaUrl";
import { H3, P } from "@/components/ui/Typography";
import {
  useGetPageByKeyQuery,
  useUpdatePageByKeyMutation,
} from "@/redux/api/pageApi";
import { useUploadCoursePdfMutation } from "@/redux/api/courseApi";

export const STAKEHOLDER_CATEGORIES = [
  { value: "investors", label: "Investors (শিল্প কারখানা ও বিনিয়োগকারী)" },
  { value: "dealer", label: "Dealer (এলপিজি রিটেইলার ও ডিলার)" },
  { value: "distributor", label: "Distributor (পরিবেশক ও পরিবহনকারী)" },
  { value: "customer", label: "Customer (গৃহস্থালি ও সাধারণ ভোক্তা)" },
  { value: "all", label: "All Stakeholders (সকল অংশীজন)" },
];

export const CONTENT_TYPE_OPTIONS = [
  {
    value: "guideline",
    label: "Safety Guidelines & Manuals (নিরাপত্তা নির্দেশিকা ও ম্যানুয়াল)",
    description: "Downloadable SOPs, compliance guidelines and technical manuals.",
  },
  {
    value: "agency",
    label: "Regulatory Agencies & Authorities (নিয়ন্ত্রক কর্তৃপক্ষ ও অধিদপ্তর)",
    description: "Official government regulatory bodies, ministry portals & circulars.",
  },
];

export const ACCESS_OPTIONS = [
  { value: "Public", label: "Public Access (সবার জন্য উন্মুক্ত)" },
  { value: "Login Required", label: "Login Required (নিবন্ধিত ব্যবহারকারীদের জন্য)" },
];

export const BADGE_COLOR_OPTIONS = [
  { value: "bg-blue-50 text-blue-700 border-blue-200", label: "Blue Accent (বিইআরসি / জ্বালানি মন্ত্রণালয়)" },
  { value: "bg-red-50 text-red-700 border-red-200", label: "Red Accent (বিস্ফোরক পরিদপ্তর / জরুরি)" },
  { value: "bg-amber-50 text-amber-700 border-amber-200", label: "Amber / Orange (ফায়ার সার্ভিস ও সিভিল ডিফেন্স)" },
  { value: "bg-emerald-50 text-emerald-700 border-emerald-200", label: "Emerald Green (অপারেটর অ্যাসোসিয়েশন / লোয়াব)" },
  { value: "bg-purple-50 text-purple-700 border-purple-200", label: "Purple Accent (নীতিমালা / আন্তর্জাতিক গবেষণা)" },
];

export default function SafetyGuidelineForm({ itemId = null, docId = null, isEdit = false }) {
  const activeId = itemId || docId;
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryType = searchParams?.get("type"); // "guideline" | "agency"

  const { data: pageData, isLoading: isPageLoading } = useGetPageByKeyQuery("safety-guidelines");
  const [updatePage, { isLoading: isSaving }] = useUpdatePageByKeyMutation();
  const [uploadPdf, { isLoading: isUploadingPdf }] = useUploadCoursePdfMutation();

  const [contentType, setContentType] = useState(queryType === "agency" ? "agency" : "guideline");
  const [dragActive, setDragActive] = useState(false);

  // Unified Form State
  const [formData, setFormData] = useState({
    id: activeId || (contentType === "agency" ? `agency-${Date.now()}` : Date.now()),
    category: "investors", // 4 categories: investors, dealer, distributor, customer (or all)

    // Fields for "Safety Guidelines & Manuals"
    nameEn: "",
    nameBn: "",
    access: "Public",
    formatType: "PDF",
    descriptionEn: "",
    descriptionBn: "",

    // Fields for "Regulatory Agencies & Authorities"
    agencyName: "", // e.g., BERC, DoE, FSCD
    titleEn: "",
    titleBn: "",
    badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
    href: "https://",
    descEn: "",
    descBn: "",

    // Shared PDF Upload
    fileName: "",
    pdfUrl: "",
    pdfSize: "",
  });

  // Populate data when editing
  useEffect(() => {
    if (pageData?.data && isEdit && activeId) {
      const sections = pageData.data.sections || {};
      const docs = Array.isArray(sections.documentDownloads) ? sections.documentDownloads : [];
      const agencies = Array.isArray(sections.regulatoryAgencies) ? sections.regulatoryAgencies : [];

      // Check in guidelines
      const foundDoc = docs.find((d) => String(d.id) === String(activeId));
      if (foundDoc) {
        setContentType("guideline");
        setFormData({
          id: foundDoc.id,
          category: foundDoc.targetTab || "all",
          nameEn: foundDoc.nameEn || "",
          nameBn: foundDoc.nameBn || "",
          access: foundDoc.access || "Public",
          formatType: foundDoc.type || "PDF",
          descriptionEn: foundDoc.descriptionEn || "",
          descriptionBn: foundDoc.descriptionBn || "",
          agencyName: "",
          titleEn: "",
          titleBn: "",
          badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
          href: "https://",
          descEn: "",
          descBn: "",
          fileName: foundDoc.fileName || "",
          pdfUrl: foundDoc.pdfUrl || "",
          pdfSize: foundDoc.pdfSize || "",
        });
        return;
      }

      // Check in agencies
      const foundAgency = agencies.find((a) => String(a.id) === String(activeId));
      if (foundAgency) {
        setContentType("agency");
        setFormData({
          id: foundAgency.id,
          category: foundAgency.targetTab || "all",
          nameEn: "",
          nameBn: "",
          access: "Public",
          formatType: "PDF",
          descriptionEn: "",
          descriptionBn: "",
          agencyName: foundAgency.name || "",
          titleEn: foundAgency.titleEn || "",
          titleBn: foundAgency.titleBn || "",
          badgeBg: foundAgency.badgeBg || "bg-blue-50 text-blue-700 border-blue-200",
          href: foundAgency.href || "https://",
          descEn: foundAgency.descEn || "",
          descBn: foundAgency.descBn || "",
          fileName: foundAgency.fileName || "",
          pdfUrl: foundAgency.pdfUrl || "",
          pdfSize: foundAgency.pdfSize || "",
        });
      }
    }
  }, [pageData, isEdit, activeId]);

  // Handle PDF file upload
  const handlePdfUpload = async (file) => {
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      toast.error("Please upload a valid PDF document (.pdf)");
      return;
    }

    if (file.size > 25 * 1024 * 1024) {
      toast.error("PDF size exceeds 25MB limit");
      return;
    }

    try {
      const data = new FormData();
      data.append("pdf", file);

      const res = await uploadPdf(data).unwrap();
      const uploadedUrl = res?.data?.pdfUrl;
      const uploadedName = res?.data?.originalName || file.name;
      const formattedSize =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`;

      setFormData((prev) => ({
        ...prev,
        pdfUrl: uploadedUrl,
        fileName: uploadedName,
        pdfSize: formattedSize,
      }));

      toast.success(`PDF "${uploadedName}" uploaded successfully!`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to upload PDF file");
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePdfUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!pageData?.data) {
      toast.error("Page configuration not loaded. Please try again.");
      return;
    }

    const targetId = activeId || formData.id || Date.now();

    // Validation based on selected type
    if (contentType === "guideline") {
      if (!formData.nameEn?.trim()) {
        toast.error("Please enter the document title in English");
        return;
      }
      if (!formData.nameBn?.trim()) {
        toast.error("Please enter the document title in Bangla");
        return;
      }
    } else {
      if (!formData.agencyName?.trim()) {
        toast.error("Please enter the agency acronym / short code (e.g. BERC, DoE)");
        return;
      }
      if (!formData.titleEn?.trim()) {
        toast.error("Please enter the official authority name in English");
        return;
      }
      if (!formData.titleBn?.trim()) {
        toast.error("Please enter the official authority name in Bangla");
        return;
      }
      if (!formData.href?.trim() || formData.href === "https://") {
        toast.error("Please provide the authority official website URL");
        return;
      }
    }

    try {
      const existingSections = pageData.data.sections || {};
      let updatedDocs = Array.isArray(existingSections.documentDownloads)
        ? [...existingSections.documentDownloads]
        : [];
      let updatedAgencies = Array.isArray(existingSections.regulatoryAgencies)
        ? [...existingSections.regulatoryAgencies]
        : [];

      if (contentType === "guideline") {
        // Construct Guideline Object
        const guidelineItem = {
          id: targetId,
          itemType: "guideline",
          nameEn: (formData.nameEn || "").trim(),
          nameBn: (formData.nameBn || "").trim(),
          targetTab: formData.category || "all", // investors, dealer, distributor, customer, all
          type: formData.formatType || "PDF",
          access: formData.access || "Public",
          fileName: formData.fileName || "",
          pdfUrl: formData.pdfUrl || "",
          pdfSize: formData.pdfSize || "",
          descriptionEn: (formData.descriptionEn || "").trim(),
          descriptionBn: (formData.descriptionBn || "").trim(),
        };

        if (isEdit) {
          const docIndex = updatedDocs.findIndex((d) => String(d.id) === String(targetId));
          if (docIndex >= 0) {
            updatedDocs[docIndex] = guidelineItem;
          } else {
            updatedDocs.push(guidelineItem);
          }
          // Remove from agencies if previously was an agency
          updatedAgencies = updatedAgencies.filter((a) => String(a.id) !== String(targetId));
        } else {
          updatedDocs.push(guidelineItem);
        }
      } else {
        // Construct Agency Object
        const agencyItem = {
          id: targetId,
          itemType: "agency",
          name: (formData.agencyName || "").trim(),
          titleEn: (formData.titleEn || "").trim(),
          titleBn: (formData.titleBn || "").trim(),
          targetTab: formData.category || "all", // investors, dealer, distributor, customer, all
          descEn: (formData.descEn || "").trim(),
          descBn: (formData.descBn || "").trim(),
          badgeBg: formData.badgeBg || "bg-blue-50 text-blue-700 border-blue-200",
          href: (formData.href || "").trim(),
          fileName: formData.fileName || "",
          pdfUrl: formData.pdfUrl || "",
          pdfSize: formData.pdfSize || "",
        };

        if (isEdit) {
          const agencyIndex = updatedAgencies.findIndex((a) => String(a.id) === String(targetId));
          if (agencyIndex >= 0) {
            updatedAgencies[agencyIndex] = agencyItem;
          } else {
            updatedAgencies.push(agencyItem);
          }
          // Remove from docs if previously was a guideline
          updatedDocs = updatedDocs.filter((d) => String(d.id) !== String(targetId));
        } else {
          updatedAgencies.push(agencyItem);
        }
      }

      const updatedSections = {
        ...existingSections,
        documentDownloads: updatedDocs,
        regulatoryAgencies: updatedAgencies,
      };

      // Strip system metadata fields so Mongoose update succeeds without conflict
      const { _id, createdAt, updatedAt, __v, ...cleanPageData } = pageData.data;

      await updatePage({
        pageKey: "safety-guidelines",
        data: {
          ...cleanPageData,
          sections: updatedSections,
        },
      }).unwrap();

      toast.success(
        isEdit
          ? `${contentType === "guideline" ? "Safety guideline" : "Regulatory agency"} updated successfully!`
          : `${contentType === "guideline" ? "Safety guideline" : "Regulatory agency"} added successfully!`
      );

      router.push("/admin/safety-guidelines");
    } catch (err) {
      toast.error(err?.data?.message || err?.message || "Failed to save changes. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/safety-guidelines"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
          >
            <FaArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <H3 className="text-lg font-bold text-slate-900">
              {isEdit ? "Edit Safety Entry" : "Create New Safety & Compliance Entry"}
            </H3>
            <P className="text-xs text-slate-500">
              Select content type, choose stakeholder category, and fill in the corresponding details.
            </P>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/admin/safety-guidelines">
            <Button variant="outline" size="sm" type="button">
              Cancel
            </Button>
          </Link>
          <Button
            size="sm"
            onClick={handleSubmit}
            disabled={isSaving || isUploadingPdf || isPageLoading}
            className="gap-2"
          >
            <FaSave className="h-3.5 w-3.5" />
            <span>{isSaving ? "Saving..." : isEdit ? "Update Entry" : "Publish Entry"}</span>
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Content Type & Target Category Selector */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-800">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                1
              </span>
              <span>Content Type & Stakeholder Classification</span>
            </div>
            <span className="text-[11px] text-slate-400">Step 1 of 2</span>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Content Type Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Content Type <span className="text-rose-500">*</span>
              </label>
              <Select
                value={contentType}
                onChange={(e) => {
                  const val = e.target.value;
                  setContentType(val);
                  if (!formData.agencyName && val === "agency") {
                    setFormData((prev) => ({
                      ...prev,
                      agencyName: "BERC",
                    }));
                  }
                }}
                className="w-full text-xs font-semibold"
              >
                {CONTENT_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
              <p className="mt-1 text-[11px] text-slate-500">
                {CONTENT_TYPE_OPTIONS.find((c) => c.value === contentType)?.description}
              </p>
            </div>

            {/* Stakeholder Category Selector (The 4 Categories) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Target Stakeholder Category <span className="text-rose-500">*</span>
              </label>
              <Select
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
                className="w-full text-xs font-semibold"
              >
                {STAKEHOLDER_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </Select>
              <p className="mt-1 text-[11px] text-slate-500">
                Determines which tab this item is shown under on the public Safety Guidelines page.
              </p>
            </div>
          </div>
        </div>

        {/* Step 2: Dynamic Form Fields based on Type */}
        {contentType === "guideline" ? (
          /* ================================================================
             TYPE 1: SAFETY GUIDELINES & MANUALS
             ================================================================ */
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-800">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                    2
                  </span>
                  <FaFilePdf className="text-rose-500" />
                  <span>Safety Guideline & Manual Information</span>
                </div>
                <Badge variant="primary" className="text-[10px] font-bold">
                  Guideline
                </Badge>
              </div>

              {/* Title Fields */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Document Title <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g., NFPA 58: Liquefied Petroleum Gas Code Summary"
                    value={formData.nameEn}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, nameEn: e.target.value }))
                    }
                    className="text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-bengali">
                    ডকুমেন্ট টাইটেল <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g., এনএফপিএ ৫৮: এলপিজি নিরাপত্তা কোড ও স্ট্যান্ডার্ড সারসংক্ষেপ"
                    value={formData.nameBn}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, nameBn: e.target.value }))
                    }
                    className="text-xs font-bengali"
                    required
                  />
                </div>
              </div>

              {/* Access Level and Format */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Access Permission Level <span className="text-rose-500">*</span>
                  </label>
                  <Select
                    value={formData.access}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, access: e.target.value }))
                    }
                    className="w-full text-xs font-semibold"
                  >
                    {ACCESS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Select>
                  <p className="mt-1 text-[11px] text-slate-500">
                    "Public" enables one-click download. "Login Required" protects technical SOPs.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Document Format / Type
                  </label>
                  <Input
                    value={formData.formatType}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, formatType: e.target.value }))
                    }
                    placeholder="PDF, DOCX, ZIP"
                    className="text-xs font-semibold uppercase"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Overview / Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Brief description of the guideline, applicable regulations, or target audience..."
                    value={formData.descriptionEn}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, descriptionEn: e.target.value }))
                    }
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-bengali">
                    সংক্ষিপ্ত বিবরণ
                  </label>
                  <textarea
                    rows={3}
                    placeholder="নির্দেশিকার সংক্ষিপ্ত বিবরণ বা পালনীয় নিয়মাবলী..."
                    value={formData.descriptionBn}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, descriptionBn: e.target.value }))
                    }
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-xs font-bengali text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ================================================================
             TYPE 2: REGULATORY AGENCIES & AUTHORITIES
             ================================================================ */
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-800">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] text-white">
                    2
                  </span>
                  <FaBuilding className="text-emerald-600" />
                  <span>Regulatory Authority & Governance Details</span>
                </div>
                <Badge variant="success" className="text-[10px] font-bold">
                  Authority
                </Badge>
              </div>

              {/* Tag / Acronym & Official Portal URL */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Agency Acronym / Code <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g. BERC, DoE, FSCD, LOAB"
                    value={formData.agencyName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, agencyName: e.target.value.toUpperCase() }))
                    }
                    className="text-xs font-black tracking-wider uppercase"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Official Website / Portal URL <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <FaGlobe className="h-3.5 w-3.5" />
                    </div>
                    <Input
                      placeholder="https://berc.org.bd"
                      value={formData.href}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, href: e.target.value }))
                      }
                      className="pl-9 text-xs font-medium"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Agency Full Name (En & Bn) */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Institution Name <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g., Bangladesh Energy Regulatory Commission"
                    value={formData.titleEn}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, titleEn: e.target.value }))
                    }
                    className="text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-bengali">
                    প্রতিষ্ঠানের নাম <span className="text-rose-500">*</span>
                  </label>
                  <Input
                    placeholder="e.g., বাংলাদেশ এনার্জি রেগুলেটরি কমিশন"
                    value={formData.titleBn}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, titleBn: e.target.value }))
                    }
                    className="text-xs font-bengali"
                    required
                  />
                </div>
              </div>

              {/* Badge Theme Color */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Visual Badge Style / Color
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  {BADGE_COLOR_OPTIONS.map((badge) => (
                    <label
                      key={badge.value}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg border p-2.5 text-xs transition-all ${
                        formData.badgeBg === badge.value
                          ? "border-primary bg-primary/5 ring-1 ring-primary"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="badgeBg"
                        checked={formData.badgeBg === badge.value}
                        onChange={() =>
                          setFormData((prev) => ({ ...prev, badgeBg: badge.value }))
                        }
                        className="text-primary"
                      />
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${badge.value}`}>
                        {formData.agencyName || "TAG"}
                      </span>
                      <span className="text-[11px] font-medium text-slate-600">{badge.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Scope & Responsibilities (En & Bn) */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Regulatory Mandate & Scope
                  </label>
                  <textarea
                    rows={3}
                    placeholder="LPG licensing, pricing regulations and market operations..."
                    value={formData.descEn}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, descEn: e.target.value }))
                    }
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 font-bengali">
                    নিয়ন্ত্রক পরিধি ও বিবরণ
                  </label>
                  <textarea
                    rows={3}
                    placeholder="লাইসেন্সিং, ট্যারিফ রেগুলেশন ও অপারেশনস..."
                    value={formData.descBn}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, descBn: e.target.value }))
                    }
                    className="w-full rounded-lg border border-slate-200 p-2.5 text-xs font-bengali text-slate-800 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Shared PDF File Upload Section */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-800">
              <FaFilePdf className="text-primary" />
              <span>
                {contentType === "guideline"
                  ? "Attached Guideline PDF Document"
                  : "Official Gazette / Regulatory Notification PDF (Optional)"}
              </span>
            </div>
            {formData.pdfUrl && (
              <Badge variant="success" className="text-[10px]">
                PDF Attached
              </Badge>
            )}
          </div>

          {/* Drag & Drop Upload Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-all ${
              dragActive
                ? "border-primary bg-primary/5"
                : "border-slate-300 bg-slate-50/60 hover:border-slate-400"
            }`}
          >
            <input
              type="file"
              accept=".pdf,application/pdf"
              id="pdfUploadInput"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handlePdfUpload(e.target.files[0]);
                }
              }}
            />

            <div className="flex flex-col items-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-600 shadow-2xs">
                <FaUpload className="h-5 w-5" />
              </div>
              <div className="text-xs font-bold text-slate-800">
                Drag and drop your official PDF document here, or{" "}
                <label
                  htmlFor="pdfUploadInput"
                  className="cursor-pointer text-primary underline hover:text-blue-700"
                >
                  browse files
                </label>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                Supported format: Standard Adobe PDF (.pdf) • Maximum file size: 25MB
              </p>
            </div>

            {isUploadingPdf && (
              <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/80 backdrop-blur-xs">
                <div className="flex items-center gap-2 text-xs font-bold text-primary">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <span>Uploading PDF to cloud storage...</span>
                </div>
              </div>
            )}
          </div>

          {/* Uploaded File Status & Details Card */}
          {formData.pdfUrl ? (
            <div className="flex flex-col gap-3 rounded-lg border border-emerald-200 bg-emerald-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-2xs">
                  <FaFilePdf className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-xs font-bold text-slate-900">
                      {formData.fileName || "document.pdf"}
                    </span>
                    <FaCheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span>Size: {formData.pdfSize || "Verified"}</span>
                    <span>•</span>
                    <span className="truncate max-w-xs">{formData.pdfUrl}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={getMediaUrl(formData.pdfUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-emerald-300 bg-white px-3 text-xs font-bold text-emerald-700 shadow-2xs hover:bg-emerald-100 transition-colors"
                >
                  <FaEye className="h-3 w-3" />
                  <span>Preview PDF</span>
                </a>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      pdfUrl: "",
                      fileName: "",
                      pdfSize: "",
                    }))
                  }
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-rose-200 bg-white text-rose-600 shadow-2xs hover:bg-rose-50 transition-colors"
                  title="Remove PDF"
                >
                  <FaTrashAlt className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* Manual URL Input fallback */
            <div className="pt-2">
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                Or direct PDF URL link (Optional)
              </label>
              <Input
                placeholder="https://example.com/manuals/standard.pdf"
                value={formData.pdfUrl}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    pdfUrl: e.target.value,
                    fileName: prev.fileName || "manual-doc.pdf",
                  }))
                }
                className="text-xs"
              />
            </div>
          )}
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex items-center justify-between border-t border-slate-200 pt-5">
          <Link href="/admin/safety-guidelines">
            <Button variant="outline" size="sm" type="button">
              Discard Changes
            </Button>
          </Link>

          <Button
            size="sm"
            type="submit"
            disabled={isSaving || isUploadingPdf || isPageLoading}
            className="gap-2"
          >
            <FaSave className="h-3.5 w-3.5" />
            <span>{isSaving ? "Saving to Database..." : isEdit ? "Update Entry" : "Publish to Safety Page"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}

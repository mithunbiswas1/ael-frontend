// src/app/(dashboard)/admin/regulatory-agencies/_components/RegulatoryAgencyForm.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  FaArrowLeft,
  FaSave,
  FaBuilding,
  FaFilePdf,
  FaUpload,
  FaTrashAlt,
  FaEye,
  FaGlobe,
} from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { H3, P } from "@/components/ui/Typography";
import {
  useGetPageByKeyQuery,
  useUpdatePageByKeyMutation,
} from "@/redux/api/pageApi";
import { useUploadCoursePdfMutation } from "@/redux/api/courseApi";

export const BADGE_COLOR_OPTIONS = [
  { value: "bg-red-50 text-red-600 border-red-200", label: "Red Accent (বিস্ফোরক / জরুরি)" },
  { value: "bg-amber-50 text-amber-600 border-amber-200", label: "Amber / Orange (ফায়ার সার্ভিস / সতর্কতা)" },
  { value: "bg-emerald-50 text-emerald-600 border-emerald-200", label: "Emerald Green (অপারেটর অ্যাসোসিয়েশন)" },
  { value: "bg-blue-50 text-blue-600 border-blue-200", label: "Blue Accent (জ্বালানি মন্ত্রণালয় / বিইআরসি)" },
  { value: "bg-purple-50 text-purple-600 border-purple-200", label: "Purple Accent (স্ট্যান্ডার্ড / পলিসি)" },
];

export default function RegulatoryAgencyForm({ agencyId = null, isEdit = false }) {
  const router = useRouter();
  const { data: pageData, isLoading: isPageLoading } = useGetPageByKeyQuery("safety-guidelines");
  const [updatePage, { isLoading: isSaving }] = useUpdatePageByKeyMutation();
  const [uploadPdf, { isLoading: isUploadingPdf }] = useUploadCoursePdfMutation();

  const [formData, setFormData] = useState({
    id: agencyId || `agency-${Date.now()}`,
    name: "",
    titleEn: "",
    titleBn: "",
    descEn: "",
    descBn: "",
    badgeBg: "bg-blue-50 text-blue-600 border-blue-200",
    href: "https://",
    pdfUrl: "",
    fileName: "",
  });

  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (pageData?.data && isEdit && agencyId) {
      const agencies = pageData.data.sections?.regulatoryAgencies || [];
      const found = agencies.find((a) => String(a.id) === String(agencyId));
      if (found) {
        setFormData({
          id: found.id,
          name: found.name || "",
          titleEn: found.titleEn || "",
          titleBn: found.titleBn || "",
          descEn: found.descEn || "",
          descBn: found.descBn || "",
          badgeBg: found.badgeBg || "bg-blue-50 text-blue-600 border-blue-200",
          href: found.href || "https://",
          pdfUrl: found.pdfUrl || "",
          fileName: found.fileName || "",
        });
      }
    }
  }, [pageData, isEdit, agencyId]);

  // Handle PDF file upload
  const handlePdfUpload = async (file) => {
    if (!file) return;

    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      toast.error("Please upload a valid PDF document (.pdf)");
      return;
    }

    try {
      const data = new FormData();
      data.append("pdf", file);

      const res = await uploadPdf(data).unwrap();
      const uploadedUrl = res?.data?.pdfUrl;
      const uploadedName = res?.data?.originalName || file.name;

      setFormData((prev) => ({
        ...prev,
        pdfUrl: uploadedUrl,
        fileName: uploadedName,
      }));

      toast.success(`PDF "${uploadedName}" uploaded successfully!`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to upload PDF file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name?.trim() || !formData.titleEn?.trim() || !formData.titleBn?.trim()) {
      toast.error("Please provide agency tag and titles in both English and Bengali");
      return;
    }

    if (!pageData?.data) {
      toast.error("Unable to load parent page configuration");
      return;
    }

    try {
      const existingAgencies = pageData.data.sections?.regulatoryAgencies || [];
      let updatedAgencies = [];

      if (isEdit && agencyId) {
        updatedAgencies = existingAgencies.map((item) =>
          String(item.id) === String(agencyId) ? { ...formData } : item
        );
      } else {
        const newAgency = {
          ...formData,
          id: formData.name.toLowerCase().replace(/[^a-z0-9]/g, "-") || `agency-${Date.now()}`,
        };
        updatedAgencies = [...existingAgencies, newAgency];
      }

      const updatedSections = {
        ...(pageData.data.sections || {}),
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
        isEdit
          ? "Regulatory agency updated successfully!"
          : "Regulatory agency added successfully!"
      );

      router.push("/admin/regulatory-agencies");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save regulatory agency");
    }
  };

  if (isPageLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 bg-white rounded-xl border border-slate-200">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <P className="mt-4 text-xs font-semibold text-slate-500">
          Loading regulatory agency record...
        </P>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/regulatory-agencies"
            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <FaArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <H3 className="text-base font-bold text-slate-900">
              {isEdit ? "Edit Regulatory Agency" : "Add Regulatory Agency"}
            </H3>
            <P className="text-xs text-slate-500 mt-0.5">
              Manage government regulatory authorities (DoE, Fire Service, LOAB) and institutional links.
            </P>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/admin/regulatory-agencies">
            <Button type="button" variant="outline" size="sm">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSaving || isUploadingPdf}
            className="gap-2 font-bold px-5"
          >
            <FaSave className="h-3.5 w-3.5" />
            <span>{isSaving ? "Saving..." : isEdit ? "Update Agency" : "Save Agency"}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Agency Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2.5">
              Agency Information
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Short Tag / Acronym (e.g. DoE, Civil Defense) *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. DoE"
                required
              />

              <Select
                label="Badge Color Style *"
                value={formData.badgeBg}
                onChange={(e) => setFormData({ ...formData, badgeBg: e.target.value })}
                options={BADGE_COLOR_OPTIONS}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Official Name (English) *"
                value={formData.titleEn}
                onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                placeholder="e.g. Department of Explosives"
                required
              />

              <Input
                label="পূর্ণ প্রাতিষ্ঠানিক নাম (বাংলা) *"
                value={formData.titleBn}
                onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })}
                placeholder="যেমন: বিস্ফোরক পরিদপ্তর"
                required
              />
            </div>

            <Input
              label="Official Portal / Website URL *"
              value={formData.href}
              onChange={(e) => setFormData({ ...formData, href: e.target.value })}
              placeholder="https://explosives.gov.bd"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Authority Description (English)
                </label>
                <textarea
                  value={formData.descEn}
                  onChange={(e) => setFormData({ ...formData, descEn: e.target.value })}
                  placeholder="Mandate or scope under Ministry of Power & Energy..."
                  rows={3}
                  className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  কর্তৃপক্ষের বিবরণ (বাংলা)
                </label>
                <textarea
                  value={formData.descBn}
                  onChange={(e) => setFormData({ ...formData, descBn: e.target.value })}
                  placeholder="বিদ্যুৎ ও জ্বালানি মন্ত্রণালয়ের অধীনস্থ জাতীয় নিয়ন্ত্রক কর্তৃপক্ষ..."
                  rows={3}
                  className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: PDF Gazettes or Circulars Attachment */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2.5 flex items-center justify-between">
              <span>Official Circular / PDF (Optional)</span>
              {formData.pdfUrl && (
                <Badge variant="success" size="xs">
                  ✓ Attached
                </Badge>
              )}
            </h4>

            {formData.pdfUrl ? (
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                    <FaFilePdf className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {formData.fileName || "Agency-Directive.pdf"}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      PDF Document Attachment
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-emerald-200/60">
                  <a
                    href={formData.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline px-2.5 py-1 rounded bg-white border border-slate-200"
                  >
                    <FaEye className="h-3 w-3" />
                    <span>Preview</span>
                  </a>
                  <Button
                    type="button"
                    variant="danger-ghost"
                    size="xs"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        pdfUrl: "",
                        fileName: "",
                      }))
                    }
                    className="text-rose-600"
                  >
                    <FaTrashAlt className="h-3 w-3 mr-1" />
                    <span>Remove</span>
                  </Button>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file) handlePdfUpload(file);
                }}
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                  dragActive
                    ? "border-primary bg-primary/5"
                    : "border-slate-300 bg-slate-50/50 hover:bg-slate-50"
                }`}
              >
                {isUploadingPdf ? (
                  <div className="py-4 space-y-2">
                    <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="text-xs font-semibold text-primary">Uploading PDF... Please wait</p>
                  </div>
                ) : (
                  <label className="cursor-pointer block space-y-2">
                    <div className="mx-auto h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary mb-1">
                      <FaUpload className="h-4 w-4" />
                    </div>
                    <p className="text-xs font-bold text-slate-800">
                      Upload Agency Circular / Gazette PDF
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Standard PDF files supported (Max 25MB)
                    </p>
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handlePdfUpload(file);
                      }}
                    />
                  </label>
                )}
              </div>
            )}

            {/* Live Agency Card Preview */}
            <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                Website Card Live Preview
              </span>
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-lg border px-2.5 py-1 text-xs font-black uppercase tracking-wider ${
                      formData.badgeBg || "bg-blue-50 text-blue-600 border-blue-200"
                    }`}
                  >
                    {formData.name || "TAG"}
                  </span>
                  <FaBuilding className="h-4 w-4 text-slate-400" />
                </div>
                <p className="text-xs font-bold text-slate-900 leading-snug">
                  {formData.titleEn || "Agency Title Here"}
                </p>
                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {formData.descEn || "Agency description preview..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

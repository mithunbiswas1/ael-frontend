// src/app/(dashboard)/admin/archive/page.jsx
"use client";

import { useState } from "react";
import {
  FileText,
  Plus,
  Search,
  Edit2,
  Trash2,
  Download,
  Calendar,
  Eye,
  CheckCircle2,
  Clock,
  Tag,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/ui/AdminPageHeader";
import {
  useGetAdminArchivesQuery,
  useCreateArchiveMutation,
  useUpdateArchiveMutation,
  useDeleteArchiveMutation,
} from "@/redux/api/archiveApi";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import DragDropUploadZone from "@/app/(dashboard)/_components/DragDropUploadZone";
import { useUploadPageImageMutation } from "@/redux/api/pageApi";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";

const CATEGORY_OPTIONS = [
  { value: "regulatory_circulars", label: "Regulatory Circulars" },
  { value: "incident_news", label: "Incident News & Probes" },
  { value: "meeting_updates", label: "Meeting Updates" },
  { value: "safety_instructions", label: "Safety Instructions" },
  { value: "stakeholder_updates", label: "Stakeholder Updates" },
];

export default function AdminArchivePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    titleBn: "",
    category: "regulatory_circulars",
    referenceNumber: "",
    summary: "",
    summaryBn: "",
    content: "",
    contentBn: "",
    documentUrl: "",
    tags: "",
    isPublished: true,
  });

  const { data: archiveData, isLoading, refetch } = useGetAdminArchivesQuery({
    category: selectedCategory !== "all" ? selectedCategory : undefined,
    search: searchQuery.trim() || undefined,
  });

  const [createArchive, { isLoading: isCreating }] = useCreateArchiveMutation();
  const [updateArchive, { isLoading: isUpdating }] = useUpdateArchiveMutation();
  const [deleteArchive, { isLoading: isDeleting }] = useDeleteArchiveMutation();
  const [uploadDoc, { isLoading: isUploadingDoc }] = useUploadPageImageMutation();

  const handleDocUpload = async (files) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const uploadData = new FormData();
    uploadData.append("images", file);
    try {
      const response = await uploadDoc(uploadData).unwrap();
      const uploadedItem = Array.isArray(response?.data)
        ? response.data[0]
        : response?.data;
      const uploadedUrl =
        uploadedItem?.image || uploadedItem?.url || (typeof uploadedItem === "string" ? uploadedItem : null);
      if (uploadedUrl) {
        setFormData((prev) => ({ ...prev, documentUrl: uploadedUrl }));
        toast.success("Document uploaded successfully!");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to upload document.");
    }
  };

  const records = archiveData?.data?.records || [];

  const handleOpenCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      titleBn: "",
      category: "regulatory_circulars",
      referenceNumber: "",
      summary: "",
      summaryBn: "",
      content: "",
      contentBn: "",
      documentUrl: "",
      tags: "",
      isPublished: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title || "",
      titleBn: item.titleBn || "",
      category: item.category || "regulatory_circulars",
      referenceNumber: item.referenceNumber || "",
      summary: item.summary || "",
      summaryBn: item.summaryBn || "",
      content: item.content || "",
      contentBn: item.contentBn || "",
      documentUrl: item.documentUrl || "",
      tags: Array.isArray(item.tags)
        ? item.tags.join(", ")
        : typeof item.tags === "string"
        ? item.tags
        : "",
      isPublished: item.isPublished ?? true,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.titleBn) {
      toast.error("Please provide both English and Bengali titles.");
      return;
    }

    const payload = {
      ...formData,
      tags: formData.tags
        ? formData.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
    };

    try {
      if (editingItem) {
        await updateArchive({ id: editingItem._id, data: payload }).unwrap();
        toast.success("Archive document updated successfully.");
      } else {
        await createArchive(payload).unwrap();
        toast.success("Archive document created successfully.");
      }
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save archive record.");
    }
  };

  const handleDelete = (item) => {
    setDeleteTarget(item);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget?._id) return;

    try {
      await deleteArchive(deleteTarget._id).unwrap();
      toast.success("Document deleted successfully.");
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete document.");
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <AdminPageHeader
        icon={FileText}
        title="Official Archive & Circulars Management"
        description="Publish, categorize, and maintain regulatory circulars, tripartite meeting updates, probe reports, and safety directives."
        action={
          <Button
            variant="primary"
            size="default"
            onClick={handleOpenCreateModal}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            <span>Add Archive Document</span>
          </Button>
        }
      />

      {/* 2. Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4">
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
              selectedCategory === "all"
                ? "bg-primary text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            All Categories
          </button>
          {CATEGORY_OPTIONS.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                selectedCategory === cat.value
                  ? "bg-primary text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72">
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            prefix={<Search className="h-4 w-4 text-slate-400" />}
            size="sm"
          />
        </div>
      </div>

      {/* 3. Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document Title & Ref</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date Published</TableHead>
              <TableHead>Downloads</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-slate-400 text-xs">
                  Loading archive records...
                </TableCell>
              </TableRow>
            ) : records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-slate-400 text-xs">
                  No archive documents found matching criteria.
                </TableCell>
              </TableRow>
            ) : (
              records.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <div className="space-y-0.5 max-w-md">
                      <div className="font-bold text-slate-900 text-xs line-clamp-1">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">
                        {item.titleBn}
                      </div>
                      {item.referenceNumber && (
                        <span className="font-mono text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                          {item.referenceNumber}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-700 capitalize">
                      {item.category?.replace(/_/g, " ")}
                    </span>
                  </TableCell>

                  <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                    {item.publishDate
                      ? new Date(item.publishDate).toLocaleDateString()
                      : "—"}
                  </TableCell>

                  <TableCell className="text-xs font-bold text-slate-700">
                    {item.downloadCount || 0}
                  </TableCell>

                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        item.isPublished
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.isPublished ? "Published" : "Draft"}
                    </span>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEditModal(item)}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-primary transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 4. Create / Edit Dialog */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="lg"
        title={editingItem ? "Edit Archive Document" : "Add Archive Document"}
        description="Enter the regulatory details, reference ID, and PDF file attachment."
      >
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Document Title (English) *
              </label>
              <Input
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Mandatory Safety Directive on Cylinder Valves"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Document Title (Bengali) *
              </label>
              <Input
                required
                value={formData.titleBn}
                onChange={(e) => setFormData({ ...formData, titleBn: e.target.value })}
                placeholder="e.g. সিলিন্ডার ভালভ সংক্রান্ত বাধ্যতামূলক প্রজ্ঞাপন"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-hidden focus:border-primary"
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official Reference ID
              </label>
              <Input
                value={formData.referenceNumber}
                onChange={(e) =>
                  setFormData({ ...formData, referenceNumber: e.target.value })
                }
                placeholder="e.g. DOE-CIR-2024-089"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Executive Summary (English)
              </label>
              <textarea
                rows={2}
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="Brief summary of the directive..."
                className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-700 outline-hidden focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Executive Summary (Bengali)
              </label>
              <textarea
                rows={2}
                value={formData.summaryBn}
                onChange={(e) => setFormData({ ...formData, summaryBn: e.target.value })}
                placeholder="সংক্ষিপ্ত সারসংক্ষেপ..."
                className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-700 outline-hidden focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Full Circular Text / Decisions
            </label>
            <textarea
              rows={4}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Full text, decisions, and clauses..."
              className="w-full rounded-lg border border-slate-200 p-2 text-xs text-slate-700 outline-hidden focus:border-primary"
            />
          </div>

          {/* Document Upload Zone */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700">
              Official Document / Circular File (Drag & Drop) *
            </label>

            {formData.documentUrl ? (
              <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {formData.documentUrl.split("/").pop() || "Uploaded Circular Document"}
                  </p>
                  <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
                    ✓ Document attached and ready
                  </p>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => setFormData({ ...formData, documentUrl: "" })}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  title="Remove document"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : null}

            <DragDropUploadZone
              onFilesSelected={handleDocUpload}
              isUploading={isUploadingDoc}
              multiple={false}
              accept="application/pdf,image/png,image/jpeg,image/webp"
              title={
                <>
                  Drag & drop PDF / document here, or <span className="text-primary underline">browse</span>
                </>
              }
              subtitle="Upload official gazette, circular, probe report, or safety notice (PDF, PNG, JPG)."
              uploadingText="Uploading archive document..."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tags (Comma separated)
            </label>
            <Input
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="DoE, Safety, Pressure, 2024"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isPublishedCheck"
              checked={formData.isPublished}
              onChange={(e) =>
                setFormData({ ...formData, isPublished: e.target.checked })
              }
              className="h-4 w-4 rounded border-slate-300 text-primary"
            />
            <label htmlFor="isPublishedCheck" className="text-xs font-semibold text-slate-700">
              Publish publicly immediately
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              isLoading={isCreating || isUpdating}
            >
              {editingItem ? "Update Document" : "Publish Document"}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Archive Document"
        description="Are you sure you want to permanently delete this official circular / document from the public safety archive?"
        itemTitle={deleteTarget?.title || deleteTarget?.titleBn || ""}
        confirmText="Delete Document"
      />
    </div>
  );
}

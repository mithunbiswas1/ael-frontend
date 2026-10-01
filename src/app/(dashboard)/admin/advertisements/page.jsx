// src/app/(dashboard)/admin/advertisements/page.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  FaBullhorn,
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaMousePointer,
  FaExternalLinkAlt,
  FaCheck,
  FaBan,
} from "react-icons/fa";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import Input from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { AdminPageHeader } from "@/components/ui/AdminPageHeader";
import { H4, P } from "@/components/ui/Typography";
import {
  useGetAllAdsAdminQuery,
  useCreateAdMutation,
  useUpdateAdMutation,
  useDeleteAdMutation,
} from "@/redux/api/advertisementApi";
import { useUploadPageImageMutation } from "@/redux/api/pageApi";
import DragDropUploadZone from "@/app/(dashboard)/_components/DragDropUploadZone";

const SLOT_OPTIONS = [
  { value: "all", label: "All Slots (সকল স্লট)" },
  { value: "header_banner", label: "Header Banner (শীর্ষ ব্যানার)" },
  { value: "sidebar_ad", label: "Sidebar Ad (সাইডবার বিজ্ঞাপন)" },
  { value: "mid_content", label: "Mid-Content (আর্টিকেলের মাঝে)" },
  { value: "footer_banner", label: "Footer Banner (ফুটার ব্যানার)" },
  { value: "sponsored_post", label: "Sponsored Post (স্পন্সরড পোস্ট)" },
  { value: "popup_ad", label: "POP UP Ad (পপ-আপ বিজ্ঞাপন)" },
];

const INITIAL_FORM = {
  title: "",
  slot: "header_banner",
  type: "image",
  imageUrl: "",
  htmlContent: "",
  clickUrl: "https://",
  startDate: new Date().toISOString().split("T")[0],
  endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0],
  isActive: true,
};

export default function AdminAdvertisementsPage() {
  const [selectedSlot, setSelectedSlot] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: adsResponse, isLoading, refetch } = useGetAllAdsAdminQuery({
    slot: selectedSlot !== "all" ? selectedSlot : undefined,
    search: searchTerm || undefined,
  });

  const [createAd, { isLoading: isCreating }] = useCreateAdMutation();
  const [updateAd, { isLoading: isUpdating }] = useUpdateAdMutation();
  const [deleteAd, { isLoading: isDeleting }] = useDeleteAdMutation();
  const [uploadImage, { isLoading: isUploadingImage }] = useUploadPageImageMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const ads = Array.isArray(adsResponse?.data) ? adsResponse.data : [];

  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please drop a valid image file (PNG, JPG, JPEG, WEBP).");
      return;
    }
    const uploadData = new FormData();
    uploadData.append("images", file);
    try {
      const response = await uploadImage(uploadData).unwrap();
      const uploadedItem = Array.isArray(response?.data)
        ? response.data[0]
        : response?.data;
      const uploadedImage =
        uploadedItem?.image || uploadedItem?.url || (typeof uploadedItem === "string" ? uploadedItem : null);
      if (uploadedImage) {
        setFormData((prev) => ({ ...prev, imageUrl: uploadedImage }));
        toast.success("Ad creative image uploaded successfully!");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Failed to upload ad image.");
    }
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(INITIAL_FORM);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ad) => {
    setEditingId(ad._id);
    setFormData({
      title: ad.title || "",
      slot: ad.slot || "header_banner",
      type: ad.type || "image",
      imageUrl: ad.imageUrl || "",
      htmlContent: ad.htmlContent || "",
      clickUrl: ad.clickUrl || "",
      startDate: ad.startDate ? new Date(ad.startDate).toISOString().split("T")[0] : "",
      endDate: ad.endDate ? new Date(ad.endDate).toISOString().split("T")[0] : "",
      isActive: ad.isActive !== false,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id, title) => {
    setDeleteTarget({ id, title });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget?.id) return;
    try {
      await deleteAd(deleteTarget.id).unwrap();
      toast.success("Advertisement deleted successfully");
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete advertisement");
    }
  };

  const handleSubmitModal = async (e) => {
    e.preventDefault();
    try {
      const sanitizedType = formData.type === "html" ? "html5" : (formData.type || "image");
      const payload = {
        ...formData,
        type: sanitizedType,
      };
      if (editingId) {
        await updateAd({ id: editingId, data: payload }).unwrap();
        toast.success("Advertisement updated successfully!");
      } else {
        await createAd(payload).unwrap();
        toast.success("Advertisement created successfully!");
      }
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save advertisement");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        icon={FaBullhorn}
        title="Commercial Advertisement Management"
        description="Configure banner slots, upload marketing creatives, track live impressions and CTR analytics."
        badge={`${ads.length} Total`}
        actionLabel="New Advertisement"
        onActionClick={handleOpenCreate}
      />

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search by campaign title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="w-full sm:w-64">
          <Select
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
            options={SLOT_OPTIONS}
            placeholder="Filter by ad slot"
          />
        </div>
      </div>

      {/* Ads Table */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <P className="mt-3 text-xs">Loading advertisement slots...</P>
        </div>
      ) : ads.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center bg-white">
          <H4 className="text-sm font-bold text-slate-700">No advertisements found</H4>
          <P className="mt-1 text-xs text-slate-500">
            Click &quot;New Advertisement&quot; to configure your first commercial sponsor banner.
          </P>
        </div>
      ) : (
        <Table containerClassName="border-slate-200/90">
          <TableHeader>
            <TableRow>
              <TableHead className="w-64">Campaign / Creative</TableHead>
              <TableHead className="w-40">Slot Placement</TableHead>
              <TableHead className="w-36">Schedule</TableHead>
              <TableHead className="w-32 text-center">Performance</TableHead>
              <TableHead className="w-24 text-center">Status</TableHead>
              <TableHead className="w-28 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ads.map((ad) => {
              const isExpired = new Date(ad.endDate) < new Date();
              const ctr = ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(1) : "0.0";

              return (
                <TableRow key={ad._id}>
                  {/* Creative Preview */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {ad.imageUrl ? (
                        <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                          <Image
                            src={ad.imageUrl}
                            alt={ad.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-12 w-20 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold text-xs">
                          HTML5
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-slate-900 truncate">
                          {ad.title}
                        </p>
                        <a
                          href={ad.clickUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-[10px] text-slate-400 hover:text-primary truncate flex items-center gap-1 mt-0.5"
                        >
                          <span className="truncate">{ad.clickUrl}</span>
                          <FaExternalLinkAlt className="h-2.5 w-2.5 shrink-0" />
                        </a>
                      </div>
                    </div>
                  </TableCell>

                  {/* Slot */}
                  <TableCell>
                    <span className="inline-block uppercase font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {ad.slot}
                    </span>
                  </TableCell>

                  {/* Schedule */}
                  <TableCell className="text-xs text-slate-600 font-mono">
                    <p className="text-[11px]">
                      From: {new Date(ad.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Till: {new Date(ad.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                  </TableCell>

                  {/* Performance */}
                  <TableCell className="text-center">
                    <div className="space-y-0.5 text-xs">
                      <p className="font-semibold text-slate-800 flex items-center justify-center gap-1">
                        <FaEye className="h-3 w-3 text-slate-400" />
                        <span>{ad.impressions || 0} imp.</span>
                      </p>
                      <p className="text-[11px] text-primary flex items-center justify-center gap-1 font-mono">
                        <FaMousePointer className="h-2.5 w-2.5" />
                        <span>{ad.clicks || 0} clicks ({ctr}%)</span>
                      </p>
                    </div>
                  </TableCell>

                  {/* Status */}
                  <TableCell className="text-center">
                    {isExpired ? (
                      <span className="inline-flex rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-500">
                        Expired
                      </span>
                    ) : ad.isActive ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                        <FaCheck className="h-2.5 w-2.5" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-bold text-red-700 border border-red-200">
                        <FaBan className="h-2.5 w-2.5" />
                        Paused
                      </span>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        onClick={() => handleOpenEdit(ad)}
                        className="h-8 w-8 p-0 text-slate-500 hover:text-primary hover:bg-primary/5"
                        title="Edit Advertisement"
                      >
                        <FaEdit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        onClick={() => handleDelete(ad._id, ad.title)}
                        className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50"
                        title="Delete Advertisement"
                      >
                        <FaTrash className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {/* Create / Edit Modal */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="lg"
        title={editingId ? "Edit Advertisement" : "Create New Advertisement"}
        description="Configure target banner slot, creative image or HTML5 code, and scheduling."
      >
        <form onSubmit={handleSubmitModal} className="p-6 space-y-4">
          <Input
            label="Campaign Title *"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. DoE National LPG Safety Week Sponsorship"
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              label="Format / বিজ্ঞাপন ধরন *"
              value={formData.type || "image"}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              options={[
                { value: "image", label: "Static/Animated Image" },
                { value: "html5", label: "HTML5 / Embed Code" },
              ]}
              required
            />

            <Select
              label="Target Slot Placement *"
              value={formData.slot}
              onChange={(e) => setFormData({ ...formData, slot: e.target.value })}
              options={SLOT_OPTIONS.filter((s) => s.value !== "all")}
              required
            />

            <Input
              label="Destination Click URL *"
              type="url"
              value={formData.clickUrl}
              onChange={(e) => setFormData({ ...formData, clickUrl: e.target.value })}
              placeholder="https://partner-website.com/offer"
              required
            />
          </div>

          {/* Creative Banner Upload or HTML5 Script */}
          {formData.type === "image" ? (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Ad Creative Image (Drag & Drop) *
              </label>

              {formData.imageUrl ? (
                <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
                    <Image
                      src={formData.imageUrl}
                      alt="Ad Creative Preview"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {formData.imageUrl.split("/").pop() || "Uploaded Creative Banner"}
                    </p>
                    <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
                      ✓ Image ready for campaign
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={() => setFormData({ ...formData, imageUrl: "" })}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    title="Remove creative"
                  >
                    <FaTrash className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ) : null}

              <DragDropUploadZone
                onFilesSelected={handleFileUpload}
                isUploading={isUploadingImage}
                multiple={false}
                title={
                  <>
                    Drag & drop banner image here, or <span className="text-primary underline">browse</span>
                  </>
                }
                subtitle="Upload advertising creative (PNG, JPG, JPEG, WEBP). Recommended size: 1200x400 or 728x90."
                uploadingText="Uploading ad creative..."
              />
            </div>
          ) : (
            <Textarea
              label="HTML5 / Custom Script Ad Code *"
              rows={3}
              value={formData.htmlContent}
              onChange={(e) => setFormData({ ...formData, htmlContent: e.target.value })}
              placeholder="<iframe ... /> or custom responsive HTML banner"
              required
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Campaign Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
            <Input
              label="Campaign End Date *"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
            />
          </div>

          {/* Active status */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3.5">
            <div>
              <p className="text-xs font-bold text-slate-800">Serve Live on Website</p>
              <p className="text-[11px] text-slate-500">
                When enabled, active ads within scheduled dates will be served automatically.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
                formData.isActive ? "bg-emerald-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.isActive ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
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
              disabled={isCreating || isUpdating}
            >
              <span>{isCreating || isUpdating ? "Saving..." : editingId ? "Save Changes" : "Create Advertisement"}</span>
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
        title="Delete Advertisement"
        description="Are you sure you want to remove this advertisement campaign? It will immediately stop rendering across all visitor surfaces."
        itemTitle={deleteTarget?.title || ""}
        confirmText="Delete Ad"
      />
    </div>
  );
}

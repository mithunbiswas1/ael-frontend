// src/app/(dashboard)/admin/advertisements/page.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  FaBullhorn,
  FaEdit,
  FaTrash,
  FaEye,
  FaMousePointer,
  FaExternalLinkAlt,
  FaCheck,
  FaBan,
  FaRulerCombined,
  FaGoogle,
  FaImage,
  FaCode,
  FaInfoCircle,
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
import { SearchInput } from "@/components/ui/SearchInput";
import { DateInput } from "@/components/ui/DateInput";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { AdminPageHeader } from "@/components/ui/AdminPageHeader";
import { H4, P } from "@/components/ui/Typography";
import Pagination from "@/components/ui/Pagination";
import {
  useGetAllAdsAdminQuery,
  useCreateAdMutation,
  useUpdateAdMutation,
  useDeleteAdMutation,
} from "@/redux/api/advertisementApi";
import { useUploadPageImageMutation } from "@/redux/api/pageApi";
import DragDropUploadZone from "@/app/(dashboard)/_components/DragDropUploadZone";
import { baseUriBackend } from "@/config/base-url";

export const resolveAdImageUrl = (src) => {
  if (!src) return "/default_image.jpg";
  if (
    src.startsWith("http://") ||
    src.startsWith("https://") ||
    src.startsWith("data:")
  ) {
    return src;
  }
  const filename = src.split("/").pop();
  if (filename && filename.startsWith("ad_")) {
    return `/images/ads/${filename}`;
  }
  const cleanPath = src.replace(/^\/+/, "");
  return `${baseUriBackend}${cleanPath}`;
};

export const SLOT_CONFIG = {
  header_banner: {
    slotNumber: 1,
    title: "1. Header Banner (Between Topbar and Navbar)",
    shortName: "Header Banner",
    expectedWidth: 970,
    expectedHeight: 90,
    expectedSize: "970 × 90 px",
    alternateSize: "728 × 90 px",
    ratio: "10:1 (Leaderboard)",
    description: "Full-width leaderboard banner displayed between topbar and main navbar.",
    recommendedFormat: "PNG, JPG, WEBP (Max 2MB)",
  },
  right_overlay: {
    slotNumber: 2,
    title: "2. Footer Side Sticky Ad (Floating Sticky Banner)",
    shortName: "Footer Sticky",
    expectedWidth: 970,
    expectedHeight: 90,
    expectedSize: "970 × 90 px",
    alternateSize: "728 × 90 px",
    ratio: "10:1 (Leaderboard)",
    description: "Floating leaderboard advertisement anchored at the bottom viewport above footer.",
    recommendedFormat: "PNG, JPG, WEBP (Max 2MB)",
  },
  mid_content: {
    slotNumber: 3,
    title: "3. Mid-Content Banner (Below Hero Section)",
    shortName: "Mid-Content",
    expectedWidth: 970,
    expectedHeight: 250,
    expectedSize: "970 × 250 px",
    alternateSize: "970 × 90 px",
    ratio: "4:1 (Billboard)",
    description: "Billboard banner positioned between homepage hero and primary content.",
    recommendedFormat: "PNG, JPG, WEBP (Max 3MB)",
  },
  sidebar_ad: {
    slotNumber: 4,
    title: "4. Sidebar Ad (Below Subscription / Incident Cards)",
    shortName: "Sidebar Ad",
    expectedWidth: 300,
    expectedHeight: 250,
    expectedSize: "300 × 250 px",
    alternateSize: "336 × 280 px",
    ratio: "6:5 (Medium Rectangle)",
    description: "Standard rectangle banner shown in the sidebar column below incident cards.",
    recommendedFormat: "PNG, JPG, WEBP (Max 1.5MB)",
  },
  footer_banner: {
    slotNumber: 5,
    title: "5. Footer Banner (Above Main Footer)",
    shortName: "Footer Banner",
    expectedWidth: 970,
    expectedHeight: 90,
    expectedSize: "970 × 90 px",
    alternateSize: "728 × 90 px",
    ratio: "10:1 (Leaderboard)",
    description: "Full-width leaderboard banner positioned directly above the main website footer.",
    recommendedFormat: "PNG, JPG, WEBP (Max 2MB)",
  },
  popup_ad: {
    slotNumber: 6,
    title: "6. Pop-up Modal Ad (Center Screen)",
    shortName: "Center Popup",
    expectedWidth: 600,
    expectedHeight: 400,
    expectedSize: "600 × 400 px",
    alternateSize: "400 × 300 px",
    ratio: "3:2 (Center Modal)",
    description: "Promotional modal displayed in screen center with backdrop upon page load.",
    recommendedFormat: "PNG, JPG, WEBP (Max 2MB)",
  },
};

const SLOT_OPTIONS = [
  { value: "all", label: "All Slots" },
  { value: "header_banner", label: "1. Header Banner" },
  { value: "right_overlay", label: "2. Footer Side Sticky Ad" },
  { value: "mid_content", label: "3. Mid-Content Banner" },
  { value: "sidebar_ad", label: "4. Sidebar Ad" },
  { value: "footer_banner", label: "5. Footer Banner" },
  { value: "popup_ad", label: "6. Pop-up Modal Ad" },
];

const INITIAL_FORM = {
  title: "",
  slot: "header_banner",
  type: "image",
  imageUrl: "",
  googleAdClient: "",
  googleAdSlot: "",
  googleAdFormat: "auto",
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
  const [page, setPage] = useState(1);

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
  const totalAds = ads.length;
  const totalPages = Math.ceil(totalAds / 10) || 1;
  const paginatedAds = ads.slice((page - 1) * 10, page * 10);

  const currentSlotConfig = SLOT_CONFIG[formData.slot] || SLOT_CONFIG.header_banner;

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
      type: ad.type || (ad.googleAdSlot ? "google_ads" : "image"),
      imageUrl: ad.imageUrl || "",
      googleAdClient: ad.googleAdClient || "",
      googleAdSlot: ad.googleAdSlot || "",
      googleAdFormat: ad.googleAdFormat || "auto",
      htmlContent: ad.htmlContent || "",
      clickUrl: ad.clickUrl || "https://",
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
        clickUrl: formData.clickUrl?.trim() || "#",
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
        description="Configure standard Google Ads banner slots, upload marketing creatives, and manage live impressions."
        badge={`${ads.length} Total`}
        actionLabel="New Advertisement"
        onActionClick={handleOpenCreate}
      />

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="w-full sm:w-72">
          <SearchInput
            placeholder="Search by campaign title..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            onClear={() => {
              setSearchTerm("");
              setPage(1);
            }}
            size="sm"
          />
        </div>

        <div className="w-full sm:w-80">
          <Select
            value={selectedSlot}
            onChange={(e) => {
              setSelectedSlot(e.target.value);
              setPage(1);
            }}
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
            Click &quot;New Advertisement&quot; to configure your commercial banner with standard dimensions.
          </P>
        </div>
      ) : (
        <>
          <Table containerClassName="border-slate-200/90">
            <TableHeader>
              <TableRow>
                <TableHead className="w-64">Campaign / Creative</TableHead>
                <TableHead className="w-48">Ad Placement</TableHead>
                <TableHead className="w-36">Schedule</TableHead>
                <TableHead className="w-32 text-center">Performance</TableHead>
                <TableHead className="w-24 text-center">Status</TableHead>
                <TableHead className="w-28 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAds.map((ad) => {
                const isExpired = new Date(ad.endDate) < new Date();
                const ctr = ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(1) : "0.0";
                const slotMeta = SLOT_CONFIG[ad.slot];

                return (
                  <TableRow key={ad._id}>
                    {/* Creative Preview */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {ad.imageUrl ? (
                          <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-2xs">
                            <Image
                              src={resolveAdImageUrl(ad.imageUrl)}
                              alt={ad.title}
                              fill
                              unoptimized
                              className="object-cover"
                              onError={(e) => {
                                const currentSrc = e.currentTarget.getAttribute("src") || "";
                                if (!currentSrc.includes("ad_") && (ad.imageUrl || "").includes("ad_")) {
                                  const filename = (ad.imageUrl || "").split("/").pop();
                                  e.currentTarget.src = `/images/ads/${filename}`;
                                } else {
                                  e.currentTarget.src = "/default_image.jpg";
                                }
                              }}
                            />
                          </div>
                        ) : ad.type === "google_ads" ? (
                          <div className="flex h-12 w-20 shrink-0 flex-col items-center justify-center rounded-lg bg-blue-50 border border-blue-200 text-blue-600 font-bold text-[10px]">
                            <FaGoogle className="h-3.5 w-3.5 mb-0.5" />
                            <span>AdSense</span>
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
                            href={ad.clickUrl || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-[10px] text-slate-400 hover:text-primary truncate flex items-center gap-1 mt-0.5"
                          >
                            <span className="truncate">{ad.clickUrl || "#"}</span>
                            <FaExternalLinkAlt className="h-2 w-2 shrink-0" />
                          </a>
                        </div>
                      </div>
                    </TableCell>

                    {/* Ad Placement */}
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="inline-block uppercase font-mono text-[10px] font-extrabold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {slotMeta?.shortName || ad.slot}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px]">
                          {ad.imageUrl ? (
                            <span className="text-emerald-700 font-semibold flex items-center gap-1 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              <FaImage className="h-2.5 w-2.5" /> Image Ad
                            </span>
                          ) : ad.type === "google_ads" ? (
                            <span className="text-blue-700 font-semibold flex items-center gap-1 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                              <FaGoogle className="h-2.5 w-2.5" /> AdSense
                            </span>
                          ) : (
                            <span className="text-amber-700 font-semibold flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                              <FaCode className="h-2.5 w-2.5" /> HTML5
                            </span>
                          )}
                          {ad.imageUrl && ad.type === "google_ads" && (
                            <span className="text-emerald-600 font-medium text-[9px]">(Priority: Image)</span>
                          )}
                        </div>
                      </div>
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

          {totalAds > 0 && (
            <div className="mt-4">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={totalAds}
                pageSize={10}
                onPageChange={setPage}
              />
            </div>
          )}
        </>
      )}

      {/* Create / Edit Modal */}
      <Dialog
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        maxWidth="lg"
        title={editingId ? "Edit Advertisement" : "Create New Advertisement"}
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
              label="Creative Format *"
              value={formData.type || "image"}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              options={[
                { value: "image", label: "Custom Image (Banner/Creative)" },
                { value: "google_ads", label: "Google AdSense Responsive Unit" },
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
              required={formData.type === "image"}
            />
          </div>

          {/* DYNAMIC EXPECTED IMAGE SIZE CALLOUT CARD */}
          <div className="rounded-xl border border-primary/25 bg-gradient-to-br from-primary/5 via-primary/[0.08] to-amber-500/5 p-4 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-white shadow-xs">
                  <FaRulerCombined className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
                      Expected Image Size
                    </span>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                      Slot #{currentSlotConfig.slotNumber}
                    </span>
                  </div>
                  <p className="font-mono text-base font-extrabold text-slate-900 mt-0.5 flex items-baseline gap-2">
                    <span>{currentSlotConfig.expectedSize}</span>
                    <span className="text-xs font-medium text-slate-500 font-sans">
                      ({currentSlotConfig.ratio})
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:text-right">
                <div className="rounded-lg bg-white px-3 py-1.5 border border-slate-200 shadow-2xs">
                  <span className="text-[10px] block text-slate-400 font-medium uppercase font-mono">
                    Alternative Size
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-700">
                    {currentSlotConfig.alternateSize}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-2.5 pt-2.5 border-t border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px] text-slate-600">
              <p>
                <span className="font-semibold text-slate-700">Position: </span>
                {currentSlotConfig.description}
              </p>
              <p className="text-slate-500 font-mono text-[10px]">
                {currentSlotConfig.recommendedFormat}
              </p>
            </div>
          </div>

          {/* CREATIVE BANNER UPLOAD OR GOOGLE ADSENSE OR HTML5 */}
          {formData.type === "image" ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  Ad Creative Image (Drag & Drop) *
                </label>
                <span className="text-[11px] text-slate-500 font-mono">
                  Expected: <strong className="text-primary">{currentSlotConfig.expectedSize}</strong>
                </span>
              </div>

              {formData.imageUrl ? (
                <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white">
                    <Image
                      src={resolveAdImageUrl(formData.imageUrl)}
                      alt="Ad Creative Preview"
                      fill
                      unoptimized
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/default_image.jpg";
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {formData.imageUrl.split("/").pop() || "Uploaded Creative Banner"}
                    </p>
                    <p className="text-[11px] text-emerald-600 font-medium mt-0.5">
                      ✓ Image ready for {currentSlotConfig.shortName} ({currentSlotConfig.expectedSize})
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
                    Drag & drop {currentSlotConfig.shortName} creative here, or <span className="text-primary underline">browse</span>
                  </>
                }
                subtitle={`Upload advertising creative (PNG, JPG, JPEG, WEBP). Expected image size: ${currentSlotConfig.expectedSize} (${currentSlotConfig.ratio}).`}
                uploadingText="Uploading ad creative..."
              />
            </div>
          ) : formData.type === "google_ads" ? (
            <div className="space-y-4 rounded-xl border border-blue-200 bg-blue-50/40 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <FaGoogle className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h5 className="text-xs font-bold text-blue-900">
                    Google AdSense Configuration ({currentSlotConfig.shortName})
                  </h5>
                  <p className="text-[11px] text-blue-700 mt-0.5 leading-relaxed">
                    Google Ads will automatically render adhering to standard dimensions ({currentSlotConfig.expectedSize}).
                    <br />
                    <span className="font-semibold text-amber-800">
                      ★ Priority Rule: If you upload an Image below, the platform prioritizes and shows the Image Ad. If no image is provided, Google AdSense will display.
                    </span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <Input
                  label="Google Ad Client (ca-pub-xxx) *"
                  value={formData.googleAdClient}
                  onChange={(e) => setFormData({ ...formData, googleAdClient: e.target.value })}
                  placeholder="ca-pub-1234567890123456"
                  required={formData.type === "google_ads"}
                />
                <Input
                  label="Google Ad Slot ID *"
                  value={formData.googleAdSlot}
                  onChange={(e) => setFormData({ ...formData, googleAdSlot: e.target.value })}
                  placeholder="1234567890"
                  required={formData.type === "google_ads"}
                />
              </div>

              <div>
                <Select
                  label="Ad Format"
                  value={formData.googleAdFormat || "auto"}
                  onChange={(e) => setFormData({ ...formData, googleAdFormat: e.target.value })}
                  options={[
                    { value: "auto", label: "Auto Responsive (Recommended)" },
                    { value: "horizontal", label: "Horizontal Banner (Leaderboard)" },
                    { value: "vertical", label: "Vertical Banner (Skyscraper)" },
                    { value: "rectangle", label: "Rectangle (Medium Rectangle)" },
                  ]}
                />
              </div>

              {/* Optional Image Upload for Google Ads (Image takes priority) */}
              <div className="pt-2 border-t border-blue-200/60 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                    <FaImage className="h-3 w-3 text-primary" />
                    <span>Optional Custom Image (Overrides Google Ads when uploaded)</span>
                  </p>
                  <span className="text-[10px] font-mono text-slate-500">
                    Size: {currentSlotConfig.expectedSize}
                  </span>
                </div>

                {formData.imageUrl ? (
                  <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-2">
                    <div className="relative h-10 w-16 shrink-0 overflow-hidden rounded border border-slate-200">
                      <Image
                        src={resolveAdImageUrl(formData.imageUrl)}
                        alt="Fallback"
                        fill
                        className="object-cover"
                        unoptimized
                        onError={(e) => {
                          e.currentTarget.src = "/default_image.jpg";
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-slate-700 truncate">{formData.imageUrl.split("/").pop()}</p>
                      <p className="text-[10px] text-emerald-600 font-medium">✓ Image will take precedence over Google Ads</p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={() => setFormData({ ...formData, imageUrl: "" })}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <FaTrash className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <DragDropUploadZone
                    onFilesSelected={handleFileUpload}
                    isUploading={isUploadingImage}
                    multiple={false}
                    title={<>Drop image here to override Google Ads, or <span className="text-primary underline">browse</span></>}
                    subtitle={`Expected size: ${currentSlotConfig.expectedSize}`}
                    uploadingText="Uploading ad creative..."
                  />
                )}
              </div>
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
            <DateInput
              label="Campaign Start Date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              max={formData.endDate || undefined}
            />
            <DateInput
              label="Campaign End Date"
              required
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              min={formData.startDate || undefined}
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
            <Switch
              checked={Boolean(formData.isActive)}
              onCheckedChange={(val) =>
                setFormData({ ...formData, isActive: val })
              }
            />
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

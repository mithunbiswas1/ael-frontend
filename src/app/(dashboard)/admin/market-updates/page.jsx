// src/app/(dashboard)/admin/market-updates/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useGetAdminMarketUpdatesQuery,
  useDeleteMarketUpdateMutation,
} from "@/redux/api/marketUpdateApi";
import PermissionGuard from "@/components/ui/PermissionGuard";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import MarketUpdateFilterBar from "./_components/MarketUpdateFilterBar";
import MarketUpdateTable from "./_components/MarketUpdateTable";
import { MARKET_UPDATE_CATEGORIES } from "./_components/MarketUpdateForm";

export default function AdminMarketUpdatesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const {
    data: updatesResponse,
    isLoading,
    refetch,
  } = useGetAdminMarketUpdatesQuery({
    q: searchTerm,
    category: selectedCategory,
  });

  const [deleteUpdate, { isLoading: isDeleting }] =
    useDeleteMarketUpdateMutation();

  const updates = updatesResponse?.data?.data || [];

  const handleOpenCreate = () => {
    router.push("/admin/market-updates/add");
  };

  const handleEdit = (item) => {
    router.push(`/admin/market-updates/edit/${item._id}`);
  };

  const handleDeleteClick = (id) => {
    const target = updates.find((u) => u._id === id);
    setDeleteTarget(target || { _id: id, titleEn: "Selected Market Update" });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget?._id) return;
    try {
      await deleteUpdate(deleteTarget._id).unwrap();
      toast.success("Market update deleted successfully");
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete market update");
    }
  };

  return (
    <PermissionGuard module="market-updates" action="view">
      <title>LPG Market Updates Management | Safe LPG Admin</title>
      <div className="space-y-6">
        <MarketUpdateFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={MARKET_UPDATE_CATEGORIES}
          onOpenCreate={handleOpenCreate}
        />

        <MarketUpdateTable
          updates={updates}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={Boolean(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
          title="Delete Market Update"
          description="Are you sure you want to delete this market update? All associated gazettes and telemetry data will be permanently removed."
          itemTitle={
            deleteTarget?.titleEn || deleteTarget?.titleBn || ""
          }
          confirmText="Delete Article"
        />
      </div>
    </PermissionGuard>
  );
}

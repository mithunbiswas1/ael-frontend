// src/app/(dashboard)/admin/newsletter/page.jsx
"use client";

import { useState } from "react";
import { Send, RefreshCw, UserPlus } from "lucide-react";
import { FaNewspaper } from "react-icons/fa";
import { toast } from "sonner";

import {
  useGetNewsletterSubscribersQuery,
  useToggleNewsletterSubscriberMutation,
  useDeleteNewsletterSubscriberMutation,
  useBroadcastNewsletterMutation,
} from "@/redux/api/newsletterApi";
import { AdminPageHeader } from "@/components/ui/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";

// Modularized Components
import NewsletterStatsGrid from "./_components/NewsletterStatsGrid";
import NewsletterFilters from "./_components/NewsletterFilters";
import NewsletterTable from "./_components/NewsletterTable";
import BroadcastCampaignDialog from "./_components/BroadcastCampaignDialog";
import AddSubscriberDialog from "./_components/AddSubscriberDialog";

export default function AdminNewsletterPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [page, setPage] = useState(1);

  // Modal states
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Broadcast form state (Single-language, no dual En/Bn required)
  const [broadcastForm, setBroadcastForm] = useState({
    title: "",
    subject: "",
    summary: "",
    ctaText: "View Details",
    ctaUrl: "/",
    targetAudience: "all",
  });

  // Queries & Mutations
  const { data, isLoading, isFetching, refetch } = useGetNewsletterSubscribersQuery({
    page,
    limit: 10,
    q: search,
    status: statusFilter,
    source: sourceFilter,
  });

  const [toggleStatus, { isLoading: isToggling }] =
    useToggleNewsletterSubscriberMutation();
  const [deleteSubscriber, { isLoading: isDeleting }] =
    useDeleteNewsletterSubscriberMutation();
  const [broadcastNewsletter, { isLoading: isBroadcasting }] =
    useBroadcastNewsletterMutation();

  const subscribers = data?.data?.subscribers || [];
  const pagination = data?.data?.pagination || { page: 1, totalPages: 1, total: 0 };
  const stats = data?.data?.stats || {
    totalSubscribers: 0,
    totalActive: 0,
    totalInactive: 0,
    totalWebsite: 0,
    totalRegistered: 0,
  };

  // Toggle subscriber status
  const handleToggleStatus = async (subscriber) => {
    try {
      await toggleStatus(subscriber._id).unwrap();
      toast.success(
        `Subscriber ${!subscriber.isActive ? "activated" : "deactivated"} successfully`
      );
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update subscriber status");
    }
  };

  // Confirm delete
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteSubscriber(deleteTarget._id).unwrap();
      toast.success("Subscriber removed successfully");
      setDeleteTarget(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete subscriber");
    }
  };

  // Submit manual broadcast
  const handleBroadcastSubmit = async (e) => {
    e.preventDefault();
    if (!broadcastForm.title || !broadcastForm.subject || !broadcastForm.summary) {
      toast.error("Please fill in title, subject, and summary content");
      return;
    }

    try {
      const res = await broadcastNewsletter(broadcastForm).unwrap();
      toast.success(res?.message || "Newsletter broadcast dispatched successfully!");
      setIsBroadcastModalOpen(false);
      setBroadcastForm({
        title: "",
        subject: "",
        summary: "",
        ctaText: "View Details",
        ctaUrl: "/",
        targetAudience: "all",
      });
    } catch (err) {
      toast.error(err?.data?.message || "Failed to send newsletter broadcast");
    }
  };

  // Manual refresh with visual feedback & notification
  const handleRefresh = async () => {
    try {
      const res = await refetch();
      if (res.isError) {
        toast.error(res?.error?.data?.message || "Failed to refresh subscribers");
      } else {
        toast.success("Subscribers list updated");
      }
    } catch {
      toast.error("Failed to refresh subscribers");
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <AdminPageHeader
        icon={FaNewspaper}
        title="Newsletter Subscribers"
        description="Manage active email newsletter subscribers, export subscriber lists, and manual registrations."
        badge={`${subscribers.length} Active`}
        action={
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              isLoading={isFetching}
              disabled={isFetching}
              icon={RefreshCw}
            >
              <span>Refresh</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddModalOpen(true)}
              icon={UserPlus}
            >
              <span>Add Subscriber</span>
            </Button>

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => setIsBroadcastModalOpen(true)}
              icon={Send}
            >
              <span>Manual Broadcast</span>
            </Button>
          </div>
        }
      />

      {/* 2. Metrics Row */}
      <NewsletterStatsGrid stats={stats} />

      {/* 3. Filter and Search Bar */}
      <NewsletterFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sourceFilter={sourceFilter}
        setSourceFilter={setSourceFilter}
        setPage={setPage}
      />

      {/* 4. Subscribers Table with Pagination */}
      <NewsletterTable
        subscribers={subscribers}
        pagination={pagination}
        isLoading={isLoading}
        isToggling={isToggling}
        onToggleStatus={handleToggleStatus}
        onDelete={(item) => setDeleteTarget(item)}
        onPageChange={(newPage) => setPage(newPage)}
      />

      {/* 5. Add Subscriber Modal (Single & CSV/Bulk) */}
      <AddSubscriberDialog
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onRefresh={refetch}
      />

      {/* 6. Manual Broadcast Modal (Single title & content) */}
      <BroadcastCampaignDialog
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        broadcastForm={broadcastForm}
        setBroadcastForm={setBroadcastForm}
        onSubmit={handleBroadcastSubmit}
        isBroadcasting={isBroadcasting}
        stats={stats}
      />

      {/* 7. Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        title="Delete Subscriber Record"
        description={`Are you sure you want to delete ${deleteTarget?.email}? They will no longer receive automated newsletter broadcasts.`}
      />
    </div>
  );
}

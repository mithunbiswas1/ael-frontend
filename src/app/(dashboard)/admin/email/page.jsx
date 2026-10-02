// src/app/(dashboard)/admin/email/page.jsx
"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/ui/AdminPageHeader";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import Pagination from "@/components/ui/Pagination";
import {
  useGetCampaignsQuery,
  useCreateCampaignMutation,
  useDeleteCampaignMutation,
} from "@/redux/api/campaignApi";

// Modularized Components
import EmailComposer from "./_components/EmailComposer";
import EmailBroadcastTable from "./_components/EmailBroadcastTable";

export default function AdminEmailCampaignsPage() {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [page, setPage] = useState(1);

  const { data: campaignData, isLoading, refetch } = useGetCampaignsQuery({
    type: "email",
    page,
    limit: 10,
  });
  const [createCampaign, { isLoading: isSending }] = useCreateCampaignMutation();
  const [deleteCampaign, { isLoading: isDeleting }] = useDeleteCampaignMutation();

  const campaigns = campaignData?.data?.campaigns || [];
  const pagination = campaignData?.data || { total: campaigns.length, totalPages: 1 };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !subject.trim() || !content.trim()) {
      toast.error("Please fill in campaign title, subject, and email content.");
      return;
    }

    try {
      await createCampaign({
        type: "email",
        title: title.trim(),
        subject: subject.trim(),
        targetAudience: "all_subscribers",
        messageContent: content.trim(),
        isSchedule: false,
        scheduledAt: new Date(),
      }).unwrap();

      toast.success("Email broadcast dispatched successfully via SMTP!");

      setTitle("");
      setSubject("");
      setContent("");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to dispatch email campaign.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget?._id) return;
    try {
      await deleteCampaign(deleteTarget._id).unwrap();
      toast.success("Campaign record removed.");
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error("Failed to delete record.");
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <AdminPageHeader
        icon={Mail}
        title="Enterprise Email Broadcast & Campaign Manager"
        description="Dispatch certified communications to registered members and newsletter subscribers via SMTP."
      />

      {/* 2. Composer Section */}
      <EmailComposer
        title={title}
        setTitle={setTitle}
        subject={subject}
        setSubject={setSubject}
        content={content}
        setContent={setContent}
        isSending={isSending}
        onSubmit={handleSubmit}
      />

      {/* 3. Campaign History Table */}
      <div className="space-y-4">
        <EmailBroadcastTable
          campaigns={campaigns}
          isLoading={isLoading}
          onDelete={(item) => setDeleteTarget(item)}
        />

        {pagination.total > 0 && (
          <Pagination
            currentPage={page}
            totalPages={pagination.totalPages || 1}
            totalItems={pagination.total}
            pageSize={10}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* 4. Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Email Broadcast Log"
        description="Are you sure you want to permanently remove this email broadcast campaign record and delivery log?"
        itemTitle={deleteTarget?.subject || deleteTarget?.title || ""}
        confirmText="Delete Campaign"
      />
    </div>
  );
}

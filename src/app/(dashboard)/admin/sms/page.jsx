// src/app/(dashboard)/admin/sms/page.jsx
"use client";

import { useState, useMemo } from "react";
import { Smartphone } from "lucide-react";
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
import SmsComposer from "./_components/SmsComposer";
import SmsBroadcastTable from "./_components/SmsBroadcastTable";

export default function AdminSmsCampaignsPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [page, setPage] = useState(1);

  const { data: campaignData, isLoading, refetch } = useGetCampaignsQuery({
    type: "sms",
    page,
    limit: 10,
  });
  const [createCampaign, { isLoading: isSending }] = useCreateCampaignMutation();
  const [deleteCampaign, { isLoading: isDeleting }] = useDeleteCampaignMutation();

  const campaigns = campaignData?.data?.campaigns || [];
  const pagination = campaignData?.data || { total: campaigns.length, totalPages: 1 };

  // Bangla Unicode detection & character metrics
  const isBanglaUnicode = useMemo(() => {
    return /[\u0980-\u09FF]/.test(message);
  }, [message]);

  const maxCharPerSms = isBanglaUnicode ? 70 : 160;
  const currentChars = message.length;
  const smsCount = currentChars === 0 ? 0 : Math.ceil(currentChars / maxCharPerSms);
  const charsRemainingInCurrent =
    currentChars === 0
      ? maxCharPerSms
      : maxCharPerSms - (currentChars % maxCharPerSms || maxCharPerSms);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      toast.error("Please enter both campaign title and SMS text.");
      return;
    }

    try {
      await createCampaign({
        type: "sms",
        title: title.trim(),
        targetAudience: "all_subscribers",
        senderId: "SafeLPG-BD",
        messageContent: message.trim(),
        isSchedule: false,
        scheduledAt: new Date(),
      }).unwrap();

      toast.success("Bulk SMS broadcast dispatched successfully to users' phones!");

      setTitle("");
      setMessage("");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to dispatch SMS campaign.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget?._id) return;
    try {
      await deleteCampaign(deleteTarget._id).unwrap();
      toast.success("Broadcast record removed.");
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
        icon={Smartphone}
        title="Enterprise Bulk SMS Campaign Manager"
        description="Dispatch certified SMS broadcasts directly to all registered users and subscribers' mobile phones."
      />

      {/* 2. Simple SMS Composer */}
      <SmsComposer
        title={title}
        setTitle={setTitle}
        message={message}
        setMessage={setMessage}
        isBanglaUnicode={isBanglaUnicode}
        currentChars={currentChars}
        smsCount={smsCount}
        charsRemainingInCurrent={charsRemainingInCurrent}
        isSending={isSending}
        onSubmit={handleSubmit}
      />

      {/* 3. SMS Broadcast Logs Table */}
      <div className="space-y-4">
        <SmsBroadcastTable
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
        title="Delete SMS Broadcast Log"
        description="Are you sure you want to permanently remove this SMS broadcast campaign record and delivery log?"
        itemTitle={deleteTarget?.title || deleteTarget?.messageContent?.slice(0, 30) || ""}
        confirmText="Delete Broadcast"
      />
    </div>
  );
}

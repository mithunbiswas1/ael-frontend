// src/app/(dashboard)/admin/messages/page.jsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FaEnvelope, FaPaperPlane } from "react-icons/fa";
import { AdminPageHeader } from "@/components/ui/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import Pagination from "@/components/ui/Pagination";
import {
  useGetContactMessagesQuery,
  useUpdateContactMessageStatusMutation,
  useDeleteContactMessageMutation,
} from "@/redux/api/pageApi";

// Modularized Components
import MessageFilters from "./_components/MessageFilters";
import MessageTable from "./_components/MessageTable";
import MessageDetailModal from "./_components/MessageDetailModal";
import MessageReplyModal from "./_components/MessageReplyModal";

export default function AdminMessagesPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyMessageTarget, setReplyMessageTarget] = useState(null);
  const [isComposeDirectOpen, setIsComposeDirectOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: messagesData, isLoading, refetch } = useGetContactMessagesQuery({
    status: statusFilter,
    search: searchTerm,
  });

  const [updateStatus] = useUpdateContactMessageStatusMutation();
  const [deleteMessage, { isLoading: isDeleting }] = useDeleteContactMessageMutation();

  const messages = Array.isArray(messagesData?.data) ? messagesData.data : [];
  const totalMessages = messages.length;
  const totalPages = Math.ceil(totalMessages / 10) || 1;
  const paginatedMessages = messages.slice((page - 1) * 10, page * 10);

  const handleStatusChange = async (id, status) => {
    try {
      await updateStatus({ id, data: { status } }).unwrap();
      toast.success(`Message marked as ${status}`);
      if (selectedMessage?._id === id) {
        setSelectedMessage((prev) => ({ ...prev, status }));
      }
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  const handleOpenMessage = (msg) => {
    setSelectedMessage(msg);
    if (msg.status === "unread") {
      handleStatusChange(msg._id, "read");
    }
  };

  const handleOpenReply = (msg) => {
    setReplyMessageTarget(msg);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget?._id) return;
    try {
      await deleteMessage(deleteTarget._id).unwrap();
      toast.success("Message deleted successfully");
      if (selectedMessage?._id === deleteTarget._id) setSelectedMessage(null);
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete message");
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Compose Direct Email action */}
      <AdminPageHeader
        icon={FaEnvelope}
        title="Contact Messages & Inquiries"
        description="View, filter, manage, and respond to submissions from citizens, dealers, and commercial operators via SMTP."
        badge={`${messages.length} Submissions`}
        actions={
          <Button
            type="button"
            variant="primary"
            size="xs"
            onClick={() => setIsComposeDirectOpen(true)}
            className="flex items-center gap-1.5"
          >
            <FaPaperPlane className="h-3 w-3" />
            <span>Send Direct Email</span>
          </Button>
        }
      />

      {/* 2. Filters Bar */}
      <MessageFilters
        statusFilter={statusFilter}
        setStatusFilter={(val) => {
          setStatusFilter(val);
          setPage(1);
        }}
        searchTerm={searchTerm}
        setSearchTerm={(val) => {
          setSearchTerm(val);
          setPage(1);
        }}
      />

      {/* 3. Messages Table */}
      <div className="space-y-4">
        <MessageTable
          messages={paginatedMessages}
          isLoading={isLoading}
          onOpenMessage={handleOpenMessage}
          onOpenReply={handleOpenReply}
          onStatusChange={handleStatusChange}
          onDelete={(msg) => setDeleteTarget(msg)}
        />

        {totalMessages > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalMessages}
            pageSize={10}
            onPageChange={setPage}
          />
        )}
      </div>

      {/* 4. Message View Detail Modal */}
      {selectedMessage && (
        <MessageDetailModal
          selectedMessage={selectedMessage}
          onClose={() => setSelectedMessage(null)}
          onStatusChange={handleStatusChange}
          onOpenReply={handleOpenReply}
        />
      )}

      {/* 5. Reply to Message via Email (SMTP) Modal */}
      {(replyMessageTarget || isComposeDirectOpen) && (
        <MessageReplyModal
          isOpen={Boolean(replyMessageTarget || isComposeDirectOpen)}
          onClose={() => {
            setReplyMessageTarget(null);
            setIsComposeDirectOpen(false);
          }}
          messageRecord={replyMessageTarget}
          onSuccess={() => refetch()}
        />
      )}

      {/* 6. Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Contact Message"
        description="Are you sure you want to permanently delete this contact submission and inquiry record?"
        itemTitle={
          deleteTarget
            ? `${deleteTarget.fullName || "User"} - ${deleteTarget.subject || "Message"}`
            : ""
        }
        confirmText="Delete Message"
      />
    </div>
  );
}

// src/app/(dashboard)/admin/messages/page.jsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  FaEnvelope,
  FaEnvelopeOpen,
  FaTrash,
  FaCheck,
  FaPhoneAlt,
  FaSearch,
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
import { AdminPageHeader } from "@/components/ui/AdminPageHeader";
import { Input } from "@/components/ui/Input";
import { H3, H4, P } from "@/components/ui/Typography";
import { Dialog, DialogBody, DialogFooter } from "@/components/ui/Dialog";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import {
  useGetContactMessagesQuery,
  useUpdateContactMessageStatusMutation,
  useDeleteContactMessageMutation,
} from "@/redux/api/pageApi";

export default function AdminMessagesPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: messagesData, isLoading, refetch } = useGetContactMessagesQuery({
    status: statusFilter,
    search: searchTerm,
  });

  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateContactMessageStatusMutation();
  const [deleteMessage, { isLoading: isDeleting }] =
    useDeleteContactMessageMutation();

  const messages = Array.isArray(messagesData?.data) ? messagesData.data : [];

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

  const handleDelete = (msg) => {
    setDeleteTarget(msg);
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

  const handleOpenMessage = (msg) => {
    setSelectedMessage(msg);
    if (msg.status === "unread") {
      handleStatusChange(msg._id, "read");
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <AdminPageHeader
        icon={FaEnvelope}
        title="Contact Messages & Inquiries"
        description="View, filter, manage, and respond to submissions from citizens, dealers, and commercial operators."
        badge={`${messages.length} Submissions`}
      />

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {["all", "unread", "read", "replied"].map((st) => (
            <Button
              key={st}
              type="button"
              variant={statusFilter === st ? "primary" : "secondary"}
              size="xs"
              onClick={() => setStatusFilter(st)}
              className="capitalize text-xs font-bold"
            >
              {st}
            </Button>
          ))}
        </div>

        <div className="w-full sm:w-72">
          <Input
            placeholder="Search by name, email, subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            prefix={<FaSearch className="h-3 w-3 text-slate-400" />}
          />
        </div>
      </div>

      {/* Messages Table */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <P className="mt-3 text-xs">Loading messages...</P>
        </div>
      ) : messages.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center bg-white">
          <FaEnvelopeOpen className="mx-auto h-10 w-10 text-slate-300 mb-2" />
          <H4 className="text-sm font-bold text-slate-700">No Messages Found</H4>
          <P className="text-xs text-slate-400 mt-1">
            New inquiries from the public contact page will appear here.
          </P>
        </div>
      ) : (
        <Table containerClassName="border-slate-200/90 bg-white">
          <TableHeader>
            <TableRow>
              <TableHead>Sender & Contact</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((msg) => (
              <TableRow
                key={msg._id}
                className={msg.status === "unread" ? "bg-blue-50/30" : ""}
              >
                <TableCell>
                  <div>
                    <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      {msg.status === "unread" && (
                        <span className="h-2 w-2 rounded-full bg-blue-600 shrink-0" />
                      )}
                      <span>{msg.fullName}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono">
                      {msg.email}
                    </div>
                    {msg.phone && (
                      <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                        <FaPhoneAlt className="h-2 w-2" />
                        <span>{msg.phone}</span>
                      </div>
                    )}
                  </div>
                </TableCell>

                <TableCell className="max-w-xs">
                  <div className="font-semibold text-slate-800 text-xs truncate">
                    {msg.subject || "(No Subject)"}
                  </div>
                  <div className="text-[11px] text-slate-500 truncate max-w-xs mt-0.5">
                    {msg.message}
                  </div>
                </TableCell>

                <TableCell>
                  <span className="text-xs text-slate-500">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </TableCell>

                <TableCell>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                      msg.status === "unread"
                        ? "bg-amber-100 text-amber-800"
                        : msg.status === "replied"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {msg.status}
                  </span>
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      type="button"
                      variant="secondary"
                      size="xs"
                      onClick={() => handleOpenMessage(msg)}
                    >
                      View
                    </Button>

                    {msg.status === "unread" ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="xs"
                        onClick={() => handleStatusChange(msg._id, "read")}
                        title="Mark as Read"
                      >
                        <FaCheck className="h-3 w-3 text-emerald-600" />
                      </Button>
                    ) : null}

                    <Button
                      type="button"
                      variant="danger"
                      size="xs"
                      onClick={() => handleDelete(msg)}
                      className="p-1.5"
                      title="Delete Message"
                    >
                      <FaTrash className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Message View Modal using Dialog */}
      {selectedMessage && (
        <Dialog
          isOpen={!!selectedMessage}
          onClose={() => setSelectedMessage(null)}
          maxWidth="md"
          title={selectedMessage.subject || "User Inquiry Details"}
          description={`From: ${selectedMessage.fullName} (${selectedMessage.email})`}
        >
          <DialogBody className="space-y-4">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
              <div>
                <strong>Phone:</strong> {selectedMessage.phone || "Not provided"}
              </div>
              <div>
                <strong>Sent on:</strong>{" "}
                {new Date(selectedMessage.createdAt).toLocaleString()}
              </div>
              <div>
                <strong>Current Status:</strong>{" "}
                <span className="capitalize font-bold text-primary">
                  {selectedMessage.status}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Message Content:
              </label>
              <div className="p-3.5 bg-white border border-slate-200 rounded-lg text-xs leading-relaxed text-slate-800 whitespace-pre-wrap">
                {selectedMessage.message}
              </div>
            </div>
          </DialogBody>

          <DialogFooter className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="xs"
                onClick={() =>
                  handleStatusChange(
                    selectedMessage._id,
                    selectedMessage.status === "read" ? "unread" : "read"
                  )
                }
              >
                Mark as {selectedMessage.status === "read" ? "Unread" : "Read"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="xs"
                onClick={() => handleStatusChange(selectedMessage._id, "replied")}
              >
                Mark as Replied
              </Button>
            </div>

            <Button
              type="button"
              variant="primary"
              size="xs"
              onClick={() => setSelectedMessage(null)}
            >
              Close
            </Button>
          </DialogFooter>
        </Dialog>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Contact Message"
        description="Are you sure you want to permanently delete this contact submission and inquiry record?"
        itemTitle={
          deleteTarget
            ? `${deleteTarget.name} - ${deleteTarget.subject || "Message"}`
            : ""
        }
        confirmText="Delete Message"
      />
    </div>
  );
}

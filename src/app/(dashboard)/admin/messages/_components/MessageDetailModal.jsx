// src/app/(dashboard)/admin/messages/_components/MessageDetailModal.jsx
"use client";

import { Mail, Clock, CheckCircle2, User, Phone } from "lucide-react";
import { Dialog, DialogBody, DialogFooter } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";

export default function MessageDetailModal({
  selectedMessage,
  onClose,
  onStatusChange,
  onOpenReply,
}) {
  if (!selectedMessage) return null;

  return (
    <Dialog
      isOpen={!!selectedMessage}
      onClose={onClose}
      maxWidth="md"
      title={selectedMessage.subject || "User Inquiry Details"}
      description={`From: ${selectedMessage.fullName} (${selectedMessage.email})`}
    >
      <DialogBody className="space-y-4">
        {/* Meta details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-lg border border-slate-200 text-xs">
          <div className="flex items-center gap-2 text-slate-700">
            <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>
              <strong>Sender:</strong> {selectedMessage.fullName}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="font-mono">{selectedMessage.email}</span>
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>
              <strong>Phone:</strong> {selectedMessage.phone || "Not provided"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-700">
            <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>
              {new Date(selectedMessage.createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-slate-500">
            Processing Status:
          </span>
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${
              selectedMessage.status === "unread"
                ? "bg-amber-100 text-amber-800"
                : selectedMessage.status === "replied"
                ? "bg-emerald-100 text-emerald-800"
                : "bg-slate-100 text-slate-700"
            }`}
          >
            {selectedMessage.status}
          </span>
        </div>

        {/* Message Content */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Inquiry Message:
          </label>
          <div className="p-3.5 bg-white border border-slate-200 rounded-lg text-xs leading-relaxed text-slate-800 whitespace-pre-wrap max-h-60 overflow-y-auto">
            {selectedMessage.message}
          </div>
        </div>

        {/* Admin Notes if replied */}
        {selectedMessage.adminNotes && (
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Admin Action Audit Log:
            </label>
            <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-lg text-[11px] text-emerald-900 whitespace-pre-wrap font-mono">
              {selectedMessage.adminNotes}
            </div>
          </div>
        )}
      </DialogBody>

      <DialogFooter className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={() =>
              onStatusChange(
                selectedMessage._id,
                selectedMessage.status === "read" ? "unread" : "read"
              )
            }
          >
            Mark as {selectedMessage.status === "read" ? "Unread" : "Read"}
          </Button>

          <Button
            type="button"
            variant="primary"
            size="xs"
            onClick={() => {
              onClose();
              onOpenReply(selectedMessage);
            }}
            className="flex items-center gap-1.5"
          >
            <Mail className="h-3 w-3" />
            <span>Reply via Email</span>
          </Button>
        </div>

        <Button type="button" variant="secondary" size="xs" onClick={onClose}>
          Close
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

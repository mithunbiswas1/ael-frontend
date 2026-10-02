// src/app/(dashboard)/admin/messages/_components/MessageReplyModal.jsx
"use client";

import { useState, useEffect } from "react";
import { Mail, Send, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogBody, DialogFooter } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useReplyContactMessageMutation } from "@/redux/api/pageApi";

export default function MessageReplyModal({
  isOpen,
  onClose,
  messageRecord,
  onSuccess,
}) {
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [replySubject, setReplySubject] = useState("");
  const [replyMessage, setReplyMessage] = useState("");

  const [sendReply, { isLoading }] = useReplyContactMessageMutation();

  useEffect(() => {
    if (messageRecord) {
      setRecipientEmail(messageRecord.email || "");
      setRecipientName(messageRecord.fullName || "");
      setReplySubject(
        messageRecord.subject
          ? `Re: ${messageRecord.subject}`
          : "Inquiry on AEL SafeLPG Bangladesh"
      );
      setReplyMessage("");
    } else {
      setRecipientEmail("");
      setRecipientName("");
      setReplySubject("Official Notification from AEL SafeLPG");
      setReplyMessage("");
    }
  }, [messageRecord]);

  const handleSend = async (e) => {
    e.preventDefault();

    if (!recipientEmail || !recipientEmail.includes("@")) {
      toast.error("Please enter a valid recipient email address.");
      return;
    }
    if (!replyMessage.trim()) {
      toast.error("Please compose a reply message.");
      return;
    }

    try {
      const payload = {
        recipientEmail: recipientEmail.trim(),
        recipientName: recipientName.trim(),
        replySubject: replySubject.trim(),
        replyMessage: replyMessage.trim(),
      };

      const messageId = messageRecord?._id || "direct";
      const res = await sendReply({ id: messageId, data: payload }).unwrap();

      toast.success(
        res?.message || `Email successfully delivered to ${recipientEmail} via SMTP`
      );
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      toast.error(
        err?.data?.message || err?.message || "Failed to deliver email through SMTP server"
      );
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title="Reply via Email (SMTP)"
      description="Send a formal, branded response directly to the user's inbox through the configured SMTP mail server."
    >
      <form onSubmit={handleSend} className="space-y-4">
        <DialogBody className="space-y-4">
          {/* SMTP Protocol Badge */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50/80 border border-emerald-200/80 text-xs text-emerald-800">
            <div className="flex items-center gap-2 font-medium">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Direct SMTP Delivery: SSL/TLS Encrypted Transmission</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded">
              Active Server
            </span>
          </div>

          {/* Original message context preview if replying to a contact message */}
          {messageRecord?.message && (
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Original Inquiry:
              </div>
              <p className="text-slate-700 italic line-clamp-2">
                &ldquo;{messageRecord.message}&rdquo;
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Recipient Name
              </label>
              <Input
                placeholder="User / Customer Name"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Recipient Email *
              </label>
              <Input
                type="email"
                required
                placeholder="user@example.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Subject Line *
            </label>
            <Input
              required
              placeholder="e.g. Re: LPG Safety Standards Clarification"
              value={replySubject}
              onChange={(e) => setReplySubject(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Message Content (Email Body) *
            </label>
            <textarea
              required
              rows={6}
              placeholder="Write your email response here... The user will receive this in an official AEL SafeLPG branded HTML email template."
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              disabled={isLoading}
              className="w-full rounded-lg border border-slate-300 p-3 text-xs leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-slate-100"
            />
          </div>
        </DialogBody>

        <DialogFooter className="flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="xs"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="xs"
            disabled={isLoading}
            className="flex items-center gap-1.5"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Sending via SMTP...</span>
              </>
            ) : (
              <>
                <Send className="h-3 w-3" />
                <span>Send Email (SMTP)</span>
              </>
            )}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}

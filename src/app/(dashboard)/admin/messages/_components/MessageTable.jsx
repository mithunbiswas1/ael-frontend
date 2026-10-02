// src/app/(dashboard)/admin/messages/_components/MessageTable.jsx
"use client";

import { FaEnvelopeOpen, FaCheck, FaTrash, FaPhoneAlt, FaReply } from "react-icons/fa";
import { Mail } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { H4, P } from "@/components/ui/Typography";

export default function MessageTable({
  messages,
  isLoading,
  onOpenMessage,
  onOpenReply,
  onStatusChange,
  onDelete,
}) {
  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <P className="mt-3 text-xs">Loading contact inquiries...</P>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center bg-white">
        <FaEnvelopeOpen className="mx-auto h-10 w-10 text-slate-300 mb-2" />
        <H4 className="text-sm font-bold text-slate-700">No Inquiries Found</H4>
        <P className="text-xs text-slate-400 mt-1">
          Submissions from the public contact page will automatically show up here.
        </P>
      </div>
    );
  }

  return (
    <Table containerClassName="border-slate-200/90 bg-white shadow-xs">
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
            className={msg.status === "unread" ? "bg-blue-50/20" : ""}
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
              <span className="text-xs text-slate-500 whitespace-nowrap">
                {new Date(msg.createdAt).toLocaleDateString()}
              </span>
            </TableCell>

            <TableCell>
              <span
                className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold capitalize whitespace-nowrap ${
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
                {/* View Detail */}
                <Button
                  type="button"
                  variant="secondary"
                  size="xs"
                  onClick={() => onOpenMessage(msg)}
                  title="View full inquiry"
                >
                  View
                </Button>

                {/* Reply via Email */}
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={() => onOpenReply(msg)}
                  className="flex items-center gap-1 border-primary/30 text-primary hover:bg-primary/5"
                  title="Reply to user via Email SMTP"
                >
                  <FaReply className="h-2.5 w-2.5" />
                  <span className="hidden sm:inline">Reply</span>
                </Button>

                {/* Mark as read quick toggle */}
                {msg.status === "unread" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={() => onStatusChange(msg._id, "read")}
                    title="Mark as Read"
                  >
                    <FaCheck className="h-3 w-3 text-emerald-600" />
                  </Button>
                )}

                {/* Delete */}
                <Button
                  type="button"
                  variant="danger"
                  size="xs"
                  onClick={() => onDelete(msg)}
                  className="p-1.5"
                  title="Delete Inquiry"
                >
                  <FaTrash className="h-3 w-3" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

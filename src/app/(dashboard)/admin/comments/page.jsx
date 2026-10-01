// src/app/(dashboard)/admin/comments/page.jsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  FaComments,
  FaCheck,
  FaBan,
  FaTrash,
  FaExternalLinkAlt,
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
import { Input } from "@/components/ui/Input";
import { AdminPageHeader } from "@/components/ui/AdminPageHeader";
import { H4, P } from "@/components/ui/Typography";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import {
  useGetAdminCommentsQuery,
  useUpdateCommentStatusMutation,
  useDeleteCommentMutation,
} from "@/redux/api/commentApi";

const STATUS_TABS = [
  { id: "all", label: "All Comments" },
  { id: "pending", label: "Pending Approval" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
];

export default function AdminCommentsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const { data: commentsResponse, isLoading, refetch } = useGetAdminCommentsQuery({
    status: statusFilter,
    search: searchTerm,
    page,
    limit: 25,
  });

  const [updateStatus, { isLoading: isUpdating }] = useUpdateCommentStatusMutation();
  const [deleteComment, { isLoading: isDeleting }] = useDeleteCommentMutation();

  const comments = commentsResponse?.data?.comments || [];
  const pagination = commentsResponse?.data?.pagination || {};

  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateStatus({ id, data: { status: newStatus } }).unwrap();
      toast.success(`Comment status updated to ${newStatus}`);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update comment status");
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget?._id) return;
    try {
      await deleteComment(deleteTarget._id).unwrap();
      toast.success("Comment deleted successfully");
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete comment");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        icon={FaComments}
        title="Subscriber Comments & Moderation"
        description="Review, moderate, approve, or reject comments posted by subscribers on blogs and incident news."
        badge={`${pagination.totalCount || comments.length} Total`}
      />

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {STATUS_TABS.map((tab) => (
            <Button
              key={tab.id}
              type="button"
              variant={statusFilter === tab.id ? "primary" : "secondary"}
              size="xs"
              onClick={() => {
                setStatusFilter(tab.id);
                setPage(1);
              }}
              className="text-xs font-bold capitalize"
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Search */}
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search by text, user, or topic..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            prefix={<FaSearch className="h-3 w-3 text-slate-400" />}
          />
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <P className="mt-3 text-xs">Loading subscriber comments...</P>
        </div>
      ) : comments.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center bg-white">
          <H4 className="text-sm font-bold text-slate-700">No comments found</H4>
          <P className="mt-1 text-xs text-slate-500">
            No subscriber comments currently match your selected status filter.
          </P>
        </div>
      ) : (
        <Table containerClassName="border-slate-200/90">
          <TableHeader>
            <TableRow>
              <TableHead className="w-48">Commenter</TableHead>
              <TableHead>Comment Content</TableHead>
              <TableHead className="w-48">Target Article / Post</TableHead>
              <TableHead className="w-28 text-center">Status</TableHead>
              <TableHead className="w-32 text-right">Moderation</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {comments.map((item) => (
              <TableRow key={item._id}>
                {/* Commenter */}
                <TableCell>
                  <div className="space-y-0.5">
                    <p className="font-bold text-xs text-slate-900">
                      {item.userFullName || item.userName}
                    </p>
                    <p className="font-mono text-[11px] text-slate-400">
                      @{item.userName}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </TableCell>

                {/* Content */}
                <TableCell>
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line line-clamp-3">
                    {item.content}
                  </p>
                  {item.parentId && (
                    <span className="mt-1 inline-block text-[10px] font-bold text-primary bg-primary/5 px-1.5 py-0.5 rounded">
                      ↳ Nested Reply
                    </span>
                  )}
                </TableCell>

                {/* Target */}
                <TableCell>
                  <div className="space-y-0.5">
                    <span className="inline-block uppercase font-mono text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {item.targetType}
                    </span>
                    <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                      {item.targetTitle || item.targetId}
                    </p>
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell className="text-center">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                      item.status === "approved"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : item.status === "rejected"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {item.status}
                  </span>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {item.status !== "approved" && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        onClick={() => handleStatusChange(item._id, "approved")}
                        className="h-8 w-8 p-0 text-emerald-600 hover:bg-emerald-50"
                        title="Approve Comment"
                      >
                        <FaCheck className="h-3 w-3" />
                      </Button>
                    )}
                    {item.status !== "rejected" && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="xs"
                        onClick={() => handleStatusChange(item._id, "rejected")}
                        className="h-8 w-8 p-0 text-amber-600 hover:bg-amber-50"
                        title="Reject Comment"
                      >
                        <FaBan className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      onClick={() => setDeleteTarget(item)}
                      className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50"
                      title="Delete Comment"
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

      {/* Reusable UI Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        isLoading={isDeleting}
        title="Delete Comment Permanently"
        description="Are you sure you want to permanently delete this comment? This cannot be undone."
        itemTitle={deleteTarget?.content ? `"${deleteTarget.content.slice(0, 60)}..."` : ""}
        confirmText="Delete Comment"
      />
    </div>
  );
}

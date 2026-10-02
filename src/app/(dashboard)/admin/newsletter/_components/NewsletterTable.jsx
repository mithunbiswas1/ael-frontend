// src/app/(dashboard)/admin/newsletter/_components/NewsletterTable.jsx
"use client";

import { Mail, Globe, UserCheck, Trash2 } from "lucide-react";
import { FaCheckCircle, FaBan } from "react-icons/fa";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { H4, P } from "@/components/ui/Typography";
import Pagination from "@/components/ui/Pagination";

export default function NewsletterTable({
  subscribers,
  pagination,
  isLoading,
  isToggling,
  onToggleStatus,
  onDelete,
  onPageChange,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
      {isLoading ? (
        <div className="p-12 text-center text-slate-400">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
          <P className="mt-3 text-xs">Loading subscribers list...</P>
        </div>
      ) : subscribers.length === 0 ? (
        <div className="p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <Mail className="h-6 w-6" />
          </div>
          <H4 className="mt-4 text-sm font-bold text-slate-800">
            No newsletter subscribers found
          </H4>
          <P className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
            No records match your search or filter criteria. Subscribers will appear here when visitors sign up.
          </P>
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/80">
                <TableHead className="font-bold text-slate-700">Subscriber</TableHead>
                <TableHead className="font-bold text-slate-700">Phone</TableHead>
                <TableHead className="font-bold text-slate-700">Source</TableHead>
                <TableHead className="font-bold text-slate-700">Subscribed At</TableHead>
                <TableHead className="font-bold text-slate-700 text-center">Status</TableHead>
                <TableHead className="font-bold text-slate-700 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers.map((item) => {
                const initial = (item.name || item.email || "S").charAt(0).toUpperCase();
                const registeredUser = item.userId;

                return (
                  <TableRow key={item._id} className="hover:bg-slate-50/50">
                    {/* Subscriber Info */}
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-black text-slate-700 border border-slate-200">
                          {initial}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-900 truncate">
                            {item.name || registeredUser?.fullName || "Guest Subscriber"}
                          </div>
                          <div className="text-xs font-mono text-slate-500 truncate">
                            {item.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>

                    {/* Phone */}
                    <TableCell className="text-xs font-mono text-slate-600">
                      {item.phone || registeredUser?.phone || "—"}
                    </TableCell>

                    {/* Source */}
                    <TableCell>
                      {item.source === "registration" ? (
                        <Badge variant="primary" size="xs" icon={UserCheck}>
                          Registered User
                        </Badge>
                      ) : (
                        <Badge variant="secondary" size="xs" icon={Globe}>
                          Newsletter User
                        </Badge>
                      )}
                    </TableCell>

                    {/* Subscribed At */}
                    <TableCell className="text-xs text-slate-500 whitespace-nowrap">
                      {item.subscribedAt
                        ? new Date(item.subscribedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "—"}
                    </TableCell>

                    {/* Status */}
                    <TableCell className="text-center">
                      <Badge
                        variant={item.isActive ? "success" : "danger"}
                        size="xs"
                        icon={item.isActive ? FaCheckCircle : FaBan}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>

                    {/* Actions */}
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          type="button"
                          variant={item.isActive ? "outline" : "primary-soft"}
                          size="xs"
                          onClick={() => onToggleStatus(item)}
                          disabled={isToggling}
                          title={item.isActive ? "Deactivate subscriber" : "Activate subscriber"}
                        >
                          <span>{item.isActive ? "Pause" : "Activate"}</span>
                        </Button>

                        <Button
                          type="button"
                          variant="danger-ghost"
                          size="icon-xs"
                          onClick={() => onDelete(item)}
                          title="Delete subscriber"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          <Pagination
            currentPage={pagination?.page || 1}
            totalPages={pagination?.totalPages || 1}
            totalItems={pagination?.total}
            pageSize={10}
            onPageChange={onPageChange}
          />
        </>
      )}
    </div>
  );
}

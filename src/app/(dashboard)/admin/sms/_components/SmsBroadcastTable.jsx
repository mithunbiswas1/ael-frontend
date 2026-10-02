// src/app/(dashboard)/admin/sms/_components/SmsBroadcastTable.jsx
"use client";

import { BarChart2, Trash2, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";

export default function SmsBroadcastTable({
  campaigns,
  isLoading,
  onDelete,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <Smartphone className="h-4 w-4 text-primary" />
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            SMS Broadcast Logs
          </h4>
        </div>
        <span className="text-xs font-medium text-slate-500">
          Total {campaigns.length} campaigns dispatched
        </span>
      </div>

      <Table
        containerClassName="border-0 rounded-none overflow-x-auto"
        className="min-w-[650px] w-full caption-bottom text-left text-xs"
      >
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[280px]">Campaign & SMS Text</TableHead>
            <TableHead className="min-w-[120px] text-center">Recipients</TableHead>
            <TableHead className="min-w-[120px] text-center">Status</TableHead>
            <TableHead className="min-w-[120px]">Dispatched At</TableHead>
            <TableHead className="w-16 text-right pr-4">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-slate-400 text-xs">
                Loading SMS broadcast records...
              </TableCell>
            </TableRow>
          ) : campaigns.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-slate-400 text-xs">
                No SMS campaigns found. Compose and send your first SMS campaign above.
              </TableCell>
            </TableRow>
          ) : (
            campaigns.map((item) => (
              <TableRow key={item._id} className="hover:bg-slate-50/70 transition-colors">
                <TableCell className="min-w-[280px] max-w-md whitespace-normal py-3">
                  <div className="space-y-1">
                    <div className="font-bold text-xs text-slate-900 leading-snug break-words">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-600 leading-relaxed break-words line-clamp-2">
                      {item.messageContent}
                    </div>
                  </div>
                </TableCell>

                <TableCell className="min-w-[120px] text-center font-bold text-xs text-slate-800">
                  {Number(item.recipientCount || item.deliveredCount || 0).toLocaleString()}
                </TableCell>

                <TableCell className="min-w-[120px] text-center">
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      item.status === "completed"
                        ? "bg-emerald-100 text-emerald-800"
                        : item.status === "scheduled"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.status}
                  </span>
                </TableCell>

                <TableCell className="min-w-[120px] text-xs text-slate-500 whitespace-nowrap">
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "—"}
                </TableCell>

                <TableCell className="w-16 text-right pr-4">
                  <Button
                    type="button"
                    variant="danger-ghost"
                    size="icon-sm"
                    onClick={() => onDelete(item)}
                    title="Delete log"
                    icon={Trash2}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

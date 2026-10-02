// src/app/(dashboard)/admin/email/_components/EmailBroadcastTable.jsx
"use client";

import { BarChart2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/Table";

export default function EmailBroadcastTable({
  campaigns,
  isLoading,
  onDelete,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <BarChart2 className="h-4 w-4 text-primary" />
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Email Broadcast Logs
          </h4>
        </div>
        <span className="text-xs font-medium text-slate-500">
          Total {campaigns.length} campaigns logged
        </span>
      </div>

      <Table
        containerClassName="border-0 rounded-none overflow-x-auto"
        className="min-w-[700px] w-full caption-bottom text-left text-xs"
      >
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[300px]">Campaign & Subject</TableHead>
            <TableHead className="min-w-[160px]">Target Segment</TableHead>
            <TableHead className="min-w-[120px] text-center">Recipients</TableHead>
            <TableHead className="min-w-[120px] text-center">Status</TableHead>
            <TableHead className="w-16 text-right pr-4">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-slate-400 text-xs">
                Loading email campaigns...
              </TableCell>
            </TableRow>
          ) : campaigns.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-slate-400 text-xs">
                No email campaigns found.
              </TableCell>
            </TableRow>
          ) : (
            campaigns.map((item) => (
              <TableRow key={item._id} className="hover:bg-slate-50/70 transition-colors">
                <TableCell className="min-w-[300px] max-w-sm whitespace-normal py-3">
                  <div className="space-y-1">
                    <div className="font-bold text-xs text-slate-900 leading-snug break-words">
                      {item.title}
                    </div>
                    {item.subject && item.subject !== item.title && (
                      <div className="text-[11px] text-slate-500 leading-tight break-words line-clamp-2">
                        {item.subject}
                      </div>
                    )}
                  </div>
                </TableCell>

                <TableCell className="min-w-[160px] text-xs">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold capitalize whitespace-nowrap">
                    {item.targetAudience?.replace(/_/g, " ")}
                  </span>
                </TableCell>

                <TableCell className="min-w-[120px] text-center font-bold text-xs text-slate-800">
                  {Number(item.recipientCount || 0).toLocaleString()}
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

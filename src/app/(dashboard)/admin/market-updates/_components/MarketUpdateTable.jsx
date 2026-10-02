// src/app/(dashboard)/admin/market-updates/_components/MarketUpdateTable.jsx
"use client";

import Image from "next/image";
import { FaEdit, FaTrash, FaFilePdf } from "react-icons/fa";
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

const CATEGORY_COLORS = {
  incidents: "bg-rose-50 text-rose-700 border-rose-200",
  berc: "bg-blue-50 text-blue-700 border-blue-200",
  global: "bg-purple-50 text-purple-700 border-purple-200",
};

export default function MarketUpdateTable({
  updates = [],
  isLoading,
  onEdit,
  onDelete,
}) {
  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <P className="mt-3 text-xs">Loading market updates...</P>
      </div>
    );
  }

  if (updates.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center bg-white">
        <H4 className="text-sm font-bold text-slate-700">No market updates found</H4>
        <P className="mt-1 text-xs text-slate-500">
          Click &quot;New Market Update&quot; to publish your first intelligence or gazette report.
        </P>
      </div>
    );
  }

  return (
    <Table containerClassName="border-slate-200/90">
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">Banner</TableHead>
          <TableHead>Title & Category</TableHead>
          <TableHead>Publication Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {updates.map((item) => (
          <TableRow key={item._id} className="hover:bg-slate-50/80 transition-colors">
            {/* Banner */}
            <TableCell>
              <div className="relative h-11 w-16 overflow-hidden rounded-md border border-slate-200 bg-slate-100 shrink-0">
                <Image
                  src={item.image || "/default_image.jpg"}
                  alt={item.titleEn}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/default_image.jpg";
                  }}
                />
              </div>
            </TableCell>

            {/* Title & Category */}
            <TableCell className="max-w-md">
              <div className="space-y-1">
                <p className="font-bold text-xs text-slate-900 line-clamp-1">
                  {item.titleEn}
                </p>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  {item.titleBn}
                </p>
                <div className="flex items-center gap-2 pt-0.5">
                  <span
                    className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      CATEGORY_COLORS[item.category] || "bg-slate-100 text-slate-700 border-slate-200"
                    }`}
                  >
                    {item.category === "incidents"
                      ? "Incidents"
                      : item.category === "berc"
                      ? "BERC Notice"
                      : "Global Market"}
                  </span>
                  {item.pdfUrl && (
                    <a
                      href={item.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded bg-rose-50 border border-rose-200 px-1.5 py-0.5 text-[10px] font-bold text-rose-700 hover:bg-rose-100 transition-colors"
                      title={item.pdfOriginalName || "View PDF Attachment"}
                    >
                      <FaFilePdf className="h-2.5 w-2.5 text-rose-600" />
                      <span>PDF</span>
                    </a>
                  )}
                </div>
              </div>
            </TableCell>

            {/* Date */}
            <TableCell className="text-xs text-slate-500 whitespace-nowrap">
              {item.publishDate ? new Date(item.publishDate).toLocaleDateString() : "—"}
            </TableCell>

            {/* Status */}
            <TableCell>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                  item.isPublished
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                {item.isPublished ? "Published" : "Draft"}
              </span>
            </TableCell>

            {/* Actions */}
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={() => onEdit(item)}
                  className="p-1.5 text-slate-700 hover:bg-slate-100"
                  title="Edit Update"
                >
                  <FaEdit className="h-3 w-3" />
                </Button>
                <Button
                  type="button"
                  variant="danger"
                  size="xs"
                  onClick={() => onDelete(item._id)}
                  className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border-rose-200"
                  title="Delete Update"
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

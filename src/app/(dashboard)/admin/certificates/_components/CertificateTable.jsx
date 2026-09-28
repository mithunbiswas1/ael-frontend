// src/app/(dashboard)/admin/certificates/_components/CertificateTable.jsx
"use client";

import Link from "next/link";
import { FaAward, FaEdit, FaTrash, FaExternalLinkAlt, FaCheckCircle } from "react-icons/fa";
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

export default function CertificateTable({
  certificates = [],
  isLoading,
  onEdit,
  onDelete,
}) {
  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <P className="mt-3 text-xs">Loading certificate registry...</P>
      </div>
    );
  }

  if (certificates.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center bg-white">
        <H4 className="text-sm font-bold text-slate-700">No certificates found</H4>
        <P className="mt-1 text-xs text-slate-500">
          Click &quot;Issue New Certificate&quot; to issue a verified safety certificate.
        </P>
      </div>
    );
  }

  return (
    <Table containerClassName="shadow-xs border-slate-200/90">
      <TableHeader>
        <TableRow>
          <TableHead className="w-44">Certificate ID</TableHead>
          <TableHead className="w-56">Recipient Name</TableHead>
          <TableHead>Course Curriculum</TableHead>
          <TableHead className="w-32">Grade</TableHead>
          <TableHead className="w-36">Issue Date</TableHead>
          <TableHead className="w-28 text-center">Status</TableHead>
          <TableHead className="w-32 text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {certificates.map((cert) => (
          <TableRow key={cert._id || cert.certificateId}>
            {/* Certificate ID */}
            <TableCell>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs font-bold text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/20">
                  {cert.certificateId}
                </span>
              </div>
            </TableCell>

            {/* Recipient */}
            <TableCell>
              <div className="space-y-0.5">
                <p className="font-bold text-xs text-slate-900">{cert.studentName}</p>
                {cert.studentNameBn && (
                  <p className="text-[11px] text-slate-500">{cert.studentNameBn}</p>
                )}
              </div>
            </TableCell>

            {/* Course */}
            <TableCell>
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-slate-800 line-clamp-1">
                  {cert.courseTitle}
                </p>
                {cert.courseTitleBn && (
                  <p className="text-[11px] text-slate-400 line-clamp-1">
                    {cert.courseTitleBn}
                  </p>
                )}
              </div>
            </TableCell>

            {/* Grade */}
            <TableCell>
              <span className="inline-flex rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                {cert.grade || "Pass (90%)"}
              </span>
            </TableCell>

            {/* Issue Date */}
            <TableCell className="text-xs font-mono text-slate-500">
              {cert.issueDate || "—"}
            </TableCell>

            {/* Status */}
            <TableCell className="text-center">
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                <FaCheckCircle className="h-2.5 w-2.5" />
                Verified
              </span>
            </TableCell>

            {/* Actions */}
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1">
                <Link
                  href={`/verify-certificate?id=${cert.certificateId}`}
                  target="_blank"
                  className="rounded-lg p-1.5 text-slate-400 hover:text-primary hover:bg-primary/5 transition-colors"
                  title="Verify Certificate Online"
                >
                  <FaExternalLinkAlt className="h-3 w-3" />
                </Link>
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => onEdit(cert)}
                  className="h-8 w-8 p-0 text-slate-500 hover:text-primary hover:bg-primary/5"
                  title="Edit Certificate"
                >
                  <FaEdit className="h-3.5 w-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={() => onDelete(cert)}
                  className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50"
                  title="Revoke / Delete Certificate"
                >
                  <FaTrash className="h-3.5 w-3.5" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

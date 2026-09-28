// src/app/(dashboard)/admin/roles/_components/RolesTable.jsx
"use client";

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

export default function RolesTable({
  roles = [],
  isLoading,
  onConfigureAccess,
}) {
  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <P className="mt-3 text-xs">Loading role definitions...</P>
      </div>
    );
  }

  if (roles.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center bg-white">
        <H4 className="text-sm font-bold text-slate-700">No roles configured</H4>
        <P className="mt-1 text-xs text-slate-500">
          Click &quot;Add Custom Role&quot; to define custom access levels.
        </P>
      </div>
    );
  }

  return (
    <Table containerClassName="shadow-xs border-slate-200/90">
      <TableHeader>
        <TableRow>
          <TableHead>Role Name</TableHead>
          <TableHead>System Key</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Type</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {roles.map((role) => (
          <TableRow key={role._id}>
            <TableCell className="font-bold text-slate-900">
              {role.label}
            </TableCell>
            <TableCell className="font-mono text-xs text-primary font-semibold">
              {role.name}
            </TableCell>
            <TableCell className="text-slate-500 text-xs max-w-xs truncate">
              {role.description || "Standard role"}
            </TableCell>
            <TableCell>
              {role.isSystem ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                  System Core
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  Custom
                </span>
              )}
            </TableCell>
            <TableCell className="text-right">
              <Button
                type="button"
                onClick={() => onConfigureAccess(role)}
                variant="secondary"
                size="xs"
                className="border-primary/30 text-primary hover:bg-primary/10 font-semibold"
              >
                Configure Access
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

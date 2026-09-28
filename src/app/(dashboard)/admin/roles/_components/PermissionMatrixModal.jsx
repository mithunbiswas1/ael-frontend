// src/app/(dashboard)/admin/roles/_components/PermissionMatrixModal.jsx
"use client";

import { Dialog } from "@/components/ui/Dialog";
import { FaCheckCircle, FaSave } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import { P } from "@/components/ui/Typography";

export default function PermissionMatrixModal({
  selectedRole,
  onClose,
  allModules = [],
  actions = [],
  hasPermission,
  onTogglePermission,
  onSave,
  isUpdating,
}) {
  if (!selectedRole) return null;

  const isSuperAdmin = selectedRole?.name === "super_admin";

  return (
    <Dialog
      isOpen={Boolean(selectedRole)}
      onClose={onClose}
      maxWidth="3xl"
      title={selectedRole ? `Permissions: ${selectedRole.label}` : ""}
      description={selectedRole ? `System Key: ${selectedRole.name}` : ""}
    >
      {/* Modal Content */}
      <div className="p-6 space-y-4">
        {isSuperAdmin ? (
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-xs text-slate-700">
              <P className="font-bold text-primary">Master Super Administrator Access</P>
              <P className="mt-1 text-slate-600">
                This system role possesses unconditional full access to all actions on every module.
              </P>
            </div>
          ) : (
            <Table containerClassName="border-slate-200">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3">System Module</TableHead>
                  {actions.map((act) => (
                    <TableHead key={act} className="text-center capitalize">
                      {act}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {allModules.map((mod) => (
                  <TableRow key={mod.id}>
                    <TableCell className="font-bold text-slate-800 text-xs">
                      {mod.label}
                    </TableCell>
                    {actions.map((act) => {
                      const enabled = hasPermission(mod.id, act);
                      return (
                        <TableCell key={act} className="text-center">
                          <Button
                            type="button"
                            onClick={() => onTogglePermission(mod.id, act)}
                            variant={enabled ? "primary" : "outline"}
                            size="xs"
                            className={`h-7 px-2.5 text-[11px] font-bold ${
                              enabled
                                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                : "text-slate-400 border-slate-200 hover:text-slate-700"
                            }`}
                          >
                            {enabled ? (
                              <span className="flex items-center gap-1">
                                <FaCheckCircle className="h-3 w-3" />
                                <span>ALLOW</span>
                              </span>
                            ) : (
                              <span>DENY</span>
                            )}
                          </Button>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-3 bg-slate-50">
          <Button
            type="button"
            onClick={onClose}
            variant="outline"
            size="sm"
          >
            Cancel
          </Button>

          {!isSuperAdmin && (
            <Button
              type="button"
              onClick={onSave}
              disabled={isUpdating}
              variant="primary"
              size="sm"
              className="gap-2"
            >
              <FaSave className="h-3.5 w-3.5" />
              <span>{isUpdating ? "Saving Matrix..." : "Save Permissions"}</span>
            </Button>
          )}
        </div>
    </Dialog>
  );
}

// src/app/(dashboard)/admin/roles/_components/RolesHeader.jsx
"use client";

import { FaUserShield } from "react-icons/fa";
import { AdminPageHeader } from "@/components/ui/AdminPageHeader";

export default function RolesHeader({ onOpenCreateModal }) {
  return (
    <AdminPageHeader
      icon={FaUserShield}
      title="Role & Permission Matrix"
      description="Configure granular view, create, edit, and delete permissions for each role across all modules."
      actionLabel="Add Custom Role"
      onActionClick={onOpenCreateModal}
    />
  );
}

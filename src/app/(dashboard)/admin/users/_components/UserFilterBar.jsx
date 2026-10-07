// src/app/(dashboard)/admin/users/_components/UserFilterBar.jsx
"use client";

import { FaUserShield } from "react-icons/fa";
import { AdminPageHeader } from "@/components/ui/AdminPageHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";

import { useGetRolesQuery } from "@/redux/api/roleApi";

const DEFAULT_ROLE_OPTIONS = [
  { value: "ALL", label: "All Roles" },
  { value: "super_admin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "instructor", label: "Instructor" },
  { value: "subscriber", label: "Subscriber" },
  { value: "user", label: "User" },
];

export default function UserFilterBar({
  searchTerm,
  onSearchChange,
  selectedRole,
  onRoleChange,
  totalUsers = 0,
}) {
  const { data: rolesData } = useGetRolesQuery();

  const roleOptions = [
    { value: "ALL", label: "All Roles" },
    ...(rolesData?.data?.map((r) => ({
      value: r.name,
      label: r.label || r.name,
    })) || DEFAULT_ROLE_OPTIONS.slice(1)),
  ];
  return (
    <div className="space-y-4">
      {/* Header & Action */}
      <AdminPageHeader
        icon={FaUserShield}
        title="User & Role Permission"
        description="Monitor registered platform members, manage assigned system roles, and configure page-level permissions."
        badge={`${totalUsers} Total`}
      />

      {/* Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="w-full sm:w-80">
          <SearchInput
            placeholder="Search by name, email, phone..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="w-full sm:w-56">
          <Select
            value={selectedRole}
            onChange={(e) => onRoleChange(e.target.value)}
            options={roleOptions}
            placeholder="Filter by role"
          />
        </div>
      </div>
    </div>
  );
}

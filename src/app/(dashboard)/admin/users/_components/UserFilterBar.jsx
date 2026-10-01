// src/app/(dashboard)/admin/users/_components/UserFilterBar.jsx
"use client";

import { FaUsers } from "react-icons/fa";
import { AdminPageHeader } from "@/components/ui/AdminPageHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";

const ROLE_OPTIONS = [
  { value: "ALL", label: "All Roles (সকল রোল)" },
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
  return (
    <div className="space-y-4">
      {/* Header & Action */}
      <AdminPageHeader
        icon={FaUsers}
        title="User Management"
        description="Monitor registered platform members, change access roles, and manage account statuses."
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
            options={ROLE_OPTIONS}
            placeholder="Filter by role"
          />
        </div>
      </div>
    </div>
  );
}

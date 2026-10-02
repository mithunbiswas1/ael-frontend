// src/app/(dashboard)/admin/users/_components/UserTable.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { FaUserShield, FaEdit, FaTrash, FaCheckCircle, FaBan, FaKey } from "react-icons/fa";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { H4, P } from "@/components/ui/Typography";

const ROLE_BADGES = {
  super_admin: "bg-purple-100 text-purple-800 border-purple-200",
  admin: "bg-blue-100 text-blue-800 border-blue-200",
  instructor: "bg-indigo-100 text-indigo-800 border-indigo-200",
  course_admin: "bg-indigo-100 text-indigo-800 border-indigo-200",
  subscriber: "bg-emerald-100 text-emerald-800 border-emerald-200",
  user: "bg-slate-100 text-slate-700 border-slate-200",
  general_user: "bg-slate-100 text-slate-700 border-slate-200",
};

export default function UserTable({
  users = [],
  isLoading,
  onEdit,
  onDelete,
}) {
  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <P className="mt-3 text-xs">Loading user registry...</P>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center bg-white">
        <H4 className="text-sm font-bold text-slate-700">No users found</H4>
        <P className="mt-1 text-xs text-slate-500">
          Try adjusting your search keywords or role filters.
        </P>
      </div>
    );
  }

  return (
    <Table containerClassName="border-slate-200/90">
      <TableHeader>
        <TableRow>
          <TableHead className="w-64">User Profile</TableHead>
          <TableHead>Contact Information</TableHead>
          <TableHead className="w-36">Role</TableHead>
          <TableHead className="w-28 text-center">Status</TableHead>
          <TableHead className="w-36">Joined Date</TableHead>
          <TableHead className="w-28 text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => {
          const roleClass = ROLE_BADGES[user.role] || ROLE_BADGES.customer;
          const initials = (user.fullName || user.userName || "U")
            .slice(0, 2)
            .toUpperCase();
          const joinedDate = user.createdAt
            ? new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "—";

          return (
            <TableRow key={user._id}>
              {/* Profile */}
              <TableCell>
                <Link
                  href={`/admin/users/${user._id}`}
                  className="flex items-center gap-3 group"
                  title="View user details & permissions"
                >
                  {user.image?.url || user.profilePhoto?.url || (typeof user.image === "string" && user.image) ? (
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-slate-200">
                      <Image
                        src={user.image?.url || user.profilePhoto?.url || user.image || "/default_person.jpg"}
                        alt={user.fullName || user.userName}
                        fill
                        className="object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/default_person.jpg";
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-xs text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      {initials}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-slate-900 group-hover:text-primary transition-colors truncate">
                      {user.fullName || "Unnamed User"}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono truncate">
                      @{user.userName || "no-username"}
                    </p>
                  </div>
                </Link>
              </TableCell>

              {/* Contact */}
              <TableCell>
                <div className="space-y-0.5 text-xs">
                  <p className="text-slate-700 truncate">{user.email || "No email"}</p>
                  <p className="text-slate-400 font-mono text-[11px]">
                    {user.phone || "No phone"}
                  </p>
                </div>
              </TableCell>

              {/* Role */}
              <TableCell>
                <span
                  className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-bold uppercase ${roleClass}`}
                >
                  <FaUserShield className="h-3 w-3" />
                  {user.role}
                </span>
                {user.subscription?.status === "active" && (
                  <span className="block text-[10px] text-emerald-700 font-semibold mt-0.5">
                    ★ {user.subscription.planName || user.subscription.planKey}
                  </span>
                )}
              </TableCell>

              {/* Status */}
              <TableCell className="text-center">
                {user.is_active !== false ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                    <FaCheckCircle className="h-2.5 w-2.5" />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-700 border border-red-200">
                    <FaBan className="h-2.5 w-2.5" />
                    Inactive
                  </span>
                )}
              </TableCell>

              {/* Joined */}
              <TableCell className="text-xs text-slate-500 font-mono">
                {joinedDate}
              </TableCell>

              {/* Actions */}
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <LinkButton
                    href={`/admin/users/${user._id}`}
                    variant="primary-soft"
                    size="xs"
                    icon={FaKey}
                    title="Manage Permissions & Role"
                  >
                    Permissions
                  </LinkButton>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => onEdit(user)}
                    title="Quick Edit"
                  >
                    <FaEdit className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    type="button"
                    variant="danger-ghost"
                    size="icon-sm"
                    onClick={() => onDelete(user)}
                    title="Delete User"
                  >
                    <FaTrash className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

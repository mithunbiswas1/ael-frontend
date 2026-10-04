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

const PAGE_NAME_MAP = {
  "/admin": "Dashboard",
  "/admin/blogs": "Blogs",
  "/admin/courses": "Courses",
  "/admin/courses/enrollments": "Enrollments",
  "/admin/certificates": "Certificates",
  "/admin/users": "Users",
  "/admin/messages": "Messages",
  "/admin/comments": "Comments",
  "/admin/safety-guidelines": "Safety",
  "/admin/regulatory-agencies": "Agencies",
  "/admin/advertisements": "Ads",
  "/admin/sms": "SMS",
  "/admin/email": "Email",
  "/admin/newsletter": "Newsletter",
  "/admin/subscriptions": "Subscriptions",
  "/admin/market-updates": "Market Updates",
  "/admin/settings": "Settings",
  "/admin/pages/home": "Home CMS",
  "/admin/pages/about": "About CMS",
  "/admin/pages/blogs": "Blog CMS",
  "/admin/pages/contact": "Contact CMS",
  "/admin/pages/safety-guidelines": "Safety CMS",
  "/admin/pages/market-updates": "Market CMS",
  "/admin/pages/courses": "Courses CMS",
  "/admin/pages/acts-and-rules": "Acts CMS",
  "/admin/pages/terms": "Terms CMS",
  "/admin/pages/privacy": "Privacy CMS",
  "/admin/pages/faq": "FAQ CMS",
  "/admin/pages/subscription": "Pricing CMS",
};

const getPageLabel = (pageItem) => {
  if (!pageItem) return "Page";
  if (pageItem.page && PAGE_NAME_MAP[pageItem.page]) {
    return PAGE_NAME_MAP[pageItem.page];
  }
  if (pageItem.module) {
    return (
      PAGE_NAME_MAP[`/admin/${pageItem.module}`] ||
      pageItem.module.replace(/[-_]/g, " ")
    );
  }
  if (pageItem.page) {
    return pageItem.page
      .replace("/admin/pages/", "")
      .replace("/admin/", "")
      .replace(/[-_/]/g, " ");
  }
  return "Page";
};

function renderAccessiblePages(user) {
  const isSuperAdmin = user.role === "super_admin";
  const isAdmin = user.role === "admin";
  const isInstructor = user.role === "instructor" || user.role === "course_admin";

  // Only display page access pills for Admin and Instructor (and Super Admin)
  if (!isSuperAdmin && !isAdmin && !isInstructor) {
    return <span className="text-slate-300 text-xs font-mono">—</span>;
  }

  if (isSuperAdmin) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-0.5 text-[10px] font-bold text-purple-700 border border-purple-200 shadow-2xs">
        ★ Master Access
      </span>
    );
  }

  const userPerms = Array.isArray(user.permissions)
    ? user.permissions.filter((p) => p.actions && p.actions.length > 0)
    : [];

  // If custom permissions are configured
  if (userPerms.length > 0) {
    if (userPerms.length >= 18) {
      return (
        <Link
          href={`/admin/users/${user._id}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200 transition-colors shadow-2xs group"
          title={`Full platform access (${userPerms.length} pages enabled). Click to configure.`}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          <span>All Pages ({userPerms.length})</span>
        </Link>
      );
    }

    const maxVisible = 4;
    const visiblePerms = userPerms.slice(0, maxVisible);
    const row1Perms = visiblePerms.slice(0, 2);
    const row2Perms = visiblePerms.slice(2, 4);
    const remainingCount = userPerms.length - maxVisible;
    const remainingTooltip = userPerms
      .slice(maxVisible)
      .map(getPageLabel)
      .join(", ");

    return (
      <Link
        href={`/admin/users/${user._id}`}
        className="flex flex-col gap-1.5 py-0.5 group/pills w-fit"
        title="Click to view or edit page permissions"
      >
        {/* Row 1: First 2 pills */}
        <div className="flex items-center gap-1.5 flex-nowrap">
          {row1Perms.map((p, idx) => (
            <span
              key={idx}
              className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 capitalize truncate max-w-[125px]"
              title={`${getPageLabel(p)} (${p.actions?.join(", ")})`}
            >
              {getPageLabel(p)}
            </span>
          ))}
        </div>

        {/* Row 2: Up to 2 pills + more pill on the exact same line */}
        {(row2Perms.length > 0 || remainingCount > 0) && (
          <div className="flex items-center gap-1.5 flex-nowrap">
            {row2Perms.map((p, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 capitalize truncate max-w-[125px]"
                title={`${getPageLabel(p)} (${p.actions?.join(", ")})`}
              >
                {getPageLabel(p)}
              </span>
            ))}
            {remainingCount > 0 && (
              <span
                className="inline-flex items-center shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 group-hover/pills:bg-primary group-hover/pills:text-white transition-colors"
                title={`More accessible pages: ${remainingTooltip}`}
              >
                +{remainingCount} more
              </span>
            )}
          </div>
        )}
      </Link>
    );
  }

  // Default role presets if no custom permissions configured yet
  if (isInstructor) {
    return (
      <Link
        href={`/admin/users/${user._id}`}
        className="flex items-center gap-1.5"
        title="Default Instructor pages. Click to customize or grant all pages."
      >
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
          Courses
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
          Enrollments
        </span>
      </Link>
    );
  }

  if (isAdmin) {
    return (
      <Link
        href={`/admin/users/${user._id}`}
        className="flex items-center gap-1.5"
        title="Default Admin role (Access to all admin pages). Click to configure."
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          All Admin Pages
        </span>
      </Link>
    );
  }

  return <span className="text-slate-300 text-xs font-mono">—</span>;
}

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
          <TableHead className="w-56">User Profile</TableHead>
          <TableHead>Contact Information</TableHead>
          <TableHead className="w-32">Role</TableHead>
          <TableHead className="w-80 min-w-[290px]">Accessible Pages</TableHead>
          <TableHead className="w-24 text-center">Status</TableHead>
          <TableHead className="w-28">Joined Date</TableHead>
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
              </TableCell>

              {/* Accessible Pages (for Admin & Instructor) */}
              <TableCell>
                {renderAccessiblePages(user)}
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

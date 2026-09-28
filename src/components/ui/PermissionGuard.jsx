// src/components/ui/PermissionGuard.jsx
"use client";

import { useGetMyPermissionsQuery } from "@/redux/api/roleApi";
import { useSelector } from "react-redux";

/**
 * Reusable RBAC Permission Guard Component
 * Conditionally renders children only if active user holds the requested permission
 *
 * @param {string} module - The module name ('blogs', 'courses', 'roles', etc.)
 * @param {string} action - The action ('view', 'create', 'edit', 'delete')
 * @param {React.ReactNode} children - Elements to display when access is granted
 * @param {React.ReactNode} fallback - Elements to display when access is denied
 */
export default function PermissionGuard({
  module,
  action = "view",
  children,
  fallback = null,
}) {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const { data: permData, isLoading } = useGetMyPermissionsQuery(undefined, {
    skip: !isLoggedIn,
  });

  if (!isLoggedIn) return fallback;
  if (isLoading) return null;

  // 1. Super Admin master override
  if (
    user?.role === "super_admin" ||
    user?.role === "admin" ||
    permData?.data?.isSuperAdmin
  ) {
    return <>{children}</>;
  }

  // 2. Evaluate module and action
  const permissions = permData?.data?.permissions || [];
  const modulePerm = permissions.find((p) => p.module === module);

  const hasAccess = modulePerm?.actions?.includes(action);

  if (hasAccess) {
    return <>{children}</>;
  }

  return fallback;
}

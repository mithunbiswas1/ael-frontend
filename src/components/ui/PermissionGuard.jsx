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
  page,
  action = "view",
  children,
  fallback = null,
}) {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const { data: permData, isLoading } = useGetMyPermissionsQuery(user?._id, {
    skip: !isLoggedIn || !user?._id,
    refetchOnMountOrArgChange: true,
  });

  if (!isLoggedIn) return fallback;
  if (isLoading) return null;

  // 1. Super Admin & Admin master override
  if (
    user?.role === "super_admin" ||
    user?.role === "admin" ||
    (Boolean(permData?.data?.isSuperAdmin) && permData?.data?.role === "super_admin")
  ) {
    return <>{children}</>;
  }

  // 2. Evaluate module, page and action
  const permissions = permData?.data?.permissions || [];
  const modulePerm = permissions.find((p) => {
    if (page && p.page === page) return true;
    if (module && p.module === module) return true;
    if (module && p.page === module) return true;
    return false;
  });

  const hasAccess = modulePerm?.actions?.includes(action);

  if (hasAccess) {
    return <>{children}</>;
  }

  return fallback;
}

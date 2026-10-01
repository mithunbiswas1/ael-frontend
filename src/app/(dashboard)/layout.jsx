// src/app/(dashboard)/layout.jsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useGetMyPermissionsQuery } from "@/redux/api/roleApi";

import Sidebar from "./_components/Sidebar";

import { FaBars, FaShieldAlt, FaArrowLeft, FaHome } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { H2, P } from "@/components/ui/Typography";

// Comprehensive route to module permission mapping
const ROUTE_PERMISSION_MAP = [
  { prefix: "/admin/blogs", module: "blogs" },
  { prefix: "/admin/courses", module: "courses" },
  { prefix: "/admin/certificates", module: "certificates" },
  { prefix: "/admin/users", module: "users" },
  { prefix: "/admin/messages", module: "messages" },
  { prefix: "/admin/comments", module: "comments" },
  { prefix: "/admin/advertisements", module: "advertisements" },
  { prefix: "/admin/archive", module: "archive" },
  { prefix: "/admin/sms", module: "sms" },
  { prefix: "/admin/email", module: "email" },
  { prefix: "/admin/subscriptions", module: "subscriptions" },
  { prefix: "/admin/database", module: "database" },
  { prefix: "/admin/pages/home", module: "pages_home" },
  { prefix: "/admin/pages/about", module: "pages_about" },
  { prefix: "/admin/pages/blogs", module: "pages_blogs" },
  { prefix: "/admin/pages/contact", module: "pages_contact" },
  { prefix: "/admin/pages/safety-guidelines", module: "pages_safety" },
  { prefix: "/admin/pages/market-updates", module: "pages_market" },
  { prefix: "/admin/pages/courses", module: "pages_courses" },
  { prefix: "/admin/pages/acts-and-rules", module: "pages_acts" },
  { prefix: "/admin/pages/terms", module: "pages_terms" },
  { prefix: "/admin/pages/privacy", module: "pages_privacy" },
  { prefix: "/admin/pages/faq", module: "pages_faq" },
];

function DashboardContent({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const { data: permData, isLoading: isPermLoading } = useGetMyPermissionsQuery(
    undefined,
    { skip: !isLoggedIn }
  );

  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
      return;
    }

    setIsLoading(false);
  }, [isLoggedIn, router]);

  const isSuperAdmin =
    user?.role === "super_admin" || permData?.data?.isSuperAdmin;

  const permissions = permData?.data?.permissions || [];

  // Determine if current pathname requires access check
  let isAccessDenied = false;

  if (isLoggedIn && !isSuperAdmin && pathname.startsWith("/admin")) {
    // Plain subscribers or general users cannot access any administrative routes
    if (user?.role === "subscriber" || user?.role === "general_user") {
      isAccessDenied = true;
    } else if (pathname === "/admin") {
      // Main dashboard: allowed if user has analytics or at least one admin view action
      const hasAny = permissions.some((p) => p.actions?.includes("view"));
      if (!hasAny) isAccessDenied = true;
    } else {
      // Find matching rule for subroute (longest prefix match)
      const sortedRules = [...ROUTE_PERMISSION_MAP].sort(
        (a, b) => b.prefix.length - a.prefix.length
      );
      const matched = sortedRules.find((r) => pathname.startsWith(r.prefix));

      if (matched) {
        const hasAccess = permissions.some((p) => {
          // Check page match
          if (p.page && (p.page === matched.prefix || pathname.startsWith(p.page))) {
            return p.actions?.includes("view");
          }
          // Check module match
          if (p.module && p.module === matched.module) {
            return p.actions?.includes("view");
          }
          return false;
        });

        if (!hasAccess) {
          isAccessDenied = true;
        }
      }
    }
  }

  if (isLoading || (isLoggedIn && isPermLoading)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <P className="mt-4 text-xs font-semibold text-slate-500">
            Verifying workspace permissions...
          </P>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <Sidebar
        isMobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            className="rounded-lg p-2 hover:bg-slate-100 cursor-pointer"
            aria-label="Open dashboard menu"
          >
            <FaBars className="h-5 w-5 text-slate-600" />
          </button>

          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-2xl font-black text-primary">AEL</span>
          </Link>

          {/* Spacer for alignment */}
          <div className="w-10" />
        </header>

        {/* Page Content with Centralized Route Guard */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {isAccessDenied ? (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-slate-200 my-8 max-w-xl mx-auto">
              <div className="h-14 w-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-4">
                <FaShieldAlt className="h-7 w-7" />
              </div>
              <H2 className="text-lg font-bold text-slate-900">Access Restricted</H2>
              <P className="text-xs text-slate-500 mt-1.5 max-w-md">
                Your current account role (
                <strong className="text-slate-800 capitalize">
                  {user?.role?.replace("_", " ") || "User"}
                </strong>
                ) does not have permission to view or manage this administrative page.
              </P>
              <P className="text-[11px] text-slate-400 mt-1">
                Please contact a Super Administrator to grant you access in User Registry.
              </P>
              <div className="flex items-center gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => router.back()}
                  className="gap-1.5 text-xs font-bold"
                >
                  <FaArrowLeft className="h-3 w-3" />
                  <span>Go Back</span>
                </Button>
                <Link href="/admin">
                  <Button type="button" variant="primary" size="sm" className="gap-1.5 text-xs font-bold">
                    <FaHome className="h-3 w-3" />
                    <span>Return to Dashboard</span>
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return <DashboardContent>{children}</DashboardContent>;
}

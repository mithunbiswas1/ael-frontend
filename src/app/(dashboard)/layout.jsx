// src/app/(dashboard)/layout.jsx

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Sidebar from "./_components/Sidebar";

import { FaBars } from "react-icons/fa";
import { P } from "@/components/ui/Typography";

function DashboardContent({ children }) {
  const router = useRouter();

  const { isLoggedIn } = useSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      router.replace("/login");
      return;
    }

    setIsLoading(false);
  }, [isLoggedIn, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <P className="mt-4 text-xs font-semibold text-slate-500">Loading workspace...</P>
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
            className="rounded-lg p-2 hover:bg-slate-100"
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

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }) {
  return <DashboardContent>{children}</DashboardContent>;
}

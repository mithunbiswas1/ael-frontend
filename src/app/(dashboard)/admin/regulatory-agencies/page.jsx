// src/app/(dashboard)/admin/regulatory-agencies/page.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegulatoryAgenciesRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/safety-guidelines");
  }, [router]);

  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-xs text-slate-500 font-medium">
          Redirecting to unified Safety Guidelines & Authorities...
        </p>
      </div>
    </div>
  );
}

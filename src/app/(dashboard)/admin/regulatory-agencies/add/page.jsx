// src/app/(dashboard)/admin/regulatory-agencies/add/page.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddRegulatoryAgencyRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/safety-guidelines/add?type=agency");
  }, [router]);

  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

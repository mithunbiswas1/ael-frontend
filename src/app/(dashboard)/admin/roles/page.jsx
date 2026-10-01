// src/app/(dashboard)/admin/roles/page.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RolesManagementPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/users");
  }, [router]);

  return (
    <div className="flex items-center justify-center p-12 text-center">
      <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

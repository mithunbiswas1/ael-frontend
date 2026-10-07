// src/app/(dashboard)/admin/subscriptions/create/page.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateSubscriptionPlanPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/pages/subscription/add");
  }, [router]);

  return (
    <div className="flex h-48 items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

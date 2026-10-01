// src/app/(dashboard)/admin/regulatory-agencies/edit/[id]/page.jsx
"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditRegulatoryAgencyRedirect() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  useEffect(() => {
    if (id) {
      router.replace(`/admin/safety-guidelines/edit/${id}?type=agency`);
    } else {
      router.replace("/admin/safety-guidelines");
    }
  }, [router, id]);

  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  );
}

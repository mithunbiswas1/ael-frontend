// src/app/(dashboard)/admin/safety-guidelines/add/page.jsx
"use client";

import { Suspense } from "react";
import SafetyGuidelineForm from "../_components/SafetyGuidelineForm";
import PermissionGuard from "@/components/ui/PermissionGuard";

function AddFormFallback() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-xs text-slate-500 font-medium">Loading New Entry Form...</p>
      </div>
    </div>
  );
}

export default function AddSafetyGuidelinePage() {
  return (
    <PermissionGuard module="safety_guidelines" action="create">
      <Suspense fallback={<AddFormFallback />}>
        <SafetyGuidelineForm isEdit={false} />
      </Suspense>
    </PermissionGuard>
  );
}

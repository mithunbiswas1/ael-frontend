// src/app/(dashboard)/admin/safety-guidelines/edit/[id]/page.jsx
"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import SafetyGuidelineForm from "../../_components/SafetyGuidelineForm";
import PermissionGuard from "@/components/ui/PermissionGuard";

function EditFormFallback() {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-xs text-slate-500 font-medium">Loading Safety Guideline Editor...</p>
      </div>
    </div>
  );
}

export default function EditSafetyGuidelinePage() {
  const params = useParams();
  const id = params?.id;

  return (
    <PermissionGuard module="safety_guidelines" action="edit">
      <Suspense fallback={<EditFormFallback />}>
        <SafetyGuidelineForm docId={id} isEdit={true} />
      </Suspense>
    </PermissionGuard>
  );
}

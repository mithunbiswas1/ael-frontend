// src/app/(dashboard)/admin/safety-guidelines/add/page.jsx
"use client";

import SafetyGuidelineForm from "../_components/SafetyGuidelineForm";
import PermissionGuard from "@/components/ui/PermissionGuard";

export default function AddSafetyGuidelinePage() {
  return (
    <PermissionGuard module="safety_guidelines" action="create">
      <SafetyGuidelineForm isEdit={false} />
    </PermissionGuard>
  );
}

// src/app/(dashboard)/admin/safety-guidelines/edit/[id]/page.jsx
"use client";

import { useParams } from "next/navigation";
import SafetyGuidelineForm from "../../_components/SafetyGuidelineForm";
import PermissionGuard from "@/components/ui/PermissionGuard";

export default function EditSafetyGuidelinePage() {
  const params = useParams();
  const id = params?.id;

  return (
    <PermissionGuard module="safety_guidelines" action="edit">
      <SafetyGuidelineForm docId={id} isEdit={true} />
    </PermissionGuard>
  );
}

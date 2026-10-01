// src/app/(dashboard)/admin/courses/add/page.jsx
"use client";

import PermissionGuard from "@/components/ui/PermissionGuard";
import CourseBuilderForm from "../_components/CourseBuilderForm";

export default function AddCoursePage() {
  return (
    <PermissionGuard module="courses" action="create">
      <div className="max-w-7xl mx-auto py-2">
        <CourseBuilderForm isEdit={false} />
      </div>
    </PermissionGuard>
  );
}

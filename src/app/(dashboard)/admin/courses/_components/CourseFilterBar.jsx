// src/app/(dashboard)/admin/courses/_components/CourseFilterBar.jsx
"use client";

import { useRouter } from "next/navigation";
import { FaGraduationCap } from "react-icons/fa";
import { AdminPageHeader } from "@/components/ui/AdminPageHeader";
import { SearchInput } from "@/components/ui/SearchInput";

export default function CourseFilterBar({
  searchTerm,
  onSearchChange,
  onOpenCreateModal,
}) {
  const router = useRouter();

  const handleCreate = () => {
    if (onOpenCreateModal) {
      onOpenCreateModal();
    } else {
      router.push("/admin/courses/add");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header & Action */}
      <AdminPageHeader
        icon={FaGraduationCap}
        title="LMS Course Management"
        description="Create, edit, and organize training curricula, lessons, and certification criteria."
        actionLabel="Create New Course"
        onActionClick={handleCreate}
      />

      {/* Search Bar */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-slate-200/80">
        <div className="w-full sm:w-80">
          <SearchInput
            placeholder="Search by title, level, or category..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange("")}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
}

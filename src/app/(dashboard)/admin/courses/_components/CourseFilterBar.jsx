// src/app/(dashboard)/admin/courses/_components/CourseFilterBar.jsx
"use client";

import { useRouter } from "next/navigation";
import { FaGraduationCap } from "react-icons/fa";
import { AdminPageHeader } from "@/components/ui/AdminPageHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";

export default function CourseFilterBar({
  searchTerm,
  onSearchChange,
  priceFilter = "all",
  onPriceFilterChange,
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
      {/* Header & Actions */}
      <AdminPageHeader
        icon={FaGraduationCap}
        title="LMS Course Management"
        description="Create, edit, and organize training curricula, lessons, and certification criteria."
        secondaryActionLabel="Enrollments & Sales"
        secondaryActionHref="/admin/courses/enrollments"
        secondaryActionIcon={FaGraduationCap}
        actionLabel="Create New Course"
        onActionClick={handleCreate}
      />

      {/* Search Bar & Price Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/80">
        <div className="w-full sm:w-80">
          <SearchInput
            placeholder="Search by title, level, or category..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onClear={() => onSearchChange("")}
            size="sm"
          />
        </div>

        {onPriceFilterChange && (
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/80 self-start sm:self-auto">
            {[
              { id: "all", label: "All Courses" },
              { id: "free", label: "Free" },
              { id: "paid", label: "Paid" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => onPriceFilterChange(tab.id)}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  priceFilter === tab.id
                    ? "bg-white text-slate-900 font-bold shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// src/app/(dashboard)/admin/courses/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useGetAdminCoursesQuery,
  useDeleteCourseMutation,
} from "@/redux/api/courseApi";
import PermissionGuard from "@/components/ui/PermissionGuard";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import Pagination from "@/components/ui/Pagination";
import CourseFilterBar from "./_components/CourseFilterBar";
import CourseTable from "./_components/CourseTable";

export default function AdminCoursesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: coursesData, isLoading, refetch } = useGetAdminCoursesQuery({
    search: searchTerm,
    priceType: priceFilter === "all" ? undefined : priceFilter,
  });

  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();

  const allCourses = Array.isArray(coursesData?.data)
    ? coursesData.data
    : coursesData?.data?.courses || [];
  const totalCourses = allCourses.length;
  const totalPages = Math.ceil(totalCourses / 10) || 1;
  const paginatedCourses = allCourses.slice((page - 1) * 10, page * 10);

  const handleOpenCreate = () => {
    router.push("/admin/courses/add");
  };

  const handleEdit = (course) => {
    router.push(`/admin/courses/edit/${course._id || course.courseId}`);
  };

  const handleDeleteClick = (id) => {
    const course = allCourses.find((c) => (c._id || c.courseId) === id);
    setDeleteTarget(course || { _id: id, titleEn: "Selected Course" });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const targetId = deleteTarget._id || deleteTarget.courseId;
    try {
      await deleteCourse(targetId).unwrap();
      toast.success("Course deleted successfully");
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete course");
    }
  };

  return (
    <PermissionGuard module="courses" action="view">
      <div className="space-y-6">
        <CourseFilterBar
          searchTerm={searchTerm}
          onSearchChange={(val) => {
            setSearchTerm(val);
            setPage(1);
          }}
          priceFilter={priceFilter}
          onPriceFilterChange={(val) => {
            setPriceFilter(val);
            setPage(1);
          }}
          onOpenCreateModal={handleOpenCreate}
        />

        <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
          <CourseTable
            courses={paginatedCourses}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalCourses}
            pageSize={10}
            onPageChange={setPage}
          />
        </div>

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={Boolean(deleteTarget)}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
          isLoading={isDeleting}
          title="Delete Course"
          description="Are you sure you want to delete this course? All associated lessons, modules, and enrollments will be permanently affected."
          itemTitle={deleteTarget?.titleEn || deleteTarget?.titleBn || deleteTarget?.title || ""}
          confirmText="Delete Course"
        />
      </div>
    </PermissionGuard>
  );
}

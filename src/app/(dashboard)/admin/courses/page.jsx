// src/app/(dashboard)/admin/courses/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  useGetCoursesQuery,
  useDeleteCourseMutation,
} from "@/redux/api/courseApi";
import PermissionGuard from "@/components/ui/PermissionGuard";
import DeleteConfirmationModal from "@/components/ui/DeleteConfirmationModal";
import CourseFilterBar from "./_components/CourseFilterBar";
import CourseTable from "./_components/CourseTable";

export default function AdminCoursesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: coursesData, isLoading, refetch } = useGetCoursesQuery({
    search: searchTerm,
  });

  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();

  const courses = coursesData?.data || [];

  const handleOpenCreate = () => {
    router.push("/admin/courses/add");
  };

  const handleEdit = (course) => {
    router.push(`/admin/courses/edit/${course._id || course.courseId}`);
  };

  const handleDeleteClick = (id) => {
    const course = courses.find((c) => (c._id || c.courseId) === id);
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
          onSearchChange={setSearchTerm}
          onOpenCreateModal={handleOpenCreate}
        />

        <CourseTable
          courses={courses}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />

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

// src/app/(dashboard)/admin/courses/page.jsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  useGetCoursesQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} from "@/redux/api/courseApi";
import PermissionGuard from "@/components/ui/PermissionGuard";
import CourseFilterBar from "./_components/CourseFilterBar";
import CourseTable from "./_components/CourseTable";
import CourseFormModal from "./_components/CourseFormModal";

const INITIAL_FORM = {
  courseId: "",
  title: "",
  titleBn: "",
  slug: "",
  description: "",
  descriptionBn: "",
  category: "Consumer Safety",
  categoryBn: "ভোক্তা নিরাপত্তা",
  badge: "FREE",
  badgeColor: "bg-amber-500",
  audience: "Consumers & Homemakers",
  audienceBn: "ভোক্তা ও গৃহিণী",
  level: "Beginner",
  levelBn: "প্রাথমিক",
  duration: "1h 30m",
  durationBn: "১ ঘণ্টা ৩০ মিনিট",
  price: 0,
  imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop",
  videoUrl: "/sample-course-video.mp4",
  isPublished: true,
};

export default function AdminCoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: coursesData, isLoading, refetch } = useGetCoursesQuery({
    search: searchTerm,
  });

  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [formData, setFormData] = useState(INITIAL_FORM);

  const courses = coursesData?.data || [];

  const handleOpenCreateModal = () => {
    setEditingCourseId(null);
    setFormData(INITIAL_FORM);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (course) => {
    setEditingCourseId(course._id);
    setFormData({
      courseId: course.courseId || "",
      title: course.title || "",
      titleBn: course.titleBn || "",
      slug: course.slug || "",
      description: course.description || "",
      descriptionBn: course.descriptionBn || "",
      category: course.category || "Consumer Safety",
      categoryBn: course.categoryBn || "ভোক্তা নিরাপত্তা",
      badge: course.badge || "FREE",
      badgeColor: course.badgeColor || "bg-amber-500",
      audience: course.audience || "Consumers & Homemakers",
      audienceBn: course.audienceBn || "ভোক্তা ও গৃহিণী",
      level: course.level || "Beginner",
      levelBn: course.levelBn || "প্রাথমিক",
      duration: course.duration || "1h 30m",
      durationBn: course.durationBn || "১ ঘণ্টা ৩০ মিনিট",
      price: course.price || 0,
      imageUrl: course.imageUrl || "",
      videoUrl: course.videoUrl || "/sample-course-video.mp4",
      isPublished: course.isPublished !== undefined ? course.isPublished : true,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.titleBn) {
      toast.error("Please provide both English and Bengali course titles");
      return;
    }

    try {
      if (editingCourseId) {
        await updateCourse({ id: editingCourseId, data: formData }).unwrap();
        toast.success("Course updated successfully!");
      } else {
        await createCourse(formData).unwrap();
        toast.success("New course created successfully!");
      }
      setIsModalOpen(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save course");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await deleteCourse(id).unwrap();
      toast.success("Course deleted successfully");
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
          onOpenCreateModal={handleOpenCreateModal}
        />

        <CourseTable
          courses={courses}
          isLoading={isLoading}
          onEdit={handleOpenEditModal}
          onDelete={handleDelete}
        />

        <CourseFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          isSaving={isCreating || isUpdating}
          isEditing={!!editingCourseId}
        />
      </div>
    </PermissionGuard>
  );
}

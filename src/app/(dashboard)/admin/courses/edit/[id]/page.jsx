// src/app/(dashboard)/admin/courses/edit/[id]/page.jsx
"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import PermissionGuard from "@/components/ui/PermissionGuard";
import { useGetCourseByIdQuery } from "@/redux/api/courseApi";
import CourseBuilderForm from "../../_components/CourseBuilderForm";

export default function EditCoursePage({ params }) {
  const routeParams = useParams();
  const id = routeParams?.id || params?.id;

  const { data: courseData, isLoading, error } = useGetCourseByIdQuery(id, {
    skip: !id,
  });
  const course = courseData?.data;

  return (
    <PermissionGuard module="courses" action="edit">
      <div className="max-w-7xl mx-auto py-2">
        {isLoading ? (
          <div className="p-16 text-center bg-white rounded-2xl border border-slate-200">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="mt-3 text-xs text-slate-500 font-semibold">Loading course data for editing...</p>
          </div>
        ) : error || !course ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-rose-200">
            <AlertCircle className="mx-auto h-10 w-10 text-rose-500 mb-3" />
            <h2 className="text-sm font-bold text-slate-800">Course Not Found</h2>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Unable to load course details for editing.
            </p>
            <Link
              href="/admin/courses"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Course Catalog</span>
            </Link>
          </div>
        ) : (
          <CourseBuilderForm
            key={course._id || course.courseId}
            initialData={course}
            isEdit={true}
          />
        )}
      </div>
    </PermissionGuard>
  );
}

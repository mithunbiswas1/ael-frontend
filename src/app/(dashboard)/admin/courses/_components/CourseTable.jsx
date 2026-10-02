// src/app/(dashboard)/admin/courses/_components/CourseTable.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { FaEdit, FaTrash, FaPlayCircle, FaEye } from "react-icons/fa";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { H4, P } from "@/components/ui/Typography";

export default function CourseTable({
  courses = [],
  isLoading,
  onEdit,
  onDelete,
}) {
  if (isLoading) {
    return (
      <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <P className="mt-3 text-xs">Loading course catalog...</P>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center bg-white">
        <H4 className="text-sm font-bold text-slate-700">
          No courses found
        </H4>
        <P className="mt-1 text-xs text-slate-500">
          Click &quot;Create New Course&quot; to add your first training module.
        </P>
      </div>
    );
  }

  return (
    <Table containerClassName="border-slate-200/90">
      <TableHeader>
        <TableRow>
          <TableHead className="w-16">Banner</TableHead>
          <TableHead>Course Title & Level (EN / BN)</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Pricing</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {courses.map((course) => (
          <TableRow key={course._id}>
            <TableCell>
              <div className="relative h-11 w-16 overflow-hidden rounded-lg bg-slate-100 shrink-0">
                <Image
                  src={course.imageUrl || "/default_image.jpg"}
                  alt={course.title || "Course banner"}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/default_image.jpg";
                  }}
                />
              </div>
            </TableCell>

            <TableCell className="max-w-md">
              <div className="space-y-0.5">
                <div className="font-bold text-slate-900 text-xs line-clamp-1">
                  {course.title}
                </div>
                <div className="text-[11px] text-slate-500 line-clamp-1 font-serif">
                  {course.titleBn}
                </div>
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="font-mono text-[10px] text-slate-400">
                    ID: {course.courseId}
                  </span>
                  <span className="text-[10px] text-slate-400">•</span>
                  <span className="text-[10px] font-semibold text-slate-600">
                    {course.level || "Beginner"}
                  </span>
                </div>
              </div>
            </TableCell>

            <TableCell>
              <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                {course.category}
              </span>
            </TableCell>

            <TableCell>
              {course.price > 0 ? (
                <span className="font-bold text-xs text-secondary">
                  ৳ {course.price}
                </span>
              ) : (
                <span className="rounded bg-secondary/10 text-secondary border border-secondary/20 px-2 py-0.5 text-[10px] font-bold">
                  FREE
                </span>
              )}
            </TableCell>

            <TableCell>
              <span className="text-xs text-slate-600">
                {course.duration || "1h 30m"}
              </span>
            </TableCell>

            <TableCell>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                  course.isPublished !== false
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                {course.isPublished !== false ? "Live" : "Draft"}
              </span>
            </TableCell>

            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1.5">
                <Link
                  href={`/courses/learn/${course.slug || "lpg-cylinder-safety-handling-emergency-response"}`}
                  className="inline-flex items-center justify-center p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors border border-emerald-200"
                  title="View Course Lessons & Classroom"
                  target="_blank"
                >
                  <FaPlayCircle className="h-3 w-3" />
                </Link>

                <Link
                  href={`/courses/${course.slug || "lpg-cylinder-safety-handling-emergency-response"}`}
                  className="inline-flex items-center justify-center p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                  title="View Public Course Details & Outline"
                  target="_blank"
                >
                  <FaEye className="h-3 w-3" />
                </Link>

                <Link
                  href={`/admin/courses/edit/${course._id || course.courseId}`}
                  className="inline-flex items-center justify-center p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-primary transition-colors border border-slate-200"
                  title="Edit Course & Modules"
                >
                  <FaEdit className="h-3 w-3" />
                </Link>

                <Button
                  type="button"
                  onClick={() => onDelete(course._id)}
                  variant="danger"
                  size="xs"
                  className="p-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border-red-200"
                  title="Delete Course"
                >
                  <FaTrash className="h-3 w-3" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

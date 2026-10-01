// src/app/(dashboard)/subscriber/courses/page.jsx
"use client";

import { useState } from "react";
import { FaGraduationCap, FaBookOpen } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { AdminPageHeader } from "@/components/ui/AdminPageHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { H1, H3, P } from "@/components/ui/Typography";
import { useGetMyLearningCoursesQuery } from "@/redux/api/courseApi";
import SubscriberCourseCard from "./_components/SubscriberCourseCard";

export default function SubscriberCoursesPage() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: learningData, isLoading } = useGetMyLearningCoursesQuery();

  const rawCourses = Array.isArray(learningData?.data) ? learningData.data : [];

  const filteredCourses = rawCourses.filter((course) => {
    const progress = course.enrollment?.progressPercent || 0;
    const isCompleted = progress >= 100;
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "completed" && isCompleted) ||
      (filterStatus === "active" && !isCompleted);

    const matchesSearch =
      (course.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.category || "").toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <AdminPageHeader
        icon={FaGraduationCap}
        title="My Enrolled Courses & Classroom"
        description="Watch your subscribed LPG safety video modules, review handouts, and obtain verified certificates."
        action={
          <LinkButton
            href="/courses"
            variant="primary"
            size="default"
            className="gap-2"
          >
            <FaBookOpen className="h-3.5 w-3.5" />
            <span>Browse Course Catalog</span>
          </LinkButton>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/80">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <Button
            type="button"
            onClick={() => setFilterStatus("all")}
            variant={filterStatus === "all" ? "primary" : "secondary"}
            size="xs"
            className="whitespace-nowrap"
          >
            All Courses ({rawCourses.length})
          </Button>
          <Button
            type="button"
            onClick={() => setFilterStatus("active")}
            variant={filterStatus === "active" ? "primary" : "secondary"}
            size="xs"
            className="whitespace-nowrap"
          >
            In Progress (
            {rawCourses.filter((c) => (c.enrollment?.progressPercent || 0) < 100).length}
            )
          </Button>
          <Button
            type="button"
            onClick={() => setFilterStatus("completed")}
            variant={filterStatus === "completed" ? "primary" : "secondary"}
            size="xs"
            className="whitespace-nowrap"
          >
            Completed (
            {rawCourses.filter((c) => (c.enrollment?.progressPercent || 0) >= 100).length}
            )
          </Button>
        </div>

        <div className="w-full sm:w-64">
          <SearchInput
            placeholder="Search enrolled courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm("")}
            size="sm"
          />
        </div>
      </div>

      {/* Courses List */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <P className="mt-3 text-xs">Loading your courses...</P>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center bg-white">
          <FaGraduationCap className="mx-auto h-12 w-12 text-slate-300" />
          <H3 className="mt-3 text-base font-bold text-slate-800">
            No enrolled courses match your filter
          </H3>
          <P className="mt-1 text-xs text-slate-500">
            Try adjusting your search query or explore new courses in the catalog.
          </P>
          <LinkButton
            href="/courses"
            variant="primary"
            size="sm"
            className="mt-4"
          >
            Explore All Courses
          </LinkButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <SubscriberCourseCard
              key={course.courseId || course.id}
              course={course}
            />
          ))}
        </div>
      )}
    </div>
  );
}

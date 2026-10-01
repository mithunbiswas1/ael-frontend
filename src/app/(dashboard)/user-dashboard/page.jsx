// src/app/(dashboard)/user-dashboard/page.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  FaGraduationCap,
  FaAward,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import { P } from "@/components/ui/Typography";
import { useGetMyLearningCoursesQuery } from "@/redux/api/courseApi";

export default function UserDashboardPage() {
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (["super_admin", "admin"].includes(user?.role)) {
      router.replace("/admin");
    }
  }, [user, router]);

  const { data: learningData, isLoading } = useGetMyLearningCoursesQuery();

  const courses = Array.isArray(learningData?.data) ? learningData.data : [];

  const completedCount = courses.filter(
    (c) => (c.enrollment?.progressPercent || 0) >= 100
  ).length;

  return (
    <div className="space-y-6">
      {/* Metric Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Enrolled Courses
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <FaGraduationCap className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">
            {isLoading ? "..." : courses.length}
          </div>
          <P className="mt-1 text-xs text-slate-400">Active learning subscriptions</P>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Completed Courses
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <FaCheckCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">
            {isLoading ? "..." : completedCount}
          </div>
          <P className="mt-1 text-xs text-slate-400">100% syllabus finished</P>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Certificates Earned
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <FaAward className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">
            {completedCount > 0 ? completedCount : 0}
          </div>
          <P className="mt-1 text-xs text-slate-400">Verified digital certificates</P>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Hours Learned
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <FaClock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">
            {courses.length > 0 ? `${(courses.length * 2.5).toFixed(1)} hrs` : "0 hrs"}
          </div>
          <P className="mt-1 text-xs text-slate-400">Video lectures watched</P>
        </div>
      </div>
    </div>
  );
}

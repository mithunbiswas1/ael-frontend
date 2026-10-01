// src/app/(dashboard)/subscriber/page.jsx
"use client";

import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import {
  FaGraduationCap,
  FaPlayCircle,
  FaAward,
  FaBookOpen,
  FaCheckCircle,
  FaClock,
  FaArrowRight,
  FaShieldAlt,
} from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { H1, H2, H3, P } from "@/components/ui/Typography";
import { useGetMyLearningCoursesQuery } from "@/redux/api/courseApi";

export default function SubscriberDashboardPage() {
  const { user } = useSelector((state) => state.auth);

  const { data: learningData, isLoading } = useGetMyLearningCoursesQuery();

  const courses = Array.isArray(learningData?.data) ? learningData.data : [];

  const activeCourse = courses[0] || null;
  const completedCount = courses.filter(
    (c) => (c.enrollment?.progressPercent || 0) >= 100
  ).length;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-tertiary via-primary to-tertiary p-6 sm:p-8 text-white">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
              <FaShieldAlt className="h-3.5 w-3.5 text-secondary" />
              <span>Subscriber & Certified Learner Portal</span>
            </div>
            <H1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {user?.fullName || "Learner"}!
            </H1>
            <P className="text-sm text-slate-300 leading-relaxed">
              Continue your industrial LPG safety certifications, access on-demand HD video lectures, and take official regulatory compliance assessments.
            </P>
          </div>

          <div className="flex flex-wrap gap-3">
            <LinkButton
              href="/subscriber/courses"
              variant="solid"
              size="default"
              className="gap-2 bg-secondary hover:bg-secondary/90 text-white border-transparent font-bold"
            >
              <FaGraduationCap className="h-4 w-4" />
              <span>My Enrolled Courses</span>
            </LinkButton>
            <LinkButton
              href="/courses"
              variant="outline"
              size="default"
              className="gap-2 border-white/20 bg-white/10 text-white hover:bg-white/20 backdrop-blur-md font-bold"
            >
              <FaBookOpen className="h-4 w-4" />
              <span>Browse Catalog</span>
            </LinkButton>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 h-64 w-64 rounded-full bg-primary/20 blur-3xl pointer-events-none" />
      </div>

      {/* Metric Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200/80 bg-white p-5">
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

        <div className="rounded-xl border border-slate-200/80 bg-white p-5">
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

        <div className="rounded-xl border border-slate-200/80 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Certificates Earned
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
              <FaAward className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">1</div>
          <P className="mt-1 text-xs text-slate-400">Verified by DoE & LOAB</P>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Hours Learned
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <FaClock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-bold text-slate-900">4.5 hrs</div>
          <P className="mt-1 text-xs text-slate-400">Video lectures watched</P>
        </div>
      </div>

      {/* Continue Learning Spotlight */}
      {activeCourse && (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-xl bg-slate-100 hidden sm:block">
                <Image
                  src={
                    activeCourse.imageUrl ||
                    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop"
                  }
                  alt={activeCourse.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="space-y-1">
                <span className="inline-block rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                  IN PROGRESS • NEXT UP
                </span>
                <H3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {activeCourse.title}
                </H3>
                <P className="text-xs text-slate-500 line-clamp-1">
                  {activeCourse.description}
                </P>
                <div className="mt-2 flex items-center gap-3">
                  <div className="h-2 w-48 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-secondary transition-all duration-500"
                      style={{
                        width: `${activeCourse.enrollment?.progressPercent || 0}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-700">
                    {activeCourse.enrollment?.progressPercent || 0}% Done
                  </span>
                </div>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <LinkButton
                href={`/courses/learn/${activeCourse.slug || "lpg-cylinder-safety-handling-emergency-response"}`}
                variant="primary"
                size="default"
                className="gap-2"
              >
                <FaPlayCircle className="h-4 w-4" />
                <span>Resume Classroom Player</span>
              </LinkButton>
            </div>
          </div>
        </div>
      )}

      {/* Enrolled Courses Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <H2 className="text-lg font-bold text-slate-900">
            My Enrolled Courses
          </H2>
          <Link
            href="/courses"
            className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
          >
            <span>Browse All Courses</span>
            <FaArrowRight className="h-3 w-3" />
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center bg-white">
            <FaGraduationCap className="h-10 w-10 text-slate-300 mx-auto mb-2" />
            <H3 className="text-sm font-bold text-slate-700">No Enrolled Courses</H3>
            <P className="text-xs text-slate-500 mt-1 mb-4">
              Explore certified safety courses to begin your professional training.
            </P>
            <LinkButton href="/courses" variant="primary" size="sm">
              Explore Course Catalog
            </LinkButton>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course) => {
              const progress = course.enrollment?.progressPercent || 0;
              const courseSlug = course.slug || "lpg-cylinder-safety-handling-emergency-response";
              return (
                <div
                  key={courseSlug}
                  className="group flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200/80 bg-white"
                >
                  <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={course.imageUrl}
                      alt={course.title}
                      fill
                      className="object-cover transition-transform duration-300"
                    />
                    <span className="absolute left-2.5 top-2.5 rounded bg-slate-950/80 px-2 py-0.5 text-[9px] font-bold text-white">
                      {course.category || "Safety Training"}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <H3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                        {course.title}
                      </H3>
                      <P className="mt-1 text-xs text-slate-500 line-clamp-2">
                        {course.description}
                      </P>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-medium text-slate-500">
                          <span>Course Progress</span>
                          <span className="font-bold text-slate-800">
                            {progress}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-emerald-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <LinkButton
                          href={`/courses/learn/${courseSlug}`}
                          variant="secondary"
                          size="xs"
                          fullWidth
                          className="gap-1.5 bg-slate-900 text-white hover:bg-slate-800 border-slate-900"
                        >
                          <FaPlayCircle className="h-3.5 w-3.5 text-amber-400" />
                          <span>Watch Lessons</span>
                        </LinkButton>
                        <LinkButton
                          href={`/courses/${courseSlug}/quiz`}
                          variant="outline"
                          size="xs"
                          className="px-3"
                          title="Take Assessment Quiz"
                        >
                          Quiz
                        </LinkButton>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

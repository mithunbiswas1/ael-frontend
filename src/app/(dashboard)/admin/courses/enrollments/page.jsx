// src/app/(dashboard)/admin/courses/enrollments/page.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaReceipt,
  FaArrowLeft,
  FaUsers,
  FaMoneyBillWave,
  FaCheckCircle,
  FaExternalLinkAlt,
  FaUserGraduate,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";
import { useGetCourseEnrollmentsQuery } from "@/redux/api/courseApi";
import PermissionGuard from "@/components/ui/PermissionGuard";
import { LinkButton } from "@/components/ui/LinkButton";
import { SearchInput } from "@/components/ui/SearchInput";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/Table";
import { H3, P } from "@/components/ui/Typography";
import Pagination from "@/components/ui/Pagination";

export default function CourseEnrollmentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [page, setPage] = useState(1);

  const { data: responseData, isLoading, refetch } =
    useGetCourseEnrollmentsQuery();

  const rawEnrollments = responseData?.data?.enrollments || [];

  // Calculate unique learners (distinct students who enrolled)
  const uniqueLearnerIds = new Set();
  rawEnrollments.forEach((e) => {
    if (e.userId) {
      uniqueLearnerIds.add(e.userId.toString());
    } else if (e.studentEmail && e.studentEmail.trim()) {
      uniqueLearnerIds.add(e.studentEmail.trim().toLowerCase());
    } else if (
      e.studentPhone &&
      e.studentPhone.trim() &&
      e.studentPhone !== "01XXXXXXXXX"
    ) {
      uniqueLearnerIds.add(e.studentPhone.trim());
    } else {
      uniqueLearnerIds.add(e.studentName || e.id);
    }
  });

  const totalUniqueStudents =
    responseData?.data?.stats?.totalStudents ?? uniqueLearnerIds.size;
  const totalPurchases =
    responseData?.data?.stats?.totalEnrollments ?? rawEnrollments.length;

  const stats = {
    totalStudents: totalUniqueStudents,
    totalEnrollments: totalPurchases,
    totalRevenue: responseData?.data?.stats?.totalRevenue || 0,
    totalPaid: responseData?.data?.stats?.totalPaid || 0,
    totalFree: responseData?.data?.stats?.totalFree || 0,
  };

  const filteredEnrollments = rawEnrollments.filter((item) => {
    // Type Filter
    if (typeFilter === "paid" && item.amount <= 0) return false;
    if (typeFilter === "free" && item.amount > 0) return false;

    // Search Filter
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      item.studentName?.toLowerCase().includes(q) ||
      item.studentPhone?.toLowerCase().includes(q) ||
      item.studentEmail?.toLowerCase().includes(q) ||
      item.courseTitle?.toLowerCase().includes(q) ||
      item.courseTitleBn?.toLowerCase().includes(q) ||
      item.transactionId?.toLowerCase().includes(q)
    );
  });

  const paginatedEnrollments = filteredEnrollments.slice((page - 1) * 10, page * 10);

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <PermissionGuard module="courses" action="view">
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <FaReceipt className="h-6 w-6 text-primary shrink-0" />
              <H3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Course Enrollments & Sales History
              </H3>
              <span className="ml-2 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                {stats.totalEnrollments} Purchases ({stats.totalStudents} Learners)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LinkButton
              href="/admin/courses"
              variant="outline"
              size="sm"
              className="text-xs font-bold gap-1.5"
            >
              <FaArrowLeft className="h-3 w-3" />
              <span>Back to Courses</span>
            </LinkButton>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                Total Enrolled Students
              </span>
              <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                <FaUsers className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">
                {stats.totalStudents.toLocaleString()}
              </span>
              <span className="text-xs font-medium text-slate-400">
                learners
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Total {stats.totalEnrollments} course purchases
            </p>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                Total Course Sales
              </span>
              <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                <FaMoneyBillWave className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">
                ৳ {stats.totalRevenue.toLocaleString()}
              </span>
              <span className="text-xs font-medium text-emerald-600">
                Gross BDT
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                Paid Enrollments
              </span>
              <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
                <FaCheckCircle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">
                {stats.totalPaid.toLocaleString()}
              </span>
              <span className="text-xs font-medium text-slate-400">
                purchases
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                Free Direct Enrollments
              </span>
              <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                <FaCheckCircle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">
                {stats.totalFree.toLocaleString()}
              </span>
              <span className="text-xs font-medium text-slate-400">
                enrollments
              </span>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/80">
          <div className="w-full sm:w-80">
            <SearchInput
              placeholder="Search by student, phone, or course..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              onClear={() => {
                setSearchTerm("");
                setPage(1);
              }}
              size="sm"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/80 self-start sm:self-auto">
            {[
              { id: "all", label: "All Enrollments" },
              { id: "paid", label: "Paid Only" },
              { id: "free", label: "Free Only" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setTypeFilter(tab.id);
                  setPage(1);
                }}
                className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  typeFilter === tab.id
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Enrollments Table */}
        {isLoading ? (
          <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <P className="mt-3 text-xs">Loading course enrollments...</P>
          </div>
        ) : filteredEnrollments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center bg-white">
            <FaUserGraduate className="mx-auto h-8 w-8 text-slate-300 mb-2" />
            <h4 className="text-sm font-bold text-slate-700">
              No course enrollments found
            </h4>
            <P className="mt-1 text-xs text-slate-500">
              When students purchase or enroll in your courses, their purchase
              history will appear here.
            </P>
          </div>
        ) : (
          <div className="space-y-4">
            <Table containerClassName="border-slate-200/90">
            <TableHeader>
              <TableRow>
                <TableHead>Student Info</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Purchased / Enrolled</TableHead>
                <TableHead>Price Paid</TableHead>
                <TableHead>Payment & Gateway</TableHead>
                <TableHead>Learning Progress</TableHead>
                <TableHead className="text-right">Transaction ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedEnrollments.map((item) => (
                <TableRow key={item.id || item.transactionId}>
                  {/* Student */}
                  <TableCell>
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900 text-xs">
                        {item.studentName}
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                        <FaPhoneAlt className="h-2.5 w-2.5 text-slate-400" />
                        <span>{item.studentPhone}</span>
                      </div>
                      {item.studentEmail && (
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <FaEnvelope className="h-2.5 w-2.5 text-slate-300" />
                          <span>{item.studentEmail}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Course */}
                  <TableCell className="max-w-xs">
                    <div className="space-y-0.5">
                      <div className="font-semibold text-slate-800 text-xs line-clamp-1">
                        {item.courseTitle}
                      </div>
                      {item.courseTitleBn && (
                        <div className="text-[11px] text-slate-500 line-clamp-1 font-serif">
                          {item.courseTitleBn}
                        </div>
                      )}
                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="font-mono text-[10px] text-slate-400">
                          ID: {item.courseId}
                        </span>
                        {item.courseSlug && (
                          <Link
                            href={`/courses/${item.courseSlug}`}
                            target="_blank"
                            className="inline-flex items-center gap-0.5 text-[10px] text-primary hover:underline font-semibold"
                          >
                            <span>View</span>
                            <FaExternalLinkAlt className="h-2 w-2" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Enrolled Date */}
                  <TableCell>
                    <span className="text-xs text-slate-700 font-medium">
                      {formatDate(item.enrolledAt)}
                    </span>
                  </TableCell>

                  {/* Price Paid */}
                  <TableCell>
                    {item.amount > 0 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md font-bold text-xs bg-emerald-50 text-emerald-800 border border-emerald-200">
                        ৳ {item.amount.toLocaleString()}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md font-bold text-[11px] bg-slate-100 text-slate-600 border border-slate-200">
                        FREE
                      </span>
                    )}
                  </TableCell>

                  {/* Payment Details */}
                  <TableCell>
                    <div className="space-y-0.5 text-xs">
                      <div className="font-semibold text-slate-800 uppercase text-[11px]">
                        {item.paymentMethod || "Card"}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {item.paymentGateway || "Direct"}
                      </div>
                    </div>
                  </TableCell>

                  {/* Progress */}
                  <TableCell>
                    <div className="w-28 space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-semibold text-slate-600">
                        <span>Progress</span>
                        <span>{item.progressPercent || 0}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            item.progressPercent >= 100
                              ? "bg-emerald-500"
                              : "bg-primary"
                          }`}
                          style={{ width: `${item.progressPercent || 0}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>

                  {/* Transaction ID */}
                  <TableCell className="text-right">
                    <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200">
                      {item.transactionId}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

            {/* Pagination Controls */}
            <Pagination
              currentPage={page}
              totalPages={Math.ceil(filteredEnrollments.length / 10) || 1}
              totalItems={filteredEnrollments.length}
              pageSize={10}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </PermissionGuard>
  );
}

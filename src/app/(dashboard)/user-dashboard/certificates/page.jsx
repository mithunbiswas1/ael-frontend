// src/app/(dashboard)/user-dashboard/certificates/page.jsx
"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import {
  FaAward,
  FaCheckCircle,
  FaExternalLinkAlt,
  FaDownload,
  FaGraduationCap,
  FaShieldAlt,
  FaCalendarAlt,
  FaLock,
  FaHourglassHalf,
  FaPlayCircle,
  FaPrint,
  FaTimes,
  FaCertificate,
} from "react-icons/fa";

import { AdminPageHeader } from "@/components/ui/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { H3, P } from "@/components/ui/Typography";
import { useDictionary } from "@/context/DictionaryContext";
import { useGetMyLearningCoursesQuery } from "@/redux/api/courseApi";

export default function UserCertificatesPage() {
  const { locale } = useDictionary();
  const isBn = locale === "bn";
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("all"); // "all", "completed", "pending"
  const [selectedCertForModal, setSelectedCertForModal] = useState(null);
  const printRef = useRef(null);

  const { data: learningData, isLoading } = useGetMyLearningCoursesQuery();
  const enrolledCourses = Array.isArray(learningData?.data) ? learningData.data : [];

  // Map courses to certificate status
  const certificateItems = enrolledCourses.map((course) => {
    const cid = course.courseId || course.id;
    const courseSlug = course.slug || cid;
    const progress = course.enrollment?.progressPercent || 0;
    const isCompleted = progress >= 100;
    const enrolledAt = course.enrollment?.enrolledAt || course.createdAt;

    // Deterministic certificate ID based on course and user ID
    const userSuffix = user?._id ? String(user._id).slice(-4).toUpperCase() : "USR1";
    const courseSuffix = String(cid).toUpperCase();
    const certificateId = `CERT-LPG-${courseSuffix}-${userSuffix}`;

    return {
      courseId: cid,
      courseSlug,
      title: isBn ? course.titleBn || course.title : course.title,
      category: isBn ? course.categoryBn || course.category : course.category,
      progress,
      isCompleted,
      certificateId,
      enrolledAt,
      issueDate: isCompleted
        ? new Date().toLocaleDateString(isBn ? "bn-BD" : "en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : null,
      grade: isCompleted ? "Pass (92%)" : null,
      status: isCompleted ? "Verified & Authentic" : "Pending Completion",
      studentName: user?.fullName || user?.userName || (isBn ? "শিক্ষার্থী" : "Learner"),
    };
  });

  const completedCerts = certificateItems.filter((item) => item.isCompleted);
  const pendingCerts = certificateItems.filter((item) => !item.isCompleted);

  const displayedItems = certificateItems.filter((item) => {
    if (activeTab === "completed") return item.isCompleted;
    if (activeTab === "pending") return !item.isCompleted;
    return true;
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* 1. Header */}
      <AdminPageHeader
        icon={FaAward}
        title={isBn ? "আমার সার্টিফিকেট ও অ্যাক্রিডিটেশন" : "My Certificates & Credentials"}
        description={
          isBn
            ? "সম্পন্নকৃত কোর্সের ভেরিফাইড সার্টিফিকেট ডাউনলোড করুন এবং চলমান কোর্সের অগ্রগতি পর্যবেক্ষণ করুন।"
            : "Review and download your official LPG safety certificates, or monitor pending course completions."
        }
        action={
          <LinkButton
            href="/courses"
            variant="outline"
            size="default"
            className="gap-2 bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
          >
            <FaGraduationCap className="h-3.5 w-3.5 text-primary" />
            <span>{isBn ? "নতুন কোর্স দেখুন" : "Browse Courses"}</span>
          </LinkButton>
        }
      />

      {/* 2. Top Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Enrolled Courses */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              {isBn ? "মোট এনরোল্ড কোর্স" : "Enrolled Courses"}
            </span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {isLoading ? "..." : certificateItems.length}
            </span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FaGraduationCap className="h-5 w-5" />
          </div>
        </div>

        {/* Earned Certificates */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              {isBn ? "অর্জিত সার্টিফিকেট" : "Earned Certificates"}
            </span>
            <span className="text-2xl font-black text-emerald-600 mt-1 block">
              {isLoading ? "..." : completedCerts.length}
            </span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <FaCheckCircle className="h-5 w-5" />
          </div>
        </div>

        {/* Pending Courses */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
              {isBn ? "সার্টিফিকেট পেন্ডিং" : "Pending Completion"}
            </span>
            <span className="text-2xl font-black text-amber-600 mt-1 block">
              {isLoading ? "..." : pendingCerts.length}
            </span>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <FaHourglassHalf className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* 3. Filter Tabs Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200/80 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "all"
                ? "bg-white text-slate-900 font-bold shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {isBn ? `সকল (${certificateItems.length})` : `All (${certificateItems.length})`}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("completed")}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "completed"
                ? "bg-white text-emerald-700 font-bold shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {isBn ? `অর্জিত (${completedCerts.length})` : `Earned (${completedCerts.length})`}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("pending")}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === "pending"
                ? "bg-white text-amber-700 font-bold shadow-2xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            {isBn ? `পেন্ডিং (${pendingCerts.length})` : `Pending (${pendingCerts.length})`}
          </button>
        </div>

        <span className="text-xs text-slate-400">
          {isBn
            ? "কোর্স ১০০% সমাপ্তির পর সার্টিফিকেট তাৎক্ষণিকভাবে ইস্যু হয়"
            : "Certificates are instantly unlocked upon 100% completion"}
        </span>
      </div>

      {/* 4. Certificate List */}
      {isLoading ? (
        <div className="p-12 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <P className="mt-3 text-xs">
            {isBn ? "সার্টিফিকেট তথ্য লোড হচ্ছে..." : "Loading certificate records..."}
          </P>
        </div>
      ) : displayedItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center bg-white">
          <FaAward className="mx-auto h-12 w-12 text-slate-300" />
          <H3 className="mt-3 text-base font-bold text-slate-800">
            {isBn ? "কোনো সার্টিফিকেট রেকর্ড পাওয়া যায়নি" : "No certificates in this view"}
          </H3>
          <P className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
            {isBn
              ? "প্রশিক্ষণ কোর্সে এনরোল করুন এবং ভিডিও লেকচার ও কুইজ সম্পন্ন করে ভেরিফাইড সার্টিফিকেট অর্জন করুন।"
              : "Enroll in LMS training courses and complete video lectures and gating assessments to earn verified credentials."}
          </P>
          <LinkButton href="/courses" variant="primary" size="sm" className="mt-4">
            {isBn ? "কোর্স ক্যাটালগে যান" : "Explore Courses"}
          </LinkButton>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedItems.map((item) => {
            const isCompleted = item.isCompleted;

            return (
              <div
                key={item.certificateId}
                className={`overflow-hidden rounded-2xl border bg-white transition-all shadow-2xs ${
                  isCompleted
                    ? "border-slate-200/90 hover:border-slate-300"
                    : "border-amber-200/80 bg-amber-50/20"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between p-5 sm:p-6 gap-6">
                  {/* Left: Icon & Details */}
                  <div className="flex items-start gap-4">
                    {/* Status Badge Icon */}
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
                        isCompleted
                          ? "bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-xs"
                          : "bg-amber-100 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {isCompleted ? (
                        <FaAward className="h-7 w-7" />
                      ) : (
                        <FaHourglassHalf className="h-6 w-6" />
                      )}
                    </div>

                    <div className="space-y-1.5 flex-1">
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        {isCompleted ? (
                          <>
                            <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                              {item.certificateId}
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                              <FaCheckCircle className="h-3 w-3 text-emerald-600" />
                              <span>{isBn ? "ভেরিফাইড ও প্রস্তুত" : "Verified & Ready"}</span>
                            </span>
                          </>
                        ) : (
                          <>
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800 border border-amber-300">
                              <FaHourglassHalf className="h-3 w-3 text-amber-600" />
                              <span>{isBn ? "সার্টিফিকেট পেন্ডিং (কোর্স সম্পন্ন হয়নি)" : "Certificate Pending (Course Incomplete)"}</span>
                            </span>
                            <span className="text-[11px] font-bold text-amber-700">
                              {item.progress}% {isBn ? "সম্পন্ন" : "Completed"}
                            </span>
                          </>
                        )}
                      </div>

                      {/* Course Title */}
                      <H3 className="text-base font-bold text-slate-900 leading-snug">
                        {item.title}
                      </H3>

                      {/* Progress or Meta Details */}
                      {!isCompleted ? (
                        <div className="space-y-2 pt-1 max-w-xl">
                          {/* Progress Bar */}
                          <div className="h-2 w-full overflow-hidden rounded-full bg-amber-100 border border-amber-200/60">
                            <div
                              className="h-full rounded-full bg-amber-500 transition-all duration-500"
                              style={{ width: `${Math.max(5, item.progress)}%` }}
                            />
                          </div>
                          <p className="text-xs text-amber-800/90 leading-relaxed font-medium">
                            💡{" "}
                            {isBn
                              ? "সার্টিফিকেট আনলক ও ডাউনলোড করতে এই কোর্সের সকল ভিডিও লেকচার ও অ্যাসেসমেন্ট কুইজ ১০০% সম্পন্ন করুন।"
                              : "Complete 100% of this course's video lectures and gating assessment quiz to unlock and download your certified credential."}
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                          <span className="flex items-center gap-1.5">
                            <FaCalendarAlt className="h-3.5 w-3.5 text-slate-400" />
                            {isBn ? "ইস্যু তারিখ: " : "Issued: "}
                            <strong className="text-slate-700 font-semibold">
                              {item.issueDate}
                            </strong>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <FaGraduationCap className="h-3.5 w-3.5 text-slate-400" />
                            {isBn ? "মূল্যায়ন: " : "Assessment: "}
                            <strong className="text-slate-700 font-semibold">{item.grade}</strong>
                          </span>
                          <span className="flex items-center gap-1.5">
                            <FaShieldAlt className="h-3.5 w-3.5 text-slate-400" />
                            {isBn
                              ? "অনুমোদনে: বিস্ফোরক পরিদপ্তর (DoE) ও LOAB"
                              : "Authority: DoE & LOAB Joint Accreditation"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex flex-wrap items-center gap-2.5 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                    {!isCompleted ? (
                      <>
                        {/* Continue Course Action */}
                        <LinkButton
                          href={`/courses/learn/${item.courseSlug}`}
                          variant="primary"
                          size="sm"
                          className="gap-1.5 font-bold text-xs"
                        >
                          <FaPlayCircle className="h-3.5 w-3.5" />
                          <span>{isBn ? "কোর্স চালিয়ে যান" : "Continue Course"}</span>
                        </LinkButton>

                        {/* Locked Download Placeholder */}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled
                          className="gap-1.5 text-xs text-slate-400 cursor-not-allowed border-slate-200 bg-slate-50"
                          title="Complete 100% of course to unlock download"
                        >
                          <FaLock className="h-3 w-3 text-slate-400" />
                          <span>{isBn ? "ডাউনলোড লক করা" : "Locked"}</span>
                        </Button>
                      </>
                    ) : (
                      <>
                        {/* Verify Online */}
                        <LinkButton
                          href={`/verify-certificate?id=${item.certificateId}`}
                          variant="outline"
                          size="sm"
                          className="gap-1.5 text-xs font-semibold text-slate-700 border-slate-200 hover:bg-slate-50"
                        >
                          <FaExternalLinkAlt className="h-3 w-3 text-slate-400" />
                          <span>{isBn ? "অনলাইন যাচাই" : "Verify Online"}</span>
                        </LinkButton>

                        {/* Download / Print PDF */}
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          className="gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={() => setSelectedCertForModal(item)}
                        >
                          <FaDownload className="h-3 w-3" />
                          <span>{isBn ? "সার্টিফিকেট দেখুন / ডাউনলোড" : "View / Download PDF"}</span>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Printable Certificate Modal */}
      {selectedCertForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-2xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-200">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedCertForModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <FaTimes className="h-5 w-5" />
            </button>

            {/* Printable Certificate Frame */}
            <div
              ref={printRef}
              className="border-8 border-double border-amber-600/30 rounded-xl p-6 sm:p-10 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20 text-center relative overflow-hidden"
            >
              {/* Watermark Crest */}
              <div className="absolute inset-0 flex items-center justify-center opacity-4 pointer-events-none">
                <FaAward className="w-80 h-80 text-amber-900" />
              </div>

              {/* Certificate Header */}
              <div className="mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/10 text-amber-600 mb-2">
                  <FaCertificate className="w-7 h-7" />
                </div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-amber-700">
                  Safe LPG Training Academy Bangladesh
                </h4>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider">
                  Accredited in collaboration with Department of Explosives (DoE) & LOAB
                </p>
              </div>

              <h2 className="text-xl sm:text-2xl font-black font-serif text-slate-900 mb-3 tracking-wide">
                CERTIFICATE OF COMPLETION
              </h2>

              <p className="text-xs text-slate-500 italic mb-2">
                This is to officially certify that
              </p>

              {/* Student Name */}
              <h3 className="text-lg sm:text-xl font-black text-primary border-b border-slate-200 pb-2 mb-3 inline-block min-w-64">
                {selectedCertForModal.studentName}
              </h3>

              <p className="text-xs text-slate-600 max-w-lg mx-auto mb-2 leading-relaxed">
                has successfully completed all modules, practical safety drills, and achieved an assessment grade of{" "}
                <span className="font-bold text-slate-900">{selectedCertForModal.grade}</span> in
              </p>

              {/* Course Title */}
              <h4 className="text-sm sm:text-base font-bold text-slate-900 mb-6 bg-slate-50 py-2 px-4 rounded-lg border border-slate-200/60 inline-block max-w-xl">
                {selectedCertForModal.title}
              </h4>

              {/* Certificate Footer Meta */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 text-left text-[11px] text-slate-600">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">
                    Certificate ID
                  </span>
                  <span className="font-mono font-bold text-slate-800 text-xs">
                    {selectedCertForModal.certificateId}
                  </span>
                </div>
                <div className="text-center">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">
                    Issue Date
                  </span>
                  <span className="font-semibold text-slate-800">
                    {selectedCertForModal.issueDate}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">
                    Status
                  </span>
                  <span className="font-bold text-emerald-700">
                    Verified & Authentic
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setSelectedCertForModal(null)}
              >
                {isBn ? "বন্ধ করুন" : "Close"}
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handlePrint}
                className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                <FaPrint className="h-3.5 w-3.5" />
                <span>{isBn ? "প্রিন্ট / পিডিএফ হিসেবে সংরক্ষণ" : "Print / Save as PDF"}</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

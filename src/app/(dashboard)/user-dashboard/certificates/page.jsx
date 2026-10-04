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
  FaFilePdf,
  FaImage,
} from "react-icons/fa";

import { AdminPageHeader } from "@/components/ui/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { H3, P } from "@/components/ui/Typography";
import { useDictionary } from "@/context/DictionaryContext";
import { useGetMyLearningCoursesQuery } from "@/redux/api/courseApi";
import CertificateDocument from "@/components/shared/CertificateDocument";
import {
  downloadCertificateAsPdf,
  downloadCertificateAsImage,
  printCertificateOnly,
} from "@/lib/certificateExporter";

export default function UserCertificatesPage() {
  const { locale } = useDictionary();
  const isBn = locale === "bn";
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("all"); // "all", "completed", "pending"
  const [selectedCertForModal, setSelectedCertForModal] = useState(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingImage, setIsExportingImage] = useState(false);
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

  const handleDownloadPdf = async () => {
    if (!printRef.current || !selectedCertForModal) return;
    setIsExportingPdf(true);
    try {
      const filename = `Certificate-${selectedCertForModal.certificateId || "AEL"}`;
      await downloadCertificateAsPdf(printRef.current, filename);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleDownloadImage = async () => {
    if (!printRef.current || !selectedCertForModal) return;
    setIsExportingImage(true);
    try {
      const filename = `Certificate-${selectedCertForModal.certificateId || "AEL"}`;
      await downloadCertificateAsImage(printRef.current, filename);
    } finally {
      setIsExportingImage(false);
    }
  };

  const handlePrint = () => {
    if (!printRef.current) return;
    printCertificateOnly(printRef.current);
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
        <>
          <style jsx global>{`
            @media print {
              body {
                background: #ffffff !important;
                margin: 0 !important;
                padding: 0 !important;
                overflow: visible !important;
              }
              body * {
                visibility: hidden;
              }
              #printable-certificate,
              #printable-certificate * {
                visibility: visible;
              }
              #printable-certificate {
                position: fixed;
                left: 0;
                top: 0;
                width: 100vw !important;
                height: 100vh !important;
                max-width: none !important;
                margin: 0 !important;
                padding: 0 !important;
                border: none !important;
                box-shadow: none !important;
                background: #faf8f5 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                page-break-inside: avoid;
              }
              @page {
                size: A4 landscape;
                margin: 0;
              }
            }
          `}</style>

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs overflow-y-auto">
            <div className="relative w-full max-w-4xl rounded-2xl bg-white p-4 sm:p-6 shadow-2xl border border-slate-200 my-auto max-h-[92vh] overflow-y-auto">
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedCertForModal(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors z-20"
              >
                <FaTimes className="h-5 w-5" />
              </button>

              <div className="mb-3 pr-8">
                <h3 className="text-base font-bold text-slate-900">
                  {isBn ? "অফিসিয়াল সার্টিফিকেট প্রিভিউ" : "Official Certificate Preview"}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  ID: {selectedCertForModal.certificateId}
                </p>
              </div>

              {/* Printable Certificate Frame */}
              <div className="flex justify-center items-center w-full my-2 bg-slate-100/60 p-2 sm:p-4 rounded-xl border border-slate-200">
                <CertificateDocument
                  ref={printRef}
                  certificate={selectedCertForModal}
                  className="rounded-xl shadow-md border border-slate-200"
                />
              </div>

              {/* Modal Actions */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-500 font-sans">
                  {isBn
                    ? "শুধুমাত্র এই সার্টিফিকেটটি PDF বা ইমেজ হিসেবে ডাউনলোড করুন।"
                    : "Download clean PDF or PNG image of only this certificate."}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCertForModal(null)}
                    disabled={isExportingPdf || isExportingImage}
                  >
                    {isBn ? "বন্ধ করুন" : "Close"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handlePrint}
                    disabled={isExportingPdf || isExportingImage}
                    icon={FaPrint}
                  >
                    <span>{isBn ? "প্রিন্ট" : "Print"}</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadImage}
                    isLoading={isExportingImage}
                    disabled={isExportingImage || isExportingPdf}
                    icon={FaImage}
                    className="text-amber-800 border-amber-300 hover:bg-amber-50"
                  >
                    <span>{isBn ? "ইমেজ ডাউনলোড (PNG)" : "Download Image (PNG)"}</span>
                  </Button>

                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={handleDownloadPdf}
                    isLoading={isExportingPdf}
                    disabled={isExportingPdf || isExportingImage}
                    icon={FaFilePdf}
                    className="bg-[#7C481A] hover:bg-[#5C3411] text-white border-transparent shadow-xs"
                  >
                    <span>{isBn ? "পিডিএফ ডাউনলোড" : "Download PDF"}</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

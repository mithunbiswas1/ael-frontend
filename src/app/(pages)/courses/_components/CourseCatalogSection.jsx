// src/app/(pages)/courses/_components/CourseCatalogSection.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Search, User, BookOpen, ArrowRight, Eye, ShieldCheck, CheckCircle } from "lucide-react";

import { H2, H4, P } from "@/components/ui/Typography";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { useDictionary } from "@/context/DictionaryContext";
import { useEnrollCourseMutation } from "@/redux/api/courseApi";
import AuthModal from "@/components/shared/AuthModal";

export const PRICE_TABS = [
  { id: "all", label: "All", labelBn: "সকল" },
  { id: "paid", label: "Paid", labelBn: "পেইড" },
  { id: "free", label: "Free", labelBn: "ফ্রি" },
];

export const CATEGORIES = [
  { id: "all", name: "All Categories", nameBn: "সকল ক্যাটাগরি" },
  { id: "consumer", name: "Consumer Safety", nameBn: "ভোক্তা নিরাপত্তা" },
  { id: "dealer", name: "Dealer Compliance", nameBn: "ডিলার কমপ্লায়েন্স" },
  { id: "industrial", name: "Industrial Use", nameBn: "শিল্প কারখানা ব্যবহার" },
  { id: "auto-gas", name: "Auto Gas Station", nameBn: "অটো গ্যাস স্টেশন" },
  { id: "emergency", name: "Emergency Response", nameBn: "জরুরি সাড়াদান" },
  { id: "environment", name: "Environment & Sustainability", nameBn: "পরিবেশ ও স্থায়িত্ব" },
];

export const COURSE_CATALOG = [];

export default function CourseCatalogSection({
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  priceFilter,
  setPriceFilter,
  filteredCourses,
}) {
  const router = useRouter();
  const { locale } = useDictionary();
  const isBn = locale === "bn";

  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [enrollCourse, { isLoading: isEnrolling }] = useEnrollCourseMutation();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingCourse, setPendingCourse] = useState(null);

  // Check if course is already enrolled by the user
  const isAlreadyEnrolled = (courseId) => {
    if (!user?.enrolledCourses) return false;
    return user.enrolledCourses.some(
      (e) => e.courseId === courseId || e.courseId === String(courseId)
    );
  };

  // Handle Enroll Click (Checks login, Free vs Paid)
  const handleEnrollClick = async (course) => {
    const courseUniqueId = course.courseId;
    const isPaidCourse = course.price > 0;

    if (!isLoggedIn) {
      setPendingCourse(course);
      setIsAuthModalOpen(true);
      return;
    }

    // If already enrolled, go to learning classroom
    if (isAlreadyEnrolled(courseUniqueId)) {
      toast.info(
        isBn
          ? "আপনি ইতিমধ্যে এই কোর্সে এনরোল করেছেন। ক্লাসরুমে নিয়ে যাওয়া হচ্ছে..."
          : "You are already enrolled. Navigating to classroom..."
      );
      router.push(`/subscriber/courses`);
      return;
    }

    if (isPaidCourse) {
      router.push(`/checkout?courseId=${courseUniqueId}`);
      return;
    }

    // Direct Enroll for Free Course
    try {
      await enrollCourse(courseUniqueId).unwrap();
      toast.success(
        isBn
          ? "অভিনন্দন! আপনি সফলভাবে বিনামূল্যে কোর্সে এনরোল করেছেন।"
          : "Successfully enrolled in this course!"
      );
      router.push(`/subscriber/courses`);
    } catch (err) {
      toast.error(
        err?.data?.message ||
          (isBn ? "এনরোলমেন্ট ব্যর্থ হয়েছে।" : "Enrollment failed.")
      );
    }
  };

  // Triggered when user logs in/registers successfully from AuthModal
  const handleAuthSuccess = (loggedUser) => {
    if (pendingCourse) {
      const course = pendingCourse;
      setPendingCourse(null);
      const courseUniqueId = course.courseId;
      const isPaidCourse = course.price > 0;

      if (isPaidCourse) {
        router.push(`/checkout?courseId=${courseUniqueId}`);
      } else {
        enrollCourse(courseUniqueId)
          .unwrap()
          .then(() => {
            toast.success(
              isBn
                ? "অভিনন্দন! আপনি সফলভাবে কোর্সে এনরোল করেছেন।"
                : "Successfully enrolled in this course!"
            );
            router.push(`/subscriber/courses`);
          })
          .catch((err) => {
            toast.error(err?.data?.message || "Enrollment failed.");
          });
      }
    }
  };

  return (
    <section id="catalog" className="py-12 sm:py-16">
      <div className="site-container">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <H2>
              <span>{isBn ? "উপলব্ধ" : "AVAILABLE"}</span>{" "}
              <span className="text-primary">{isBn ? "কোর্সসমূহ।" : "COURSES."}</span>
            </H2>
            <P className="mt-1">
              {isBn
                ? "স্টেকহোল্ডার ক্যাটাগরি অনুসারে প্রত্যয়িত কোর্স অন্বেষণ করুন এবং আপনার নিরাপত্তা সনদ অর্জন করুন।"
                : "Explore certified courses by stakeholder category and enhance your safety credentials."}
            </P>
          </div>

          {/* Search */}
          <div className="min-w-[190px]">
            <Input
              type="text"
              placeholder={isBn ? "কোর্স অনুসন্ধান করুন..." : "Search courses..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              prefix={<Search className="h-3.5 w-3.5" />}
            />
          </div>
        </div>

        {/* Price Tabs */}
        <div className="mb-6 flex items-center gap-1.5 w-full sm:w-fit rounded-xl border border-slate-200/80 bg-white p-1.5 shadow-xs">
          {PRICE_TABS.map((tab) => {
            const isActive = priceFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setPriceFilter(tab.id)}
                className={`flex-1 sm:flex-none rounded-lg px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? "bg-primary text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {isBn ? tab.labelBn : tab.label}
              </button>
            );
          })}
        </div>

        {/* Main Grid with Left Categories Sidebar */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Sidebar (3 cols) */}
          <div className="space-y-4 lg:col-span-3">
            <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
              <H4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                {isBn ? "ক্যাটাগরি" : "Categories"}
              </H4>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left rounded-lg px-3 py-2 text-xs font-semibold transition-colors cursor-pointer ${
                      selectedCategory === cat.id
                        ? "bg-primary/10 text-primary font-bold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    {isBn ? cat.nameBn : cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick trust box */}
            <div className="rounded-xl border border-slate-200/80 bg-gradient-to-br from-slate-900 to-slate-950 p-4 text-white shadow-xs">
              <ShieldCheck className="h-6 w-6 text-emerald-400 mb-2" />
              <div className="text-xs font-bold">
                {isBn ? "ভেরিফাইড ডিজিটাল সনদ" : "Verified LMS Certification"}
              </div>
              <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
                {isBn
                  ? "কোর্স সম্পন্ন করে সরাসরি অনলাইনে যাচাইযোগ্য নিরাপত্তা সনদপত্র গ্রহণ করুন।"
                  : "Complete video modules, pass quizzes, and earn verifiably signed certificates."}
              </p>
            </div>
          </div>

          {/* Right Courses Grid (9 cols) */}
          <div className="lg:col-span-9">
            {filteredCourses.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500">
                {isBn
                  ? "আপনার অনুসন্ধানের সাথে মিলে এমন কোনো কোর্স পাওয়া যায়নি।"
                  : "No courses found matching your criteria."}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredCourses.map((course) => {
                  const courseTitle = isBn ? course.titleBn || course.title : course.title;
                  const courseDesc = isBn ? course.descriptionBn || course.description : course.description;
                  const courseBadge = isBn ? course.badgeBn || course.badge : course.badge;
                  const courseAudience = isBn ? course.audienceBn || course.audience : course.audience;
                  const courseLevel = isBn ? course.levelBn || course.level : course.level;

                  const courseUniqueId = course.courseId;
                  const isEnrolled = isAlreadyEnrolled(courseUniqueId);

                  return (
                    <div
                      key={courseUniqueId}
                      className="group flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs transition-colors duration-200 hover:border-primary/50"
                    >
                      {/* Image + Badge */}
                      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
                        <Image
                          src={course.imageUrl}
                          alt={courseTitle}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                        />
                        <span
                          className={`absolute left-2.5 top-2.5 rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-xs ${
                            course.badgeColor || "bg-primary"
                          }`}
                        >
                          {courseBadge}
                        </span>

                        <span className="absolute bottom-2.5 right-2.5 rounded-md bg-slate-950/80 px-2 py-0.5 text-[9px] font-bold text-white">
                          {course.isPaid ? (course.price ? `৳ ${course.price}` : "PAID") : "FREE"}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex flex-1 flex-col justify-between p-4">
                        <div>
                          <H4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                            {courseTitle}
                          </H4>
                          <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {courseDesc}
                          </p>
                        </div>

                        <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-slate-400" />
                            <span>
                              {isBn ? "কাদের জন্য: " : "Audience: "}
                              {courseAudience || (isBn ? "সকলের জন্য" : "General Audience")}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                            <span>
                              {isBn ? "স্তর: " : "Level: "}
                              {courseLevel || (isBn ? "প্রাথমিক" : "Beginner")}
                            </span>
                          </div>
                        </div>

                        {/* Standard 2 Action Buttons: View Details & Enroll Now */}
                        <div className="mt-4 grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                          {/* Button 1: View Details / Course Outline */}
                          <LinkButton
                            href={`/courses/${courseUniqueId}`}
                            variant="secondary"
                            size="sm"
                            className="gap-1.5 text-xs font-bold text-slate-700 hover:text-primary"
                          >
                            <Eye className="h-3.5 w-3.5 text-slate-500" />
                            <span>{isBn ? "বিস্তারিত দেখুন" : "View Details"}</span>
                          </LinkButton>

                          {/* Button 2: Enroll Now / Continue */}
                          {isEnrolled ? (
                            <LinkButton
                              href="/subscriber/courses"
                              variant="secondary"
                              size="sm"
                              className="gap-1.5 bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 font-bold"
                            >
                              <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                              <span>{isBn ? "এনরোল্ড" : "Enrolled"}</span>
                            </LinkButton>
                          ) : (
                            <Button
                              type="button"
                              variant="primary"
                              size="sm"
                              onClick={() => handleEnrollClick(course)}
                              disabled={isEnrolling}
                              className="gap-1.5 font-bold shadow-2xs"
                            >
                              <span>
                                {course.isPaid
                                  ? isBn ? "এনরোল করুন" : "Enroll Now"
                                  : isBn ? "ফ্রি এনরোল" : "Enroll Free"}
                              </span>
                              <ArrowRight className="h-3.5 w-3.5" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Global Auth Modal for Course Enrollment */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingCourse(null);
        }}
        onSuccess={handleAuthSuccess}
      />
    </section>
  );
}

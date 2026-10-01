// src/app/(pages)/courses/_components/CourseCatalogSection.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import {
  Search,
  User,
  BookOpen,
  ArrowRight,
  Eye,
  CheckCircle,
  Clock,
  Layers,
  PlayCircle,
} from "lucide-react";

import { H2, H4, P } from "@/components/ui/Typography";
import SectionHeader from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { useDictionary } from "@/context/DictionaryContext";
import { useEnrollCourseMutation } from "@/redux/api/courseApi";
import AuthModal from "@/components/shared/AuthModal";
import CheckoutModal from "@/components/shared/CheckoutModal";

export const PRICE_TABS = [
  { id: "all", label: "All Courses", labelBn: "সকল কোর্স" },
  { id: "paid", label: "Premium", labelBn: "প্রিমিয়াম" },
  { id: "free", label: "Free", labelBn: "ফ্রি" },
];

export default function CourseCatalogSection({
  searchQuery,
  setSearchQuery,
  priceFilter,
  setPriceFilter,
  filteredCourses = [],
  isLoading = false,
}) {
  const router = useRouter();
  const { locale } = useDictionary();
  const isBn = locale === "bn";

  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [enrollCourse, { isLoading: isEnrolling }] = useEnrollCourseMutation();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingCourse, setPendingCourse] = useState(null);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutCourse, setCheckoutCourse] = useState(null);

  const isSubscribed = Boolean(
    user?.role === "subscriber" ||
    (user?.subscription?.status === "active" &&
      user?.subscription?.planKey !== "course_single" &&
      (!user?.subscription?.expiresAt ||
        new Date(user.subscription.expiresAt) > new Date())) ||
    ["super_admin", "admin", "instructor", "course_admin", "editor"].includes(user?.role)
  );

  // Check if user has access to course
  const hasCourseAccess = (course) => {
    if (isSubscribed) return true;
    const cid = course.courseId || course.id;
    if (!user?.enrolledCourses) return false;
    return user.enrolledCourses.some(
      (e) =>
        e.courseId === cid ||
        e.courseId === String(cid) ||
        e.courseId === course.slug ||
        (course._id && e.courseId === String(course._id))
    );
  };

  // Handle Enrollment
  const handleEnrollClick = async (course) => {
    const cid = course.courseId || course.id;
    const courseSlug = course.slug || cid;
    const isPaid = course.price > 0;

    if (hasCourseAccess(course)) {
      router.push(`/courses/learn/${courseSlug}`);
      return;
    }

    if (!isLoggedIn) {
      setPendingCourse(course);
      setIsAuthModalOpen(true);
      return;
    }

    if (isPaid) {
      setCheckoutCourse(course);
      setIsCheckoutModalOpen(true);
      return;
    }

    try {
      await enrollCourse(cid).unwrap();
      toast.success(
        isBn
          ? "অভিনন্দন! আপনি সফলভাবে এই কোর্সে এনরোল করেছেন।"
          : "Successfully enrolled in this course!"
      );
      router.push(`/courses/learn/${courseSlug}`);
    } catch (err) {
      toast.error(err?.data?.message || (isBn ? "এনরোলমেন্ট ব্যর্থ হয়েছে।" : "Enrollment failed"));
    }
  };

  const handleAuthSuccess = () => {
    if (!pendingCourse) return;
    const cid = pendingCourse.courseId || pendingCourse.id;
    const courseSlug = pendingCourse.slug || cid;
    if (pendingCourse.price > 0) {
      setCheckoutCourse(pendingCourse);
      setIsCheckoutModalOpen(true);
    } else {
      enrollCourse(cid)
        .unwrap()
        .then(() => {
          toast.success(
            isBn
              ? "অভিনন্দন! আপনি সফলভাবে এই কোর্সে এনরোল করেছেন।"
              : "Successfully enrolled in this course!"
          );
          router.push(`/courses/learn/${courseSlug}`);
        })
        .catch((err) => toast.error(err?.data?.message || "Enrollment failed"));
    }
  };

  return (
    <section id="catalog" className="py-12 sm:py-16 bg-slate-50">
      <div className="site-container">
        {/* Section Header */}
        <div className="mb-8">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary">
            {isBn ? "প্রশিক্ষণ কারিকুলাম" : "Professional Training Catalog"}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {isBn ? "উপলব্ধ সকল নিরাপত্তা কোর্স" : "Available Safety Courses"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            {isBn
              ? "জাতীয় মানদণ্ড অনুযায়ী পরিচালিত কারিগরি ও ব্যবহারিক কোর্স। প্রতিটি মডিউলে রয়েছে ভিডিও লেকচার ও মূল্যায়ন পরীক্ষা।"
              : "Technical safety curricula adhering to national regulations. Each module includes structured video lectures and gating assessments."}
          </p>
        </div>

        {/* Search & Price Filter Toolbar (No category filter) */}
        <div className="mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isBn ? "কোর্স বা বিষয়ের নাম দিয়ে খুঁজুন..." : "Search by course title or keyword..."
              }
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs text-slate-800 placeholder:text-slate-400 focus:border-primary focus:outline-hidden"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Clean Segmented Price Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/80 self-start sm:self-auto">
            {PRICE_TABS.map((tab) => {
              const isActive = priceFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setPriceFilter(tab.id)}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? "bg-white text-slate-900 font-bold shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {isBn ? tab.labelBn : tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-6">
          <span>
            {isBn
              ? `মোট ${filteredCourses.length}টি কোর্স পাওয়া গেছে`
              : `Showing ${filteredCourses.length} course${filteredCourses.length === 1 ? "" : "s"}`}
          </span>
          <span className="text-slate-400 text-[11px]">
            {isBn ? "পরপর মডিউল সম্পন্ন করার নিয়ম প্রযোজ্য" : "Sequential Module Completion Required"}
          </span>
        </div>

        {/* Full-Width Courses Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="animate-pulse rounded-xl border border-slate-200 bg-white p-4 space-y-4"
              >
                <div className="aspect-16/10 w-full rounded-lg bg-slate-200" />
                <div className="h-4 bg-slate-200 rounded-md w-1/3" />
                <div className="h-5 bg-slate-200 rounded-md w-3/4" />
                <div className="h-3 bg-slate-100 rounded-md w-full" />
                <div className="h-3 bg-slate-100 rounded-md w-2/3" />
                <div className="h-8 bg-slate-100 rounded-lg mt-4" />
              </div>
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500">
            <BookOpen className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-800">
              {isBn ? "কোনো কোর্স খুঁজে পাওয়া যায়নি" : "No courses match your query"}
            </p>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              {isBn
                ? "অনুগ্রহ করে অনুসন্ধানের শব্দ পরিবর্তন করে পুনরায় চেষ্টা করুন।"
                : "Try resetting your search query."}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setPriceFilter("all");
              }}
            >
              {isBn ? "ফিল্টার রিসেট করুন" : "Reset Filters"}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => {
              const courseSlug = course.slug || course.courseId || course.id;
              const courseTitle = isBn ? course.titleBn || course.title : course.title;
              const courseDesc = isBn ? course.descriptionBn || course.description : course.description;
              const courseDuration = isBn ? course.durationBn || course.duration : course.duration;
              const courseLevel = isBn ? course.levelBn || course.level : course.level;
              const isPaid = course.price > 0;
              const hasAccess = hasCourseAccess(course);

              const moduleCount = course.curriculum?.length || 1;
              const hasFreeModule =
                course.curriculum &&
                course.curriculum.length > 0 &&
                (course.curriculum[0].isFree || !isPaid);

              return (
                <div
                  key={courseSlug}
                  className="group flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors hover:border-slate-300"
                >
                  <div>
                    {/* Course Thumbnail */}
                    <Link href={`/courses/${courseSlug}`} className="block relative aspect-16/10 w-full overflow-hidden bg-slate-100">
                      <Image
                        src={
                          course.imageUrl ||
                          "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop"
                        }
                        alt={courseTitle || "Course thumbnail"}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />

                      {/* Clean Badges (no rounded pills, crisp tags) */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="rounded bg-slate-900/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                          {isPaid ? "Premium" : "Free"}
                        </span>

                        {hasFreeModule && isPaid && (
                          <span className="rounded bg-emerald-700 text-white px-2 py-0.5 text-[10px] font-bold">
                            {isBn ? "১ম মডিউল ফ্রি" : "Module 1 Free"}
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-2.5 right-2.5 rounded bg-slate-900/85 px-2 py-0.5 text-[11px] font-bold text-white">
                        {isPaid ? `৳ ${course.price}` : (isBn ? "বিনামূল্যে" : "Free")}
                      </div>
                    </Link>

                    {/* Content Body */}
                    <div className="p-4 sm:p-5">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        {course.category || (isBn ? "নিরাপত্তা কোর্স" : "Safety Compliance")}
                      </div>

                      <Link href={`/courses/${courseSlug}`}>
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug line-clamp-2 hover:text-primary transition-colors">
                          {courseTitle}
                        </h3>
                      </Link>

                      <p className="mt-2 line-clamp-2 text-xs text-slate-600 leading-relaxed">
                        {courseDesc}
                      </p>

                      {/* Professional Meta Line */}
                      <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-slate-500 border-t border-slate-100 pt-3">
                        <div className="flex items-center gap-1">
                          <Layers className="h-3.5 w-3.5 text-slate-400" />
                          <span>{moduleCount} {isBn ? "মডিউল" : "Modules"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                          <span>{course.totalLessons} {isBn ? "পাঠ" : "Lessons"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          <span>{courseDuration}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action Buttons */}
                  <div className="p-4 sm:p-5 pt-0 border-t border-slate-100 mt-2">
                    <div className="grid grid-cols-2 gap-2 pt-3">
                      {/* View Details / Syllabus Link -> /courses/[slug] */}
                      <Link
                        href={`/courses/${courseSlug}`}
                        className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5 text-slate-500" />
                        <span>{isBn ? "বিস্তারিত" : "Outline"}</span>
                      </Link>

                      {/* Enroll / Play Button */}
                      {hasAccess ? (
                        <Link
                          href={`/courses/learn/${courseSlug}`}
                          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 text-xs font-bold transition-colors shadow-xs"
                        >
                          <PlayCircle className="h-3.5 w-3.5" />
                          <span>{isBn ? "দেখুন ও প্লে করুন" : "View & Play"}</span>
                        </Link>
                      ) : (
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          onClick={() => handleEnrollClick(course)}
                          disabled={isEnrolling}
                          className="gap-1 font-bold text-xs"
                        >
                          <span>
                            {isPaid
                              ? (isBn ? "ভর্তি হোন" : "Enroll")
                              : (isBn ? "ফ্রি ভর্তি" : "Start Free")}
                          </span>
                          <ArrowRight className="h-3 w-3" />
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

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => {
          setIsCheckoutModalOpen(false);
          setCheckoutCourse(null);
        }}
        course={checkoutCourse}
        onSuccess={() => {
          setIsCheckoutModalOpen(false);
          if (checkoutCourse) {
            const courseSlug = checkoutCourse.slug || checkoutCourse.courseId || checkoutCourse.id;
            router.push(`/courses/learn/${courseSlug}`);
          }
        }}
      />

      {/* Global Auth Modal */}
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

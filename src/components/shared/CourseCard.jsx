// src/components/shared/CourseCard.jsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import {
  Clock,
  BookOpen,
  ArrowRight,
  Eye,
  PlayCircle,
  Layers,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { useDictionary } from "@/context/DictionaryContext";
import { useEnrollCourseMutation } from "@/redux/api/courseApi";
import AuthModal from "@/components/shared/AuthModal";
import CheckoutModal from "@/components/shared/CheckoutModal";

export default function CourseCard({
  course,
  courseId = "1",
  id,
  slug,
  isPaid: isPaidProp,
  imageUrl,
  title,
  description,
  duration = "3h 45m",
  lessonsCount = 12,
  price,
  category,
  curriculum,
  href,
}) {
  const router = useRouter();
  const { locale } = useDictionary();
  const isBn = locale === "bn";

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [enrollCourse, { isLoading: isEnrolling }] = useEnrollCourseMutation();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const cid = course?.courseId || course?._id || courseId || id || course?.slug || "1";
  const courseSlug = slug || course?.slug || cid;
  const detailsHref = href || `/courses/${courseSlug}`;

  const courseTitle = isBn
    ? course?.titleBn || title || course?.title
    : title || course?.title;

  const courseDesc = isBn
    ? course?.descriptionBn || description || course?.description
    : description || course?.description;

  const courseDuration = isBn
    ? course?.durationBn || duration || course?.duration || "3h 45m"
    : duration || course?.duration || "3h 45m";

  const displayLessonsCount = course?.totalLessons ?? lessonsCount ?? 12;

  const rawPrice = course?.price !== undefined ? course.price : price;
  const numericPrice =
    typeof rawPrice === "number"
      ? rawPrice
      : parseInt(String(rawPrice || "").replace(/[^0-9]/g, ""), 10) || 0;
  const isPaid =
    course?.isFree === true
      ? false
      : isPaidProp !== undefined
      ? isPaidProp
      : numericPrice > 0;

  const courseCategory = isBn
    ? course?.categoryBn || category || course?.category
    : category || course?.category;

  const courseCurriculum = course?.curriculum || curriculum || [];
  const moduleCount = courseCurriculum.length || 1;
  const hasFreeModule =
    courseCurriculum.length > 0 && (courseCurriculum[0].isFree || !isPaid);

  const displayImage = course?.imageUrl || imageUrl || "/default_image.jpg";

  const isSubscribed =
    mounted &&
    Boolean(
      user?.role === "subscriber" ||
        (user?.subscription?.status === "active" &&
          user?.subscription?.planKey !== "course_single" &&
          (!user?.subscription?.expiresAt ||
            new Date(user.subscription.expiresAt) > new Date())) ||
        ["super_admin", "admin", "instructor", "course_admin", "editor"].includes(
          user?.role
        )
    );

  const isEnrolled =
    mounted &&
    Boolean(
      user?.enrolledCourses?.some(
        (e) =>
          e.courseId === cid ||
          e.courseId === String(cid) ||
          e.courseId === courseSlug ||
          (course?._id && e.courseId === String(course._id))
      )
    );

  const hasAccess = isEnrolled || isSubscribed;

  const handleEnroll = async () => {
    // 1. Free Course: Instant auto-enroll for logged-in user
    if (!isPaid) {
      if (isLoggedIn) {
        try {
          await enrollCourse(cid).unwrap();
          toast.success(
            isBn
              ? "সফলভাবে ফ্রি কোর্সে এনরোল সম্পন্ন হয়েছে!"
              : "Successfully enrolled in this course!"
          );
        } catch {
          // If already enrolled, continue straight to classroom
        }
        router.push(`/courses/learn/${courseSlug}`);
        return;
      } else {
        setIsAuthModalOpen(true);
        return;
      }
    }

    // 2. Paid Course
    if (hasAccess) {
      router.push(`/courses/learn/${courseSlug}`);
      return;
    }

    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }

    setIsCheckoutModalOpen(true);
  };

  const handleAuthSuccess = () => {
    if (isPaid) {
      setIsCheckoutModalOpen(true);
    } else {
      enrollCourse(cid)
        .unwrap()
        .then(() => {
          toast.success(
            isBn
              ? "সফলভাবে ফ্রি কোর্সে এনরোল সম্পন্ন হয়েছে!"
              : "Successfully enrolled in this course!"
          );
          router.push(`/courses/learn/${courseSlug}`);
        })
        .catch(() => {
          router.push(`/courses/learn/${courseSlug}`);
        });
    }
  };

  return (
    <>
      <div className="group flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white transition-colors hover:border-slate-300">
        <div>
          {/* Course Thumbnail */}
          <Link
            href={detailsHref}
            className="block relative aspect-16/10 w-full overflow-hidden bg-slate-100"
          >
            <Image
              src={displayImage}
              alt={courseTitle || "Course thumbnail"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              onError={(e) => {
                e.currentTarget.src = "/default_image.jpg";
              }}
            />

            {/* Clean Badges matching /courses design */}
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
              {isPaid ? `৳ ${numericPrice}` : isBn ? "বিনামূল্যে" : "Free"}
            </div>
          </Link>

          {/* Content Body */}
          <div className="p-4 sm:p-5">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              {courseCategory || (isBn ? "নিরাপত্তা কোর্স" : "Safety Compliance")}
            </div>

            <Link href={detailsHref}>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug line-clamp-2 hover:text-primary transition-colors">
                {courseTitle}
              </h3>
            </Link>

            <p className="mt-2 line-clamp-2 text-xs text-slate-600 leading-relaxed">
              {courseDesc}
            </p>

            {/* Professional Meta Line matching /courses */}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-slate-500 border-t border-slate-100 pt-3">
              <div className="flex items-center gap-1">
                <Layers className="h-3.5 w-3.5 text-slate-400" />
                <span>
                  {moduleCount} {isBn ? "মডিউল" : "Modules"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                <span>
                  {displayLessonsCount} {isBn ? "পাঠ" : "Lessons"}
                </span>
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
              href={detailsHref}
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
                onClick={handleEnroll}
                disabled={isEnrolling}
                className="gap-1 font-bold text-xs"
              >
                <span>
                  {isPaid
                    ? isBn
                      ? "ভর্তি হোন"
                      : "Enroll"
                    : isBn
                    ? "ফ্রি ভর্তি"
                    : "Start Free"}
                </span>
                <ArrowRight className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        course={{
          courseId: cid,
          id: cid,
          slug: courseSlug,
          title: courseTitle,
          price: numericPrice,
        }}
        onSuccess={() => {
          setIsCheckoutModalOpen(false);
          router.push(`/courses/learn/${courseSlug}`);
        }}
      />

      {/* Auth Modal for Unauthenticated Users */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}

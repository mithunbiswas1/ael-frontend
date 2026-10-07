// src/app/(pages)/courses/[slug]/_components/CourseEnrollSidebar.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import {
  PlayCircle,
  ArrowRight,
  FileText,
  Award,
  ShieldCheck,
  CheckCircle,
  Lock,
} from "lucide-react";

import { useDictionary } from "@/context/DictionaryContext";
import { useEnrollCourseMutation } from "@/redux/api/courseApi";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import AuthModal from "@/components/shared/AuthModal";
import CheckoutModal from "@/components/shared/CheckoutModal";
import SocialShareBar from "@/components/shared/SocialShareBar";

export default function CourseEnrollSidebar({ course, isFree }) {
  const router = useRouter();
  const { locale } = useDictionary();
  const isBn = locale === "bn";

  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [enrollCourse, { isLoading: isEnrolling }] = useEnrollCourseMutation();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const isCourseFree =
    isFree !== undefined
      ? isFree
      : Boolean(
          course?.isFree === true ||
          !course?.price ||
          Number(course?.price) === 0 ||
          String(course?.price).trim() === "0"
        );

  const cid = course?.courseId || course?._id || course?.id || course?.slug;
  const targetSlug = course.slug || cid;
  const title = isBn ? course.titleBn || course.title : course.title;
  const duration = isBn
    ? course.durationBn || course.duration || "১ ঘণ্টা ৪৫ মিনিট"
    : course.duration || "1h 45m";
  const sub = user?.subscription;
  const now = Date.now();
  const hasRemainingDays =
    sub?.remainingDays !== undefined && sub?.remainingDays !== null
      ? Number(sub.remainingDays) > 0
      : true;
  const hasValidExpiry = sub?.expiresAt
    ? new Date(sub.expiresAt).getTime() > now
    : sub?.planKey === "lifetime";

  const isSubActive =
    sub?.status === "active" &&
    sub?.planKey &&
    sub?.planKey !== "course_single" &&
    sub?.planKey !== "free" &&
    hasValidExpiry &&
    hasRemainingDays;

  const isSubscribed = Boolean(
    isSubActive ||
    ["super_admin", "admin", "instructor", "course_admin", "manager", "editor"].includes(user?.role)
  );

  const isEnrolled = user?.enrolledCourses?.some(
    (e) =>
      e.courseId === cid ||
      e.courseId === String(cid) ||
      e.courseId === course.slug ||
      (course._id && e.courseId === String(course._id))
  );

  const hasAccess = isEnrolled || isSubscribed;

  const handleEnrollClick = async () => {
    if (hasAccess) {
      router.push(`/courses/learn/${targetSlug}`);
      return;
    }

    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!isCourseFree) {
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
    } catch {
      // Continue if already enrolled
    }
    router.push(`/courses/learn/${targetSlug}`);
  };

  const handleAuthSuccess = () => {
    if (!isCourseFree) {
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
          router.push(`/courses/learn/${targetSlug}`);
        })
        .catch(() => {
          router.push(`/courses/learn/${targetSlug}`);
        });
    }
  };

  return (
    <>
      <div className="lg:col-span-4 sticky top-24">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
          {/* Media Preview Box */}
          <div className="relative aspect-16/9 w-full bg-slate-900">
            <Image
              src={course.imageUrl || "/default_image.jpg"}
              alt={title || "Course Preview"}
              fill
              className="object-cover opacity-85"
              onError={(e) => {
                e.currentTarget.src = "/default_image.jpg";
              }}
            />
            <div className="absolute inset-0 bg-slate-950/50 flex flex-col items-center justify-center text-white p-4 text-center">
              <span className="inline-flex items-center gap-1.5 rounded bg-slate-900/90 border border-slate-700 px-2.5 py-1 text-xs font-semibold mb-1">
                <Lock className="h-3.5 w-3.5 text-secondary" />
                <span>{isBn ? "অনলাইন ক্লাসরুম" : "Online Learning Portal"}</span>
              </span>
              <p className="text-[11px] text-slate-300 max-w-xs">
                {isBn
                  ? "এনরোল করে এইচডি লেকচার, মডিউল কুইজ ও সনদ লাভ করুন"
                  : "Enroll to access video lessons, gating quizzes & certificate"}
              </p>
            </div>
            <span className="absolute bottom-2 right-2 rounded bg-slate-950/85 px-2 py-0.5 text-[10px] font-bold text-white">
              {course.category || (isBn ? "নিরাপত্তা কোর্স" : "Safety Compliance")}
            </span>
          </div>

          {/* Price & Action */}
          <div className="p-5">
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-2xl font-black text-slate-900">
                {isSubscribed ? (isBn ? "উন্মুক্ত" : "UNLOCKED") : isFree ? (isBn ? "ফ্রি" : "FREE") : `৳ ${course.price}`}
              </span>
              {!isFree && !isSubscribed && (
                <span className="text-xs text-slate-400 line-through">
                  ৳ ১,২০০
                </span>
              )}
              <span className="ml-auto rounded bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold">
                {isSubscribed
                  ? isBn
                    ? "সাবস্ক্রিপশনে অন্তর্ভুক্ত"
                    : "Included with Subscription"
                  : isFree
                    ? isBn
                      ? "১০০% স্কলারশিপ"
                      : "100% Free"
                    : isBn
                      ? "বিশেষ ৫৮% ছাড়"
                      : "58% Off"}
              </span>
            </div>

            {/* Main Action Button */}
            {hasAccess ? (
              <LinkButton
                href={`/courses/learn/${targetSlug}`}
                variant="primary"
                size="lg"
                fullWidth
                className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs"
              >
                <PlayCircle className="h-5 w-5 text-white" />
                <span>
                  {isBn ? "কোর্সটি দেখুন ও প্লে করুন" : "View & Play Now"}
                </span>
              </LinkButton>
            ) : (
              <div className="space-y-2">
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  fullWidth
                  onClick={handleEnrollClick}
                  disabled={isEnrolling}
                  className="gap-2 font-bold"
                >
                  <span>
                    {isCourseFree
                      ? isBn
                        ? "ফ্রি ভর্তি"
                        : "Start Free"
                      : isBn
                        ? `এখনই ভর্তি হন (৳ ${course.price})`
                        : `Enroll Now (৳ ${course.price})`}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>

                {/* Free Module Preview Button for Premium Courses */}
                {!isCourseFree && (
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    fullWidth
                    onClick={() => {
                      if (!isLoggedIn) {
                        setIsAuthModalOpen(true);
                      } else {
                        router.push(`/courses/learn/${targetSlug}`);
                      }
                    }}
                    className="gap-2 font-bold border-emerald-600 text-emerald-700 hover:bg-emerald-50 bg-emerald-50/20"
                  >
                    <PlayCircle className="h-4 w-4 text-emerald-600" />
                    <span>
                      {isBn
                        ? "১ম ফ্রি মডিউল দেখুন (লগইন করলেই উন্মুক্ত)"
                        : "Watch Free Module 1 (Free Preview)"}
                    </span>
                  </Button>
                )}
              </div>
            )}

            {/* Features Checklist */}
            <div className="mt-5 space-y-2.5 border-t border-slate-100 pt-4 text-xs text-slate-600">
              <div className="font-bold text-slate-900 text-[11px] uppercase tracking-wider mb-2">
                {isBn ? "এই প্রশিক্ষণে অন্তর্ভুক্ত:" : "This training includes:"}
              </div>
              <div className="flex items-center gap-2">
                <PlayCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>
                  {duration} {isBn ? "অন-ডিমান্ড ভিডিও লেকচার" : "on-demand video lectures"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>
                  {isBn
                    ? "মডিউলভিত্তিক মূল্যায়ন ও কুইজ প্রশ্ন"
                    : "Module assessments & gating quizzes"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>
                  {isBn
                    ? "যাচাইযোগ্য ডিজিটাল কোর্স সমাপ্তি সার্টিফিকেট"
                    : "Official verifiable completion certificate"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>
                  {isBn
                    ? "মোবাইল ও ডেক্সটপে আজীবন অ্যাক্সেস"
                    : "Lifetime access on mobile & desktop"}
                </span>
              </div>
            </div>

            {/* Verification Notice */}
            <div className="mt-5 rounded border border-slate-200 bg-slate-50 p-3 text-center text-[11px] text-slate-600 leading-normal">
              <span>
                {isBn
                  ? "সেইফ এলপিজি একাডেমি ও সহযোগী নিয়ন্ত্রক সংস্থা কর্তৃক অনুমোদিত সনদ।"
                  : "Authorized Certificate issued by Safe LPG Academy."}
              </span>
            </div>

            {/* Social Share Bar */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-center">
              <SocialShareBar
                title={course.title}
                isBn={isBn}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal for Direct Purchase */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        course={course}
        onSuccess={() => {
          setIsCheckoutModalOpen(false);
          router.push(`/courses/learn/${targetSlug}`);
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

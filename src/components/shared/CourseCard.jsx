// src/components/shared/CourseCard.jsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Clock, BookOpen, User, ArrowRight, Eye, CheckCircle, PlayCircle } from "lucide-react";

import { H4, P } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { useDictionary } from "@/context/DictionaryContext";
import { useEnrollCourseMutation } from "@/redux/api/courseApi";
import AuthModal from "@/components/shared/AuthModal";
import CheckoutModal from "@/components/shared/CheckoutModal";

export default function CourseCard({
  courseId = "1",
  id,
  slug,
  isBestSeller = true,
  isPaid = true,
  imageUrl,
  title,
  description,
  duration = "3h 45m",
  lessonsCount = 12,
  level = "Beginner",
  price = "৳ 500",
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

  const cid = courseId || id || "1";
  const courseSlug = slug || cid;
  const detailsHref = href || `/courses/${courseSlug}`;

  const isSubscribed = mounted && Boolean(
    user?.role === "subscriber" ||
    (user?.subscription?.status === "active" &&
      user?.subscription?.planKey !== "course_single" &&
      (!user?.subscription?.expiresAt ||
        new Date(user.subscription.expiresAt) > new Date())) ||
    ["super_admin", "admin", "instructor", "course_admin", "editor"].includes(user?.role)
  );

  const isEnrolled = mounted && Boolean(
    user?.enrolledCourses?.some(
      (e) =>
        e.courseId === cid ||
        e.courseId === String(cid) ||
        e.courseId === courseSlug
    )
  );

  const hasAccess = isEnrolled || isSubscribed;

  const handleEnroll = async () => {
    if (hasAccess) {
      router.push(`/courses/learn/${courseSlug}`);
      return;
    }

    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }

    if (isPaid) {
      setIsCheckoutModalOpen(true);
      return;
    }

    try {
      await enrollCourse(cid).unwrap();
      toast.success(
        isBn
          ? "সফলভাবে ফ্রি কোর্সে এনরোল সম্পন্ন হয়েছে!"
          : "Successfully enrolled in this course!"
      );
      router.push("/user-dashboard/courses");
    } catch (err) {
      toast.error(err?.data?.message || "Enrollment failed");
    }
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
          router.push("/user-dashboard/courses");
        })
        .catch((err) => toast.error(err?.data?.message || "Enrollment failed"));
    }
  };

  return (
    <>
      <div className="group overflow-hidden rounded-xl border border-slate-200/80 bg-white/90 p-4 backdrop-blur-md transition-colors duration-200 hover:border-primary/50 hover:bg-white flex flex-col justify-between">
        <div>
          {/* Thumbnail with floating badges */}
          <Link href={detailsHref} className="block relative aspect-16/10 w-full overflow-hidden rounded-lg bg-slate-100">
            <Image
              src={imageUrl || "/default_image.jpg"}
              alt={title || "Course thumbnail"}
              fill
              sizes="(max-width: 768px) 100vw, 35vw"
              className="object-cover"
              onError={(e) => {
                e.currentTarget.src = "/default_image.jpg";
              }}
            />

            {isBestSeller && (
              <span className="absolute right-2.5 top-2.5 rounded-md bg-emerald-600 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-xs">
                Best Seller
              </span>
            )}

            <span
              className={`absolute bottom-2.5 left-2.5 rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-xs ${
                isPaid ? "bg-primary" : "bg-emerald-600"
              }`}
            >
              {isPaid ? "Paid Course" : "Free Course"}
            </span>
          </Link>

          {/* Content */}
          <div className="mt-3.5 flex flex-col">
            <Link href={detailsHref}>
              <H4 className="transition-colors group-hover:text-primary line-clamp-1">
                {title}
              </H4>
            </Link>

            <P size="xs" className="mt-1 line-clamp-2">
              {description}
            </P>

            {/* Specs row */}
            <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] font-medium text-slate-500">
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <span>{duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                <span>{lessonsCount} Lessons</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-slate-400" />
                <span>{level}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Price & Action: 2 Buttons */}
        <div className="mt-4 border-t border-slate-100 pt-3">
          <div className="mb-2 text-base font-black text-slate-900 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500" suppressHydrationWarning>
              {isSubscribed ? (isBn ? "অ্যাক্সেস:" : "Access:") : isPaid ? (isBn ? "কোর্স ফি:" : "Course Fee:") : (isBn ? "ফি:" : "Fee:")}
            </span>
            <span className={isSubscribed ? "text-emerald-600 text-xs font-bold" : isPaid ? "text-primary" : "text-emerald-600"} suppressHydrationWarning>
              {isSubscribed ? (isBn ? "সাবস্ক্রিপশনে অন্তর্ভুক্ত" : "Included with Subscription") : price}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {/* Button 1: View Details */}
            <LinkButton
              href={detailsHref}
              variant="secondary"
              size="sm"
              className="gap-1.5 text-xs font-bold text-slate-700 hover:text-primary"
            >
              <Eye className="h-3.5 w-3.5 text-slate-400" />
              <span>{isBn ? "বিস্তারিত" : "Details"}</span>
            </LinkButton>

            {/* Button 2: View & Play Now or Enroll */}
            {hasAccess ? (
              <LinkButton
                href={`/courses/learn/${courseSlug}`}
                variant="primary"
                size="sm"
                className="gap-1.5 font-bold text-xs shadow-xs"
              >
                <PlayCircle className="h-3.5 w-3.5" />
                <span>{isBn ? "ক্লাসরুমে দেখুন ও প্লে করুন" : "View & Play Now"}</span>
              </LinkButton>
            ) : (
              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={handleEnroll}
                disabled={isEnrolling}
                className="gap-1.5 font-bold shadow-2xs"
              >
                <span>{isPaid ? (isBn ? "এনরোল" : "Enroll") : (isBn ? "ফ্রি এনরোল" : "Enroll Free")}</span>
                <ArrowRight className="h-3.5 w-3.5" />
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
          title,
          price:
            typeof price === "number"
              ? price
              : parseInt(String(price).replace(/[^0-9]/g, ""), 10) || 500,
        }}
        onSuccess={() => {
          setIsCheckoutModalOpen(false);
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

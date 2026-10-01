// src/components/shared/CourseCard.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import { Clock, BookOpen, User, ArrowRight, Eye, CheckCircle } from "lucide-react";

import { H4, P } from "@/components/ui/Typography";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { useDictionary } from "@/context/DictionaryContext";
import { useEnrollCourseMutation } from "@/redux/api/courseApi";
import AuthModal from "@/components/shared/AuthModal";

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

  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [enrollCourse, { isLoading: isEnrolling }] = useEnrollCourseMutation();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const cid = courseId || id || "1";
  const courseSlug = slug || cid;
  const detailsHref = href || `/courses/${courseSlug}`;

  const isEnrolled = user?.enrolledCourses?.some(
    (e) => e.courseId === cid || e.courseId === String(cid)
  );

  const handleEnroll = async () => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }

    if (isEnrolled) {
      router.push("/subscriber/courses");
      return;
    }

    if (isPaid) {
      router.push(`/checkout?courseId=${cid}`);
      return;
    }

    try {
      await enrollCourse(cid).unwrap();
      toast.success(
        isBn
          ? "সফলভাবে ফ্রি কোর্সে এনরোল সম্পন্ন হয়েছে!"
          : "Successfully enrolled in this course!"
      );
      router.push("/subscriber/courses");
    } catch (err) {
      toast.error(err?.data?.message || "Enrollment failed");
    }
  };

  const handleAuthSuccess = () => {
    if (isPaid) {
      router.push(`/checkout?courseId=${cid}`);
    } else {
      enrollCourse(cid)
        .unwrap()
        .then(() => {
          toast.success(
            isBn
              ? "সফলভাবে ফ্রি কোর্সে এনরোল সম্পন্ন হয়েছে!"
              : "Successfully enrolled in this course!"
          );
          router.push("/subscriber/courses");
        })
        .catch((err) => toast.error(err?.data?.message || "Enrollment failed"));
    }
  };

  return (
    <>
      <div className="group overflow-hidden rounded-xl border border-slate-200/80 bg-white/90 p-4 backdrop-blur-md transition-all duration-200 hover:border-primary/50 hover:bg-white hover:shadow-xs flex flex-col justify-between">
        <div>
          {/* Thumbnail with floating badges */}
          <Link href={detailsHref} className="block relative aspect-16/10 w-full overflow-hidden rounded-lg bg-slate-100">
            <Image
              src={
                imageUrl ||
                "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop"
              }
              alt={title || "Course thumbnail"}
              fill
              sizes="(max-width: 768px) 100vw, 35vw"
              className="object-cover"
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
            <span className="text-xs font-semibold text-slate-500">
              {isPaid ? (isBn ? "কোর্স ফি:" : "Course Fee:") : (isBn ? "ফি:" : "Fee:")}
            </span>
            <span className={isPaid ? "text-primary" : "text-emerald-600"}>
              {price}
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

            {/* Button 2: Enroll Now */}
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

      {/* Auth Modal for Unauthenticated Users */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}

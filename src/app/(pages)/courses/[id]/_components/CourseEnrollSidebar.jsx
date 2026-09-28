// src/app/(pages)/courses/[id]/_components/CourseEnrollSidebar.jsx
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

export default function CourseEnrollSidebar({ course, isFree }) {
  const router = useRouter();
  const { locale } = useDictionary();
  const isBn = locale === "bn";

  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const [enrollCourse, { isLoading: isEnrolling }] = useEnrollCourseMutation();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const cid = course.courseId;
  const title = isBn ? course.titleBn || course.title : course.title;
  const duration = isBn ? course.durationBn || course.duration : course.duration;

  const isEnrolled = user?.enrolledCourses?.some(
    (e) => e.courseId === cid
  );

  const handleEnrollClick = async () => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      return;
    }

    if (isEnrolled) {
      router.push(`/subscriber/courses`);
      return;
    }

    if (!isFree) {
      router.push(`/checkout?courseId=${cid}`);
      return;
    }

    try {
      await enrollCourse(cid).unwrap();
      toast.success(
        isBn
          ? "অভিনন্দন! আপনি সফলভাবে এই কোর্সে এনরোল করেছেন।"
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

  const handleAuthSuccess = () => {
    if (!isFree) {
      router.push(`/checkout?courseId=${cid}`);
    } else {
      enrollCourse(cid)
        .unwrap()
        .then(() => {
          toast.success(
            isBn
              ? "অভিনন্দন! আপনি সফলভাবে এই কোর্সে এনরোল করেছেন।"
              : "Successfully enrolled in this course!"
          );
          router.push(`/subscriber/courses`);
        })
        .catch((err) => {
          toast.error(err?.data?.message || "Enrollment failed.");
        });
    }
  };

  return (
    <>
      <div className="lg:col-span-4 sticky top-24">
        <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-md">
          {/* Media Preview Box (Front panel outline preview) */}
          <div className="relative aspect-16/9 w-full bg-slate-900">
            <Image
              src={
                course.imageUrl ||
                "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop"
              }
              alt={title}
              fill
              className="object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-slate-950/40 flex flex-col items-center justify-center text-white p-4 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md mb-1">
                <Lock className="h-3.5 w-3.5 text-secondary" />
                <span>{isBn ? "সুরক্ষিত ক্লাসরুম" : "Protected Classroom"}</span>
              </span>
              <p className="text-[11px] text-white/80">
                {isBn
                  ? "এনরোলমেন্ট সম্পন্ন করে ড্যাশবোর্ড থেকে ভিডিও লেকচার দেখুন"
                  : "Enroll to access interactive HD lessons & classroom notes"}
              </p>
            </div>
            <span className="absolute bottom-2 right-2 rounded bg-slate-950/80 px-2 py-0.5 text-[10px] font-bold text-white">
              {course.category || (isBn ? "নিরাপত্তা কোর্স" : "Safety Course")}
            </span>
          </div>

          {/* Price & Action */}
          <div className="p-4 sm:p-5">
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-2xl font-black text-slate-900">
                {isFree ? (isBn ? "ফ্রি" : "FREE") : `৳ ${course.price}`}
              </span>
              {!isFree && (
                <span className="text-xs text-slate-400 line-through">
                  ৳ ১,২০০
                </span>
              )}
              <span className="ml-auto rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold">
                {isFree
                  ? isBn
                    ? "১০০% স্কলারশিপ"
                    : "100% Scholarship"
                  : isBn
                    ? "বিশেষ ৫৮% ছাড়"
                    : "Special 58% Off"}
              </span>
            </div>

            {/* Main Action Button */}
            {isEnrolled ? (
              <LinkButton
                href="/subscriber/courses"
                variant="secondary"
                size="lg"
                fullWidth
                className="gap-2 bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 font-bold shadow-xs"
              >
                <CheckCircle className="h-4 w-4 text-emerald-600" />
                <span>
                  {isBn ? "এনরোল্ড আছেন (ক্লাসরুমে যান)" : "Enrolled (Go to Classroom)"}
                </span>
              </LinkButton>
            ) : (
              <Button
                type="button"
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleEnrollClick}
                disabled={isEnrolling}
                className="gap-2 font-bold shadow-xs"
              >
                <span>
                  {isFree
                    ? isBn
                      ? "বিনামূল্যে এনরোল করুন"
                      : "Enroll for Free"
                    : isBn
                      ? `এখনই ভর্তি হন (৳ ${course.price})`
                      : `Enroll Now (৳ ${course.price})`}
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}

            {/* Features Checklist */}
            <div className="mt-5 space-y-2.5 border-t border-slate-100 pt-4 text-xs text-slate-600">
              <div className="font-bold text-slate-900 text-[11px] uppercase tracking-wider mb-2">
                {isBn ? "এই প্রশিক্ষণে অন্তর্ভুক্ত রয়েছে:" : "This training includes:"}
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
                    ? "৩টি ডাউনলোডযোগ্য নিরাপত্তা নির্দেশিকা গাইড"
                    : "3 Downloadable safety reference guides"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>
                  {isBn
                    ? "যাচাইযোগ্য ডিজিটাল কোর্স সমাপ্তি সার্টিফিকেট"
                    : "Official verifiable certificate of completion"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
                <span>
                  {isBn
                    ? "মোবাইল ও ডেক্সটপে আজীবন লাইফটাইম অ্যাক্সেস"
                    : "Full lifetime access across mobile & desktop"}
                </span>
              </div>
            </div>

            {/* Verification Notice */}
            <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-3 text-center text-[11px] text-slate-500">
              <span>
                {isBn
                  ? "সেইফ এলপিজি এবং সহযোগী নিয়ন্ত্রক সংস্থা কর্তৃক অনুমোদিত সার্টিফিকেট।"
                  : "Authorized Certificate issued by Safe LPG & Partner Regulatory Bodies."}
              </span>
            </div>
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

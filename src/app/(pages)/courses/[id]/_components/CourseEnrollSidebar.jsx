import Image from "next/image";
import Link from "next/link";
import {
  PlayCircle,
  ArrowRight,
  FileText,
  Award,
  ShieldCheck,
} from "lucide-react";

export default function CourseEnrollSidebar({ course, isFree }) {
  return (
    <div className="lg:col-span-4 sticky top-24">
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-md">
        {/* Media Preview */}
        <div className="relative aspect-16/9 w-full bg-slate-900">
          <Image
            src={course.imageUrl}
            alt={course.title}
            fill
            className="object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
            <Link
              href={`/courses/learn/${course.id}`}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg transition-transform hover:scale-110"
              title="Start Learning / Preview Video"
            >
              <PlayCircle className="h-6 w-6" />
            </Link>
          </div>
        </div>

        {/* Price & Action */}
        <div className="p-4 sm:p-5">
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-2xl font-black text-slate-900">
              {isFree ? "FREE" : `৳ ${course.price}`}
            </span>
            {!isFree && (
              <span className="text-xs text-slate-400 line-through">
                ৳ 1,200
              </span>
            )}
          </div>

          {isFree ? (
            <Link
              href={`/courses/learn/${course.id}`}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-3 text-xs font-bold text-white hover:bg-primary/90 transition-colors shadow-xs"
            >
              <span>Start Learning Free</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <Link
              href={`/checkout?courseId=${course.id}`}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 py-3 text-xs font-bold text-white hover:bg-emerald-700 transition-colors shadow-xs"
            >
              <span>Enroll Now (৳ {course.price})</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}

          <div className="mt-3 text-center">
            <Link
              href={`/courses/${course.id}/quiz`}
              className="text-xs font-bold text-primary hover:underline"
            >
              Already completed? Take Assessment Quiz →
            </Link>
          </div>

          {/* Features Checklist */}
          <div className="mt-5 space-y-2.5 border-t border-slate-100 pt-4 text-xs text-slate-600">
            <div className="font-bold text-slate-900 text-[11px] uppercase tracking-wider mb-2">
              This training includes:
            </div>
            <div className="flex items-center gap-2">
              <PlayCircle className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>{course.duration} on-demand video lectures</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>3 Downloadable safety reference guides</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
              <span>Official verifiable certificate of completion</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-primary shrink-0" />
              <span>Full lifetime access across mobile &amp; desktop</span>
            </div>
          </div>

          {/* Verification Notice */}
          <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-3 text-center text-[11px] text-slate-500">
            <span>Authorized Certificate issued by Safe LPG &amp; Partner Regulatory Bodies.</span>
          </div>
        </div>
      </div>
    </div>
  );
}

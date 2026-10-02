// src/app/(dashboard)/subscriber/courses/_components/SubscriberCourseCard.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  FaPlayCircle,
  FaQuestionCircle,
  FaAward,
  FaCheckCircle,
} from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { H3, P } from "@/components/ui/Typography";

export default function SubscriberCourseCard({ course }) {
  const cid = course.courseId || course.id;
  const courseSlug = course.slug || cid;
  const progress = course.enrollment?.progressPercent || 0;
  const isCompleted = progress >= 100;

  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200/80 bg-white">
      <Link href={`/courses/learn/${courseSlug}`} className="block relative aspect-16/10 w-full overflow-hidden bg-slate-100">
        <Image
          src={course.imageUrl || "/default_image.jpg"}
          alt={course.title}
          fill
          className="object-cover"
          onError={(e) => {
            e.currentTarget.src = "/default_image.jpg";
          }}
        />
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
          <span className="rounded bg-slate-950/80 px-2 py-0.5 text-[9px] font-bold text-white">
            {course.category || "Safety Training"}
          </span>
          {isCompleted && (
            <span className="flex items-center gap-1 rounded bg-emerald-600 px-2 py-0.5 text-[9px] font-bold text-white">
              <FaCheckCircle className="h-2.5 w-2.5" />
              <span>Completed</span>
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          <Link href={`/courses/learn/${courseSlug}`}>
            <H3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 hover:text-primary transition-colors">
              {course.title}
            </H3>
          </Link>
          <P className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {course.description}
          </P>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-100 space-y-3">
          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-medium text-slate-500">
              <span>Course Completion</span>
              <span className="font-bold text-slate-800">{progress}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isCompleted ? "bg-secondary" : "bg-primary"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            <LinkButton
              href={`/courses/learn/${courseSlug}`}
              variant="primary"
              size="sm"
              fullWidth
              className="gap-2"
            >
              <FaPlayCircle className="h-4 w-4" />
              <span>
                {isCompleted
                  ? "Rewatch Classroom Player"
                  : "Continue Video Lessons"}
              </span>
            </LinkButton>

            <div className="flex items-center gap-2">
              <LinkButton
                href={`/courses/${courseSlug}/quiz`}
                variant="outline"
                size="sm"
                className="flex-1 gap-1.5 text-slate-700"
              >
                <FaQuestionCircle className="h-3 w-3 text-slate-400" />
                <span>Assessment Quiz</span>
              </LinkButton>

              {isCompleted && (
                <LinkButton
                  href="/subscriber/certificates"
                  variant="secondary"
                  size="sm"
                  className="gap-1.5 border-secondary/30 bg-secondary/10 text-secondary hover:bg-secondary/20 font-bold"
                  title="View Earned Certificate"
                >
                  <FaAward className="h-3.5 w-3.5 text-secondary" />
                  <span>Certificate</span>
                </LinkButton>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

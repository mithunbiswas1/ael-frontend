// src/app/(dashboard)/profile/_components/ProfileCoursesCard.jsx
"use client";

import { FaGraduationCap } from "react-icons/fa";
import { LinkButton } from "@/components/ui/LinkButton";
import { H4, P } from "@/components/ui/Typography";

export default function ProfileCoursesCard({ coursesCount = 0, isBn }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
            <FaGraduationCap className="h-4 w-4" />
          </div>
          <div>
            <H4 className="text-xs font-bold text-slate-900">
              {isBn ? "এনরোল্ড কোর্স" : "Enrolled Courses"}
            </H4>
            <P className="text-[11px] text-slate-500">
              {coursesCount} {isBn ? "টি সক্রিয় কোর্স" : "active courses"}
            </P>
          </div>
        </div>
      </div>

      <LinkButton
        href="/subscriber/courses"
        variant="secondary"
        size="sm"
        fullWidth
      >
        <span>{isBn ? "কোর্স ড্যাশবোর্ডে যান" : "Go to Courses"}</span>
      </LinkButton>
    </div>
  );
}

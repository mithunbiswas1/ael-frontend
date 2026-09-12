// src/app/(pages)/courses/_components/CoursesHeroSection.jsx
import { ArrowRight, GraduationCap, Clock, HelpCircle, Award } from "lucide-react";
import SharedHeroSection from "@/components/shared/SharedHeroSection";

export default function CoursesHeroSection() {
  return (
    <SharedHeroSection
      variant="main"
      breadcrumbItems={[
        { label: "Home", href: "/" },
        { label: "Training & Quiz" },
      ]}
      title="TRAINING &"
      accent="QUIZ."
      description="Industry-aligned LPG safety training for regular consumers, commercial dealers, and industrial operators. Learn at your own pace, take the quiz, and earn your verified certificate."
      buttons={[
        {
          label: "Browse Courses Below",
          href: "#catalog",
          variant: "primary",
          icon: ArrowRight,
        },
      ]}
      imageSrc="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop"
      imageAlt="Digital LPG Safety Training Academy"
    >
      {/* 4 Feature Badges */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-1">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary/20 text-secondary border border-secondary/30">
            <GraduationCap className="h-4 w-4" />
          </div>
          <span className="text-[11px]">Expert Courses</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary/20 text-secondary border border-secondary/30">
            <Clock className="h-4 w-4" />
          </div>
          <span className="text-[11px]">Self-Paced</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary/20 text-secondary border border-secondary/30">
            <HelpCircle className="h-4 w-4" />
          </div>
          <span className="text-[11px]">Dynamic Quiz</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-secondary/20 text-secondary border border-secondary/30">
            <Award className="h-4 w-4" />
          </div>
          <span className="text-[11px]">QR Certificate</span>
        </div>
      </div>
    </SharedHeroSection>
  );
}

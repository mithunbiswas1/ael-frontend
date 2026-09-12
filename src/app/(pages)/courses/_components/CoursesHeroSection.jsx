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

      imageSrc="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop"
      imageAlt="Digital LPG Safety Training Academy"
    >

    </SharedHeroSection>
  );
}

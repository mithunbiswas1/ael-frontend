// src/app/(home)/_components/FeaturedTrainingSection.jsx

import CourseCard from "@/components/shared/CourseCard";
import { H2 } from "@/components/ui/Typography";

export default function FeaturedTrainingSection() {
  return (
    <div className="mb-6">
      <div className="mb-4">
        <span className="mb-1.5 inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary backdrop-blur-md">
          E-LEARNING LMS
        </span>
        <H2 className="text-xl sm:text-2xl font-black">
          FEATURED TRAINING <span className="text-primary">&amp; QUIZ.</span>
        </H2>
      </div>

      <CourseCard
        isBestSeller={true}
        isPaid={true}
        imageUrl="https://images.unsplash.com/photo-1581092162384-8987c1d64718?q=80&w=800&auto=format&fit=crop"
        title="LPG Safety Awareness Complete Course"
        description="Learn essential safety practices and regulations for LPG handling and usage."
        duration="3h 45m"
        lessonsCount={12}
        level="Beginner"
        price="৳ 500.00"
        href="/courses/1"
      />
    </div>
  );
}

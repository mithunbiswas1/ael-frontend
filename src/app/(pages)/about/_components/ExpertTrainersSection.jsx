// src/app/(pages)/about/_components/ExpertTrainersSection.jsx
"use client";

import Image from "next/image";
import { H4 } from "@/components/ui/Typography";
import SectionHeader from "@/components/ui/SectionHeader";

const expertTrainers = [
  {
    name: "Engr. Md. Shafiqul Islam",
    role: "Safety & Risk Management",
    bio: "25+ years in LPG safety protocols, risk assessment and hazard mitigation.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "Mst. Nusrat Jahan",
    role: "Environment & Compliance",
    bio: "Specialist in environmental compliance, national regulations and energy safety.",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "Engr. A. K. M. Rakib",
    role: "LPG Operations Specialist",
    bio: "15+ years in plant operations, maintenance engineering and process safety.",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "Md. Kamrul Hasan",
    role: "Fire & Emergency Expert",
    bio: "Specialist in fire safety standards, rapid emergency response and investigation.",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "Dr. Tanvir Ahmed",
    role: "Training & Development",
    bio: "10+ years in technical curriculum design, safety drills and capacity development.",
    imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop",
  },
];

export default function ExpertTrainersSection() {
  return (
    <section className="py-12 sm:py-16 bg-slate-100/60 border-t border-slate-200/60">
      <div className="site-container">
        <SectionHeader
          align="center"
          tag="CONSULTATION POOL"
          title="EXPERT"
          accent="TRAINERS."
          subtitle="Experienced industry veterans dedicated to building skills, hazard mitigation, and practical guidance."
        />

        {/* 5 Trainers Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {expertTrainers.map((trainer, idx) => (
            <div
              key={idx}
              className="flex flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs transition-colors duration-200 hover:border-primary/50"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                <Image
                  src={trainer.imageUrl}
                  alt={trainer.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col p-3.5 text-center">
                <H4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                  {trainer.name}
                </H4>
                <span className="mt-0.5 text-[10px] font-bold text-primary">
                  {trainer.role}
                </span>
                <p className="mt-2 text-[11px] leading-relaxed text-slate-500 line-clamp-3">
                  {trainer.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

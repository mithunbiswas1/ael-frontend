// src/app/(pages)/about/_components/MissionVisionSection.jsx

import { Target, Compass } from "lucide-react";
import { H3 } from "@/components/ui/Typography";
import SectionHeader from "@/components/ui/SectionHeader";

export default function MissionVisionSection() {
  return (
    <section className="pb-12 sm:pb-16">
      <div className="site-container">
        <SectionHeader
          align="center"
          tag="CORE FOUNDATION"
          title="MISSION &"
          accent="VISION."
          subtitle="Guiding the future of clean energy handling and incident-free LPG adoption."
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Mission Card */}
          <div className="flex items-start gap-4 rounded-xl border border-slate-200/80 bg-white/95 p-6 shadow-xs transition-colors duration-200 hover:border-primary/50">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-primary border border-blue-100">
              <Target className="h-6 w-6" strokeWidth={2} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                OUR MISSION
              </span>
              <H3 className="mt-0.5 text-base sm:text-lg font-black text-slate-900">
                Mission
              </H3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                To promote LPG safety awareness and best practices through education, training,
                information sharing and collaboration, ensuring the protection of lives, property
                and the environment across Bangladesh.
              </p>
            </div>
          </div>

          {/* Vision Card */}
          <div className="flex items-start gap-4 rounded-xl border border-slate-200/80 bg-white/95 p-6 shadow-xs transition-colors duration-200 hover:border-emerald-500/50">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Compass className="h-6 w-6" strokeWidth={2} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                OUR VISION
              </span>
              <H3 className="mt-0.5 text-base sm:text-lg font-black text-slate-900">
                Vision
              </H3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                To be the leading platform for LPG safety and awareness in Bangladesh,
                contributing to a sustainable, safe and responsible energy future for all consumers
                and industrial users.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

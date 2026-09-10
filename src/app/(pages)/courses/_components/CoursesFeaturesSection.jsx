import { PlaySquare, HelpCircle, CheckCircle2, Award, Clock } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { H4 } from "@/components/ui/Typography";

const features = [
  {
    icon: PlaySquare,
    title: "Video Lessons",
    description: "High-quality video lessons with modular chapter progress tracking.",
  },
  {
    icon: HelpCircle,
    title: "Quiz Engine",
    description: "Randomized questions dynamically curated from nationwide banks.",
  },
  {
    icon: CheckCircle2,
    title: "Instant Results",
    description: "Immediate score breakdown and review upon quiz submission.",
  },
  {
    icon: Award,
    title: "Certificates",
    description: "Official downloadable PDF with verifiable unique QR code.",
  },
  {
    icon: Clock,
    title: "Resume Anytime",
    description: "Continue seamlessly across desktop, tablet, and mobile devices.",
  },
];

export default function CoursesFeaturesSection() {
  return (
    <section className="py-12 bg-slate-100/60 border-t border-slate-200/60">
      <div className="site-container">
        <SectionHeader
          tag="PLATFORM ADVANTAGES"
          title="KEY"
          accent="FEATURES."
        />

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs transition-colors duration-200 hover:border-primary/40"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <H4 className="mt-3 text-xs font-bold text-slate-900">
                  {feat.title}
                </H4>
                <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

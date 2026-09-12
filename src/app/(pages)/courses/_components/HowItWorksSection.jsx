import { LinkButton } from "@/components/ui/LinkButton";
import { User, BookOpen, HelpCircle, Award } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { H4, P } from "@/components/ui/Typography";

export default function HowItWorksSection() {
  return (
    <section className="py-12 sm:py-16 bg-white border-t border-slate-200/80">
      <div className="site-container">
        <SectionHeader
          tag="CERTIFICATION PATHWAY"
          title="HOW IT"
          accent="WORKS."
          subtitle="Simple 4-step process to complete your module and earn your verified certificate."
        />

        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
          
          {/* 4 Steps (8 cols) */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:col-span-8 md:grid-cols-4">
            {[
              {
                step: "1. Enroll",
                desc: "Select a topic & start immediately.",
                icon: User,
              },
              {
                step: "2. Learn",
                desc: "Watch lessons & read guidelines.",
                icon: BookOpen,
              },
              {
                step: "3. Quiz",
                desc: "Pass the randomized safety quiz.",
                icon: HelpCircle,
              },
              {
                step: "4. Certify",
                desc: "Instant QR-coded PDF certificate.",
                icon: Award,
              },
            ].map((s, idx) => {
              const Icon = s.icon;
              return (
                <div
                  key={idx}
                  className="flex flex-col items-start rounded-xl border border-slate-200/80 bg-slate-50/70 p-4"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <H4 uppercase className="mt-3 text-xs font-black tracking-wider">
                    {s.step}
                  </H4>
                  <P size="xs" className="mt-1">
                    {s.desc}
                  </P>
                </div>
              );
            })}
          </div>

          {/* Right Card: Your Progress (4 cols) */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-5 lg:col-span-4">
            <H4 uppercase color="gray" className="text-xs font-bold tracking-wider">
              Your Learning Status
            </H4>
            <P size="xs">
              Track your active course progress
            </P>

            <div className="mt-4 flex items-center gap-3.5">
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-emerald-500 bg-white font-black text-emerald-600 text-sm shadow-xs">
                65%
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">
                  Active Module
                </div>
                <div className="text-xs font-bold text-slate-800 line-clamp-1">
                  LPG Safety for Regular Consumers
                </div>
              </div>
            </div>

            <LinkButton
              href="/login"
              variant="primary"
              size="sm"
              fullWidth
              className="mt-4"
            >
              Login to Resume
            </LinkButton>
          </div>

        </div>
      </div>
    </section>
  );
}

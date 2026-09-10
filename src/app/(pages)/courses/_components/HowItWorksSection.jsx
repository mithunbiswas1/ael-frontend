import Link from "next/link";
import { User, BookOpen, HelpCircle, Award } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { H4 } from "@/components/ui/Typography";

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
                  <H4 className="mt-3 text-xs font-black uppercase tracking-wider text-slate-900">
                    {s.step}
                  </H4>
                  <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Card: Your Progress (4 cols) */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-5 lg:col-span-4">
            <H4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Your Learning Status
            </H4>
            <p className="text-[11px] text-slate-500">
              Track your active course progress
            </p>

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

            <Link
              href="/login"
              className="mt-4 block w-full rounded-lg bg-primary py-2 text-center text-xs font-bold text-white transition-colors hover:bg-blue-700 shadow-xs"
            >
              Login to Resume
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}

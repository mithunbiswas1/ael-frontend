// src/app/(pages)/courses/_components/HowItWorksSection.jsx
"use client";

import { LinkButton } from "@/components/ui/LinkButton";
import { User, BookOpen, HelpCircle, Award } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { H4, P } from "@/components/ui/Typography";
import { useDictionary } from "@/context/DictionaryContext";

export default function HowItWorksSection() {
  const { locale } = useDictionary();
  const isBn = locale === "bn";

  const steps = [
    {
      step: isBn ? "১. ভর্তি হন" : "1. Enroll",
      desc: isBn ? "পছন্দের বিষয় নির্বাচন করে সাথে সাথে শুরু করুন।" : "Select a topic & start immediately.",
      icon: User,
    },
    {
      step: isBn ? "২. শিখুন" : "2. Learn",
      desc: isBn ? "ভিডিও পাঠ দেখুন এবং নির্দেশিকা পড়ুন।" : "Watch lessons & read guidelines.",
      icon: BookOpen,
    },
    {
      step: isBn ? "৩. কুইজ" : "3. Quiz",
      desc: isBn ? "র‍্যান্ডমাইজড নিরাপত্তা কুইজে উত্তীর্ণ হন।" : "Pass the randomized safety quiz.",
      icon: HelpCircle,
    },
    {
      step: isBn ? "৪. সনদ পান" : "4. Certify",
      desc: isBn ? "তাৎক্ষণিক কিউআর কোডযুক্ত পিডিএফ সার্টিফিকেট পান।" : "Instant QR-coded PDF certificate.",
      icon: Award,
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white border-t border-slate-200/80">
      <div className="site-container">
        <SectionHeader
          tag={isBn ? "সার্টিফিকেশন প্রক্রিয়া" : "CERTIFICATION PATHWAY"}
          title={isBn ? "কীভাবে" : "HOW IT"}
          accent={isBn ? "কাজ করে।" : "WORKS."}
          subtitle={
            isBn
              ? "আপনার মডিউল সম্পন্ন করতে এবং যাচাইকৃত সনদ অর্জন করতে সহজ ৪টি ধাপ।"
              : "Simple 4-step process to complete your module and earn your verified certificate."
          }
        />

        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
          {/* 4 Steps (8 cols) */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:col-span-8 md:grid-cols-4">
            {steps.map((s, idx) => {
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
              {isBn ? "আপনার শিক্ষার অগ্রগতি" : "Your Learning Status"}
            </H4>
            <P size="xs">
              {isBn ? "চলমান কোর্সের অগ্রগতি দেখুন" : "Track your active course progress"}
            </P>

            <div className="mt-4 flex items-center gap-3.5">
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-emerald-500 bg-white font-black text-emerald-600 text-sm shadow-xs">
                ৬৫%
              </div>
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">
                  {isBn ? "চলমান মডিউল" : "Active Module"}
                </div>
                <div className="text-xs font-bold text-slate-800 line-clamp-1">
                  {isBn
                    ? "সাধারণ ভোক্তাদের জন্য এলপিজি নিরাপত্তা"
                    : "LPG Safety for Regular Consumers"}
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
              {isBn ? "লগইন করে পুনরায় শুরু করুন" : "Login to Resume"}
            </LinkButton>
          </div>
        </div>
      </div>
    </section>
  );
}

// src/app/(pages)/courses/_components/HowItWorksSection.jsx
"use client";

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
      desc: isBn
        ? "পছন্দের বিষয় নির্বাচন করে সাথে সাথে শুরু করুন।"
        : "Select a topic & start immediately.",
      icon: User,
    },
    {
      step: isBn ? "২. শিখুন" : "2. Learn",
      desc: isBn
        ? "ভিডিও পাঠ দেখুন এবং নির্দেশিকা পড়ুন।"
        : "Watch lessons & read guidelines.",
      icon: BookOpen,
    },
    {
      step: isBn ? "৩. কুইজ" : "3. Quiz",
      desc: isBn
        ? "র‍্যান্ডমাইজড নিরাপত্তা কুইজে উত্তীর্ণ হন।"
        : "Pass the randomized safety quiz.",
      icon: HelpCircle,
    },
    {
      step: isBn ? "৪. সনদ পান" : "4. Certify",
      desc: isBn
        ? "তাৎক্ষণিক কিউআর কোডযুক্ত পিডিএফ সার্টিফিকেট পান।"
        : "Instant QR-coded PDF certificate.",
      icon: Award,
    },
  ];

  return (
    <section className="py-12 bg-slate-100/60 border-t border-slate-200/60">
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

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-4">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs transition-colors duration-200 hover:border-primary/40"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <H4 className="mt-3 text-xs">
                  {s.step}
                </H4>
                <P size="xs" className="mt-1">
                  {s.desc}
                </P>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

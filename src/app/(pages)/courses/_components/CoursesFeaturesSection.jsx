// src/app/(pages)/courses/_components/CoursesFeaturesSection.jsx
"use client";

import { PlaySquare, HelpCircle, CheckCircle2, Award, Clock } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { H4, P } from "@/components/ui/Typography";
import { useDictionary } from "@/context/DictionaryContext";

export default function CoursesFeaturesSection() {
  const { locale } = useDictionary();
  const isBn = locale === "bn";

  const features = [
    {
      icon: PlaySquare,
      title: isBn ? "ভিডিও পাঠ" : "Video Lessons",
      description: isBn
        ? "অধ্যায়ভিত্তিক অগ্রগতি ট্র্যাকিং সহ উচ্চমানের স্পষ্ট ভিডিও লেকচার।"
        : "High-quality video lessons with modular chapter progress tracking.",
    },
    {
      icon: HelpCircle,
      title: isBn ? "কুইজ ইঞ্জিন" : "Quiz Engine",
      description: isBn
        ? "জাতীয় প্রশ্নব্যাংক থেকে কিউরেটেড র‍্যান্ডমাইজড মূল্যায়ন প্রশ্ন।"
        : "Randomized questions dynamically curated from nationwide banks.",
    },
    {
      icon: CheckCircle2,
      title: isBn ? "তাৎক্ষণিক ফলাফল" : "Instant Results",
      description: isBn
        ? "কুইজ জমা দেওয়ার সাথে সাথে বিস্তারিত স্কোর ও পর্যালোচনা দেখার সুযোগ।"
        : "Immediate score breakdown and review upon quiz submission.",
    },
    {
      icon: Award,
      title: isBn ? "যাচাইযোগ্য সনদ" : "Certificates",
      description: isBn
        ? "অনন্য কিউআর কোডযুক্ত অফিশিয়াল ও বৈধ ডাউনলোডযোগ্য পিডিএফ সনদ।"
        : "Official downloadable PDF with verifiable unique QR code.",
    },
    {
      icon: Clock,
      title: isBn ? "যেকোনো সময় শুরু" : "Resume Anytime",
      description: isBn
        ? "ডেস্কটপ, ট্যাবলেট বা মোবাইল থেকে নিরবচ্ছিন্নভাবে কোর্স চালিয়ে যান।"
        : "Continue seamlessly across desktop, tablet, and mobile devices.",
    },
  ];

  return (
    <section className="py-12 bg-slate-100/60 border-t border-slate-200/60">
      <div className="site-container">
        <SectionHeader
          tag={isBn ? "প্ল্যাটফর্মের সুবিধাসমূহ" : "PLATFORM ADVANTAGES"}
          title={isBn ? "মূল" : "KEY"}
          accent={isBn ? "বৈশিষ্ট্য।" : "FEATURES."}
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
                <H4 className="mt-3 text-xs">
                  {feat.title}
                </H4>
                <P size="xs" className="mt-1">
                  {feat.description}
                </P>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

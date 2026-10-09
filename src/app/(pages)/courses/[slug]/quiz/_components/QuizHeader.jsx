import Link from "next/link";
import { ArrowLeft, Clock, Layers } from "lucide-react";
import { H1, P } from "@/components/ui/Typography";
import AmbientGlow from "@/components/ui/AmbientGlow";

export default function QuizHeader({ courseId, courseSlug, isSubmitted, timeString, isBn, setName, setNameBn }) {
  const targetSlug = courseSlug || courseId;
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 pb-14 pt-10 text-white">
      <AmbientGlow />

      <div className="site-container relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <Link
                href={`/courses/learn/${targetSlug}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>{isBn ? "ক্লাসরুমে ফিরে যান" : "Return to Classroom"}</span>
              </Link>

              {setName && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  <Layers className="h-3 w-3" />
                  <span>{isBn ? `প্রশ্ন সেট: ${setNameBn || setName}` : `Assessment: ${setName}`}</span>
                </span>
              )}
            </div>

            <H1 color="white" className="leading-tight text-xl sm:text-2xl md:text-3xl">
              {isBn ? "অফিসিয়াল এলপিজি নিরাপত্তা মূল্যায়ন" : "Official LPG Safety Assessment"}
            </H1>
            <P size="xs" color="slate400" className="mt-1">
              {isBn
                ? "পাস মার্ক সম্পন্ন হলে অবিলম্বে ডিজিটাল ভেরিফাইড সার্টিফিকেট জেনারেট হবে"
                : "Pass the assessment to immediately receive your official verified certificate"}
            </P>
          </div>

          {/* Timer Badge */}
          {!isSubmitted && (
            <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 text-white">
              <Clock className="h-4 w-4 text-amber-400 animate-pulse" />
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400">
                  {isBn ? "অবশিষ্ট সময়" : "Time Remaining"}
                </div>
                <div className="text-base font-black tracking-wider text-amber-400 font-mono">
                  {timeString}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

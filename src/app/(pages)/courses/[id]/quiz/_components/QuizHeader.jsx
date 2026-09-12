import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import { H1, P } from "@/components/ui/Typography";
import AmbientGlow from "@/components/ui/AmbientGlow";

export default function QuizHeader({ courseId, isSubmitted, timeString }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 pb-14 pt-10 text-white">
      <AmbientGlow />

      <div className="site-container relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link
              href={`/courses/learn/${courseId}`}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition-colors mb-3"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Return to Classroom</span>
            </Link>
            <H1 color="white" className="leading-tight text-xl sm:text-2xl md:text-3xl">
              Official LPG Safety Assessment
            </H1>
            <P size="xs" color="slate400" className="mt-1">
              Pass mark: 80% (4 of 5 correct) • Certificate auto-generated upon passing
            </P>
          </div>

          {/* Timer Badge */}
          {!isSubmitted && (
            <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-4 py-2 text-white">
              <Clock className="h-4 w-4 text-amber-400 animate-pulse" />
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-slate-400">Time Remaining</div>
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

// src/app/(pages)/about/_components/MissionVisionSection.jsx
"use client";

import { Target, Compass } from "lucide-react";
import { H3, P } from "@/components/ui/Typography";
import SectionHeader from "@/components/ui/SectionHeader";
import { useDictionary } from "@/context/DictionaryContext";

export default function MissionVisionSection({ data }) {
  const { locale } = useDictionary();
  const isBn = locale === "bn";

  if (!data) return null;

  const tag = isBn ? data?.tagBn : data?.tag;
  const title = isBn ? data?.titleBn : data?.title;
  const accent = isBn ? data?.accentBn : data?.accent;
  const subtitle = isBn ? data?.subtitleBn : data?.subtitle;

  const missionBadge = isBn ? data?.missionBadgeBn : data?.missionBadge;
  const missionHead = isBn ? data?.missionHeadBn : data?.missionHead;
  const missionText = isBn ? data?.missionBn : data?.mission;

  const visionBadge = isBn ? data?.visionBadgeBn : data?.visionBadge;
  const visionHead = isBn ? data?.visionHeadBn : data?.visionHead;
  const visionText = isBn ? data?.visionBn : data?.vision;

  const hasHeader = tag || title || accent || subtitle;
  const hasMission = missionBadge || missionHead || missionText;
  const hasVision = visionBadge || visionHead || visionText;

  if (!hasHeader && !hasMission && !hasVision) {
    return null;
  }

  return (
    <section className="pb-12 sm:pb-16">
      <div className="site-container">
        {hasHeader && (
          <SectionHeader
            align="center"
            tag={tag || ""}
            title={title || ""}
            accent={accent || ""}
            subtitle={subtitle || ""}
          />
        )}

        {(hasMission || hasVision) && (
          <div className={`grid grid-cols-1 gap-5 ${hasMission && hasVision ? "md:grid-cols-2" : "max-w-xl mx-auto"} ${hasHeader ? "mt-8" : ""}`}>
            {/* Mission Card */}
            {hasMission && (
              <div className="flex items-start gap-4 rounded-xl border border-slate-200/80 bg-white/95 p-6 shadow-xs transition-colors duration-200 hover:border-primary/50">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-primary border border-blue-100">
                  <Target className="h-6 w-6" strokeWidth={2} />
                </div>
                <div>
                  {missionBadge && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                      {missionBadge}
                    </span>
                  )}
                  {missionHead && (
                    <H3 className="mt-0.5 text-base sm:text-lg font-black text-slate-900">
                      {missionHead}
                    </H3>
                  )}
                  {missionText && (
                    <P color="muted" size="sm" className="mt-2 leading-relaxed">
                      {missionText}
                    </P>
                  )}
                </div>
              </div>
            )}

            {/* Vision Card */}
            {hasVision && (
              <div className="flex items-start gap-4 rounded-xl border border-slate-200/80 bg-white/95 p-6 shadow-xs transition-colors duration-200 hover:border-emerald-500/50">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <Compass className="h-6 w-6" strokeWidth={2} />
                </div>
                <div>
                  {visionBadge && (
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                      {visionBadge}
                    </span>
                  )}
                  {visionHead && (
                    <H3 className="mt-0.5 text-base sm:text-lg font-black text-slate-900">
                      {visionHead}
                    </H3>
                  )}
                  {visionText && (
                    <P color="muted" size="sm" className="mt-2 leading-relaxed">
                      {visionText}
                    </P>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

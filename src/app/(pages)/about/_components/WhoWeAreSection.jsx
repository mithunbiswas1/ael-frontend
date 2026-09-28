// src/app/(pages)/about/_components/WhoWeAreSection.jsx
"use client";

import { ShieldCheck, Users, BookOpen, Handshake } from "lucide-react";
import { H4, P } from "@/components/ui/Typography";
import SectionHeader from "@/components/ui/SectionHeader";
import { useDictionary } from "@/context/DictionaryContext";

const ICONS = [ShieldCheck, Users, BookOpen, Handshake];

export default function WhoWeAreSection({ data }) {
  const { locale } = useDictionary();
  const isBn = locale === "bn";

  if (!data) return null;

  const tag = isBn ? data?.tagBn : data?.tag;
  const headline = isBn ? data?.titleBn : data?.title;
  const accent = isBn ? data?.accentBn : data?.accent;
  const lead = isBn ? data?.leadTextBn : data?.leadText;
  const narrative = isBn ? data?.paragraphsBn : data?.paragraphs;
  const rawFeatures = data?.features || [];

  const hasHeader = tag || headline || accent;
  const hasText = lead || narrative;
  const hasFeatures = rawFeatures.length > 0;

  if (!hasHeader && !hasText && !hasFeatures) {
    return null;
  }

  const features = rawFeatures.map((f, i) => ({
    icon: ICONS[i % ICONS.length] || ShieldCheck,
    title: (isBn ? f.titleBn : f.title) || f.title || "",
    description: (isBn ? f.descBn : f.desc) || f.desc || f.description || "",
  }));

  return (
    <section className="py-12 sm:py-16">
      <div className="site-container">
        <div className={`grid grid-cols-1 items-start gap-8 ${hasFeatures ? "lg:grid-cols-12 lg:gap-10" : "max-w-3xl mx-auto"}`}>
          {/* Left Content */}
          <div className={hasFeatures ? "lg:col-span-6" : "w-full"}>
            {hasHeader && (
              <SectionHeader
                tag={tag || ""}
                title={headline || ""}
                accent={accent || ""}
              />
            )}

            <div className="mt-5 space-y-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
              {lead && (
                <P color="muted" size="sm">
                  {lead}
                </P>
              )}
              {narrative && (
                <P color="muted" size="sm">
                  {narrative}
                </P>
              )}
            </div>
          </div>

          {/* Right Feature Grid */}
          {hasFeatures && (
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:col-span-6">
              {features.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200/80 bg-white/95 p-4 sm:p-5 shadow-xs transition-colors duration-200 hover:border-primary/50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20 shadow-xs">
                      <Icon className="h-5 w-5" strokeWidth={2.2} />
                    </div>
                    {item.title && (
                      <H4 className="mt-3 text-sm font-bold text-slate-900">
                        {item.title}
                      </H4>
                    )}
                    {item.description && (
                      <P color="muted" size="xs" className="mt-1.5 leading-relaxed">
                        {item.description}
                      </P>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

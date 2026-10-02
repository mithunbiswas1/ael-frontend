// src/app/(pages)/about/_components/ExpertTrainersSection.jsx
"use client";

import Image from "next/image";
import { H4, P } from "@/components/ui/Typography";
import SectionHeader from "@/components/ui/SectionHeader";
import { useDictionary } from "@/context/DictionaryContext";

export default function ExpertTrainersSection({ data }) {
  const { locale } = useDictionary();
  const isBn = locale === "bn";

  if (!data) return null;

  const tag = isBn ? data?.tagBn : data?.tag;
  const headline = isBn ? data?.titleBn : data?.title;
  const subtitle = isBn ? data?.subtitleBn : data?.subtitle;
  const trainers = data?.trainers || [];

  const hasHeader = tag || headline || subtitle;
  const hasTrainers = trainers.length > 0;

  if (!hasHeader && !hasTrainers) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16 bg-slate-100/60 border-t border-slate-200/60">
      <div className="site-container">
        {hasHeader && (
          <SectionHeader
            align="center"
            tag={tag || ""}
            title={headline || ""}
            subtitle={subtitle || ""}
          />
        )}

        {/* Trainers Grid */}
        {hasTrainers && (
          <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 ${hasHeader ? "mt-8" : ""}`}>
            {trainers.map((trainer, idx) => {
              const name = (isBn ? trainer.nameBn : trainer.name) || trainer.name;
              const role = (isBn ? trainer.roleBn : trainer.role) || trainer.role;
              const bio = (isBn ? trainer.bioBn : trainer.bio) || trainer.bio;
              const imageSrc = trainer.imageUrl;

              return (
                <div
                  key={idx}
                  className="flex flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs transition-colors duration-200 hover:border-primary/50"
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                    <Image
                      src={imageSrc || "/default_person.jpg"}
                      alt={name || "Trainer"}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/default_person.jpg";
                      }}
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-3.5 text-center">
                    {name && (
                      <H4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                        {name}
                      </H4>
                    )}
                    {role && (
                      <span className="mt-0.5 text-[10px] font-bold text-primary">
                        {role}
                      </span>
                    )}
                    {bio && (
                      <P color="muted" size="xs" className="mt-2 leading-relaxed line-clamp-3">
                        {bio}
                      </P>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

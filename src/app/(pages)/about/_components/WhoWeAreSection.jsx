// src/app/(pages)/about/_components/WhoWeAreSection.jsx
"use client";

import { ShieldCheck, Users, BookOpen, Handshake } from "lucide-react";
import { H4 } from "@/components/ui/Typography";
import SectionHeader from "@/components/ui/SectionHeader";

const whoWeAreFeatures = [
  {
    icon: ShieldCheck,
    title: "Safety First",
    description: "We promote safety as a core value in every aspect of the LPG industry.",
  },
  {
    icon: Users,
    title: "Awareness for All",
    description: "We spread awareness among all stakeholders to ensure a safer LPG ecosystem.",
  },
  {
    icon: BookOpen,
    title: "Knowledge & Training",
    description: "We provide expert training, resources and guidance to build skills and confidence.",
  },
  {
    icon: Handshake,
    title: "Stronger Together",
    description: "We collaborate with industry leaders and organizations to create a safer tomorrow.",
  },
];

export default function WhoWeAreSection() {
  return (
    <section className="py-12 sm:py-16">
      <div className="site-container">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Left Content */}
          <div className="lg:col-span-6">
            <SectionHeader
              tag="WHO WE ARE"
              title="DEDICATED TO"
              accent="LPG SAFETY."
            />

            <div className="mt-5 space-y-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
              <p>
                We are a dedicated national platform working for a safer and more sustainable LPG sector
                in Bangladesh. We create awareness, provide up-to-date information, deliver quality
                training and support all stakeholders including investors, companies, dealers,
                distributors and consumers.
              </p>
              <p>
                Through collaboration with government bodies, industry associations and safety
                experts, we aim to reduce operational risks, prevent incidents and build a proactive
                culture of safety across the entire LPG supply chain.
              </p>
            </div>
          </div>

          {/* Right 2x2 Feature Grid */}
          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:col-span-6">
            {whoWeAreFeatures.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200/80 bg-white/95 p-4 sm:p-5 shadow-xs transition-colors duration-200 hover:border-primary/50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20 shadow-xs">
                    <Icon className="h-5 w-5" strokeWidth={2.2} />
                  </div>
                  <H4 className="mt-3 text-sm font-bold text-slate-900">
                    {item.title}
                  </H4>
                  <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

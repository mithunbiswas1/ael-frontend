// src/_components/GlobalHeroSection.jsx
"use client";

import Image from "next/image";
import { H1, P } from "@/components/ui/Typography";
import Breadcrumb from "@/components/ui/Breadcrumb";
import AmbientGlow from "@/components/ui/AmbientGlow";

export default function GlobalHeroSection({
  breadcrumbItems = [],
  title,
  accent,
  description,
  buttons,
  extraContent,
  children,
  imageSrc,
  imageAlt = "LPG Safety & Training",
  infoTag,
  rightContent,
}) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 pb-16 pt-10 md:pb-20 md:pt-14 text-white">
      <AmbientGlow />

      <div className="site-container relative z-10">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-8">
          {/* Left Column */}
          <div className="flex flex-col items-start lg:col-span-7">
            {/* Breadcrumb */}
            {breadcrumbItems && breadcrumbItems.length > 0 && (
              <Breadcrumb dark items={breadcrumbItems} className="mb-3" />
            )}

            {/* Dual-tone H1 */}
            <H1 color="white">
              {title && <span>{title}</span>}
              {title && accent && " "}
              {accent && <span className="text-primary">{accent}</span>}
            </H1>

            {/* Description */}
            {description && (
              <P color="light" className="mt-4 max-w-xl">
                {description}
              </P>
            )}

            {/* Optional Action Buttons */}
            {buttons && (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {buttons}
              </div>
            )}

            {/* Extra Content (e.g., hotlines, feature badges) */}
            {extraContent && <div className="mt-6 w-full">{extraContent}</div>}

            {/* Additional children if passed */}
            {children && <div className="mt-6 w-full">{children}</div>}
          </div>

          {/* Right Column: Visual or Custom Right Content */}
          <div className="relative flex items-center justify-center lg:col-span-5">
            {rightContent ? (
              rightContent
            ) : imageSrc ? (
              <div className="group relative aspect-4/3 w-full max-w-lg overflow-hidden rounded-xl border border-white/15 bg-slate-800/80 shadow-md backdrop-blur-sm">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 45vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

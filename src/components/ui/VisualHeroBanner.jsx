// src/components/ui/VisualHeroBanner.jsx
"use client";

import Image from "next/image";
import { H1, P } from "@/components/ui/Typography";
import Breadcrumb from "@/components/ui/Breadcrumb";
import AmbientGlow from "@/components/ui/AmbientGlow";
import { cn } from "@/lib/cn";
import { useDictionary } from "@/context/DictionaryContext";

/**
 * Reusable split visual hero banner (Left 7 cols content, Right 5 cols visual/card).
 * Receives all data via props from the calling page (does not hardcode or call data internally).
 */
export default function VisualHeroBanner({
  data,
  breadcrumbItems,
  title,
  accent,
  description,
  buttons,
  extraContent,
  children,
  imageSrc,
  imageAlt = "Safe LPG Platform",
  rightContent,
  className,
}) {
  const { locale } = useDictionary();
  const isBn = locale === "bn";

  // Resolve breadcrumbs: explicit props take priority over data object
  const resolvedBreadcrumbs =
    breadcrumbItems ||
    (data?.breadcrumb
      ? [
        { label: isBn ? "হোম" : "Home", href: "/" },
        ...(data.breadcrumbParent
          ? [
            {
              label: isBn
                ? data.breadcrumbParent.bn
                : data.breadcrumbParent.en,
              href: data.breadcrumbParent.href,
            },
          ]
          : []),
        {
          label: isBn ? data.breadcrumb.bn : data.breadcrumb.en,
        },
      ]
      : []);

  // Helper to resolve localized fields whether nested { en, bn } or flat { field, fieldBn }
  const resolveField = (propVal, obj, enKey, bnKey) => {
    if (propVal !== undefined && propVal !== null) return propVal;
    if (!obj) return null;
    const val = obj[enKey];
    if (val && typeof val === "object" && ("en" in val || "bn" in val)) {
      return isBn ? val.bn || val.en : val.en || val.bn;
    }
    if (isBn && obj[bnKey]) return obj[bnKey];
    return val || null;
  };

  // Resolve content fields: explicit props take priority over data object
  const resolvedTitle = resolveField(title, data, "title", "titleBn");
  const resolvedAccent = resolveField(accent, data, "accent", "accentBn");
  const resolvedDescription = resolveField(
    description,
    data,
    "description",
    "descriptionBn"
  );
  const resolvedImageSrc = imageSrc || data?.imageSrc;
  const resolvedImageAlt = imageAlt || data?.imageAlt || "Safe LPG Platform";

  if (
    !resolvedTitle &&
    !resolvedAccent &&
    !resolvedDescription &&
    !resolvedImageSrc &&
    !children &&
    !rightContent
  ) {
    return null;
  }

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 pb-16 pt-10 md:pb-20 md:pt-14 text-white",
        className
      )}
    >
      <AmbientGlow />

      <div className="site-container relative z-10">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-8">
          {/* Left Column (7 cols) */}
          <div className="flex flex-col items-start lg:col-span-7">
            {resolvedBreadcrumbs.length > 0 && (
              <Breadcrumb dark items={resolvedBreadcrumbs} className="mb-3" />
            )}

            <H1 color="white">
              {resolvedTitle && <span>{resolvedTitle}</span>}
              {resolvedTitle && resolvedAccent && " "}
              {resolvedAccent && (
                <span className="text-primary">{resolvedAccent}</span>
              )}
            </H1>

            {resolvedDescription && (
              <P color="light" className="mt-4 max-w-xl">
                {resolvedDescription}
              </P>
            )}

            {buttons && (
              <div className="mt-6 flex flex-wrap items-center gap-3">
                {buttons}
              </div>
            )}

            {extraContent && <div className="mt-6 w-full">{extraContent}</div>}
            {children && <div className="mt-6 w-full">{children}</div>}
          </div>

          {/* Right Column (5 cols) */}
          <div className="relative flex items-center justify-center lg:col-span-5">
            {rightContent ? (
              rightContent
            ) : resolvedImageSrc ? (
              <div className="group relative aspect-4/3 w-full max-w-lg overflow-hidden rounded-xl border border-white/15 bg-slate-800/80 shadow-md backdrop-blur-sm">
                <Image
                  src={resolvedImageSrc}
                  alt={resolvedImageAlt}
                  fill
                  priority
                  unoptimized
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

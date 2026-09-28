// src/components/ui/CenteredHeroBanner.jsx
"use client";

import { Scale, Lock, HelpCircle, ShieldCheck } from "lucide-react";
import { H1, P } from "@/components/ui/Typography";
import Breadcrumb from "@/components/ui/Breadcrumb";
import AmbientGlow from "@/components/ui/AmbientGlow";
import { cn } from "@/lib/cn";
import { useDictionary } from "@/context/DictionaryContext";

const ICON_MAP = {
  scale: <Scale className="h-3.5 w-3.5" />,
  lock: <Lock className="h-3.5 w-3.5" />,
  help: <HelpCircle className="h-3.5 w-3.5" />,
  shield: <ShieldCheck className="h-3.5 w-3.5" />,
};

/**
 * Reusable centered hero banner for statutory & content pages (Terms, Acts & Rules, Privacy, FAQ, etc.).
 * Receives all data via props from the calling page (does not hardcode or call data internally).
 */
export default function CenteredHeroBanner({
  data,
  breadcrumbItems,
  title,
  accent,
  description,
  children,
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

  // Resolve text fields: explicit props take priority over data object
  const resolvedTitle = resolveField(title, data, "title", "titleBn");
  const resolvedAccent = resolveField(accent, data, "accent", "accentBn");
  const resolvedDescription = resolveField(
    description,
    data,
    "description",
    "descriptionBn"
  );

  if (!resolvedTitle && !resolvedAccent && !resolvedDescription && !children) {
    return null;
  }

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 pb-16 pt-10 text-white",
        className
      )}
    >
      <AmbientGlow />

      <div className="site-container relative z-10 text-center max-w-3xl mx-auto">
        {resolvedBreadcrumbs.length > 0 && (
          <Breadcrumb
            dark
            items={resolvedBreadcrumbs}
            className="justify-center mb-3"
          />
        )}

        <H1 color="white">
          {resolvedTitle && <span>{resolvedTitle}</span>}
          {resolvedTitle && resolvedAccent && " "}
          {resolvedAccent && (
            <span className="text-primary">{resolvedAccent}</span>
          )}
        </H1>

        {resolvedDescription && (
          <P color="light" className="mt-3 max-w-xl mx-auto">
            {resolvedDescription}
          </P>
        )}

        {children && <div className="mt-6 w-full">{children}</div>}
      </div>
    </section>
  );
}

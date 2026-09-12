// src/components/shared/SharedHeroSection.jsx

import Image from "next/image";
import { H1, P } from "@/components/ui/Typography";
import AmbientGlow from "@/components/ui/AmbientGlow";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { LinkButton } from "@/components/ui/LinkButton";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

export default function SharedHeroSection({
  variant, // "main" | "others" | "between"
  breadcrumbItems = [{ label: "Home", href: "/" }],
  badgeText,
  badgeIcon: BadgeIcon,
  title,
  accent,
  description,
  buttons = [], // array of { label, href, onClick, variant, icon: Icon, className }
  imageSrc,
  imageAlt = "Hero Visual",
  rightContent,
  children,
  align, // "center" | "between" | "left"
  className,
}) {
  // Determine layout: if variant is "main" or imageSrc/rightContent is provided, use 2-column main page layout
  const isMain =
    variant === "main" || (!variant && (Boolean(imageSrc) || Boolean(rightContent)));
  const isBetween = variant === "between" || align === "between";

  const renderButtons = () => {
    if (!buttons || buttons.length === 0) return null;
    return (
      <div
        className={cn(
          "flex flex-wrap items-center gap-3",
          !isMain && !isBetween && "justify-center",
        )}
      >
        {buttons.map((btn, idx) => {
          const Icon = btn.icon;
          if (btn.href) {
            return (
              <LinkButton
                key={idx}
                href={btn.href}
                variant={btn.variant || (idx === 0 ? "primary" : "frosted")}
                size={btn.size || "default"}
                className={btn.className}
              >
                <span>{btn.label}</span>
                {Icon && <Icon className="h-4 w-4" />}
              </LinkButton>
            );
          }
          return (
            <Button
              key={idx}
              onClick={btn.onClick}
              variant={btn.variant || (idx === 0 ? "primary" : "secondary")}
              size={btn.size || "default"}
              className={btn.className}
            >
              <span>{btn.label}</span>
              {Icon && <Icon className="h-4 w-4" />}
            </Button>
          );
        })}
      </div>
    );
  };

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-tertiary via-[#0c1a33] to-tertiary pb-16 pt-10 md:pb-20 md:pt-14 text-white border-b border-primary/20",
        isBetween && "pb-12 pt-10 md:pb-14 md:pt-12",
        className,
      )}
    >
      {/* Subtle Ambient Background Glow */}
      <AmbientGlow color="primary" />

      {/* Subtle Radial grid pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#224C8D_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.08]"
      />

      {isMain ? (
        /* ================= 1. MAIN PAGE HERO (2-COLUMN) ================= */
        <div className="site-container relative z-10">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-8">
            {/* Left Column (7 cols) */}
            <div className="flex flex-col items-start lg:col-span-7">
              {breadcrumbItems && (
                <Breadcrumb items={breadcrumbItems} className="mb-4" />
              )}

              <H1 color="white">
                {title && <span>{title}</span>}{" "}
                {accent && <span className="text-secondary">{accent}</span>}
              </H1>

              {description && (
                <P color="light" className="mt-4 max-w-xl text-slate-300">
                  {description}
                </P>
              )}

              {(buttons?.length > 0 || children) && (
                <div className="mt-6 w-full space-y-4">
                  {renderButtons()}
                  {children}
                </div>
              )}
            </div>

            {/* Right Visual Column (5 cols) */}
            {(imageSrc || rightContent) && (
              <div className="relative flex items-center justify-center lg:col-span-5">
                {rightContent ? (
                  rightContent
                ) : (
                  <div className="group relative aspect-4/3 w-full max-w-lg overflow-hidden rounded-xl border border-white/15 bg-tertiary/80 shadow-2xl backdrop-blur-sm">
                    <Image
                      src={imageSrc}
                      alt={imageAlt}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 45vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-tertiary/80 via-transparent to-transparent" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ================= 2. OTHERS PAGE HERO (CENTERED OR SPLIT) ================= */
        <div
          className={cn(
            "site-container relative z-10",
            isBetween
              ? "max-w-5xl mx-auto"
              : "max-w-3xl mx-auto text-center",
          )}
        >
          {breadcrumbItems && (
            <Breadcrumb
              items={breadcrumbItems}
              className={cn(
                "mb-3",
                !isBetween ? "justify-center" : "justify-start",
              )}
            />
          )}

          {!isBetween ? (
            <>
              <H1 color="white">
                {title && <span>{title}</span>}{" "}
                {accent && <span className="text-secondary">{accent}</span>}
              </H1>

              {description && (
                <P
                  color="light"
                  className="mt-4 max-w-xl mx-auto text-slate-300"
                >
                  {description}
                </P>
              )}

              {(buttons?.length > 0 || children) && (
                <div className="mt-6 w-full flex flex-col items-center justify-center gap-4">
                  {renderButtons()}
                  {children}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <H1
                  color="white"
                  className="leading-tight text-xl sm:text-2xl md:text-3xl"
                >
                  {title && <span>{title}</span>}{" "}
                  {accent && <span className="text-secondary">{accent}</span>}
                </H1>

                {description && (
                  <P color="light" className="mt-1 text-slate-300 max-w-xl">
                    {description}
                  </P>
                )}
              </div>

              {(buttons?.length > 0 || children) && (
                <div className="shrink-0 flex items-center gap-3">
                  {renderButtons()}
                  {children}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export function MainPageHeroSection(props) {
  return <SharedHeroSection variant="main" {...props} />;
}

export function OthersPageHeroSection(props) {
  return <SharedHeroSection variant="others" {...props} />;
}

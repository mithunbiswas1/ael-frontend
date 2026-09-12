// src/components/ui/SectionHeader.jsx

import { H2, H3, P } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";

export default function SectionHeader({
  tag,
  title,
  accent,
  subtitle,
  align = "left",
  level = "h2",
  action,
  dark = false,
  className,
}) {
  const isCentered = align === "center";
  const HeadingComponent = level === "h3" ? H3 : H2;

  return (
    <div
      className={cn(
        "mb-8",
        isCentered ? "text-center" : action ? "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" : "",
        className,
      )}
    >
      <div>

        <HeadingComponent color={dark ? "white" : "default"}>
          {title}{" "}
          {accent && <span className="text-primary">{accent}</span>}
        </HeadingComponent>

        {subtitle && (
          <P
            className={cn(
              "mt-0.5 leading-relaxed",
              isCentered && "mx-auto max-w-xl",
              dark ? "text-slate-400" : "text-slate-500",
            )}
          >
            {subtitle}
          </P>
        )}
      </div>

      {action && !isCentered && (
        <div className="shrink-0">{action}</div>
      )}
    </div>
  );
}

export { SectionHeader };

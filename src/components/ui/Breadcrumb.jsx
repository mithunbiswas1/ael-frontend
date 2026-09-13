// src/components/ui/Breadcrumb.jsx
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

export default function Breadcrumb({ items = [], dark = false, className }) {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        "flex flex-wrap items-center gap-2 text-xs font-semibold",
        dark ? "text-slate-400" : "text-slate-500",
        className,
      )}
    >
      <ol className="inline-flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="inline-flex items-center gap-1.5">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className={cn(
                    "transition-colors",
                    dark
                      ? "hover:text-white"
                      : "hover:text-primary",
                  )}
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    "font-bold line-clamp-1 max-w-xs sm:max-w-md",
                    isLast ? "text-primary" : "",
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}

              {!isLast && (
                <ChevronRight
                  className={cn(
                    "h-3.5 w-3.5 shrink-0",
                    dark ? "text-slate-500" : "text-slate-400",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export { Breadcrumb };

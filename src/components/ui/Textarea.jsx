// src/components/ui/Textarea.jsx
"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/cn";

const variantStyles = {
  default:
    "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:bg-white shadow-2xs",
  filled:
    "bg-slate-50/70 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:bg-white shadow-2xs",
  dark:
    "bg-slate-900 border-slate-700/80 text-white placeholder:text-slate-500 focus:border-blue-500 focus:bg-slate-900",
};

const Textarea = forwardRef(
  (
    {
      className,
      containerClassName,
      labelClassName,
      label,
      required = false,
      id,
      error,
      disabled = false,
      variant = "default",
      rows = 4,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn("w-full", containerClassName)}>
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "block text-xs font-bold text-slate-700 mb-1.5",
              labelClassName,
            )}
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={id}
          rows={rows}
          disabled={disabled}
          aria-invalid={!!error}
          className={cn(
            "flex w-full rounded-lg border px-3.5 py-2.5 text-xs transition-colors focus:outline-none focus:ring-1 focus:ring-primary/20 resize-y",
            variantStyles[variant] || variantStyles.default,
            error && "border-red-500 focus:ring-red-500/20 focus:border-red-500",
            disabled && "cursor-not-allowed opacity-50",
            className,
          )}
          {...props}
        />

        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
export { Textarea };
export default Textarea;

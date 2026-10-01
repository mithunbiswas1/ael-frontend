// src/components/ui/Switch.jsx
"use client";

import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

const switchTrackVariants = cva(
  "relative inline-flex items-center rounded-full transition-colors focus:outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 select-none",
  {
    variants: {
      variant: {
        primary: "data-[checked=true]:bg-primary bg-slate-300",
        success: "data-[checked=true]:bg-emerald-600 bg-slate-300",
        danger: "data-[checked=true]:bg-rose-600 bg-slate-300",
      },
      size: {
        sm: "h-5 w-9",
        md: "h-6 w-11",
        lg: "h-7 w-14",
      },
    },
    defaultVariants: {
      variant: "success",
      size: "md",
    },
  },
);

const switchThumbVariants = cva(
  "inline-block transform rounded-full bg-white shadow-xs transition-transform pointer-events-none",
  {
    variants: {
      size: {
        sm: "h-3.5 w-3.5 data-[checked=true]:translate-x-4 translate-x-1",
        md: "h-4 w-4 data-[checked=true]:translate-x-6 translate-x-1",
        lg: "h-5 w-5 data-[checked=true]:translate-x-8 translate-x-1",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

export const Switch = forwardRef(function Switch(
  {
    checked = false,
    onCheckedChange,
    onChange,
    disabled = false,
    variant = "success",
    size = "md",
    className,
    thumbClassName,
    id,
    name,
    "aria-label": ariaLabel,
    ...props
  },
  ref,
) {
  const isChecked = Boolean(checked);

  const handleClick = (e) => {
    if (disabled) return;
    const next = !isChecked;
    onCheckedChange?.(next);
    onChange?.(next);
  };

  return (
    <button
      ref={ref}
      type="button"
      role="switch"
      id={id}
      name={name}
      aria-checked={isChecked}
      aria-label={ariaLabel}
      disabled={disabled}
      data-checked={isChecked}
      onClick={handleClick}
      className={cn(switchTrackVariants({ variant, size }), className)}
      {...props}
    >
      <span
        data-checked={isChecked}
        className={cn(switchThumbVariants({ size }), thumbClassName)}
      />
    </button>
  );
});

export default Switch;

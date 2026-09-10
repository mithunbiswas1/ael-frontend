// src/components/ui/Typography.jsx
"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

const typographyVariants = cva("transition-colors", {
  variants: {
    variant: {
      h1: "font-manrope text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-[1.1]",
      h2: "font-manrope text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight leading-tight text-slate-900",
      h3: "font-manrope text-lg sm:text-xl md:text-2xl font-black uppercase tracking-tight leading-snug text-slate-900",
      h4: "font-manrope text-sm sm:text-base font-bold leading-snug text-slate-900",
      h5: "font-manrope text-xs sm:text-sm font-bold leading-snug text-slate-900",
      h6: "font-manrope text-[11px] font-black uppercase tracking-wider text-slate-700",
      p: "font-manrope text-xs sm:text-sm leading-relaxed text-slate-500",
      default: "",
    },
    weight: {
      black: "font-black",
      extrabold: "font-extrabold",
      bold: "font-bold",
      semibold: "font-semibold",
      medium: "font-medium",
      regular: "font-normal",
    },
    color: {
      default: "",
      primary: "text-primary",
      secondary: "text-secondary",
      brand: "text-blue-500",
      white: "text-white",
      muted: "text-slate-500",
      gray: "text-slate-600",
      dark: "text-slate-900",
      danger: "text-red-600",
      success: "text-emerald-600",
      warning: "text-amber-500",
      info: "text-blue-500",
    },
  },
  defaultVariants: {
    variant: "default",
    color: "default",
  },
});

function Typography({
  className,
  variant,
  weight,
  color,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : variant === "p" ? "p" : variant || "p";

  return (
    <Comp
      className={cn(typographyVariants({ variant, weight, color, className }))}
      {...props}
    />
  );
}

// Semantic helper components with defaults
export function H1(props) {
  return <Typography variant="h1" {...props} />;
}
export function H2(props) {
  return <Typography variant="h2" {...props} />;
}
export function H3(props) {
  return <Typography variant="h3" {...props} />;
}
export function H4(props) {
  return <Typography variant="h4" {...props} />;
}
export function H5(props) {
  return <Typography variant="h5" {...props} />;
}
export function H6(props) {
  return <Typography variant="h6" {...props} />;
}
export function P(props) {
  return <Typography variant="p" color={props.color || "muted"} {...props} />;
}

export { Typography, typographyVariants };

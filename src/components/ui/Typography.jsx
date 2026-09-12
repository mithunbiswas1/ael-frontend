// src/components/ui/Typography.jsx

import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

const typographyVariants = cva("transition-colors", {
  variants: {
    variant: {
      h1: "font-manrope text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]",
      h2: "font-manrope text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight",
      h3: "font-manrope text-lg sm:text-xl md:text-2xl font-black tracking-tight leading-snug",
      h4: "font-manrope text-sm sm:text-base font-bold leading-snug",
      h5: "font-manrope text-xs sm:text-sm font-bold leading-snug",
      h6: "font-manrope text-[11px] font-black uppercase tracking-wider",
      p: "font-manrope text-xs sm:text-sm md:text-base",
      default: "",
    },
    uppercase: {
      true: "uppercase",
      false: "",
    },
    size: {
      default: "",
      xs: "text-[11px] leading-normal",
      sm: "text-xs leading-relaxed",
      base: "text-xs sm:text-sm md:text-base leading-relaxed",
      lg: "text-sm sm:text-base md:text-lg leading-relaxed",
      xl: "text-base sm:text-lg md:text-xl leading-relaxed",
    },
    weight: {
      default: "",
      black: "font-black",
      extrabold: "font-extrabold",
      bold: "font-bold",
      semibold: "font-semibold",
      medium: "font-medium",
      regular: "font-normal",
    },
    color: {
      default: "",
      dark: "text-slate-900",
      muted: "text-slate-500",
      light: "text-slate-300",
      white: "text-white",
      gray: "text-slate-600",
      slate400: "text-slate-400",
      primary: "text-primary",
      secondary: "text-secondary",
      brand: "text-blue-500",
      danger: "text-red-600",
      success: "text-emerald-600",
      warning: "text-amber-500",
      info: "text-blue-500",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
    color: "default",
    weight: "default",
  },
});

const Typography = forwardRef(function Typography(
  {
    className,
    variant,
    size,
    weight,
    color,
    uppercase,
    asChild = false,
    as,
    ...props
  },
  ref
) {
  const Comp = asChild ? Slot : as || (variant && variant !== "default" ? variant : "p");

  return (
    <Comp
      ref={ref}
      className={cn(typographyVariants({ variant, size, weight, color, uppercase }), className)}
      {...props}
    />
  );
});

// Semantic helper components with encapsulated defaults
const H1 = forwardRef(function H1({ color = "dark", ...props }, ref) {
  return <Typography ref={ref} variant="h1" color={color} {...props} />;
});

const H2 = forwardRef(function H2({ color = "dark", ...props }, ref) {
  return <Typography ref={ref} variant="h2" color={color} {...props} />;
});

const H3 = forwardRef(function H3({ color = "dark", ...props }, ref) {
  return <Typography ref={ref} variant="h3" color={color} {...props} />;
});

const H4 = forwardRef(function H4({ color = "dark", ...props }, ref) {
  return <Typography ref={ref} variant="h4" color={color} {...props} />;
});

const H5 = forwardRef(function H5({ color = "dark", ...props }, ref) {
  return <Typography ref={ref} variant="h5" color={color} {...props} />;
});

const H6 = forwardRef(function H6({ color = "gray", ...props }, ref) {
  return <Typography ref={ref} variant="h6" color={color} {...props} />;
});

const P = forwardRef(function P({ color = "muted", ...props }, ref) {
  return <Typography ref={ref} variant="p" color={color} {...props} />;
});

export default Typography;
export { Typography, typographyVariants, H1, H2, H3, H4, H5, H6, P };

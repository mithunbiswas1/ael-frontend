// src/components/ui/LinkButton.jsx

import React, { forwardRef } from "react";
import Link from "next/link";
import { cva } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/cn";

const linkButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-bold transition-all duration-200 cursor-pointer select-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-white hover:bg-secondary shadow-xs border border-transparent",
        "primary-soft":
          "bg-primary/10 text-primary hover:bg-primary hover:text-white border border-primary/20 shadow-2xs",
        solid:
          "bg-primary text-white hover:bg-secondary shadow-xs border border-transparent",
        secondary:
          "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200 shadow-2xs",
        outline:
          "border border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 bg-transparent",
        accent:
          "bg-[#d9f943] text-slate-950 hover:bg-[#cbef32] font-black shadow-md shadow-[#d9f943]/15 border border-transparent",
        frosted:
          "border border-slate-700 bg-white/5 hover:bg-white/10 text-white backdrop-blur-xs",
        ghost:
          "text-slate-700 hover:bg-slate-100 hover:text-slate-900 bg-transparent",
        danger:
          "bg-red-600 text-white hover:bg-red-700 shadow-xs border border-transparent",
        "danger-soft":
          "bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-200/80 shadow-2xs",
        "danger-ghost":
          "text-rose-600 hover:bg-rose-50 hover:text-rose-700 bg-transparent border-transparent",
        success:
          "bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs border border-transparent",
        "success-soft":
          "bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 shadow-2xs",
        subtle:
          "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/80",
        white:
          "bg-white text-slate-900 hover:bg-slate-100 shadow-xs border border-slate-200",
        link:
          "text-primary hover:underline bg-transparent p-0 h-auto font-bold border-transparent shadow-none",
        tab:
          "bg-slate-50 text-slate-600 border-t border-x border-transparent hover:bg-slate-100 rounded-t-xl rounded-b-none",
        "tab-active":
          "bg-white text-primary border-t border-x border-slate-200 border-b-transparent shadow-xs rounded-t-xl rounded-b-none hover:bg-white",
        pill:
          "rounded-full border border-primary text-primary hover:bg-primary hover:text-white",
        "outline-primary":
          "border border-primary/30 text-primary hover:bg-primary/10 bg-transparent",
        "outline-muted":
          "border border-slate-300 text-slate-700 bg-white hover:bg-slate-50",
        "header-primary":
          "bg-primary text-white hover:bg-secondary shadow-xs border border-transparent font-bold",
        "header-outline":
          "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 shadow-2xs font-bold",
        "success-circle":
          "rounded-full border border-emerald-600 bg-emerald-600 text-white shadow-xs",
        "subtle-circle":
          "rounded-full border border-slate-300 bg-slate-100 text-slate-400 hover:border-emerald-400 hover:text-emerald-600",
      },
      size: {
        xs: "px-2.5 py-1 text-xs font-semibold",
        sm: "px-3.5 py-1.5 text-xs font-semibold",
        default: "px-5 py-2.5 text-xs sm:text-sm font-bold",
        lg: "px-6 py-3 text-xs sm:text-sm font-bold",
        xl: "px-7 py-3.5 text-sm sm:text-base font-extrabold",
        "icon-xs": "h-6 w-6 p-0 rounded-md",
        "icon-sm": "h-8 w-8 p-0 rounded-lg",
        icon: "h-9 w-9 p-0 rounded-lg",
        "icon-lg": "h-10 w-10 p-0 rounded-xl",
        "icon-circle-xs": "h-6 w-6 p-0 rounded-full",
        "icon-circle-sm": "h-7 w-7 p-0 rounded-full",
        "icon-circle": "h-9 w-9 p-0 rounded-full",
        "icon-circle-lg": "h-10 w-10 p-0 rounded-full",
      },
      shape: {
        default: "",
        rounded: "rounded-xl",
        circle: "rounded-full",
        pill: "rounded-full",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      shape: "default",
    },
  },
);

const LinkButton = forwardRef(function LinkButton(
  {
    className,
    variant = "primary",
    size = "default",
    shape = "default",
    fullWidth = false,
    href = "#",
    icon: Icon,
    iconPosition = "left",
    isLoading = false,
    loading = false,
    disabled = false,
    label,
    children,
    ...props
  },
  ref
) {
  const isBusy = Boolean(isLoading || loading);
  const isDisabled = disabled || isBusy;

  const isExternal =
    typeof href === "string" &&
    (href.startsWith("http://") ||
      href.startsWith("https://") ||
      href.startsWith("tel:") ||
      href.startsWith("mailto:"));

  const classes = cn(
    linkButtonVariants({ variant, size, shape, fullWidth }),
    isDisabled && "pointer-events-none opacity-50 cursor-not-allowed",
    className,
  );

  const renderIcon = () => {
    if (isBusy) {
      return <Loader2 className="h-4 w-4 shrink-0 animate-spin" />;
    }
    if (!Icon) return null;
    if (React.isValidElement(Icon)) {
      return Icon;
    }
    const IconComp = Icon;
    return <IconComp className="h-4 w-4 shrink-0 transition-colors" strokeWidth={1.8} />;
  };

  const content = (
    <>
      {iconPosition === "left" && renderIcon()}
      {children}
      {iconPosition === "right" && renderIcon()}
    </>
  );

  if (isExternal) {
    const isHttp = href.startsWith("http://") || href.startsWith("https://");
    return (
      <a
        ref={ref}
        href={isDisabled ? undefined : href}
        aria-label={label}
        aria-disabled={isDisabled ? true : undefined}
        className={classes}
        target={isHttp ? "_blank" : undefined}
        rel={isHttp ? "noopener noreferrer" : undefined}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      ref={ref}
      href={isDisabled ? "#" : href}
      aria-label={label}
      aria-disabled={isDisabled ? true : undefined}
      className={classes}
      {...props}
    >
      {content}
    </Link>
  );
});

export default LinkButton;
export { LinkButton, linkButtonVariants };

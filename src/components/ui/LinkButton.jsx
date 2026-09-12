// src/components/ui/LinkButton.jsx

import Link from "next/link";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

const linkButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-bold transition-all duration-200 cursor-pointer select-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-white hover:bg-secondary shadow-xs border border-transparent",
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
        white:
          "bg-white text-slate-900 hover:bg-slate-100 shadow-xs border border-slate-200",
        pill:
          "rounded-full border border-primary text-primary hover:bg-primary hover:text-white",
      },
      size: {
        xs: "px-2.5 py-1 text-xs font-semibold",
        sm: "px-3.5 py-1.5 text-xs font-semibold",
        default: "px-5 py-2.5 text-xs sm:text-sm font-bold",
        lg: "px-6 py-3 text-xs sm:text-sm font-bold",
        xl: "px-7 py-3.5 text-sm sm:text-base font-extrabold",
        icon: "h-9 w-9 p-0",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

function LinkButton({
  className,
  variant = "primary",
  size = "default",
  fullWidth = false,
  href = "#",
  children,
  ...props
}) {
  const isExternal =
    typeof href === "string" &&
    (href.startsWith("http://") ||
      href.startsWith("https://") ||
      href.startsWith("tel:") ||
      href.startsWith("mailto:"));

  const classes = cn(
    linkButtonVariants({ variant, size, fullWidth }),
    className,
  );

  if (isExternal) {
    const isHttp = href.startsWith("http://") || href.startsWith("https://");
    return (
      <a
        href={href}
        className={classes}
        target={isHttp ? "_blank" : undefined}
        rel={isHttp ? "noopener noreferrer" : undefined}
        {...props}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...props}>
      {children}
    </Link>
  );
}

export default LinkButton;
export { LinkButton, linkButtonVariants };

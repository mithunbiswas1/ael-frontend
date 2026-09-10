// src/components/ui/LinkButton.jsx

import Link from "next/link";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

const linkButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap transition-all duration-200 font-semibold cursor-pointer",
  {
    variants: {
      variant: {
        outline:
          "text-brand border border-brand rounded-lg hover:text-white hover:bg-brand",
        solid:
          "text-white bg-brand border border-brand rounded-lg hover:bg-brand-hover",
        pill: "text-brand border border-brand rounded-full hover:text-white hover:bg-brand",
      },
      size: {
        default: "px-4 py-2 text-sm",
        sm: "px-4 py-1.5 text-xs",
        lg: "px-6 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "outline",
      size: "default",
    },
  },
);

function LinkButton({
  className,
  variant = "outline",
  size = "default",
  href,
  children,
  ...props
}) {
  return (
    <Link
      href={href}
      className={cn(linkButtonVariants({ variant, size, className }))}
      {...props}
    >
      {children}
    </Link>
  );
}

export { LinkButton, linkButtonVariants };

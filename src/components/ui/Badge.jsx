// src/components/ui/Badge.jsx
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

const badgeVariants = cva(
  "inline-flex items-center gap-1 font-bold border transition-colors select-none",
  {
    variants: {
      variant: {
        default: "bg-slate-100 text-slate-700 border-slate-200",
        primary: "bg-primary/10 text-primary border-primary/20",
        secondary: "bg-slate-200/70 text-slate-800 border-slate-300",
        success: "bg-emerald-50 text-emerald-700 border-emerald-200",
        warning: "bg-amber-50 text-amber-700 border-amber-200",
        danger: "bg-rose-50 text-rose-700 border-rose-200",
        mono: "font-mono uppercase bg-slate-100 text-slate-600 border-slate-200 tracking-wider",
        "mono-primary": "font-mono uppercase bg-primary/10 text-primary border-primary/20 tracking-wider",
        "pill-success": "bg-emerald-100 text-emerald-800 border-emerald-200",
        "pill-neutral": "bg-slate-100 text-slate-600 border-slate-200",
        "pill-primary": "bg-primary/10 text-primary border-primary/20",
      },
      size: {
        xs: "text-[10px] px-1.5 py-0.5 rounded",
        sm: "text-[11px] px-2 py-0.5 rounded-md",
        default: "text-xs px-2.5 py-0.5 rounded-md",
        lg: "text-sm px-3 py-1 rounded-lg",
      },
      shape: {
        default: "",
        rounded: "rounded-lg",
        pill: "!rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "sm",
      shape: "default",
    },
  },
);

export function Badge({
  className,
  variant = "default",
  size = "sm",
  shape = "default",
  children,
  icon: Icon,
  ...props
}) {
  return (
    <span
      className={cn(badgeVariants({ variant, size, shape }), className)}
      {...props}
    >
      {Icon && <Icon className="h-3 w-3 shrink-0" />}
      {children}
    </span>
  );
}

export { badgeVariants };

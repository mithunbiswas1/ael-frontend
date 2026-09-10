// src/components/ui/Button.jsx

import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center transition-colors group",
  {
    variants: {
      variant: {
        default: "text-gray-400 hover:text-brand",
        primary: "text-brand hover:text-brand/80",
        danger: "text-red-500 hover:text-red-600",
      },
      size: {
        default: "h-6 w-6",
        sm: "h-5 w-5",
        lg: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  disabled = false,
  icon: Icon,
  label,
  ...props
}) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      aria-label={label}
      disabled={disabled}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {Icon && (
        <Icon className="h-full w-full transition-colors" strokeWidth={1.6} />
      )}
    </Comp>
  );
}

export { Button, buttonVariants };

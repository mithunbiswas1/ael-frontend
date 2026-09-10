// src/components/ui/Checkbox.jsx
"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

const variantStyles = {
  primary: "data-[checked=true]:bg-primary data-[checked=true]:border-primary text-white",
  success: "data-[checked=true]:bg-emerald-600 data-[checked=true]:border-emerald-600 text-white",
  info: "data-[checked=true]:bg-blue-600 data-[checked=true]:border-blue-600 text-white",
  warning: "data-[checked=true]:bg-amber-500 data-[checked=true]:border-amber-500 text-white",
  danger: "data-[checked=true]:bg-red-500 data-[checked=true]:border-red-500 text-white",
};

const Checkbox = React.forwardRef(
  (
    {
      className,
      variant = "primary",
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      onChange,
      disabled = false,
      id,
      name,
      ...props
    },
    ref
  ) => {
    const isControlled = controlledChecked !== undefined;
    const [uncontrolledChecked, setUncontrolledChecked] = React.useState(defaultChecked);
    const isChecked = isControlled ? controlledChecked : uncontrolledChecked;

    const handleClick = (e) => {
      if (disabled) return;
      const nextChecked = !isChecked;
      if (!isControlled) {
        setUncontrolledChecked(nextChecked);
      }
      onCheckedChange?.(nextChecked);
      onChange?.({
        target: { id, name, checked: nextChecked, value: nextChecked },
      });
    };

    const handleKeyDown = (e) => {
      if (disabled) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        handleClick(e);
      }
    };

    return (
      <button
        type="button"
        role="checkbox"
        id={id}
        name={name}
        ref={ref}
        aria-checked={isChecked}
        data-checked={isChecked}
        disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          "peer relative flex h-4 w-4 shrink-0 items-center justify-center rounded border border-slate-300 bg-white transition-all",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
          "disabled:cursor-not-allowed disabled:opacity-50",
          variantStyles[variant] || variantStyles.primary,
          className
        )}
        {...props}
      >
        {isChecked && (
          <Check className="h-3 w-3 stroke-[3px] animate-in zoom-in-75 duration-150" />
        )}
      </button>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
export default Checkbox;

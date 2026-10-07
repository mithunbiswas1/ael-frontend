// src/components/ui/DateInput.jsx
"use client";

import { forwardRef } from "react";
import { Calendar, X } from "lucide-react";
import { cn } from "@/lib/cn";

const sizeStyles = {
  sm: "h-9 text-xs pl-8 pr-7",
  md: "h-10 text-xs sm:text-sm pl-9 pr-8",
  lg: "h-11 text-sm pl-10 pr-9",
};

const DateInput = forwardRef(
  (
    {
      value = "",
      onChange = () => {},
      onClear,
      label,
      required = false,
      id,
      name,
      min,
      max,
      disabled = false,
      error,
      size = "sm",
      className,
      containerClassName,
      labelClassName,
      clearable = true,
      ...props
    },
    ref
  ) => {
    const handleClear = (e) => {
      e.stopPropagation();
      e.preventDefault();
      if (onClear) {
        onClear();
      } else {
        onChange({ target: { name: name || "", value: "" } });
      }
    };

    return (
      <div className={cn("w-full", containerClassName)}>
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "block text-xs font-bold text-slate-700 mb-1.5",
              labelClassName
            )}
          >
            {label} {required && <span className="text-rose-500">*</span>}
          </label>
        )}

        <div className="relative w-full">
          {/* Calendar Prefix Icon */}
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2.5 text-slate-400">
            <Calendar className="h-3.5 w-3.5" />
          </div>

          <input
            ref={ref}
            id={id}
            name={name}
            type="date"
            value={value ?? ""}
            onChange={onChange}
            min={min}
            max={max}
            disabled={disabled}
            aria-invalid={!!error}
            className={cn(
              "w-full rounded-lg border border-slate-200 bg-white font-medium text-slate-800 transition-colors cursor-pointer",
              "focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20 shadow-2xs",
              sizeStyles[size] || sizeStyles.sm,
              error && "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20",
              disabled && "opacity-50 cursor-not-allowed bg-slate-50",
              className
            )}
            {...props}
          />

          {/* Clear Button */}
          {clearable && value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              title="Clear date"
              aria-label="Clear date"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {error && <p className="mt-1 text-xs text-rose-500">{error}</p>}
      </div>
    );
  }
);

DateInput.displayName = "DateInput";

export { DateInput };
export default DateInput;

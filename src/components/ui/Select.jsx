// src/components/ui/Select.jsx
"use client";

import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";

const sizeStyles = {
  sm: "py-2 pl-3 pr-8 text-xs",
  md: "py-2.5 pl-3.5 pr-9 text-xs sm:text-sm",
  lg: "py-3 pl-4 pr-10 text-sm",
};

const variantStyles = {
  default:
    "bg-white border-slate-200 text-slate-800 focus:border-primary focus:bg-white shadow-2xs",
  filled:
    "bg-slate-50/70 border-slate-200 text-slate-800 focus:border-primary focus:bg-white shadow-2xs",
  dark:
    "bg-slate-900 border-slate-700/80 text-white focus:border-blue-500 focus:bg-slate-900",
};

const Select = forwardRef(
  (
    {
      value,
      onChange = () => {},
      label,
      required = false,
      id,
      name,
      placeholder,
      options = [],
      size = "sm",
      variant = "default",
      className,
      containerClassName,
      labelClassName,
      suffix,
      prefix,
      error,
      disabled = false,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn("w-full", containerClassName)}>
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "block text-xs font-bold text-slate-700 mb-1.5",
              labelClassName,
            )}
          >
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}

        <div className="relative w-full">
          {prefix && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              {prefix}
            </div>
          )}

          <select
            id={id}
            name={name}
            value={value ?? ""}
            onChange={onChange}
            ref={ref}
            disabled={disabled}
            aria-invalid={!!error}
            className={cn(
              "w-full appearance-none rounded-lg border transition-colors focus:outline-none focus:ring-1 focus:ring-primary/20 cursor-pointer",
              sizeStyles[size] || sizeStyles.sm,
              variantStyles[variant] || variantStyles.default,
              prefix ? "pl-9" : "",
              error && "border-red-500 focus:ring-red-500/20 focus:border-red-500",
              disabled && "opacity-50 cursor-not-allowed",
              className,
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}

            {children
              ? children
              : options.map((option) => (
                  <option
                    key={typeof option === "object" ? option.value : option}
                    value={typeof option === "object" ? option.value : option}
                  >
                    {typeof option === "object" ? option.label : option}
                  </option>
                ))}
          </select>

          {/* Custom Dropdown Arrow */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-slate-400">
            {suffix || <ChevronDown className="h-3.5 w-3.5" />}
          </div>
        </div>

        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  },
);

Select.displayName = "Select";
export { Select };
export default Select;

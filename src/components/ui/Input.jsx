// src/components/ui/Input.jsx
"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/cn";

const sizeStyles = {
  sm: "py-2 px-3 text-xs",
  md: "py-2.5 px-3.5 text-xs sm:text-sm",
  lg: "py-3 px-4 text-sm",
};

const variantStyles = {
  default:
    "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:bg-white shadow-2xs",
  filled:
    "bg-slate-50/70 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary focus:bg-white shadow-2xs",
  dark:
    "bg-slate-900 border-slate-700/80 text-white placeholder:text-slate-500 focus:border-blue-500 focus:bg-slate-900",
};

const Input = forwardRef(
  (
    {
      value,
      onChange = () => {},
      label,
      required = false,
      id,
      name,
      placeholder,
      type = "text",
      size = "sm",
      variant = "default",
      className,
      containerClassName,
      labelClassName,
      prefix,
      suffix,
      error,
      disabled = false,
      ...props
    },
    ref,
  ) => (
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
        {/* LEFT ICON */}
        {prefix && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            {prefix}
          </div>
        )}

        <input
          ref={ref}
          id={id}
          name={name}
          type={type}
          value={value ?? ""}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={!!error}
          suppressHydrationWarning={true}
          className={cn(
            "w-full rounded-lg border transition-colors focus:outline-none focus:ring-1 focus:ring-primary/20",
            sizeStyles[size] || sizeStyles.sm,
            variantStyles[variant] || variantStyles.default,
            prefix ? "pl-9" : "",
            suffix ? "pr-9" : "",
            error && "border-red-500 focus:ring-red-500/20 focus:border-red-500",
            disabled && "opacity-50 cursor-not-allowed",
            className,
          )}
          {...props}
        />

        {/* RIGHT ICON */}
        {suffix && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
            {suffix}
          </div>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  ),
);

Input.displayName = "Input";
export { Input };
export default Input;

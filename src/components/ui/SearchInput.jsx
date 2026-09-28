// src/components/ui/SearchInput.jsx
"use client";

import { forwardRef } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { Input } from "./Input";
import { cn } from "@/lib/cn";

const SearchInput = forwardRef(function SearchInput(
  {
    value,
    onChange = () => {},
    onClear,
    placeholder = "Search...",
    size = "sm",
    variant = "default",
    className,
    containerClassName,
    disabled = false,
    ...props
  },
  ref
) {
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      onChange({ target: { value: "" } });
    }
  };

  return (
    <Input
      ref={ref}
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      size={size}
      variant={variant}
      disabled={disabled}
      containerClassName={containerClassName}
      className={cn("pr-8", className)}
      prefix={<FaSearch className="h-3.5 w-3.5 text-slate-400" />}
      suffix={
        value ? (
          <button
            type="button"
            onClick={handleClear}
            className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:bg-slate-300 hover:text-slate-800 transition-colors pointer-events-auto"
            aria-label="Clear search"
          >
            <FaTimes className="h-2.5 w-2.5" />
          </button>
        ) : null
      }
      {...props}
    />
  );
});

SearchInput.displayName = "SearchInput";

export { SearchInput };
export default SearchInput;

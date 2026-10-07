// src/components/ui/SlugInput.jsx
"use client";

import { forwardRef } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/cn";
import { Button } from "./Button";
import { Input } from "./Input";

/**
 * Utility function to convert arbitrary text into a URL-safe kebab-case slug
 */
export function slugify(text) {
  if (!text) return "";
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // remove non-alphanumeric chars except space and hyphen
    .replace(/[\s_-]+/g, "-")  // replace multiple spaces/underscores with single hyphen
    .replace(/^-+|-+$/g, "");  // trim leading/trailing hyphens
}

const getPrefixPadding = (pfx) => {
  if (!pfx) return "";
  const len = pfx.length;
  if (len <= 7) return "pl-16";      // e.g. /blogs/ (7 chars)
  if (len <= 9) return "pl-20";      // e.g. /courses/ (9 chars)
  if (len <= 12) return "pl-24";     // e.g. /categories/
  if (len <= 16) return "pl-32";     // e.g. /market-updates/ (16 chars)
  return "pl-36";
};

const SlugInput = forwardRef(
  (
    {
      value = "",
      onChange = () => {},
      sourceValue = "",
      onGenerate,
      prefix = "",
      label = "URL Slug",
      required = false,
      placeholder = "url-slug-identifier",
      disabled = false,
      readOnly = false,
      size = "sm",
      error,
      id,
      name = "slug",
      generateButtonText = "Generate from Title",
      showGenerateButton = true,
      helperText,
      className,
      containerClassName,
      ...props
    },
    ref
  ) => {
    const handleGenerate = () => {
      if (onGenerate) {
        onGenerate();
        return;
      }

      const textToSlugify = sourceValue?.trim();
      if (!textToSlugify) {
        toast.error("Please enter a title first to generate the URL slug.");
        return;
      }

      const generated = slugify(textToSlugify);
      if (!generated) {
        toast.error("Unable to generate a valid slug from title.");
        return;
      }

      onChange({
        target: {
          name,
          value: generated,
        },
      });
      toast.success("Slug generated from title");
    };

    return (
      <div className={cn("w-full", containerClassName)}>
        {/* Header: Label and Generate from Title Button */}
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <label
              htmlFor={id}
              className="block text-xs font-bold text-slate-700"
            >
              {label} {required && <span className="text-rose-500">*</span>}
            </label>
          )}

          {showGenerateButton && !readOnly && !disabled && (
            <Button
              type="button"
              variant="link"
              size="xs"
              onClick={handleGenerate}
            >
              {generateButtonText}
            </Button>
          )}
        </div>

        {/* Input using project standard Input component */}
        <Input
          ref={ref}
          id={id}
          name={name}
          required={required}
          size={size}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          readOnly={readOnly}
          error={error}
          prefix={
            prefix ? (
              <span className="font-mono text-xs text-slate-400 select-none">
                {prefix}
              </span>
            ) : null
          }
          className={cn(
            "font-mono",
            getPrefixPadding(prefix),
            className
          )}
          {...props}
        />

        {/* Helper Text */}
        {helperText && (
          <p className="text-[11px] text-slate-400 mt-1">{helperText}</p>
        )}
      </div>
    );
  }
);

SlugInput.displayName = "SlugInput";

export default SlugInput;

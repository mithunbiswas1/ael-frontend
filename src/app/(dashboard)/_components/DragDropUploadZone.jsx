// src/app/(dashboard)/_components/DragDropUploadZone.jsx
"use client";

import { useState, useRef } from "react";
import { UploadCloud, Loader2 } from "lucide-react";
import { H4, P } from "@/components/ui/Typography";
import { cn } from "@/lib/cn";

export default function DragDropUploadZone({
  onFilesSelected,
  isUploading = false,
  multiple = true,
  accept = "image/png,image/jpeg,image/jpg,image/webp",
  title,
  subtitle,
  uploadingText = "Uploading image(s)...",
  disabled = false,
  className,
  icon: Icon = UploadCloud,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || isUploading) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled || isUploading) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (onFilesSelected) {
        onFilesSelected(e.dataTransfer.files);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      if (onFilesSelected) {
        onFilesSelected(e.target.files);
      }
      e.target.value = "";
    }
  };

  const defaultTitle = multiple
    ? "Drag and drop images here, or browse"
    : "Drag and drop an image here, or browse";

  const defaultSubtitle = multiple
    ? "Upload multiple images simultaneously. Supported formats: PNG, JPG, JPEG, WEBP."
    : "Upload image file. Supported formats: PNG, JPG, JPEG, WEBP.";

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => {
        if (!disabled && !isUploading) {
          fileInputRef.current?.click();
        }
      }}
      className={cn(
        "group relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-all select-none",
        disabled || isUploading
          ? "cursor-not-allowed opacity-75 border-slate-200 bg-slate-50/50"
          : isDragging
          ? "border-primary bg-primary/5 cursor-pointer"
          : "border-slate-300 hover:border-primary hover:bg-slate-50/50 cursor-pointer",
        className
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={accept}
        disabled={disabled || isUploading}
        className="hidden"
        onChange={handleFileChange}
      />

      {isUploading ? (
        <div className="flex flex-col items-center gap-2 text-primary py-2">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-xs font-bold">{uploadingText}</span>
        </div>
      ) : (
        <>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icon className="h-6 w-6" />
          </div>

          <H4 className="mt-3 text-xs sm:text-sm font-bold text-slate-900">
            {title || (
              <>
                {multiple ? "Drag and drop images here, or " : "Drag and drop an image here, or "}
                <span className="text-primary underline">browse</span>
              </>
            )}
          </H4>

          <P className="mt-1 text-[11px] text-slate-500 max-w-sm">
            {subtitle || defaultSubtitle}
          </P>
        </>
      )}
    </div>
  );
}

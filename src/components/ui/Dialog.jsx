// src/components/ui/Dialog.jsx
"use client";

import { useEffect, useRef, useState, forwardRef } from "react";
import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";
import { cn } from "@/lib/cn";
import { Button } from "./Button";
import { H2, H4, P } from "./Typography";

const MAX_WIDTHS = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
  full: "max-w-full",
};

export const Dialog = forwardRef(function Dialog(
  {
    isOpen = false,
    onClose,
    children,
    className,
    maxWidth = "2xl",
    closeOnBackdropClick = true,
    closeOnEscape = true,
    showCloseButton = true,
    title,
    headerRight,
  },
  ref
) {
  const [isMounted, setIsMounted] = useState(false);
  const overlayRef = useRef(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Lock both document.body, document.documentElement, and dashboard main scroll when open
  useEffect(() => {
    if (!isOpen) return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalBodyPaddingRight = document.body.style.paddingRight;

    // Prevent layout shift from scrollbar removal
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    // Also lock dashboard main content scrolling if present
    const mainEl = document.querySelector("main");
    const originalMainOverflow = mainEl ? mainEl.style.overflow : "";
    if (mainEl) {
      mainEl.style.overflow = "hidden";
    }

    const handleKeyDown = (e) => {
      if (closeOnEscape && e.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.body.style.paddingRight = originalBodyPaddingRight;
      if (mainEl) {
        mainEl.style.overflow = originalMainOverflow;
      }
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen || !isMounted) return null;

  const handleBackdropClick = (e) => {
    if (closeOnBackdropClick && e.target === overlayRef.current) {
      onClose?.();
    }
  };

  const modalNode = (
    <div
      ref={overlayRef}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 overflow-hidden animate-in fade-in duration-200"
    >
      <div
        ref={ref}
        className={cn(
          "relative w-full rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-auto animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]",
          MAX_WIDTHS[maxWidth] || MAX_WIDTHS["2xl"],
          className
        )}
      >
        {(title || showCloseButton || headerRight) && (
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50 shrink-0">
            <div>
              {title && (
                <H4 className="text-base sm:text-lg font-bold text-slate-900">
                  {title}
                </H4>
              )}
            </div>

            <div className="flex items-center gap-2">
              {headerRight}
              {showCloseButton && (
                <Button
                  type="button"
                  onClick={onClose}
                  variant="ghost"
                  size="xs"
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-full"
                  aria-label="Close dialog"
                >
                  <FaTimes className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        )}

        <div className="overflow-y-auto flex-1 overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );

  return createPortal(modalNode, document.body);
});

Dialog.displayName = "Dialog";

export function DialogBody({ children, className }) {
  return (
    <div className={cn("p-6 overflow-y-auto", className)}>
      {children}
    </div>
  );
}

export function DialogFooter({ children, className }) {
  return (
    <div
      className={cn(
        "flex items-center justify-end gap-3 border-t border-slate-200 px-6 py-4 bg-slate-50 shrink-0",
        className
      )}
    >
      {children}
    </div>
  );
}

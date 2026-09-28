// src/components/common/navbar/LanguageSelector.jsx
"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Languages, ChevronDown, Check } from "lucide-react";
import { setLocaleAction } from "@/app/actions/locale";

export default function LanguageSelector({ currentLocale = "en" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const dropdownRef = useRef(null);
  const router = useRouter();

  // Close on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleSelectLanguage = (newLocale) => {
    if (newLocale === currentLocale || isPending) {
      setIsOpen(false);
      return;
    }

    setIsOpen(false);
    startTransition(async () => {
      // 1. Set cookie on client immediately for hydration parity
      document.cookie = `locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
      // 2. Set cookie on server via Server Action
      await setLocaleAction(newLocale);
      // 3. Refresh RSC tree to re-render all Server Components with new locale
      router.refresh();
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button - Matches navbar controls without extra icon */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        disabled={isPending}
        className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200/90 bg-white px-2.5 sm:px-3 text-xs sm:text-sm font-semibold text-slate-800 shadow-2xs hover:border-primary/50 hover:bg-slate-50 transition-all focus:outline-hidden disabled:opacity-70"
        aria-expanded={isOpen}
      >
        <span>
          {currentLocale === "bn" ? "বাংলা" : "English"}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>

      {/* Language Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 z-50 w-36 origin-top-right rounded-xl border border-slate-200/90 bg-white p-1.5 shadow-lg animate-in fade-in zoom-in-95 duration-100">
          <button
            type="button"
            onClick={() => handleSelectLanguage("en")}
            className={`w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-semibold transition-colors ${
              currentLocale === "en"
                ? "bg-primary/10 text-primary font-bold"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <span>English</span>
            {currentLocale === "en" && (
              <Check className="h-3.5 w-3.5 text-primary" />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleSelectLanguage("bn")}
            className={`w-full flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-semibold transition-colors ${
              currentLocale === "bn"
                ? "bg-primary/10 text-primary font-bold font-serif"
                : "text-slate-700 hover:bg-slate-100 font-serif"
            }`}
          >
            <span>বাংলা</span>
            {currentLocale === "bn" && (
              <Check className="h-3.5 w-3.5 text-primary" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}

// src/components/common/navbar/LanguageSelector.jsx
"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { openLanguageModal, getActiveLanguage } from "@/components/common/LanguageModal";
import { ALL_LANGUAGES } from "@/components/common/footer/google-translate-languages";
import { cn } from "@/lib/cn";

export default function LanguageSelector({
  currentLocale = "en",
  showFullOnMobile = false,
  className = "",
}) {
  const [activeCode, setActiveCode] = useState(currentLocale);

  useEffect(() => {
    const updateActive = () => {
      const code = getActiveLanguage(currentLocale);
      setActiveCode(code);
    };

    updateActive();
    window.addEventListener("language-changed", updateActive);
    return () => window.removeEventListener("language-changed", updateActive);
  }, [currentLocale]);

  // Determine display label (full and short name)
  let fullLabel = currentLocale === "bn" ? "বাংলা" : "English";
  let shortLabel = currentLocale === "bn" ? "বা" : "En";

  if (activeCode === "bn") {
    fullLabel = "বাংলা";
    shortLabel = "বা";
  } else if (activeCode === "en") {
    fullLabel = "English";
    shortLabel = "En";
  } else if (activeCode) {
    const matched = ALL_LANGUAGES.find((l) => l.code === activeCode);
    if (matched) {
      fullLabel = matched.name;
      shortLabel = matched.nativeName
        ? matched.nativeName.slice(0, 2)
        : matched.code.toUpperCase().slice(0, 2);
    } else {
      shortLabel = activeCode.toUpperCase().slice(0, 2);
    }
  }

  return (
    <button
      type="button"
      onClick={() => openLanguageModal()}
      className={cn(
        "flex h-9 items-center gap-1 sm:gap-1.5 rounded-lg border border-slate-200/90 bg-white px-2 sm:px-3 text-xs sm:text-sm font-bold sm:font-semibold text-slate-800 shadow-2xs hover:border-primary/50 hover:bg-slate-50 transition-all focus:outline-hidden shrink-0",
        className
      )}
      aria-label="Change language or translate"
      title={fullLabel}
    >
      {/* On mobile navbar: short name like En, বা */}
      {showFullOnMobile ? (
        <span>{fullLabel}</span>
      ) : (
        <>
          <span className="inline sm:hidden font-bold text-xs">{shortLabel}</span>
          <span className="hidden sm:inline">{fullLabel}</span>
        </>
      )}
      <ChevronDown className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-slate-400 shrink-0" />
    </button>
  );
}

// src/components/common/navbar/LanguageSelector.jsx
"use client";

import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { openLanguageModal, getActiveLanguage } from "@/components/common/LanguageModal";
import { ALL_LANGUAGES } from "@/components/common/footer/google-translate-languages";

export default function LanguageSelector({ currentLocale = "en" }) {
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

  // Determine display label
  let label = currentLocale === "bn" ? "বাংলা" : "English";
  if (activeCode && activeCode !== "en" && activeCode !== "bn") {
    const matched = ALL_LANGUAGES.find((l) => l.code === activeCode);
    if (matched) {
      label = matched.name;
    }
  } else if (activeCode === "bn") {
    label = "বাংলা";
  } else if (activeCode === "en") {
    label = "English";
  }

  return (
    <button
      type="button"
      onClick={() => openLanguageModal()}
      className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-200/90 bg-white px-2.5 sm:px-3 text-xs sm:text-sm font-semibold text-slate-800 shadow-2xs hover:border-primary/50 hover:bg-slate-50 transition-all focus:outline-hidden"
      aria-label="Change language or translate"
    >
      <span>{label}</span>
      <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
    </button>
  );
}

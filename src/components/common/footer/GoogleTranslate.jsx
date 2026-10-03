// src/components/common/footer/GoogleTranslate.jsx
"use client";

import { useState, useEffect } from "react";
import { openLanguageModal, getActiveLanguage } from "@/components/common/LanguageModal";
import { ALL_LANGUAGES } from "./google-translate-languages";

export default function GoogleTranslate() {
  const [activeCode, setActiveCode] = useState("en");

  useEffect(() => {
    const updateActive = () => {
      const code = getActiveLanguage("en");
      setActiveCode(code);
    };

    updateActive();
    window.addEventListener("language-changed", updateActive);
    return () => window.removeEventListener("language-changed", updateActive);
  }, []);

  let langLabel = "English";
  if (activeCode === "bn") {
    langLabel = "বাংলা";
  } else if (activeCode && activeCode !== "en") {
    const matched = ALL_LANGUAGES.find((l) => l.code === activeCode);
    if (matched) langLabel = matched.name;
  }

  const isTranslated = activeCode !== "en" && activeCode !== "" && activeCode !== "bn";

  return (
    <button
      type="button"
      onClick={() => openLanguageModal()}
      className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border ${
        isTranslated
          ? "bg-slate-900 border-slate-700 text-white"
          : "bg-slate-900/80 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-850 hover:border-slate-700"
      } active:scale-98`}
      aria-label="Open language translate modal"
    >
      <span className="tracking-wide">Translate</span>
      <span
        className={`px-1.5 py-0.5 rounded text-[11px] font-medium border ${
          isTranslated
            ? "bg-blue-600/30 border-blue-500/40 text-blue-200"
            : "bg-slate-800 border-slate-700 text-slate-400"
        }`}
      >
        {langLabel}
      </span>
    </button>
  );
}

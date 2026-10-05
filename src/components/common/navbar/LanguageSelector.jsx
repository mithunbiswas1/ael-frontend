// src/components/common/navbar/LanguageSelector.jsx
"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  openLanguageModal,
  getActiveLanguage,
  clearGoogleCookie,
} from "@/components/common/LanguageModal";
import { setLocaleAction } from "@/app/actions/locale";
import { cn } from "@/lib/cn";

export default function LanguageSelector({
  currentLocale = "en",
  showFullOnMobile = false,
  className = "",
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [optimisticLocale, setOptimisticLocale] = useState(currentLocale);
  const [activeTranslateCode, setActiveTranslateCode] = useState("");

  useEffect(() => {
    setOptimisticLocale(currentLocale);
  }, [currentLocale]);

  // Track active Google Translate foreign language
  useEffect(() => {
    const updateActive = () => {
      const code = getActiveLanguage("");
      // Only foreign languages (not native en or bn) count as active Google translation
      if (code && code !== "en" && code !== "bn") {
        setActiveTranslateCode(code);
      } else {
        setActiveTranslateCode("");
      }
    };

    updateActive();
    window.addEventListener("language-changed", updateActive);
    return () => window.removeEventListener("language-changed", updateActive);
  }, [currentLocale]);

  // Switch between native English and Bangla without hard page reload
  const handleSwitchLocale = (targetLocale) => {
    const activeForeignCode = getActiveLanguage("");
    const isForeignTranslated =
      Boolean(activeForeignCode) &&
      activeForeignCode !== "en" &&
      activeForeignCode !== "bn";

    // Only skip if already on target locale AND no foreign translation is active
    if (targetLocale === optimisticLocale && !isForeignTranslated) return;

    // Optimistic immediate UI update
    setOptimisticLocale(targetLocale);

    // 1. Thoroughly purge Google Translate cookie & state across all domain scopes
    clearGoogleCookie();
    setActiveTranslateCode("");

    // 2. Set native locale cookie synchronously and call server action
    document.cookie = `locale=${targetLocale}; path=/; max-age=31536000; SameSite=Lax`;
    startTransition(async () => {
      try {
        await setLocaleAction(targetLocale);
      } catch {
        // ignore
      }
      window.dispatchEvent(
        new CustomEvent("language-changed", { detail: targetLocale })
      );
      router.refresh();

      // Only perform a full reload if transitioning away from an active foreign Google translation
      if (isForeignTranslated) {
        window.location.reload();
      }
    });
  };

  const isEnglishActive = optimisticLocale === "en" && !activeTranslateCode;
  const isBanglaActive = optimisticLocale === "bn" && !activeTranslateCode;

  return (
    <div
      translate="no"
      className={cn(
        "notranslate flex items-center gap-1.5 sm:gap-2 shrink-0 select-none",
        className
      )}
    >
      {/* 
        1. En / বা Switch Button 
        Matching navbar button design structure: h-9, rounded-lg, border-slate-200/90, shadow-2xs
      */}
      <div
        role="group"
        aria-label="Language switch"
        translate="no"
        className="notranslate flex h-9 items-center p-0.5 rounded-lg border border-slate-200/90 bg-slate-100/90 shadow-2xs shrink-0"
      >
        <button
          type="button"
          translate="no"
          onClick={() => handleSwitchLocale("en")}
          disabled={isPending}
          className={cn(
            "notranslate h-7.5 px-2 sm:px-2.5 rounded-md text-xs font-bold transition-all duration-150 flex items-center justify-center cursor-pointer",
            isEnglishActive
              ? "bg-white text-slate-900 shadow-xs border border-slate-200/70"
              : "text-slate-500 hover:text-slate-900"
          )}
          title="Switch to English"
          aria-pressed={isEnglishActive}
        >
          En
        </button>
        <button
          type="button"
          translate="no"
          onClick={() => handleSwitchLocale("bn")}
          disabled={isPending}
          className={cn(
            "notranslate h-7.5 px-2 sm:px-2.5 rounded-md text-xs font-bold transition-all duration-150 flex items-center justify-center font-serif cursor-pointer",
            isBanglaActive
              ? "bg-white text-slate-900 shadow-xs border border-slate-200/70"
              : "text-slate-500 hover:text-slate-900"
          )}
          title="বাংলায় পরিবর্তন করুন"
          aria-pressed={isBanglaActive}
        >
          বা
        </button>
      </div>

      {/* 
        2. Separate Translate Button
        Matching navbar button design structure: h-9, rounded-lg, border-slate-200/90, shadow-2xs
      */}
      <button
        type="button"
        translate="no"
        onClick={() => openLanguageModal()}
        className={cn(
          "notranslate flex h-9 items-center gap-1.5 rounded-lg border border-slate-200/90 bg-white px-2.5 sm:px-3 text-xs sm:text-sm font-semibold text-slate-800 shadow-2xs hover:border-primary/50 hover:bg-slate-50 transition-all focus:outline-hidden shrink-0 cursor-pointer",
          activeTranslateCode && "border-primary/50 bg-primary/5 text-primary"
        )}
        aria-label="Translate website"
        title={
          activeTranslateCode
            ? `Google Translate: ${activeTranslateCode.toUpperCase()}`
            : "Translate website"
        }
      >

        <span
          translate="no"
          className={cn(
            "notranslate font-semibold",
            showFullOnMobile ? "inline" : "inline text-xs sm:text-sm"
          )}
        >
          Translate
        </span>
        {activeTranslateCode && (
          <span
            translate="no"
            className="notranslate ml-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary uppercase"
          >
            {activeTranslateCode}
          </span>
        )}
      </button>
    </div>
  );
}

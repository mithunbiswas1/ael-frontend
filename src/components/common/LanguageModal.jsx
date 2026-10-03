// src/components/common/LanguageModal.jsx
"use client";

import { useState, useEffect, useRef, useMemo, useTransition } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { ALL_LANGUAGES } from "./footer/google-translate-languages";
import { setLocaleAction } from "@/app/actions/locale";

// Safeguard Node removeChild & insertBefore against React DOM crashes when Google Translate mutates DOM text nodes
if (typeof window !== "undefined") {
  if (typeof Node === "function" && Node.prototype) {
    const originalRemoveChild = Node.prototype.removeChild;
    Node.prototype.removeChild = function (child) {
      if (child.parentNode !== this) {
        return child;
      }
      return originalRemoveChild.apply(this, arguments);
    };

    const originalInsertBefore = Node.prototype.insertBefore;
    Node.prototype.insertBefore = function (newNode, referenceNode) {
      if (referenceNode && referenceNode.parentNode !== this) {
        return newNode;
      }
      return originalInsertBefore.apply(this, arguments);
    };
  }
}

// Global helper to open the language modal from Navbar, Footer, or anywhere
export function openLanguageModal() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-language-modal"));
  }
}

// Helper to get active language code
export function getActiveLanguage(fallbackLocale = "en") {
  if (typeof document === "undefined") return fallbackLocale;
  try {
    const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]+)/);
    if (match && match[1]) {
      const parts = decodeURIComponent(match[1]).split("/");
      const code = parts[parts.length - 1];
      if (code && code !== "auto") return code;
    }
  } catch {
    // fallback
  }
  return fallbackLocale;
}

export default function LanguageModal({ currentLocale = "en" }) {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [translateLang, setTranslateLang] = useState("");
  const [isPending, startTransition] = useTransition();
  const searchInputRef = useRef(null);
  const router = useRouter();

  // Read current Google Translate cookie
  useEffect(() => {
    setMounted(true);
    const active = getActiveLanguage("");
    if (active && active !== "en" && active !== "bn") {
      setTranslateLang(active);
    } else {
      setTranslateLang("");
    }

    // Listen for global open events from Navbar, Footer, etc.
    const handleOpen = () => setIsOpen(true);
    window.addEventListener("open-language-modal", handleOpen);

    // Initialize Google Translate Script
    window.googleTranslateElementInit = () => {
      if (window.google && window.google.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            autoDisplay: false,
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          },
          "google_translate_element"
        );
      }
    };

    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else if (window.google && window.google.translate) {
      window.googleTranslateElementInit();
    }

    return () => {
      window.removeEventListener("open-language-modal", handleOpen);
    };
  }, []);

  // Lock background scroll and handle Escape key
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    const timer = setTimeout(() => {
      searchInputRef.current?.focus();
    }, 120);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen]);

  // Clear Google Translate cookie
  const clearGoogleCookie = () => {
    const host = typeof window !== "undefined" ? window.location.hostname : "";
    document.cookie =
      "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    if (host) {
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=${host}; path=/;`;
      if (host.includes(".")) {
        document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.${host}; path=/;`;
      }
    }
    try {
      localStorage.removeItem("google_translate_lang");
    } catch {
      // ignore
    }
  };

  // Switch to Primary System Language (English or Bangla)
  const handleSelectPrimaryLanguage = (targetLocale) => {
    setIsOpen(false);
    clearGoogleCookie();
    setTranslateLang("");

    // Trigger google translate reset combo if present
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = "";
      select.dispatchEvent(new Event("change"));
    }

    // Set locale cookie and call server action
    startTransition(async () => {
      document.cookie = `locale=${targetLocale}; path=/; max-age=31536000; SameSite=Lax`;
      await setLocaleAction(targetLocale);
      window.dispatchEvent(new CustomEvent("language-changed", { detail: targetLocale }));
      router.refresh();
      window.location.reload();
    });
  };

  // Switch to Translate Language (other 100+ languages)
  const handleSelectTranslateLanguage = (langCode) => {
    try {
      localStorage.setItem("google_translate_lang", langCode);
    } catch {
      // ignore
    }

    // Set cookie
    const cookieVal = `/auto/${langCode}`;
    document.cookie = `googtrans=${cookieVal}; path=/;`;
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      if (host) {
        document.cookie = `googtrans=${cookieVal}; domain=${host}; path=/;`;
        if (host.includes(".")) {
          document.cookie = `googtrans=${cookieVal}; domain=.${host}; path=/;`;
        }
      }
    }

    setTranslateLang(langCode);
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent("language-changed", { detail: langCode }));

    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event("change"));
    } else {
      window.location.reload();
    }
  };

  // Reset to original system locale
  const handleResetOriginal = () => {
    clearGoogleCookie();
    setTranslateLang("");
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent("language-changed", { detail: currentLocale }));

    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = "";
      select.dispatchEvent(new Event("change"));
    }
    window.location.reload();
  };

  // Translation languages: Bangla and English are EXCLUDED as requested
  const translateLanguages = useMemo(() => {
    const withoutPrimary = ALL_LANGUAGES.filter(
      (lang) => lang.code !== "en" && lang.code !== "bn"
    );
    const q = searchQuery.trim().toLowerCase();
    if (!q) return withoutPrimary;
    return withoutPrimary.filter(
      (lang) =>
        lang.name.toLowerCase().includes(q) ||
        lang.code.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const isEnglishActive = !translateLang && currentLocale === "en";
  const isBanglaActive = !translateLang && currentLocale === "bn";

  if (!mounted) return null;

  return (
    <>
      {/* Hidden container for Google Translate element */}
      <div
        id="google_translate_element"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          opacity: 0,
          pointerEvents: "none",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
        aria-hidden="true"
      />

      {/* Minimalist AI-style Center-Center Modal */}
      {isOpen &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Select Language"
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsOpen(false);
            }}
          >
            <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in zoom-in-95 duration-150 flex flex-col h-[80vh] my-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 bg-white shrink-0">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 tracking-tight">
                    Select Language
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="h-7 w-7 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 text-sm font-medium transition-colors"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              {/* TOP SECTION: Primary Languages (English & Bangla) */}
              <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/60 shrink-0">
                <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Primary Languages
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {/* English */}
                  <button
                    type="button"
                    onClick={() => handleSelectPrimaryLanguage("en")}
                    disabled={isPending}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-150 ${isEnglishActive
                        ? "bg-slate-900 border-slate-900 text-white shadow-xs"
                        : "bg-white border-slate-200/90 text-slate-800 hover:border-slate-300 hover:bg-slate-100"
                      }`}
                  >
                    <span>English</span>
                    {isEnglishActive && (
                      <span className="text-xs font-bold">✓</span>
                    )}
                  </button>

                  {/* Bangla */}
                  <button
                    type="button"
                    onClick={() => handleSelectPrimaryLanguage("bn")}
                    disabled={isPending}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-150 font-serif ${isBanglaActive
                        ? "bg-slate-900 border-slate-900 text-white shadow-xs"
                        : "bg-white border-slate-200/90 text-slate-800 hover:border-slate-300 hover:bg-slate-100"
                      }`}
                  >
                    <span>বাংলা (Bangla)</span>
                    {isBanglaActive && (
                      <span className="text-xs font-bold">✓</span>
                    )}
                  </button>
                </div>
              </div>

              {/* LOWER SECTION: Other Languages for Translate */}
              <div className="px-5 pt-3 pb-2 border-b border-slate-100 bg-white shrink-0">
                <span className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Translate ({translateLanguages.length} Languages)
                </span>
                <div className="relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search languages (e.g. Arabic, Spanish, French, Hindi)..."
                    className="w-full rounded-xl bg-slate-50 border border-slate-200/90 py-2 px-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs px-1"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Translate Languages Grid (Bangla and English excluded) */}
              <div className="flex-1 overflow-y-auto px-5 py-3 overscroll-contain">
                {translateLanguages.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No language matching &ldquo;{searchQuery}&rdquo;
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {translateLanguages.map((lang) => {
                      const isActive = translateLang === lang.code;
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => handleSelectTranslateLanguage(lang.code)}
                          className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all duration-150 text-left ${isActive
                              ? "bg-slate-900 text-white font-medium shadow-xs"
                              : "text-slate-700 hover:bg-slate-100 hover:text-slate-950 font-normal"
                            }`}
                        >
                          <span className="truncate">{lang.name}</span>
                          {isActive && (
                            <span className="ml-1 text-[11px] font-bold">
                              ✓
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 bg-slate-50/70 shrink-0">
                <button
                  type="button"
                  onClick={handleResetOriginal}
                  className="text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
                >
                  Reset to original
                </button>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

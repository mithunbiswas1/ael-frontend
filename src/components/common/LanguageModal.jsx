// src/components/common/LanguageModal.jsx
"use client";

import { useState, useEffect, useRef, useMemo, useTransition } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Languages, Search, X } from "lucide-react";
import { ALL_LANGUAGES } from "./footer/google-translate-languages";
import { setLocaleAction } from "@/app/actions/locale";
import { cn } from "@/lib/cn";

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

// Comprehensive Google Translate cleanup across all domain scopes, paths, and DOM elements
export function clearGoogleCookie() {
  if (typeof document === "undefined") return;

  const hostname = window.location.hostname;
  const hostParts = hostname.split(".");

  // 1. Build all possible domain variations
  const domains = ["", hostname, `.${hostname}`];
  for (let i = 0; i < hostParts.length - 1; i++) {
    const parentDomain = hostParts.slice(i).join(".");
    domains.push(parentDomain);
    domains.push(`.${parentDomain}`);
  }

  // Common cookie paths
  const paths = ["/", "", window.location.pathname];

  // 2. Annihilate googtrans cookie across all combinations
  domains.forEach((dom) => {
    paths.forEach((p) => {
      const domainAttr = dom ? `; domain=${dom}` : "";
      const pathAttr = p ? `; path=${p}` : "";

      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; max-age=0${pathAttr}${domainAttr}`;
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; max-age=0${pathAttr}${domainAttr}`;
      document.cookie = `googtrans=; max-age=0${pathAttr}${domainAttr}`;
    });
  });

  // 3. Reset storage
  try {
    localStorage.removeItem("google_translate_lang");
    sessionStorage.removeItem("google_translate_lang");
  } catch {
    // ignore
  }

  // 4. Reset Google Translate combo in DOM if present
  try {
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = "";
      select.dispatchEvent(new Event("change"));
    }
  } catch {
    // ignore
  }

  // 5. Clean up Google Translate DOM artifacts (RTL, classes, banner)
  try {
    document.documentElement.classList.remove("translated-ltr", "translated-rtl");
    document.documentElement.removeAttribute("dir");
    document.body.removeAttribute("dir");
  } catch {
    // ignore
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
      // Strip any quotes or whitespace that Google Translate or browser wraps around the value
      let rawVal = decodeURIComponent(match[1]).trim().replace(/^["']|["']$/g, "");
      const parts = rawVal.split("/").filter(Boolean);
      const code = parts[parts.length - 1]?.trim().toLowerCase();
      if (
        code &&
        code !== "auto" &&
        code !== "deleted" &&
        code !== "null" &&
        code !== "undefined"
      ) {
        return code;
      }
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
  const [, startTransition] = useTransition();
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
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen]);

  // Switch to Translate Language (English & Bangla excluded)
  // Requirement: "translate modal theke kono language select korte en bn theke default en cole asbe"
  const handleSelectTranslateLanguage = (langCode) => {
    try {
      localStorage.setItem("google_translate_lang", langCode);
    } catch {
      // ignore
    }

    // Set cookie for google translate across all domain scopes
    const cookieVal = `/auto/${langCode}`;
    const hostname = typeof window !== "undefined" ? window.location.hostname : "";
    const hostParts = hostname ? hostname.split(".") : [];
    const domains = ["", hostname, `.${hostname}`];
    for (let i = 0; i < hostParts.length - 1; i++) {
      const parentDomain = hostParts.slice(i).join(".");
      domains.push(parentDomain);
      domains.push(`.${parentDomain}`);
    }

    domains.forEach((dom) => {
      const domainAttr = dom ? `; domain=${dom}` : "";
      document.cookie = `googtrans=${cookieVal}; path=/${domainAttr}`;
    });

    // Reset base system locale to default 'en'
    document.cookie = `locale=en; path=/; max-age=31536000; SameSite=Lax`;
    startTransition(async () => {
      try {
        await setLocaleAction("en");
      } catch {
        // ignore
      }
    });

    setTranslateLang(langCode);
    setIsOpen(false);
    window.dispatchEvent(new CustomEvent("language-changed", { detail: langCode }));

    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = langCode;
      select.dispatchEvent(new Event("change"));
      if (currentLocale !== "en") {
        window.location.reload();
      }
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

      {/* 
        Translate Modal: 
        1. English & Bangla removed (only 100+ translation languages).
        2. Protected with translate="no" and className="notranslate" so Google Translate NEVER translates modal text.
      */}
      {isOpen &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Translate Website"
            translate="no"
            className="notranslate fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsOpen(false);
            }}
          >
            <div
              translate="no"
              className="notranslate relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-in zoom-in-95 duration-150 flex flex-col h-[75vh] max-h-[620px] my-auto"
            >
              {/* Modal Header */}
              <div
                translate="no"
                className="notranslate flex items-center justify-between border-b border-slate-100 px-5 py-4 bg-white shrink-0"
              >
                <div className="notranslate flex items-center gap-2" translate="no">
                  <Languages className="h-4 w-4 text-primary shrink-0" />
                  <h3 className="notranslate text-sm font-bold text-slate-900 tracking-tight" translate="no">
                    Google Translate
                  </h3>
                </div>

                <button
                  type="button"
                  translate="no"
                  onClick={() => setIsOpen(false)}
                  className="notranslate h-7 w-7 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 text-sm font-medium transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Search Input Section */}
              <div
                translate="no"
                className="notranslate px-5 pt-3.5 pb-2.5 border-b border-slate-100 bg-white shrink-0"
              >
                <div className="notranslate relative" translate="no">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    translate="no"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search translation language (e.g. Arabic, Spanish, French, Hindi)..."
                    className="notranslate w-full rounded-xl bg-slate-50 border border-slate-200/90 py-2 pl-8.5 pr-8 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-hidden focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      translate="no"
                      onClick={() => setSearchQuery("")}
                      className="notranslate absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs px-1 cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Translation Languages Grid (Bangla and English excluded) */}
              <div
                translate="no"
                className="notranslate flex-1 overflow-y-auto px-5 py-3 overscroll-contain"
              >
                {translateLanguages.length === 0 ? (
                  <div
                    className="notranslate py-8 text-center text-xs text-slate-400"
                    translate="no"
                  >
                    No language matching &ldquo;{searchQuery}&rdquo;
                  </div>
                ) : (
                  <div
                    className="notranslate grid grid-cols-2 sm:grid-cols-3 gap-1.5"
                    translate="no"
                  >
                    {translateLanguages.map((lang) => {
                      const isActive = translateLang === lang.code;
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          translate="no"
                          onClick={() => handleSelectTranslateLanguage(lang.code)}
                          className={cn(
                            "notranslate flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all duration-150 text-left cursor-pointer",
                            isActive
                              ? "bg-slate-900 text-white font-medium shadow-xs"
                              : "text-slate-700 hover:bg-slate-100 hover:text-slate-950 font-normal"
                          )}
                        >
                          <span className="notranslate truncate" translate="no">
                            {lang.name}
                          </span>
                          {isActive && (
                            <span
                              className="notranslate ml-1 text-[11px] font-bold"
                              translate="no"
                            >
                              ✓
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div
                translate="no"
                className="notranslate flex items-center justify-between border-t border-slate-100 px-5 py-3 bg-slate-50/70 shrink-0"
              >
                <button
                  type="button"
                  translate="no"
                  onClick={handleResetOriginal}
                  className="notranslate text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  Reset to original
                </button>

                <button
                  type="button"
                  translate="no"
                  onClick={() => setIsOpen(false)}
                  className="notranslate px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-colors cursor-pointer"
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

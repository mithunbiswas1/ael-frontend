// src/context/DictionaryContext.jsx

"use client";

import { createContext, useContext, useMemo } from "react";

const DictionaryContext = createContext({
  locale: "en",
  dict: {},
  t: (path, fallback = "") => fallback,
});

export function DictionaryProvider({ locale = "en", dict = {}, children }) {
  const value = useMemo(() => {
    const t = (path, fallback = "") => {
      if (!path) return fallback;
      const parts = path.split(".");
      let current = dict;
      for (const part of parts) {
        if (!current || typeof current !== "object") return fallback;
        current = current[part];
      }
      return current !== undefined ? current : fallback;
    };

    return { locale, dict, t };
  }, [locale, dict]);

  return (
    <DictionaryContext.Provider value={value}>
      {children}
    </DictionaryContext.Provider>
  );
}

export function useDictionary() {
  return useContext(DictionaryContext);
}

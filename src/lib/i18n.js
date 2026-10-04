// src/lib/i18n.js
import { cookies } from "next/headers";
import { getDictionary } from "@/dictionaries";

export const SUPPORTED_LOCALES = ["en", "bn"];
export const DEFAULT_LOCALE = "en";

export async function getLocale() {
  try {
    const cookieStore = await cookies();
    const locale = cookieStore.get("locale")?.value;
    if (locale && SUPPORTED_LOCALES.includes(locale)) {
      return locale;
    }
  } catch {
    // Fallback if accessed outside request context
  }
  return DEFAULT_LOCALE;
}

export async function getDict() {
  const locale = await getLocale();
  return getDictionary(locale);
}

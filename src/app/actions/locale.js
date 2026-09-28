// src/app/actions/locale.js
"use server";

import { cookies } from "next/headers";
import { SUPPORTED_LOCALES, DEFAULT_LOCALE } from "@/lib/i18n";

export async function setLocaleAction(locale) {
  const targetLocale = SUPPORTED_LOCALES.includes(locale)
    ? locale
    : DEFAULT_LOCALE;

  const cookieStore = await cookies();
  cookieStore.set("locale", targetLocale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: "lax",
    httpOnly: false, // accessible for quick hydration consistency
  });

  return { success: true, locale: targetLocale };
}

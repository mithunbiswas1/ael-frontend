// src/next-api/getHomeBanner.js
import { API_BASE_URL } from "@/config/base-url";

export async function getHomeBanner() {
  try {
    const baseUrl = API_BASE_URL.endsWith("/") ? API_BASE_URL : `${API_BASE_URL}/`;
    const res = await fetch(`${baseUrl}home-banner`, {
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      if (json?.data) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn("[getHomeBanner] Failed to fetch home banner from API:", err.message);
  }

  return null;
}

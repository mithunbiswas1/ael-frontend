// src/next-api/getMarketUpdateDetail.js

import { API_BASE_URL } from "@/config/base-url";

export async function getMarketUpdateDetail(slug) {
  if (!slug) return null;

  try {
    const res = await fetch(`${API_BASE_URL}market-updates/detail/${slug}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      return json?.data || null;
    }
  } catch (err) {
    console.warn("[getMarketUpdateDetail] Failed to fetch article:", err.message);
  }

  return null;
}

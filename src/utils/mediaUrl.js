// src/utils/mediaUrl.js

import { baseUriBackend } from "@/config/base-url";

export const LIVE_BACKEND_BASE = (
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  baseUriBackend ||
  "https://api.charutec.com"
).replace(/\/$/, "");

/**
 * Universal media URL resolver for images, videos, and PDFs.
 * Automatically guarantees all media references resolve to https://api.charutec.com
 * and never break due to legacy localhost references or relative paths.
 *
 * @param {string|null|undefined} url - The raw URL from API / database
 * @param {string} [fallback="/default_image.jpg"] - Fallback asset path
 * @returns {string} - Clean, accessible URL
 */
export function getMediaUrl(url, fallback = "/default_image.jpg") {
  if (!url || typeof url !== "string" || !url.trim()) {
    return fallback;
  }

  const trimmed = url.trim();

  // 1. Sanitize any legacy localhost references
  if (
    trimmed.includes("localhost:8005") ||
    trimmed.includes("localhost:8000") ||
    trimmed.includes("127.0.0.1:8005") ||
    trimmed.includes("127.0.0.1:8000")
  ) {
    return trimmed.replace(
      /^https?:\/\/(localhost|127\.0\.0\.1):(8005|8000)/i,
      LIVE_BACKEND_BASE
    );
  }

  // 2. Preserve Data URIs, Blobs, and External video embeds
  if (
    trimmed.startsWith("data:") ||
    trimmed.startsWith("blob:") ||
    trimmed.includes("youtube.com") ||
    trimmed.includes("youtu.be") ||
    trimmed.includes("vimeo.com")
  ) {
    return trimmed;
  }

  // 3. Prepend live backend domain for uploaded media
  if (trimmed.startsWith("/public/upload") || trimmed.startsWith("public/upload")) {
    const cleanPath = trimmed.startsWith("/") ? trimmed.slice(1) : trimmed;
    return `${LIVE_BACKEND_BASE}/${cleanPath}`;
  }

  // 4. If it's already an absolute HTTP/HTTPS URL, return it
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  // 5. Next.js local static assets in public/ (e.g., /default_image.jpg, /safe_lpg.png)
  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  // 6. Any other relative path
  return `${LIVE_BACKEND_BASE}/${trimmed}`;
}

export default getMediaUrl;

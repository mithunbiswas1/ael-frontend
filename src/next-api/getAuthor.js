// src/next-api/getAuthor.js

import { API_BASE_URL } from "@/config/base-url";

/**
 * Fetch public author profile and their authored content (blogs + market updates)
 * @param {string} identifier - Author username, ObjectId, or full name
 */
export async function getAuthorProfile(identifier) {
  if (!identifier) return null;

  try {
    const encoded = encodeURIComponent(identifier.trim());
    const res = await fetch(`${API_BASE_URL}user/author/${encoded}`, {
      next: { revalidate: 30 },
    });

    if (res.ok) {
      const json = await res.json();
      return json?.data || null;
    }
  } catch (err) {
    // Fail gracefully
  }

  return null;
}

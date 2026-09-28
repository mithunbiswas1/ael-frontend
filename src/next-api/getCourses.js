// src/next-api/getCourses.js

import { API_BASE_URL } from "@/config/base-url";

export async function getCourses({
  category = "all",
  search = "",
  level = "all",
  priceType = "all",
} = {}) {
  const params = new URLSearchParams();
  if (category && category !== "all") params.append("category", category);
  if (search && search.trim()) params.append("search", search.trim());
  if (level && level !== "all") params.append("level", level);
  if (priceType && priceType !== "all") params.append("priceType", priceType);

  try {
    const res = await fetch(`${API_BASE_URL}courses?${params.toString()}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      if (json?.data) {
        return json.data.map((c) => ({
          ...c,
          id: c.courseId,
        }));
      }
    }
  } catch (err) {
    console.error("[getCourses] Error fetching from backend:", err.message);
  }

  return [];
}

export async function getCourseById(id) {
  try {
    const res = await fetch(`${API_BASE_URL}courses/${id}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      if (json?.data) {
        return {
          ...json.data,
          id: json.data.courseId,
        };
      }
    }
  } catch (err) {
    console.error("[getCourseById] Error fetching from backend:", err.message);
  }

  return null;
}

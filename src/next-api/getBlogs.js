// src/next-api/getBlogs.js

import { API_BASE_URL } from "@/config/base-url";

export async function getBlogs({
  limit = 20,
  order = "desc",
  page = 1,
  q = "",
  category = "all",
} = {}) {
  const validPage = Math.max(1, parseInt(page, 10) || 1);

  const params = new URLSearchParams();
  params.append("limit", limit.toString());
  params.append("order", order);
  params.append("page", validPage.toString());

  if (q) params.append("q", q);
  if (category && category !== "all") params.append("category", category);

  try {
    const res = await fetch(`${API_BASE_URL}blogs?${params.toString()}`, {
      next: { revalidate: 60 }, // ISR revalidation
    });

    if (res.ok) {
      const json = await res.json();
      if (json?.data?.data && Array.isArray(json.data.data)) {
        return json.data.data.map((item) => ({
          id: item._id,
          slug: item.slug,
          title: item.titleEn,
          titleBn: item.titleBn,
          description: item.descriptionEn,
          descriptionBn: item.descriptionBn,
          shortDescription: item.shortDescriptionEn || item.descriptionEn || "",
          shortDescriptionBn: item.shortDescriptionBn || item.descriptionBn || "",
          content: item.contentEn,
          contentBn: item.contentBn,
          category: item.category,
          categoryBn: item.categoryBn,
          categoryId: item.category,
          imageUrl: item.image,
          author: item.authorEn,
          authorBn: item.authorBn,
          authorUsername:
            item.createdBy?.userName ||
            (item.authorEn ? item.authorEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : "author"),
          authorImage: item.createdBy?.image || null,
          authorDesignation: item.createdBy?.designation || "",
          createdBy: item.createdBy,
          readTime: item.readTimeEn,
          readTimeBn: item.readTimeBn,
          date: new Date(item.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          dateBn: new Date(item.createdAt).toLocaleDateString("bn-BD"),
          views: item.views || 0,
          accessType: item.accessType || "free",
          tags: item.tags || [],
        }));
      }
    }
  } catch (err) {
    console.warn("[getBlogs] Failed to fetch blogs from API:", err.message);
  }

  return [];
}

export async function getBlogBySlug(slug) {
  try {
    const res = await fetch(`${API_BASE_URL}blogs/detail/${slug}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      if (json?.data) {
        const item = json.data;
        return {
          id: item._id,
          slug: item.slug,
          title: item.titleEn,
          titleBn: item.titleBn,
          description: item.descriptionEn,
          descriptionBn: item.descriptionBn,
          shortDescription: item.shortDescriptionEn || item.descriptionEn || "",
          shortDescriptionBn: item.shortDescriptionBn || item.descriptionBn || "",
          content: item.contentEn,
          contentBn: item.contentBn,
          category: item.category,
          categoryBn: item.categoryBn,
          categoryId: item.category,
          imageUrl: item.image,
          author: item.authorEn,
          authorBn: item.authorBn,
          authorUsername:
            item.createdBy?.userName ||
            (item.authorEn ? item.authorEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") : "author"),
          authorImage: item.createdBy?.image || null,
          authorDesignation: item.createdBy?.designation || "",
          createdBy: item.createdBy,
          readTime: item.readTimeEn,
          readTimeBn: item.readTimeBn,
          views: item.views || 0,
          accessType: item.accessType || "free",
          date: new Date(item.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          dateBn: new Date(item.createdAt).toLocaleDateString("bn-BD"),
          tags: item.tags || [],
        };
      }
    }
  } catch {
    // Silent catch
  }

  return null;
}

export async function getBlogCategories() {
  try {
    const res = await fetch(`${API_BASE_URL}blogs/categories`, {
      next: { revalidate: 60 },
    });
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json?.data)) {
        return json.data;
      }
    }
  } catch {
    // Silent catch
  }
  return [];
}

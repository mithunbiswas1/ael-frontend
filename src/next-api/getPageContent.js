// src/next-api/getPageContent.js
import { API_BASE_URL } from "@/config/base-url";

export async function getPageContent(pageKey) {
  try {
    const baseUrl = API_BASE_URL.endsWith("/") ? API_BASE_URL : `${API_BASE_URL}/`;
    const res = await fetch(`${baseUrl}pages/${pageKey}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return {
        banner: null,
        sections: {},
        contentHtml: "",
        contentHtmlBn: "",
      };
    }

    const json = await res.json();
    const dbPage = json?.data;

    if (!dbPage) {
      return {
        banner: null,
        sections: {},
        contentHtml: "",
        contentHtmlBn: "",
      };
    }

    const rawBanner = dbPage.banner;
    const banner = rawBanner
      ? {
          type: rawBanner.type || "visual",
          icon: rawBanner.icon || "scale",
          title: rawBanner.title || "",
          titleBn: rawBanner.titleBn || "",
          accent: rawBanner.accent || "",
          accentBn: rawBanner.accentBn || "",
          description: rawBanner.description || "",
          descriptionBn: rawBanner.descriptionBn || "",
          imageSrc: rawBanner.imageSrc || "",
          imageAlt: rawBanner.imageAlt || "",
          imageAltBn: rawBanner.imageAltBn || "",
          ctaText: rawBanner.ctaText || "",
          ctaTextBn: rawBanner.ctaTextBn || "",
          ctaLink: rawBanner.ctaLink || "",
          breadcrumb: rawBanner.breadcrumb || null,
        }
      : null;

    return {
      banner,
      sections: dbPage.sections || {},
      contentHtml: dbPage.contentHtml || "",
      contentHtmlBn: dbPage.contentHtmlBn || "",
    };
  } catch {
    return {
      banner: null,
      sections: {},
      contentHtml: "",
      contentHtmlBn: "",
    };
  }
}

// src/next-api/getMarketUpdates.js

import { API_BASE_URL } from "@/config/base-url";

export async function getMarketUpdates({
  limit = 10,
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
    const res = await fetch(`${API_BASE_URL}market-updates?${params.toString()}`, {
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
          summary: item.summaryEn,
          summaryBn: item.summaryBn,
          category: item.category,
          categoryBn: item.categoryBn,
          imageUrl: item.image,
          pdfUrl: item.pdfUrl || "",
          pdfOriginalName: item.pdfOriginalName || "",
          pdfSize: item.pdfSize || 0,
          author: item.authorEn,
          authorBn: item.authorBn,
          publishDate: item.publishDate || item.createdAt,
          date: new Date(item.publishDate || item.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          dateBn: new Date(item.publishDate || item.createdAt).toLocaleDateString("bn-BD"),
          tags: item.tags || [],
          isFeatured: Boolean(item.isFeatured),
        }));
      }
    }
  } catch (err) {
    console.warn("[getMarketUpdates] Failed to fetch market updates from API:", err.message);
  }

  // Graceful fallback if offline
  return [
    {
      id: "fallback-1",
      slug: "chattogram-port-lpg-terminal-safety-probe-analysis",
      title: "Chattogram Port LPG Terminal Safety Probe & Incident Analysis Report",
      titleBn: "চট্টগ্রাম বন্দর এলপিজি টার্মিনাল নিরাপত্তা তদন্ত ও দুর্ঘটনা বিশ্লেষণ প্রতিবেদন",
      summary:
        "Comprehensive investigation into the static discharge leak and rapid valve response at Chattogram coastal terminal.",
      summaryBn:
        "চট্টগ্রাম উপকূলীয় টার্মিনালে স্ট্যাটিক ডিসচার্জ লিক ও জরুরি ভাল্ব নিয়ন্ত্রণ ব্যবস্থার কারিগরি তদন্ত প্রতিবেদন।",
      category: "incidents",
      categoryBn: "দুর্ঘটনা ও তদন্ত প্রতিবেদন",
      imageUrl:
        "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop",
      pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      pdfOriginalName: "DoE-Chattogram-Terminal-Probe-Report-2024.pdf",
      date: "May 20, 2024",
      dateBn: "২০ মে, ২০২৪",
    },
    {
      id: "fallback-2",
      slug: "berc-official-statutory-notice-12kg-cylinder-pricing",
      title: "BERC Official Statutory Notice: 12kg Cylinder Retail Price & Tariff Formula",
      titleBn: "বিইআরসি সংবিধিবদ্ধ প্রজ্ঞাপন: ১২ কেজি সিলিন্ডার খুচরা মূল্য ও ট্যারিফ নির্ধারণ",
      summary:
        "Bangladesh Energy Regulatory Commission (BERC) gazette notification outlining international CP adjustment.",
      summaryBn:
        "বাংলাদেশ এনার্জি রেগুলেটরি কমিশন (বিইআরসি) কর্তৃক ঘোষিত ভোক্তা পর্যায়ে ১২ কেজি এলপিজির মূল্য তালিকা।",
      category: "berc",
      categoryBn: "বিইআরসি বার্তা ও মূল্য সার্কুলার",
      imageUrl:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop",
      pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      pdfOriginalName: "BERC-Gazette-LPG-Consumer-Price-Circular.pdf",
      date: "May 18, 2024",
      dateBn: "১৮ মে, ২০২৪",
    },
  ];
}

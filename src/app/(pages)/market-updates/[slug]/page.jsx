// src/app/(pages)/market-updates/[slug]/page.jsx

import { notFound } from "next/navigation";
import { getMarketUpdateDetail } from "@/next-api/getMarketUpdateDetail";
import { getMarketUpdates } from "@/next-api/getMarketUpdates";
import MarketUpdateDetailContent from "./_view/MarketUpdateDetailContent";
import { getLocale } from "@/lib/i18n";

export async function generateStaticParams() {
  const updates = await getMarketUpdates({ limit: 100 });
  return (updates || []).map((item) => ({
    slug: item.slug,
  }));
}

function cleanHtml(raw = "") {
  if (!raw) return "";
  return raw
    .replace(/<[^>]*>?/gm, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function generateMetadata({ params }) {
  const [resolvedParams, locale] = await Promise.all([params, getLocale()]);
  const slug = resolvedParams.slug;
  const data = await getMarketUpdateDetail(slug);
  const article = data?.article;

  if (!article) {
    return {
      title: "Market Update Not Found | Safe LPG Platform",
      description: "The requested LPG regulatory circular or incident report could not be found.",
    };
  }

  const isBn = locale === "bn";

  const rawTitle = isBn
    ? article.metaTitleBn || article.titleBn || article.metaTitle || article.titleEn
    : article.metaTitle || article.titleEn;

  const siteSuffix = isBn ? "মার্কেট আপডেট | সেইফ এলপিজি" : "Market Updates | Safe LPG Bangladesh";
  const finalTitle = rawTitle?.includes("Safe LPG") ? rawTitle : `${rawTitle} | ${siteSuffix}`;

  const rawDescription = isBn
    ? article.metaDescriptionBn || article.summaryBn || article.metaDescription || article.summaryEn
    : article.metaDescription || article.summaryEn;

  const cleanDescription = cleanHtml(rawDescription).slice(0, 160);

  const keywords = article.metaKeywords
    ? article.metaKeywords
    : Array.isArray(article.tags)
    ? article.tags.join(", ")
    : "lpg, market update, berc, cylinder safety, circular, gazette, bangladesh";

  return {
    title: finalTitle,
    description: cleanDescription,
    keywords,
    openGraph: {
      title: finalTitle,
      description: cleanDescription,
      url: `/market-updates/${slug}`,
      siteName: "Safe LPG Bangladesh",
      images: [
        {
          url: article.image || "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=1200",
          width: 1200,
          height: 630,
          alt: finalTitle,
        },
      ],
    },
  };
}

export default async function MarketUpdateDetailPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const data = await getMarketUpdateDetail(slug);

  if (!data?.article) {
    // Check fallback items
    if (slug === "chattogram-port-lpg-terminal-safety-probe-analysis") {
      const fallbackArticle = {
        _id: "fb-1",
        slug,
        titleEn: "Chattogram Port LPG Terminal Safety Probe & Incident Analysis Report",
        titleBn: "চট্টগ্রাম বন্দর এলপিজি টার্মিনাল নিরাপত্তা তদন্ত ও দুর্ঘটনা বিশ্লেষণ প্রতিবেদন",
        category: "incidents",
        categoryBn: "দুর্ঘটনা ও তদন্ত প্রতিবেদন",
        summaryEn:
          "Comprehensive investigation into the static discharge leak and rapid valve response at Chattogram coastal terminal.",
        summaryBn:
          "চট্টগ্রাম উপকূলীয় টার্মিনালে স্ট্যাটিক ডিসচার্জ লিক ও জরুরি ভাল্ব নিয়ন্ত্রণ ব্যবস্থার কারিগরি তদন্ত প্রতিবেদন।",
        contentEn: `<h3>Executive Summary</h3><p>On May 14, 2024, a localized flange pressure variance triggered automatic safety shutoff valves at the Chattogram outer anchorage unloading terminal. The Department of Explosives (DoE) joint probe committee deployed high-precision telemetry to determine the root cause.</p><h4>Key Findings</h4><ul><li>Automated shut-off activated within 1.8 seconds.</li><li>Zero vapor escape into coastal perimeter zones.</li><li>Ultrasonic flange testing mandated for all vessel offloading couplings.</li></ul>`,
        contentBn: `<h3>সারসংক্ষেপ</h3><p>গত ১৪ মে ২০২৪ তারিখে চট্টগ্রাম বহির্নোঙর টার্মিনালে আনলোডিং চলাকালীন পাইপলাইন ফ্ল্যাঞ্জে প্রেশার বৈষম্য পরিলক্ষিত হলে স্বয়ংক্রিয় সেফটি ভাল্ব দ্রুত সক্রিয় হয়। বিস্ফোরক পরিদপ্তর (DoE) ও এনার্জি রেগুলেটরি কমিটির যৌথ তদন্ত দল সার্বিক কারিগরি পরীক্ষা সম্পন্ন করেছে।</p>`,
        image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop",
        pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        pdfOriginalName: "DoE-Chattogram-Terminal-Probe-Report-2024.pdf",
        pdfSize: 2450000,
        authorEn: "Engr. Mahmudul Hasan (DoE Lead Auditor)",
        authorBn: "প্রকৌশলী মাহমুদুল হাসান (বিস্ফোরক পরিদপ্তর)",
        publishDate: new Date("2024-05-20"),
        views: 1420,
        tags: ["incidents", "safety-probe", "chattogram", "doe-circular"],
      };
      return <MarketUpdateDetailContent article={fallbackArticle} related={[]} />;
    }

    notFound();
  }

  return (
    <MarketUpdateDetailContent
      article={data.article}
      related={data.related || []}
    />
  );
}

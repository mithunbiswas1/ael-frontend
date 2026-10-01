// src/app/(pages)/blogs/[slug]/page.jsx

import { notFound } from "next/navigation";
import { getBlogBySlug, getBlogs } from "@/next-api/getBlogs";
import BlogSingleContent from "./_view/BlogSingleContent";
import { getLocale } from "@/lib/i18n";

export async function generateStaticParams() {
  const blogs = await getBlogs({ limit: 100 });
  return (blogs || []).map((item) => ({
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
  const currentPost = await getBlogBySlug(slug);

  if (!currentPost) {
    return {
      title: "Blog Not Found | Safe LPG Platform",
      description: "The requested LPG safety or industry article could not be located.",
    };
  }

  const isBn = locale === "bn";

  // Prioritize metaTitle, then fallback to title
  const rawTitle = isBn
    ? currentPost.metaTitleBn || currentPost.titleBn || currentPost.metaTitle || currentPost.title
    : currentPost.metaTitle || currentPost.title;

  const siteSuffix = isBn ? "সেইফ এলপিজি ব্লগ" : "Safe LPG Blog";
  const finalTitle = rawTitle?.includes("Safe LPG") ? rawTitle : `${rawTitle} | ${siteSuffix}`;

  // Prioritize metaDescription, then fallback to description (cleaned of HTML tags)
  const rawDescription = isBn
    ? currentPost.metaDescriptionBn || currentPost.descriptionBn || currentPost.metaDescription || currentPost.description
    : currentPost.metaDescription || currentPost.description;

  const cleanDescription = cleanHtml(rawDescription).slice(0, 160);

  // Keywords
  const keywords = currentPost.metaKeywords
    ? currentPost.metaKeywords
    : Array.isArray(currentPost.tags)
    ? currentPost.tags.join(", ")
    : currentPost.tags || "LPG safety, gas cylinder, bangladesh energy, safety regulations";

  const canonicalUrl = currentPost.canonicalUrl || `https://safelpg.com/blogs/${slug}`;
  const ogImageUrl = currentPost.ogImage || currentPost.image || "https://safelpg.com/images/banner.jpg";

  return {
    title: finalTitle,
    description: cleanDescription,
    keywords: keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: finalTitle,
      description: cleanDescription,
      url: `/blogs/${slug}`,
      siteName: "Safe LPG Bangladesh",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: rawTitle || "Safe LPG Blog",
        },
      ],
      type: "article",
      publishedTime: currentPost.createdAt,
      authors: [currentPost.authorEn || "Safe LPG Technical Committee"],
    },
    twitter: {
      card: "summary_large_image",
      title: finalTitle,
      description: cleanDescription,
      images: [ogImageUrl],
    },
  };
}

export default async function BlogSinglePage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const [currentPost, allBlogs] = await Promise.all([
    getBlogBySlug(slug),
    getBlogs({ limit: 10 }),
  ]);

  if (!currentPost) {
    notFound();
  }

  const relatedPosts = (allBlogs || [])
    .filter((b) => b.id !== currentPost.id && b.slug !== currentPost.slug)
    .slice(0, 6);

  return (
    <BlogSingleContent
      currentPost={currentPost}
      relatedPosts={relatedPosts}
    />
  );
}

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

export async function generateMetadata({ params }) {
  const [resolvedParams, locale] = await Promise.all([params, getLocale()]);
  const slug = resolvedParams.slug;
  const currentPost = await getBlogBySlug(slug);

  if (!currentPost) {
    return {
      title: "Blog Not Found | Safe LPG Platform",
    };
  }

  const isBn = locale === "bn";

  return {
    title: `${isBn ? currentPost.titleBn || currentPost.title : currentPost.title} | ${
      isBn ? "সেইফ এলপিজি ব্লগ" : "Safe LPG Blog"
    }`,
    description: isBn
      ? currentPost.descriptionBn || currentPost.description
      : currentPost.description,
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

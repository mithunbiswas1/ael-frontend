// src/app/(home)/_components/LatestBlogsSection.jsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BlogCard from "@/components/shared/BlogCard";
import SectionHeader from "@/components/ui/SectionHeader";

export default function LatestBlogsSection({
  dict = {},
  liveBlogs = null,
  locale = "en",
}) {
  if (!liveBlogs || liveBlogs.length === 0) return null;

  const isBn = locale === "bn";

  const items = liveBlogs.slice(0, 2).map((blog) => ({
    id: blog.id,
    category: blog.category,
    badgeText: isBn ? blog.categoryBn : blog.category.toUpperCase(),
    imageUrl: blog.imageUrl,
    title: isBn ? blog.titleBn : blog.title,
    date: isBn ? blog.dateBn : blog.date,
    readTime: isBn ? blog.readTimeBn : blog.readTime,
    href: `/blogs/${blog.slug}`,
  }));

  return (
    <div>
      {/* Header */}
      <SectionHeader
        level="h3"
        tag={dict?.tag || "EDUCATION & ADVISORY"}
        title={dict?.title || "LATEST BLOG"}
        accent={dict?.accent || "POSTS."}
        subtitle={
          dict?.subtitle ||
          "Articles, safety advisories, and expert guides for LPG users in Bangladesh"
        }
        className="mb-5"
        action={
          <Link
            href="/blogs"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/90 px-4 py-1.5 text-xs font-bold text-slate-700 backdrop-blur-md transition-colors duration-200 hover:border-primary hover:bg-primary hover:text-white"
          >
            <span>{dict?.viewAll || "View All"}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        }
      />

      {/* Cards Grid */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-2">
        {items.map((item) => (
          <BlogCard
            key={item.id}
            category={item.category}
            badgeText={item.badgeText}
            imageUrl={item.imageUrl}
            title={item.title}
            date={item.date}
            readTime={item.readTime}
            href={item.href}
          />
        ))}
      </div>
    </div>
  );
}

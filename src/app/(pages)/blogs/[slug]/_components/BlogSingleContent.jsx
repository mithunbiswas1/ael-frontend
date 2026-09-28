// src/app/(pages)/blogs/[slug]/_components/BlogSingleContent.jsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import Breadcrumb from "@/components/ui/Breadcrumb";
import BlogArticleContent from "./BlogArticleContent";
import BlogArticleSidebar from "./BlogArticleSidebar";
import { useDictionary } from "@/context/DictionaryContext";

export default function BlogSingleContent({ currentPost, relatedPosts }) {
  const { locale, dict } = useDictionary();
  const isBn = locale === "bn";
  const common = dict?.common || {};

  const [isPlaying, setIsPlaying] = useState(false);

  const handleShare = (platform) => {
    toast.success(
      isBn ? `${platform}-এ শেয়ার করা হচ্ছে...` : `Sharing to ${platform}...`
    );
  };

  const title = isBn ? currentPost.titleBn || currentPost.title : currentPost.title;

  return (
    <main className="min-h-screen bg-slate-50 py-10 sm:py-12">
      <div className="site-container">
        {/* 1. Breadcrumb */}
        <Breadcrumb
          items={[
            { label: common.home || "Home", href: "/" },
            {
              label:
                dict?.navbar?.navLinks?.blog || (isBn ? "ব্লগ" : "Blog"),
              href: "/blogs",
            },
            { label: title },
          ]}
          className="mb-6"
        />

        {/* 2. Main Content & Sidebar Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <BlogArticleContent
            currentPost={currentPost}
            handleShare={handleShare}
            setIsPlaying={setIsPlaying}
            toast={toast}
          />
          <BlogArticleSidebar relatedPosts={relatedPosts} />
        </div>
      </div>
    </main>
  );
}

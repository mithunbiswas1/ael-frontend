// src/app/(pages)/blogs/_view/BlogsContent.jsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Shield, Newspaper } from "lucide-react";
import VisualHeroBanner from "@/components/ui/VisualHeroBanner";
import BlogCategoriesSidebar from "../_components/BlogCategoriesSidebar";
import BlogPostsSection from "../_components/BlogPostsSection";
import BlogRightSidebar from "../_components/BlogRightSidebar";
import { useDictionary } from "@/context/DictionaryContext";

export default function BlogsContent({ blogsData, bannerData }) {
  const { locale, dict } = useDictionary();
  const isBn = locale === "bn";
  const blogsDict = dict?.blogs || {};
  const common = dict?.common || {};

  const categories = [
    {
      id: "all",
      name: isBn ? "সকল ক্যাটাগরি" : "All Categories",
      icon: Shield,
    },
    {
      id: "seminar",
      name: isBn ? "সেমিনার" : "Seminar",
      icon: Shield,
    },
    {
      id: "programs_of_association",
      name: isBn ? "অ্যাসোসিয়েশনের কার্যক্রম" : "Programs of Association",
      icon: Newspaper,
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [viewType, setViewType] = useState("grid"); // "grid" | "list"

  // Localized blogs mapping
  const localizedBlogs = (blogsData || []).map((b) => ({
    ...b,
    title: isBn ? b.titleBn || b.title : b.title,
    description: isBn ? b.descriptionBn || b.description : b.description,
    category: isBn ? b.categoryBn || b.category : b.category,
    date: isBn ? b.dateBn || b.date : b.date,
    readTime: isBn ? b.readTimeBn || b.readTime : b.readTime,
    author: isBn ? b.authorBn || b.author : b.author,
  }));

  const filteredBlogs = localizedBlogs.filter((b) => {
    const matchesCategory =
      selectedCategory === "all" || b.categoryId === selectedCategory;
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const popularPosts = localizedBlogs.slice(0, 6);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* 1. Hero Banner passed from page */}
      {bannerData && <VisualHeroBanner data={bannerData} />}

      {/* 2. Main 3-Column Content Layout */}
      <section className="py-12 sm:py-16">
        <div className="site-container">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left Sidebar: Categories & View Type (3 cols) */}
            <BlogCategoriesSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              viewType={viewType}
              setViewType={setViewType}
            />

            {/* Center Content: Search & Blog Cards Grid (6 cols) */}
            <BlogPostsSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sortBy={sortBy}
              setSortBy={setSortBy}
              viewType={viewType}
              filteredBlogs={filteredBlogs}
            />

            {/* Right Sidebar: Popular Articles (3 cols) */}
            <BlogRightSidebar popularPosts={popularPosts} />
          </div>
        </div>
      </section>
    </main>
  );
}

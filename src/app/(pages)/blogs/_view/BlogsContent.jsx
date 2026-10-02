// src/app/(pages)/blogs/_view/BlogsContent.jsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Shield, Newspaper } from "lucide-react";
import VisualHeroBanner from "@/components/ui/VisualHeroBanner";
import BlogPostsSection from "../_components/BlogPostsSection";
import BlogSidebar from "../_components/BlogSidebar";
import { useDictionary } from "@/context/DictionaryContext";

export default function BlogsContent({ blogsData, categoriesData, bannerData }) {
  const { locale, dict } = useDictionary();
  const isBn = locale === "bn";
  const blogsDict = dict?.blogs || {};
  const common = dict?.common || {};

  // Build dynamic categories from backend API with fallback
  const categories = [
    {
      id: "all",
      name: isBn ? "সকল ক্যাটাগরি" : "All Categories",
      icon: Shield,
    },
    ...(Array.isArray(categoriesData) && categoriesData.length > 0
      ? categoriesData.map((cat) => ({
          id: cat.slug || cat.nameEn || cat._id,
          name: isBn
            ? cat.nameBn || cat.nameEn || cat.name
            : cat.nameEn || cat.name || cat.nameBn,
          icon: Newspaper,
        }))
      : [
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
        ]),
  ];

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [viewType, setViewType] = useState("grid"); // "grid" | "list"

  // Localized blogs mapping with shortDescription
  const localizedBlogs = (blogsData || []).map((b) => ({
    ...b,
    title: isBn ? b.titleBn || b.title : b.title,
    description: isBn ? b.descriptionBn || b.description : b.description,
    shortDescription: isBn
      ? b.shortDescriptionBn || b.shortDescription || b.descriptionBn || b.description
      : b.shortDescription || b.description,
    category: isBn ? b.categoryBn || b.category : b.category,
    date: isBn ? b.dateBn || b.date : b.date,
    readTime: isBn ? b.readTimeBn || b.readTime : b.readTime,
    author: isBn ? b.authorBn || b.author : b.author,
  }));

  const filteredBlogs = localizedBlogs.filter((b) => {
    const rawCat = (b.category || "").toLowerCase();
    const rawCatId = (b.categoryId || "").toLowerCase();
    const targetCat = selectedCategory.toLowerCase();

    const matchesCategory =
      selectedCategory === "all" ||
      rawCat === targetCat ||
      rawCatId === targetCat ||
      rawCat.replace(/[\s-]+/g, "_") === targetCat.replace(/[\s-]+/g, "_") ||
      rawCatId.replace(/[\s-]+/g, "_") === targetCat.replace(/[\s-]+/g, "_");

    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.shortDescription &&
        b.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const popularPosts = localizedBlogs.slice(0, 6);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* 1. Hero Banner passed from page */}
      {bannerData && <VisualHeroBanner data={bannerData} />}

      {/* 2. Main 4-Column Content Layout: 3 columns blog, 1 column sidebar */}
      <section className="py-12 sm:py-16">
        <div className="site-container">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
            {/* First 3 columns: Blog posts list / grid with inline View Toggle */}
            <BlogPostsSection
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sortBy={sortBy}
              setSortBy={setSortBy}
              viewType={viewType}
              setViewType={setViewType}
              filteredBlogs={filteredBlogs}
            />

            {/* Last column: 1) Categories, 2) Popular blogs */}
            <BlogSidebar
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              popularPosts={popularPosts}
            />
          </div>
        </div>
      </section>
    </main>
  );
}

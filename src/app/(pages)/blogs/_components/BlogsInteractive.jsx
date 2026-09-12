"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Shield, Newspaper, Flame, Scale, Cpu, Leaf } from "lucide-react";
import BlogCategoriesSidebar from "./BlogCategoriesSidebar";
import BlogPostsSection from "./BlogPostsSection";
import BlogRightSidebar from "./BlogRightSidebar";

export const BLOG_CATEGORIES = [
  { id: "all", name: "All Categories", icon: Shield },
  { id: "safety", name: "LPG Safety", icon: Shield },
  { id: "news", name: "Industry News", icon: Newspaper },
  { id: "tips", name: "Tips & Awareness", icon: Flame },
  { id: "regulations", name: "Regulations", icon: Scale },
  { id: "technology", name: "Technology", icon: Cpu },
  { id: "environment", name: "Environment", icon: Leaf },
];

export default function BlogsInteractive({ blogsData = [] }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [viewType, setViewType] = useState("grid"); // "grid" | "list"
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const filteredBlogs = blogsData.filter((b) => {
    const matchesCategory =
      selectedCategory === "all" || b.categoryId === selectedCategory;
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail) {
      toast.error("Please enter your email");
      return;
    }
    toast.success("Thank you for subscribing to our blog!");
    setNewsletterEmail("");
  };

  const popularPosts = blogsData.slice(0, 3);

  return (
    <section className="py-12 sm:py-16">
      <div className="site-container">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Sidebar: Categories & View Type (3 cols) */}
          <BlogCategoriesSidebar
            categories={BLOG_CATEGORIES}
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

          {/* Right Sidebar: Subscribe & Popular Posts (3 cols) */}
          <BlogRightSidebar
            newsletterEmail={newsletterEmail}
            setNewsletterEmail={setNewsletterEmail}
            handleSubscribe={handleSubscribe}
            popularPosts={popularPosts}
          />
        </div>
      </div>
    </section>
  );
}

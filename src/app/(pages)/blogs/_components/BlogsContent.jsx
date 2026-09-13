"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Shield, Newspaper, Flame, Scale, Cpu, Leaf } from "lucide-react";
import GlobalHeroSection from "@/_components/GlobalHeroSection";
import BlogCategoriesSidebar from "./BlogCategoriesSidebar";
import BlogPostsSection from "./BlogPostsSection";
import BlogRightSidebar from "./BlogRightSidebar";

export const BLOG_CATEGORIES = [
  { id: "all", name: "All Categories", icon: Shield },
  { id: "seminar", name: "Seminar", icon: Shield },
  { id: "programs_of_association", name: "Programs of Association", icon: Newspaper },
];

export default function BlogsContent({ blogsData }) {
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

  const popularPosts = blogsData.slice(0, 6);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* 1. Hero Banner */}
      <GlobalHeroSection
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Blog & Insights" },
        ]}
        badgeText="INDUSTRY INSIGHTS & SAFETY ARTICLES"
        title="BLOG &"
        accent="INSIGHTS."
        description="Stay updated with expert perspectives, safety guidelines, regulatory announcements, and market trends across the Bangladesh LPG energy landscape."
        imageSrc="https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=800&auto=format&fit=crop"
        imageAlt="LPG Industry Insights & Engineering Seminars"
        infoTag={{
          title: "Verified Technical Insights",
          subtitle: "Authored by certified energy engineers & safety officers",
        }}
      />

      {/* 2. Main 3-Column Content Layout */}
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
    </main>
  );
}

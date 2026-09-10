// src/app/(home)/_components/LatestBlogsSection.jsx
"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import BlogCard from "@/components/shared/BlogCard";
import SectionHeader from "@/components/ui/SectionHeader";

const blogsData = [
  {
    id: 1,
    category: "seminar",
    badgeText: "Seminar",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop",
    title: "LPG Safety Seminar Held in Dhaka",
    date: "May 18, 2024",
    readTime: "5 min read",
    href: "/blogs/1",
  },
  {
    id: 2,
    category: "safety",
    badgeText: "Safety Tips",
    imageUrl: "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=600&auto=format&fit=crop",
    title: "10 Essential LPG Safety Tips for Everyone",
    date: "May 16, 2024",
    readTime: "4 min read",
    href: "/blogs/2",
  },
  {
    id: 3,
    category: "program",
    badgeText: "Program",
    imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600&auto=format&fit=crop",
    title: "Upcoming Programs and Activities",
    date: "May 14, 2024",
    readTime: "3 min read",
    href: "/blogs/3",
  },
];

export default function LatestBlogsSection() {
  return (
    <div>
      {/* Header */}
      <SectionHeader
        level="h3"
        tag="KNOWLEDGE BASE"
        title="LATEST BLOG"
        accent="POSTS."
        subtitle="Educational articles, safety protocols, and sector analysis"
        className="mb-5"
        action={
          <Link
            href="/blogs"
            className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/90 px-4 py-1.5 text-xs font-bold text-slate-700 backdrop-blur-md transition-colors duration-200 hover:border-primary hover:bg-primary hover:text-white"
          >
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        }
      />

      {/* 3 Cards Grid */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {blogsData.map((item) => (
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

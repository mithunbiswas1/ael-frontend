// src/app/(home)/_components/LatestBlogsSection.jsx

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
    href: "/blogs/lpg-demand-to-rise-in-bangladesh-by-2025",
  },
  {
    id: 2,
    category: "safety",
    badgeText: "Safety Tips",
    imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=600&auto=format&fit=crop",
    title: "10 Essential LPG Safety Tips for Everyone",
    date: "May 16, 2024",
    readTime: "4 min read",
    href: "/blogs/10-essential-lpg-safety-tips-for-every-home",
  },
  {
    id: 3,
    category: "program",
    badgeText: "Program",
    imageUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600&auto=format&fit=crop",
    title: "Upcoming Programs and Activities",
    date: "May 14, 2024",
    readTime: "3 min read",
    href: "/blogs/how-to-detect-lpg-gas-leakage-quickly",
  },
  {
    id: 4,
    category: "regulations",
    badgeText: "Regulations",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
    title: "New Safety Regulations Issued by Department of Explosives",
    date: "May 12, 2024",
    readTime: "6 min read",
    href: "/blogs/new-lpg-safety-regulations-issued-by-doe",
  },
  {
    id: 5,
    category: "technology",
    badgeText: "Technology",
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop",
    title: "Smart LPG Monitoring Systems for Household Safety",
    date: "May 10, 2024",
    readTime: "4 min read",
    href: "/blogs/smart-lpg-monitoring-systems-for-safety",
  },
  {
    id: 6,
    category: "environment",
    badgeText: "Environment",
    imageUrl: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=600&auto=format&fit=crop",
    title: "LPG: A Cleaner Energy for Bangladesh’s Greener Future",
    date: "May 08, 2024",
    readTime: "5 min read",
    href: "/blogs/lpg-a-cleaner-energy-for-greener-future",
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

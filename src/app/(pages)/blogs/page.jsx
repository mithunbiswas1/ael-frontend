// src/app/(pages)/blogs/page.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  LayoutGrid,
  List,
  Calendar,
  ArrowRight,
  ChevronRight,
  Shield,
  Newspaper,
  Flame,
  Scale,
  Cpu,
  Leaf,
} from "lucide-react";
import { toast } from "sonner";
import { H1, H2, H3, H4, P } from "@/components/ui/Typography";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Breadcrumb from "@/components/ui/Breadcrumb";
import AmbientGlow from "@/components/ui/AmbientGlow";

export const blogsData = [
  {
    id: "1",
    slug: "10-essential-lpg-safety-tips-for-every-home",
    title: "10 Essential LPG Safety Tips for Every Home",
    category: "LPG Safety",
    categoryId: "safety",
    date: "May 20, 2024",
    readTime: "5 min read",
    author: "AEL Safety Team",
    description:
      "Simple yet crucial safety habits to ensure safe usage, leak detection, and maintenance of LPG cylinders at home.",
    imageUrl:
      "https://images.unsplash.com/photo-1581092335397-9583fe92d232?q=80&w=600&auto=format&fit=crop",
    badgeColor: "bg-blue-600 text-white",
  },
  {
    id: "2",
    slug: "lpg-demand-to-rise-in-bangladesh-by-2025",
    title: "LPG Demand to Rise in Bangladesh by 2025",
    category: "Industry News",
    categoryId: "news",
    date: "May 18, 2024",
    readTime: "4 min read",
    author: "AEL Analytics",
    description:
      "Bangladesh's expanding consumer base and commercial transition are driving unprecedented national LPG demand.",
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop",
    badgeColor: "bg-sky-600 text-white",
  },
  {
    id: "3",
    slug: "how-to-detect-lpg-gas-leakage-quickly",
    title: "How to Detect LPG Gas Leakage Quickly and Safely",
    category: "Tips & Awareness",
    categoryId: "tips",
    date: "May 15, 2024",
    readTime: "3 min read",
    author: "Safety Specialist",
    description:
      "Learn standard soap solution testing and odor identification techniques to avert fire emergencies rapidly.",
    imageUrl:
      "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop",
    badgeColor: "bg-amber-600 text-white",
  },
  {
    id: "4",
    slug: "new-lpg-safety-regulations-issued-by-doe",
    title: "New LPG Safety Regulations Issued by Department of Explosives",
    category: "Regulations",
    categoryId: "regulations",
    date: "May 12, 2024",
    readTime: "6 min read",
    author: "Regulatory Advisory",
    description:
      "DoE updates regulatory mandates regarding high-pressure cylinder storage, transport protocols, and dealer licenses.",
    imageUrl:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600&auto=format&fit=crop",
    badgeColor: "bg-purple-600 text-white",
  },
  {
    id: "5",
    slug: "smart-lpg-monitoring-systems-for-safety",
    title: "Smart LPG Monitoring Systems for Household and Commercial Safety",
    category: "Technology",
    categoryId: "technology",
    date: "May 10, 2024",
    readTime: "4 min read",
    author: "Tech Insights",
    description:
      "How IoT sensors, smart regulators, and automatic shut-off valves are shaping the future of gas safety.",
    imageUrl:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop",
    badgeColor: "bg-indigo-600 text-white",
  },
  {
    id: "6",
    slug: "lpg-a-cleaner-energy-for-greener-future",
    title: "LPG: A Cleaner Energy for Bangladesh’s Greener Future",
    category: "Environment",
    categoryId: "environment",
    date: "May 8, 2024",
    readTime: "5 min read",
    author: "Eco Awareness",
    description:
      "Replacing conventional solid fuels with LPG decreases carbon emissions and promotes indoor air quality.",
    imageUrl:
      "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?q=80&w=600&auto=format&fit=crop",
    badgeColor: "bg-emerald-600 text-white",
  },
];

const blogCategories = [
  { id: "all", name: "All Categories", icon: Shield },
  { id: "safety", name: "LPG Safety", icon: Shield },
  { id: "news", name: "Industry News", icon: Newspaper },
  { id: "tips", name: "Tips & Awareness", icon: Flame },
  { id: "regulations", name: "Regulations", icon: Scale },
  { id: "technology", name: "Technology", icon: Cpu },
  { id: "environment", name: "Environment", icon: Leaf },
];

export default function BlogsPage() {
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
    toast.success("Subscribed to blog updates successfully!");
    setNewsletterEmail("");
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* 1. Page Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 pb-16 pt-10 md:pb-20 md:pt-14 text-white">
        <AmbientGlow />

        <div className="site-container relative z-10">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-8">

            {/* Left Column */}
            <div className="flex flex-col items-start lg:col-span-7">
              {/* Breadcrumb */}
              <Breadcrumb
                dark
                items={[
                  { label: "Home", href: "/" },
                  { label: "Blog" },
                ]}
                className="mb-3"
              />

              {/* Dual-tone H1 */}
              <H1 color="white" className="leading-[1.08] tracking-tight">
                <span>SAFETY &amp; INDUSTRY</span>{" "}
                <span className="text-primary">BLOG.</span>
              </H1>

              <P className="mt-4 max-w-xl text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
                Expert insights, regulatory circulars, and practical guides on LPG safety protocols and best handling practices across Bangladesh.
              </P>
            </div>

            {/* Right Column: Visual */}
            <div className="relative flex items-center justify-center lg:col-span-5">
              <div className="group relative aspect-4/3 w-full max-w-lg overflow-hidden rounded-xl border border-white/15 bg-slate-800/80 shadow-md backdrop-blur-sm">
                <Image
                  src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop"
                  alt="LPG Industry Seminar & Knowledge"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 45vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                {/* Floating info tag */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between rounded-lg border border-white/20 bg-slate-950/75 p-3 text-white backdrop-blur-md">
                  <div>
                    <div className="text-xs font-black tracking-wide text-white">
                      Verified Technical Insights
                    </div>
                    <div className="text-[10px] text-slate-300">
                      Authored by certified energy engineers &amp; safety officers
                    </div>
                  </div>
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50 animate-pulse" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Main 3-Column Content Layout */}
      <section className="py-12 sm:py-16">
        <div className="site-container">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">

            {/* Left Sidebar: Categories & View Type (3 cols) */}
            <div className="space-y-4 lg:col-span-3">
              {/* Category Filter */}
              <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
                <H4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  CATEGORIES
                </H4>
                <div className="space-y-1">
                  {blogCategories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors ${selectedCategory === cat.id
                            ? "bg-primary text-white font-bold shadow-xs"
                            : "text-slate-600 hover:bg-slate-100"
                          }`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span>{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* View Type Toggle */}
              <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
                <H4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                  VIEW LAYOUT
                </H4>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewType("grid")}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-bold transition-colors ${viewType === "grid"
                        ? "border-primary bg-primary text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                  >
                    <LayoutGrid className="h-3.5 w-3.5" />
                    <span>Grid</span>
                  </button>

                  <button
                    onClick={() => setViewType("list")}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg border py-2 text-xs font-bold transition-colors ${viewType === "list"
                        ? "border-primary bg-primary text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                      }`}
                  >
                    <List className="h-3.5 w-3.5" />
                    <span>List</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Center Content: Search & Blog Cards Grid (6 cols) */}
            <div className="space-y-5 lg:col-span-6">
              {/* Search & Sort Bar */}
              <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    prefix={<Search className="h-3.5 w-3.5" />}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 whitespace-nowrap">Sort:</span>
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    options={[
                      { value: "latest", label: "Latest" },
                      { value: "popular", label: "Most Popular" },
                    ]}
                    className="w-32"
                  />
                </div>
              </div>

              {/* Cards Grid / List */}
              {filteredBlogs.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500">
                  No articles found matching your criteria.
                </div>
              ) : viewType === "grid" ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {filteredBlogs.map((blog) => (
                    <Link
                      key={blog.id}
                      href={`/blogs/${blog.slug}`}
                      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs transition-colors duration-200 hover:border-primary/50"
                    >
                      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
                        <Image
                          src={blog.imageUrl}
                          alt={blog.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 30vw"
                          className="object-cover"
                        />
                        <span
                          className={`absolute left-2.5 top-2.5 rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${blog.badgeColor}`}
                        >
                          {blog.category}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col justify-between p-3.5">
                        <div>
                          <H4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2 transition-colors group-hover:text-primary">
                            {blog.title}
                          </H4>
                          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
                            <Calendar className="h-3 w-3" />
                            <span>{blog.date}</span>
                          </div>
                          <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {blog.description}
                          </p>
                        </div>

                        <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center gap-1 text-xs font-bold text-primary">
                          <span>Read Full Article</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                /* List View */
                <div className="space-y-3.5">
                  {filteredBlogs.map((blog) => (
                    <Link
                      key={blog.id}
                      href={`/blogs/${blog.slug}`}
                      className="group flex flex-col sm:flex-row overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs transition-colors duration-200 hover:border-primary/50"
                    >
                      <div className="relative aspect-16/10 sm:aspect-square sm:w-44 shrink-0 overflow-hidden bg-slate-100">
                        <Image
                          src={blog.imageUrl}
                          alt={blog.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 20vw"
                          className="object-cover"
                        />
                        <span
                          className={`absolute left-2.5 top-2.5 rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${blog.badgeColor}`}
                        >
                          {blog.category}
                        </span>
                      </div>

                      <div className="flex flex-1 flex-col justify-between p-3.5">
                        <div>
                          <H4 className="text-sm font-bold text-slate-900 leading-snug transition-colors group-hover:text-primary">
                            {blog.title}
                          </H4>
                          <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
                            <span>{blog.date}</span>
                            <span>•</span>
                            <span>{blog.readTime}</span>
                          </div>
                          <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {blog.description}
                          </p>
                        </div>

                        <div className="mt-3 flex items-center gap-1 text-xs font-bold text-primary">
                          <span>Read Article</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Right Sidebar: Subscribe & Popular Posts (3 cols) */}
            <div className="space-y-4 lg:col-span-3">

              {/* Subscribe Widget */}
              <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
                <H4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">
                  SUBSCRIBE TO BLOG
                </H4>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Get monthly safety updates, regulatory circulars &amp; analysis.
                </p>

                <form onSubmit={handleSubscribe} className="mt-3 space-y-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-primary py-2 text-xs font-bold text-white transition-colors hover:bg-blue-700 shadow-xs"
                  >
                    Subscribe
                  </button>
                </form>
              </div>

              {/* Popular Posts */}
              <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
                <H4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                  POPULAR POSTS
                </H4>

                <div className="space-y-3">
                  {blogsData.slice(0, 3).map((item) => (
                    <Link
                      key={item.id}
                      href={`/blogs/${item.slug}`}
                      className="group flex items-center gap-2.5"
                    >
                      <div className="relative h-13 w-13 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          sizes="55px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                          {item.title}
                        </div>
                        <div className="mt-0.5 text-[10px] text-slate-400">
                          {item.date}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>
    </main>
  );
}

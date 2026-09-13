// src/app/(pages)/courses/_components/CourseCatalogSection.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { LinkButton } from "@/components/ui/LinkButton";
import { Search, User, BookOpen, ArrowRight } from "lucide-react";
import { H2, H4, P } from "@/components/ui/Typography";
import Input from "@/components/ui/Input";

export const PRICE_TABS = [
  { id: "all", label: "All" },
  { id: "paid", label: "Paid" },
  { id: "free", label: "Free" },
];

export const CATEGORIES = [
  { id: "all", name: "All Categories" },
  { id: "consumer", name: "Consumer Safety" },
  { id: "dealer", name: "Dealer Compliance" },
  { id: "industrial", name: "Industrial Use" },
  { id: "auto-gas", name: "Auto Gas Station" },
  { id: "emergency", name: "Emergency Response" },
  { id: "environment", name: "Environment & Sustainability" },
];

export const COURSE_CATALOG = [
  {
    id: 1,
    title: "LPG Safety for Regular Consumers",
    description: "Essential safety tips for safe handling, leak testing, and daily use of LPG cylinders at home.",
    category: "consumer",
    badge: "FREE",
    badgeColor: "bg-amber-500",
    audience: "Consumers",
    level: "Beginner",
    imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=600&auto=format&fit=crop",
    isPaid: false,
  },
  {
    id: 2,
    title: "LPG Dealer Safety & Regulatory Compliance",
    description: "Learn storage protocols, legal compliance, fire department mandates and inventory management.",
    category: "dealer",
    badge: "FREE",
    badgeColor: "bg-blue-600",
    audience: "Dealers",
    level: "Intermediate",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop",
    isPaid: false,
  },
  {
    id: 3,
    title: "Operational Safety in Auto Gas Stations",
    description: "Comprehensive operational safety guidelines for refueling, dispenser testing and staff safety.",
    category: "auto-gas",
    badge: "FREE",
    badgeColor: "bg-blue-600",
    audience: "Station Staff",
    level: "Intermediate",
    imageUrl: "https://images.unsplash.com/photo-1545459720-aac8509eb02c?q=80&w=600&auto=format&fit=crop",
    isPaid: false,
  },
  {
    id: 4,
    title: "LPG Safety for High-Pressure Industrial Use",
    description: "Safe handling, manifold inspections, and bulk storage operations in industrial facilities.",
    category: "industrial",
    badge: "৳ 500",
    badgeColor: "bg-emerald-600",
    audience: "Industrial Users",
    level: "Advanced",
    imageUrl: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?q=80&w=600&auto=format&fit=crop",
    isPaid: true,
  },
  {
    id: 5,
    title: "Rapid Emergency Response & Fire Incident Drill",
    description: "How to respond to vapor leaks, valve failures, flare-ups and evacuate personnel safely.",
    category: "emergency",
    badge: "৳ 300",
    badgeColor: "bg-emerald-600",
    audience: "All Stakeholders",
    level: "Intermediate",
    imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop",
    isPaid: true,
  },
];

export default function CourseCatalogSection({
  selectedCategory,
  setSelectedCategory,
  searchQuery,
  setSearchQuery,
  priceFilter,
  setPriceFilter,
  filteredCourses,
}) {
  return (
    <section id="catalog" className="py-12 sm:py-16">
      <div className="site-container">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <H2>
              AVAILABLE <span className="text-primary">COURSES.</span>
            </H2>
            <P className="mt-1">
              Explore certified courses by stakeholder category and enhance your safety credentials.
            </P>
          </div>

          {/* Search */}
          <div className="min-w-[190px]">
            <Input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              prefix={<Search className="h-3.5 w-3.5" />}
            />
          </div>
        </div>

        {/* Price Tabs */}
        <div className="mb-6 flex items-center gap-1.5 w-full sm:w-fit rounded-xl border border-slate-200/80 bg-white p-1.5 shadow-xs">
          {PRICE_TABS.map((tab) => {
            const isActive = priceFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setPriceFilter(tab.id)}
                className={`flex-1 sm:flex-none rounded-lg px-4 py-2 text-xs font-bold transition-all ${isActive
                    ? "bg-primary text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Main Grid with Left Categories Sidebar */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Sidebar (3 cols) */}
          <div className="space-y-4 lg:col-span-3">
            <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
              <H4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                Categories
              </H4>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left rounded-lg px-3 py-2 text-xs font-medium transition-colors ${selectedCategory === cat.id
                        ? "bg-primary text-white font-bold shadow-xs"
                        : "text-slate-600 hover:bg-slate-100"
                      }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Need Help Box */}
            <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4">
              <H4 className="text-xs font-bold text-slate-900">Need Guidance?</H4>
              <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">
                Have questions about bulk corporate LMS enrollment or certification?
              </p>
              <Link
                href="/contact"
                className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                <span>Contact Support Team</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

          {/* Right Courses Grid (9 cols) */}
          <div className="lg:col-span-9">
            {filteredCourses.length === 0 ? (
              <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500">
                No courses found matching your criteria.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className="group flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs transition-colors duration-200 hover:border-primary/50"
                  >
                    {/* Image + Badge */}
                    <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
                      <Image
                        src={course.imageUrl}
                        alt={course.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                      <span
                        className={`absolute left-2.5 top-2.5 rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-xs ${course.badgeColor}`}
                      >
                        {course.badge}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col justify-between p-4">
                      <div>
                        <H4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                          {course.title}
                        </H4>
                        <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {course.description}
                        </p>
                      </div>

                      <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <User className="h-3.5 w-3.5 text-slate-400" />
                          <span>Audience: {course.audience}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                          <span>Level: {course.level}</span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <LinkButton
                          href={`/courses/${course.id}`}
                          variant="primary"
                          size="sm"
                          fullWidth
                        >
                          {course.isPaid ? "Buy Now" : "Enroll Free"}
                        </LinkButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

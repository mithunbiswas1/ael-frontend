// src/app/(pages)/blogs/_components/BlogSidebar.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Shield } from "lucide-react";
import { H4 } from "@/components/ui/Typography";
import { useDictionary } from "@/context/DictionaryContext";

export default function BlogSidebar({
  categories = [],
  selectedCategory,
  setSelectedCategory,
  popularPosts = [],
}) {
  const { locale } = useDictionary();
  const isBn = locale === "bn";
  const defaultImage = "/default_image.jpg";

  return (
    <aside className="space-y-6 lg:col-span-1">
      {/* 1. Categories Filter */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
        <H4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
          {isBn ? "ক্যাটাগরি" : "CATEGORIES"}
        </H4>
        <div className="space-y-1">
          {categories.map((cat) => {
            const Icon = cat.icon || Shield;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-xs font-medium transition-all text-left cursor-pointer ${
                  isSelected
                    ? "bg-primary text-white font-bold shadow-xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Icon className={`h-3.5 w-3.5 shrink-0 ${isSelected ? "text-white" : "text-slate-400"}`} />
                  <span className="truncate">{cat.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Popular Blogs */}
      {popularPosts.length > 0 && (
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-2xs">
          <H4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3.5">
            {isBn ? "জনপ্রিয় প্রবন্ধসমূহ" : "POPULAR POSTS"}
          </H4>

          <div className="space-y-3.5">
            {popularPosts.map((item) => (
              <Link
                key={item.id || item.slug}
                href={`/blogs/${item.slug}`}
                className="group flex items-center gap-3 transition-colors"
              >
                <div className="relative h-13 w-13 shrink-0 overflow-hidden rounded-xl bg-slate-100 border border-slate-200/60">
                  <Image
                    src={item.imageUrl || defaultImage}
                    alt={item.title}
                    fill
                    sizes="60px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = defaultImage;
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {item.title}
                  </div>
                  <div className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-400">
                    <span>{item.date}</span>
                    {item.readTime && (
                      <>
                        <span>•</span>
                        <span>{item.readTime}</span>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}

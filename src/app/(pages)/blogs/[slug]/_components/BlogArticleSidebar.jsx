"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { H4 } from "@/components/ui/Typography";
import { useDictionary } from "@/context/DictionaryContext";
import AdSlot from "@/components/shared/AdSlot";

export default function BlogArticleSidebar({ relatedPosts }) {
  const { locale } = useDictionary();
  const isBn = locale === "bn";

  const categories = [
    { en: "Seminar", bn: "সেমিনার" },
    { en: "Programs of Association", bn: "অ্যাসোসিয়েশন কার্যক্রম" },
  ];

  return (
    <aside className="space-y-5 lg:col-span-4">
      {/* Related Posts */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
        <H4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3.5">
          {isBn ? "সম্পর্কিত পোস্ট" : "RELATED POSTS"}
        </H4>

        <div className="space-y-3.5">
          {relatedPosts.map((item) => {
            const itemTitle = isBn ? item.titleBn : item.title;
            const itemDate = isBn ? item.dateBn : item.date;

            return (
              <Link
                key={item.id}
                href={`/blogs/${item.slug}`}
                className="group flex items-center gap-3"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  <Image
                    src={item.imageUrl || "/default_image.jpg"}
                    alt={itemTitle}
                    fill
                    sizes="60px"
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/default_image.jpg";
                    }}
                  />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {itemTitle}
                  </div>
                  <div className="mt-1 text-[10px] text-slate-400">
                    {itemDate}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Commercial Sidebar Ad Slot */}
      <AdSlot slot="sidebar_ad" />

      {/* Categories */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
        <H4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
          {isBn ? "ক্যাটাগরি" : "CATEGORIES"}
        </H4>

        <div className="space-y-1">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={`/blogs?category=${encodeURIComponent(cat.en)}`}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
            >
              <span>{isBn ? cat.bn : cat.en}</span>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            </Link>
          ))}
        </div>
      </div>

      {/* Back to all blogs button */}
      <Link
        href="/blogs"
        className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 shadow-2xs hover:border-primary hover:text-primary transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>{isBn ? "সকল আর্টিকেলে ফিরে যান" : "Back to All Articles"}</span>
      </Link>
    </aside>
  );
}

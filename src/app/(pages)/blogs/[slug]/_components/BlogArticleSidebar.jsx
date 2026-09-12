import Image from "next/image";
import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { H4 } from "@/components/ui/Typography";

export default function BlogArticleSidebar({ relatedPosts }) {
  return (
    <aside className="space-y-5 lg:col-span-4">
      {/* Related Posts */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
        <H4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3.5">
          RELATED POSTS
        </H4>

        <div className="space-y-3.5">
          {relatedPosts.map((item) => (
            <Link
              key={item.id}
              href={`/blogs/${item.slug}`}
              className="group flex items-center gap-3"
            >
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  sizes="60px"
                  className="object-cover"
                />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                  {item.title}
                </div>
                <div className="mt-1 text-[10px] font-medium text-slate-500">
                  {item.date}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
        <H4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
          CATEGORIES
        </H4>

        <div className="space-y-1">
          {[
            "LPG Safety",
            "Industry News",
            "Tips & Awareness",
            "Regulations",
            "Technology",
            "Environment",
          ].map((catName, idx) => (
            <Link
              key={idx}
              href={`/blogs?category=${encodeURIComponent(catName)}`}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
            >
              <span>{catName}</span>
              <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
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
        <span>Back to All Articles</span>
      </Link>
    </aside>
  );
}

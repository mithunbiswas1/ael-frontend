import Image from "next/image";
import Link from "next/link";
import { Search, Calendar, ArrowRight } from "lucide-react";
import { H4 } from "@/components/ui/Typography";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

export default function BlogPostsSection({
  searchQuery,
  setSearchQuery,
  sortBy,
  setSortBy,
  viewType,
  filteredBlogs,
}) {
  return (
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
  );
}

import Image from "next/image";
import Link from "next/link";
import { H4 } from "@/components/ui/Typography";
import Input from "@/components/ui/Input";

export default function BlogRightSidebar({
  newsletterEmail,
  setNewsletterEmail,
  handleSubscribe,
  popularPosts,
}) {
  return (
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
          {popularPosts.map((item) => (
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
  );
}

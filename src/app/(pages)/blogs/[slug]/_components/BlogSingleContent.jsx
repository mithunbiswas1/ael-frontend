// src/app/(pages)/blogs/[slug]/_components/BlogSingleContent.jsx
import Breadcrumb from "@/components/ui/Breadcrumb";
import BlogArticleContent from "./BlogArticleContent";
import BlogArticleSidebar from "./BlogArticleSidebar";

export default function BlogSingleContent({ currentPost, relatedPosts }) {
  return (
    <main className="min-h-screen bg-slate-50 py-10 sm:py-12">
      <div className="site-container">
        {/* 1. Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blogs" },
            { label: currentPost.title },
          ]}
          className="mb-6"
        />

        {/* 2. Main Content & Sidebar Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <BlogArticleContent currentPost={currentPost} />
          <BlogArticleSidebar relatedPosts={relatedPosts} />
        </div>
      </div>
    </main>
  );
}

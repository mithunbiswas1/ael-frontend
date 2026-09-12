// src/app/(pages)/blogs/_components/BlogsContent.jsx
import BlogsHeroSection from "./BlogsHeroSection";
import BlogsInteractive from "../_client/BlogsInteractive";

export default function BlogsContent({ blogsData }) {
  return (
    <main className="min-h-screen bg-slate-50">
      <BlogsHeroSection />
      <BlogsInteractive blogsData={blogsData} />
    </main>
  );
}

// src/app/(pages)/blogs/page.jsx
import BlogsContent from "./_view/BlogsContent";
import { getBlogs } from "@/next-api/getBlogs";
import { getPageContent } from "@/next-api/getPageContent";

export const metadata = {
  title: "LPG Blog & Technical Insights | Safe LPG Platform",
  description:
    "Expert articles on LPG cylinder handling, industrial leak detection, DoE regulatory updates, and Bangladesh energy analytics.",
};

export default async function BlogsPage() {
  const [blogs, cmsData] = await Promise.all([
    getBlogs(),
    getPageContent("blogs"),
  ]);

  return (
    <BlogsContent
      blogsData={blogs}
      bannerData={cmsData.banner}
    />
  );
}

// src/app/(pages)/blogs/page.jsx
import BlogsContent from "./_components/BlogsContent";
import { blogsData } from "./_data/blogsData";

export { blogsData };

export const metadata = {
  title: "LPG Blog & Technical Insights | Safe LPG Platform",
  description:
    "Expert articles on LPG cylinder handling, industrial leak detection, DoE regulatory updates, and Bangladesh energy analytics.",
};

export default function BlogsPage() {
  return <BlogsContent blogsData={blogsData} />;
}

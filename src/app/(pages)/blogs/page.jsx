// src/app/(pages)/blogs/page.jsx
import BlogsContent from "./_view/BlogsContent";
import { getBlogs } from "@/next-api/getBlogs";
import { getPageContent } from "@/next-api/getPageContent";

export const metadata = {
  title: "LPG Blog & Technical Insights | Safe LPG Platform",
  description:
    "Expert articles on LPG cylinder handling, industrial leak detection, DoE regulatory updates, and Bangladesh energy analytics.",
  keywords: [
    "LPG safety blog",
    "gas cylinder maintenance",
    "cylinder safety Bangladesh",
    "gas leak emergency response",
    "LPG technical guidelines",
    "energy safety Bangladesh",
  ].join(", "),
  alternates: {
    canonical: "https://safelpg.com/blogs",
  },
  openGraph: {
    title: "LPG Blog & Technical Insights | Safe LPG Platform",
    description:
      "Expert articles on LPG cylinder handling, industrial leak detection, DoE regulatory updates, and Bangladesh energy analytics.",
    url: "/blogs",
    siteName: "Safe LPG Bangladesh",
    images: [
      {
        url: "/images/banner.jpg",
        width: 1200,
        height: 630,
        alt: "Safe LPG Platform Insights",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LPG Blog & Technical Insights | Safe LPG Platform",
    description:
      "Expert articles on LPG cylinder handling, industrial leak detection, DoE regulatory updates, and Bangladesh energy analytics.",
    images: ["/images/banner.jpg"],
  },
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

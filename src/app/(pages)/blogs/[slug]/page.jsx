// src/app/(pages)/blogs/[slug]/page.jsx
import { blogsData } from "../_data/blogsData";
import BlogSingleContent from "./_components/BlogSingleContent";

export function generateStaticParams() {
  return blogsData.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const currentPost =
    blogsData.find((b) => b.slug === slug || b.id === slug) || blogsData[0];

  return {
    title: `${currentPost.title} | AEL LPG Blog`,
    description: currentPost.description,
  };
}

export default async function BlogSinglePage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const currentPost =
    blogsData.find((b) => b.slug === slug || b.id === slug) || blogsData[0];

  const relatedPosts = blogsData
    .filter((b) => b.id !== currentPost.id)
    .slice(0, 3);

  return (
    <BlogSingleContent
      currentPost={currentPost}
      relatedPosts={relatedPosts}
    />
  );
}

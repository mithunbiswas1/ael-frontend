// src/app/(pages)/blogs/_components/BlogsHeroSection.jsx
import MainPageHeroSection from "@/components/shared/MainPageHeroSection";

export default function BlogsHeroSection() {
  return (
    <MainPageHeroSection
      breadcrumbItems={[
        { label: "Home", href: "/" },
        { label: "Blog & Insights" },
      ]}
      title="BLOG &"
      accent="INSIGHTS."
      description="Stay updated with expert perspectives, safety guidelines, regulatory announcements, and market trends across the Bangladesh LPG energy landscape."
      imageSrc="https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=800&auto=format&fit=crop"
      imageAlt="LPG Industry Insights & Engineering Seminars"
    />
  );
}

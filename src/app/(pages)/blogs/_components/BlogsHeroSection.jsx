// src/app/(pages)/blogs/_components/BlogsHeroSection.jsx

import VisualHeroBanner from "@/components/ui/VisualHeroBanner";
import { getLocale, getDict } from "@/lib/i18n";

export default async function BlogsHeroSection() {
  const [locale, dict] = await Promise.all([getLocale(), getDict()]);
  const isBn = locale === "bn";
  const common = dict?.common || {};
  const blogs = dict?.blogs || {};

  return (
    <VisualHeroBanner
      breadcrumbItems={[
        { label: common.home || (isBn ? "হোম" : "Home"), href: "/" },
        {
          label:
            dict?.navbar?.navLinks?.blog || (isBn ? "ব্লগ" : "Blog & Insights"),
        },
      ]}
      badge={
        blogs.badge ||
        (isBn
          ? "শিল্প বিশ্লেষণ ও নিরাপত্তা প্রবন্ধ"
          : "INDUSTRY INSIGHTS & SAFETY ARTICLES")
      }
      title={blogs.title || (isBn ? "ব্লগ ও" : "BLOG &")}
      accent={blogs.accent || (isBn ? "প্রবন্ধ।" : "INSIGHTS.")}
      description={
        blogs.subtitle ||
        (isBn
          ? "বাংলাদেশের এলপিজি জ্বালানি খাতের বিশেষজ্ঞ মতামত, নিরাপত্তা নির্দেশিকা, নিয়ন্ত্রক বিজ্ঞপ্তি এবং বাজারের প্রবণতা সম্পর্কে আপডেট থাকুন।"
          : "Stay updated with expert perspectives, safety guidelines, regulatory announcements, and market trends across the Bangladesh LPG energy landscape.")
      }
      imageSrc="https://images.unsplash.com/photo-1542744094-3a31f272c490?q=80&w=800&auto=format&fit=crop"
      imageAlt="LPG Industry Insights & Engineering Seminars"
    />
  );
}

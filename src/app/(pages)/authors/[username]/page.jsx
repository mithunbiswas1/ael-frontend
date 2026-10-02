// src/app/(pages)/authors/[username]/page.jsx

import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { getAuthorProfile } from "@/next-api/getAuthor";
import { getLocale, getDict } from "@/lib/i18n";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { H2, P } from "@/components/ui/Typography";
import { LinkButton } from "@/components/ui/LinkButton";
import AuthorHero from "./_components/AuthorHero";
import AuthorArticlesSection from "./_components/AuthorArticlesSection";

export async function generateMetadata({ params }) {
  const { username } = await params;
  const data = await getAuthorProfile(username);

  if (!data?.author) {
    return {
      title: "Author Profile | Safe LPG Bangladesh",
      description: "Read technical LPG articles and market intelligence reports by verified industry authors.",
    };
  }

  const { author, stats } = data;
  const title = `${author.fullName} - Author Profile | Safe LPG`;
  const description =
    author.bio ||
    `${author.fullName} is an active author and contributor on Safe LPG with ${stats?.totalArticles || 0} publications on LPG safety and market analysis.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      images: author.image ? [{ url: author.image }] : [{ url: "/default_person.jpg" }],
    },
  };
}

export default async function AuthorProfilePage({ params }) {
  const { username } = await params;
  const [data, locale, dict] = await Promise.all([
    getAuthorProfile(username),
    getLocale(),
    getDict(),
  ]);

  const isBn = locale === "bn";
  const common = dict?.common || {};

  if (!data || !data.author) {
    return (
      <main className="min-h-[70vh] bg-warm-sand/30 py-20">
        <div className="site-container max-w-xl text-center space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
            <BookOpen className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <H2 className="text-2xl font-bold text-slate-900">
              {isBn ? "লেখক প্রোফাইল পাওয়া যায়নি" : "Author Profile Not Found"}
            </H2>
            <P color="gray" className="text-sm leading-relaxed">
              {isBn
                ? "অনুরোধকৃত লেখক বা কন্ট্রিবিউটরের তথ্য আমাদের ডাটাবেজে পাওয়া যায়নি বা এটি নিষ্ক্রিয় রয়েছে।"
                : "The requested author profile could not be located in our verified directory or has been removed."}
            </P>
          </div>
          <div className="pt-2">
            <LinkButton href="/blogs" variant="primary" size="default">
              <span>{isBn ? "ব্লগ পেইজে ফিরে যান" : "Browse All Blogs"}</span>
            </LinkButton>
          </div>
        </div>
      </main>
    );
  }

  const { author, blogs, marketUpdates, stats } = data;

  // JSON-LD Person / ProfilePage Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: author.fullName,
      jobTitle: author.designation || "LPG Specialist & Author",
      description: author.bio || "",
      image: author.image || "https://safelpg.com/default_person.jpg",
      url: `https://safelpg.com/authors/${author.userName || username}`,
      sameAs: [
        author.website,
        author.linkedin,
        author.twitter,
        author.facebook,
      ].filter(Boolean),
    },
  };

  return (
    <main className="min-h-screen bg-slate-50/50 pb-20">
      {/* JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. Banner: Image, Name, Description, Right-Side Card */}
      <AuthorHero author={author} stats={stats || {}} isBn={isBn} />

      {/* 2. Breadcrumbs Bar */}
      <div className="border-b border-slate-200/80 bg-white shadow-2xs">
        <div className="site-container py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <Breadcrumb
            items={[
              { label: common.home || "Home", href: "/" },
              {
                label: dict?.navbar?.navLinks?.blogs || (isBn ? "ব্লগ" : "Blogs"),
                href: "/blogs",
              },
              { label: isBn ? "লেখক" : "Authors", href: "/blogs" },
              { label: author.fullName },
            ]}
          />

          <Link
            href="/blogs"
            className="inline-flex items-center gap-1.5 font-bold text-slate-500 hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{isBn ? "সকল ব্লগে ফিরুন" : "Back to All Blogs"}</span>
          </Link>
        </div>
      </div>

      {/* 3. Tab and Blog Section with Right-Side Grid/List Switcher */}
      <section className="site-container py-8 sm:py-10">
        <AuthorArticlesSection
          author={author}
          blogs={blogs}
          marketUpdates={marketUpdates}
          isBn={isBn}
        />
      </section>
    </main>
  );
}

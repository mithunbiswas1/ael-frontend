// src/app/(pages)/market-updates/[slug]/_view/MarketUpdateDetailContent.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  User,
  Eye,
  ChevronRight,
  ArrowLeft,
  FileText,
  ExternalLink,
  Download,
  Share2,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { FaFilePdf } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useDictionary } from "@/context/DictionaryContext";
import CommentSection from "@/components/shared/CommentSection";
import AdSlot from "@/components/shared/AdSlot";
import { LinkButton } from "@/components/ui/LinkButton";
import { toast } from "sonner";
import SocialShareBar from "@/components/shared/SocialShareBar";

export default function MarketUpdateDetailContent({
  article,
  related = [],
}) {
  const { locale } = useDictionary();
  const isBn = locale === "bn";

  const { isLoggedIn, user } = useSelector((state) => state.auth);

  if (!article) return null;

  const isSubscribed = Boolean(
    user?.role === "subscriber" ||
    (user?.subscription?.status === "active" && (!user?.subscription?.expiresAt || new Date(user.subscription.expiresAt) > new Date())) ||
    ["super_admin", "admin", "instructor", "course_admin", "editor"].includes(user?.role)
  );

  const isPaid = article.accessType === "paid";
  const isLocked = isPaid && !isSubscribed;

  const title = isBn
    ? article.titleBn || article.titleEn
    : article.titleEn || article.titleBn;

  const summary = isBn
    ? article.summaryBn || article.summaryEn
    : article.summaryEn || article.summaryBn;

  const content = isBn
    ? article.contentBn || article.contentEn
    : article.contentEn || article.contentBn;

  const author = isBn
    ? article.authorBn || article.authorEn
    : article.authorEn || article.authorBn;

  const categoryName =
    article.category === "incidents"
      ? isBn
        ? "দুর্ঘটনা ও তদন্ত প্রতিবেদন"
        : "Incident Probe Report"
      : article.category === "berc"
        ? isBn
          ? "বিইআরসি বার্তা ও মূল্য সার্কুলার"
          : "BERC Notice & Tariff"
        : isBn
          ? "বৈশ্বিক মার্কেট আপডেট"
          : "Global Market & CP Trends";

  const formattedDate = new Date(
    article.publishDate || article.createdAt || Date.now()
  ).toLocaleDateString(isBn ? "bn-BD" : "en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success(isBn ? "লিঙ্ক কপি করা হয়েছে!" : "Article link copied to clipboard!");
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "PDF Document";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(1)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  return (
    <article className="min-h-screen bg-slate-50/50 py-8 sm:py-12 selection:bg-primary/20 selection:text-primary">
      <div className="site-container max-w-7xl">
        {/* 1. Breadcrumbs */}
        <nav className="mb-6 flex items-center gap-2 text-xs font-semibold text-slate-500 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-primary transition-colors">
            {isBn ? "হোম" : "Home"}
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
          <Link href="/market-updates" className="hover:text-primary transition-colors">
            {isBn ? "মার্কেট আপডেট" : "Market Updates"}
          </Link>
          <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
          <span className="text-primary truncate">{categoryName}</span>
        </nav>

        {/* 2-Column Responsive Layout on lg */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
          {/* Main Article Content (8 Cols on lg) */}
          <div className="lg:col-span-8 min-w-0 max-w-full overflow-hidden">
            {/* Header Area */}
            <header className="mb-6 space-y-4">
              {isPaid && (
                <div className="mb-1">
                  {isSubscribed ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 shadow-2xs">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      <span>{isBn ? "আপনার সাবস্ক্রিপশনের মাধ্যমে উন্মুক্ত" : "Unlocked with your Subscription"}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800 shadow-2xs">
                      <Lock className="h-3.5 w-3.5 text-amber-600" />
                      <span>{isBn ? "প্রিমিয়াম সাবস্ক্রাইবার ডসিয়ার" : "Exclusive Subscriber Report"}</span>
                    </span>
                  )}
                </div>
              )}

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight break-words [overflow-wrap:anywhere]">
                {title}
              </h1>

              {/* Metadata bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-y border-slate-200 py-3 text-xs text-slate-600">
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  {author && (
                    <div className="flex items-center gap-1.5 font-medium">
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      <span>{author}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>{formattedDate}</span>
                  </div>

                  <div className="flex items-center gap-1 font-medium text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    <Eye className="h-3.5 w-3.5 text-primary" />
                    <span>
                      {isBn
                        ? `${Number(article.views || 0).toLocaleString("bn-BD")} বার পঠিত`
                        : `${Number(article.views || 0).toLocaleString()} views`}
                    </span>
                  </div>
                </div>

                <SocialShareBar
                  title={title}
                  isBn={isBn}
                />
              </div>
            </header>

            {/* Featured Image */}
            <div className="relative aspect-16/9 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 mb-8 shadow-xs">
              <Image
                src={article.image || "/default_image.jpg"}
                alt={title}
                fill
                priority
                className="object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/default_image.jpg";
                }}
              />
            </div>

            {/* Attached Official PDF Box */}
            {article.pdfUrl && (
              <div className="my-8 rounded-2xl border-2 border-rose-200 bg-linear-to-br from-rose-50/80 via-white to-rose-50/40 p-5 sm:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white shadow-md">
                      <FaFilePdf className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded-sm">
                          {isBn ? "সংবিধিবদ্ধ নথি" : "Statutory Document"}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">
                          {formatFileSize(article.pdfSize)}
                        </span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {article.pdfOriginalName || (isBn ? "অফিসিয়াল সার্কুলার / তদন্ত প্রতিবেদন.pdf" : "Official Notice & Investigation Report.pdf")}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
                    {isLocked ? (
                      <LinkButton
                        href="/subscription"
                        variant="primary"
                        size="md"
                        className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white gap-2 font-bold shadow-xs text-xs"
                      >
                        <Lock className="h-3.5 w-3.5" />
                        <span>{isBn ? "পিডিএফ আনলক করতে সাবস্ক্রাইব করুন" : "Subscribe to Download PDF"}</span>
                      </LinkButton>
                    ) : (
                      <>
                        <a
                          href={article.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition-colors"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span>{isBn ? "পিডিএফ দেখুন" : "View PDF"}</span>
                        </a>

                        <a
                          href={article.pdfUrl}
                          download={article.pdfOriginalName || "circular.pdf"}
                          className="inline-flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl border border-rose-300 bg-white px-4 py-2.5 text-xs font-bold text-rose-700 shadow-2xs hover:bg-rose-50 transition-colors"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>{isBn ? "ডাউনলোড" : "Download"}</span>
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Summary Callout */}
            {summary && (
              <div className="rounded-xl border-l-4 border-primary bg-primary/5 p-4 sm:p-5 mb-8 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium min-w-0 max-w-full overflow-hidden break-words [overflow-wrap:anywhere]">
                <p className="font-bold text-primary text-xs uppercase tracking-wider mb-1">
                  {isBn ? "মূল সারসংক্ষেপ" : "Executive Telemetry Summary"}
                </p>
                <div className="break-words [overflow-wrap:anywhere]">{summary}</div>
              </div>
            )}

            {/* Detailed Rich Text Content or Locked Gate */}
            {isLocked ? (
              <div className="relative mb-12">
                {/* Teaser Preview with Blur Fade */}
                {content && (
                  <div className="relative max-h-36 overflow-hidden select-none pointer-events-none opacity-40">
                    <div
                      className="prose prose-slate max-w-none text-slate-800 text-sm leading-relaxed break-words [overflow-wrap:anywhere] max-w-full overflow-hidden [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_img]:max-w-full [&_img]:h-auto [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_code]:break-words [&_iframe]:max-w-full"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white" />
                  </div>
                )}

                {/* Luxury Locked Gating Card */}
                <div className="relative rounded-2xl border-2 border-amber-200/90 bg-linear-to-b from-amber-50/70 via-white to-amber-50/30 p-6 sm:p-8 text-center shadow-lg mt-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 shadow-inner ring-8 ring-amber-500/5 mb-4">
                    <Lock className="h-7 w-7 text-amber-600" />
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-2">
                    {isBn
                      ? "এই প্রতিবেদনটি শুধুমাত্র সাবস্ক্রাইবারদের জন্য উন্মুক্ত"
                      : "Subscriber-Exclusive Technical Intelligence"}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed mb-6">
                    {isBn
                      ? "সম্পূর্ণ তদন্ত প্রতিবেদন, বিশ্লেষণ ও অফিশিয়াল প্রজ্ঞাপন পিডিএফ ডাউনলোড করতে আমাদের সাবস্ক্রিপশন প্যাকেজে যুক্ত হন।"
                      : "Unlock complete incident dossiers, statutory BERC circulars, high-resolution official PDF downloads, and technical compliance tools."}
                  </p>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                    <LinkButton
                      href="/subscription"
                      variant="primary"
                      size="lg"
                      className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-bold gap-2 shadow-md"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      <span>{isBn ? "সাবস্ক্রিপশন প্ল্যান দেখুন" : "Explore Subscription Plans"}</span>
                    </LinkButton>

                    {!isLoggedIn && (
                      <LinkButton
                        href={`/login?redirect=/market-updates/${article.slug || article._id}`}
                        variant="outline"
                        size="lg"
                        className="w-full sm:w-auto text-slate-700 border-slate-300 font-semibold"
                      >
                        <span>{isBn ? "ইতিমধ্যে একাউন্ট আছে? লগইন করুন" : "Already a member? Sign In"}</span>
                      </LinkButton>
                    )}
                  </div>

                  <div className="mt-5 flex items-center justify-center gap-4 text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                      {isBn ? "তাত্ক্ষণিক অ্যাক্সেস" : "Instant Activation"}
                    </span>
                    <span>•</span>
                    <span>bKash / Cards Supported</span>
                    <span>•</span>
                    <span>{isBn ? "যে কোনো সময় বাতিলযোগ্য" : "Cancel Anytime"}</span>
                  </div>
                </div>
              </div>
            ) : content ? (
              <div
                className="prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-relaxed space-y-4 mb-10 prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl min-w-0 max-w-full overflow-hidden break-words [overflow-wrap:anywhere] [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_img]:max-w-full [&_img]:h-auto [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_code]:break-words [&_iframe]:max-w-full"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <p className="text-slate-500 italic text-sm my-6">
                {isBn
                  ? "এই প্রজ্ঞাপনটির বিস্তারিত বিবরণ শিগগিরই আপডেট করা হবে।"
                  : "Full text and telemetry analysis will be updated shortly."}
              </p>
            )}

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center gap-2 mb-10">
                <span className="text-xs font-semibold text-slate-500">
                  {isBn ? "ট্যাগসমূহ:" : "Tags:"}
                </span>
                {article.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 border border-slate-200/80"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* Comments Section */}
            <div className="mt-8 mb-12">
              <CommentSection
                targetType="market-update"
                targetId={article._id || article.id}
                targetTitle={isBn ? article.titleBn || article.titleEn : article.titleEn || article.title}
                locale={locale}
              />
            </div>
          </div>

          {/* Right Sidebar: Related Market Intelligence & Quick Navigation (4 Cols on lg) */}
          <aside className="space-y-6 lg:col-span-4 lg:sticky lg:top-24 min-w-0 max-w-full">
            {/* Related Market Intelligence Box */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-100">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <span>{isBn ? "সম্পর্কিত মার্কেট আপডেট" : "RELATED INTELLIGENCE"}</span>
                </h3>
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full truncate max-w-[130px]">
                  {categoryName}
                </span>
              </div>

              {related && related.length > 0 ? (
                <div className="space-y-3.5">
                  {related.map((item) => {
                    const relTitle = isBn
                      ? item.titleBn || item.titleEn
                      : item.titleEn || item.titleBn;
                    const relDate = new Date(
                      item.publishDate || Date.now()
                    ).toLocaleDateString(isBn ? "bn-BD" : "en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });

                    return (
                      <Link
                        key={item._id || item.slug}
                        href={`/market-updates/${item.slug}`}
                        className="group flex gap-3 items-start rounded-xl p-2 transition-colors hover:bg-slate-50 border border-transparent hover:border-slate-200/60"
                      >
                        <div className="relative h-14 w-18 shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-200/60">
                          <Image
                            src={item.image || "/default_image.jpg"}
                            alt={relTitle}
                            fill
                            sizes="72px"
                            className="object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/default_image.jpg";
                            }}
                          />
                          {item.pdfUrl && (
                            <span className="absolute bottom-1 right-1 flex items-center justify-center h-3.5 w-3.5 rounded bg-rose-600 text-white shadow-2xs">
                              <FaFilePdf className="h-2 w-2" />
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <h4 className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                            {relTitle}
                          </h4>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                            <Calendar className="h-3 w-3 shrink-0" />
                            <span>{relDate}</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic py-2">
                  {isBn
                    ? "এই মুহূর্তে একই ক্যাটাগরির অন্য কোনো রিপোর্ট নেই।"
                    : "No other reports in this category at the moment."}
                </p>
              )}

              {/* View All Link */}
              <div className="mt-4 pt-3.5 border-t border-slate-100">
                <Link
                  href="/market-updates"
                  className="flex items-center justify-between text-xs font-bold text-primary hover:underline"
                >
                  <span>{isBn ? "সকল মার্কেট আপডেট দেখুন" : "View All Market Updates"}</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Quick Categories Navigation */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-3 mb-3 border-b border-slate-100">
                {isBn ? "ক্যাটাগরি সমূহ" : "MARKET SECTORS"}
              </h3>
              <div className="space-y-1">
                <Link
                  href="/market-updates"
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors"
                >
                  <span>{isBn ? "সকল আপডেট" : "All Updates"}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                </Link>
                <Link
                  href="/market-updates"
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors"
                >
                  <span>{isBn ? "দুর্ঘটনা ও তদন্ত প্রতিবেদন" : "Incidents & Reports"}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                </Link>
                <Link
                  href="/market-updates"
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors"
                >
                  <span>{isBn ? "বিইআরসি বার্তা ও মূল্য সার্কুলার" : "Message from BERC"}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                </Link>
                <Link
                  href="/market-updates"
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors"
                >
                  <span>{isBn ? "বৈশ্বিক মার্কেট আপডেট" : "Global Market Update"}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                </Link>
              </div>
            </div>

            {/* Commercial Ad Slot */}
            <AdSlot slot="sidebar_ad" />

            {/* Back link */}
            <div className="pt-1">
              <Link
                href="/market-updates"
                className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{isBn ? "সকল আপডেটে ফিরে যান" : "Back to Market Updates"}</span>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}

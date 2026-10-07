// src/app/(pages)/blogs/[slug]/_components/BlogArticleContent.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Play, Lock, ShieldCheck, Eye } from "lucide-react";
import { useSelector } from "react-redux";
import { H1, H3, P } from "@/components/ui/Typography";
import { LinkButton } from "@/components/ui/LinkButton";
import { useDictionary } from "@/context/DictionaryContext";
import { baseUriBackend } from "@/config/base-url";
import { getMediaUrl } from "@/utils/mediaUrl";
import CommentSection from "@/components/shared/CommentSection";
import AdSlot from "@/components/shared/AdSlot";
import SocialShareBar from "@/components/shared/SocialShareBar";

export default function BlogArticleContent({
  currentPost,
  handleShare,
  setIsPlaying,
  toast,
}) {
  const { locale, dict } = useDictionary();
  const isBn = locale === "bn";

  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const isSubscribed = Boolean(
    user?.role === "subscriber" ||
    (user?.subscription?.status === "active" && (!user?.subscription?.expiresAt || new Date(user.subscription.expiresAt) > new Date())) ||
    ["super_admin", "admin", "instructor", "course_admin", "editor"].includes(user?.role)
  );

  const isPaid = currentPost?.accessType === "paid";
  const isLocked = isPaid && !isSubscribed;

  const title = isBn ? currentPost.titleBn : currentPost.title;
  const category = isBn ? currentPost.categoryBn : currentPost.category;
  const author = isBn ? currentPost.authorBn : currentPost.author;
  const date = isBn ? currentPost.dateBn : currentPost.date;
  const readTime = isBn ? currentPost.readTimeBn : currentPost.readTime;
  const shortDescription = isBn
    ? currentPost.shortDescriptionBn || currentPost.shortDescription || currentPost.descriptionBn
    : currentPost.shortDescription || currentPost.shortDescriptionEn || currentPost.description;

  return (
    <article className="space-y-6 lg:col-span-8 min-w-0 max-w-full overflow-hidden">
      {/* Header: Title & Meta & Social Share */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary">
            {category}
          </span>

          {isPaid && (
            isSubscribed ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-0.5 text-[10px] font-bold text-emerald-800 shadow-2xs">
                <ShieldCheck className="h-3 w-3 text-emerald-600" />
                <span>{isBn ? "সাবস্ক্রিপশনের মাধ্যমে উন্মুক্ত" : "Unlocked with Subscription"}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-0.5 text-[10px] font-bold text-amber-800 shadow-2xs">
                <Lock className="h-3 w-3 text-amber-600" />
                <span>{isBn ? "সাবস্ক্রাইবার স্পেশাল" : "Subscriber Only"}</span>
              </span>
            )
          )}
        </div>

        <H1 className="text-2xl sm:text-3xl md:text-4xl">{title}</H1>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-y border-slate-200/80 py-3 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="font-semibold text-slate-800">
              {isBn ? "লেখক:" : "By"}{" "}
              <Link
                href={`/authors/${currentPost.authorUsername || currentPost.createdBy?.userName || encodeURIComponent(currentPost.author || currentPost.authorEn || "author")}`}
                className="text-primary hover:underline font-bold"
              >
                {author}
              </Link>
            </span>
            <span>|</span>
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>{date}</span>
            </div>
            <span>|</span>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>{readTime}</span>
            </div>
            <span>|</span>
            <div className="flex items-center gap-1 font-medium text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-full">
              <Eye className="h-3.5 w-3.5 text-primary" />
              <span>
                {isBn
                  ? `${Number(currentPost.views || 0).toLocaleString("bn-BD")} বার পঠিত`
                  : `${Number(currentPost.views || 0).toLocaleString()} views`}
              </span>
            </div>
          </div>

          {/* Share Bar */}
          <SocialShareBar
            title={title}
            isBn={isBn}
          />
        </div>
      </div>

      {/* Featured Image with Short Description Overlay */}
      <div className="relative aspect-16/9 w-full overflow-hidden rounded-xl border border-slate-200/80 bg-slate-100 shadow-xs group">
        <Image
          src={getMediaUrl(currentPost.imageUrl || currentPost.image, "/default_image.jpg")}
          alt={title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 65vw"
          className="object-cover"
          onError={(e) => {
            e.currentTarget.src = "/default_image.jpg";
          }}
        />
        {shortDescription && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/55 to-transparent p-4 sm:p-6 backdrop-blur-[1px] max-w-full">
            <p className="text-xs sm:text-sm font-medium text-white/95 leading-relaxed line-clamp-3 drop-shadow-xs break-words [overflow-wrap:anywhere]">
              {shortDescription}
            </p>
          </div>
        )}
      </div>

      {/* Article Body Content */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-6 sm:p-8 text-slate-700 shadow-xs space-y-6 text-sm leading-relaxed min-w-0 max-w-full overflow-hidden break-words [overflow-wrap:anywhere]">
        {(() => {
          const rawDesc = isBn
            ? currentPost.descriptionBn || currentPost.description
            : currentPost.description;
          if (!rawDesc) return null;
          const isHtml = /<[a-z][\s\S]*>/i.test(rawDesc);
          if (isHtml) {
            return (
              <div
                className="rich-text-output text-slate-800 leading-relaxed text-sm sm:text-base space-y-3 break-words [overflow-wrap:anywhere] max-w-full overflow-hidden [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>blockquote]:border-l-4 [&>blockquote]:border-primary/40 [&>blockquote]:pl-4 [&>blockquote]:italic [&>h2]:text-lg [&>h2]:font-bold [&>h3]:text-base [&>h3]:font-bold [&>a]:text-primary [&>a]:underline [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_img]:max-w-full [&_img]:h-auto [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_code]:break-words [&_iframe]:max-w-full"
                dangerouslySetInnerHTML={{ __html: rawDesc }}
              />
            );
          }
          return (
            <P weight="semibold" color="dark" size="lg" className="break-words [overflow-wrap:anywhere]">
              {rawDesc}
            </P>
          );
        })()}

        {isLocked ? (
          <div className="relative pt-2">
            {/* Blurred Teaser preview */}
            <div className="relative max-h-24 overflow-hidden select-none pointer-events-none opacity-40">
              <p className="text-slate-700 text-sm leading-relaxed">
                {isBn
                  ? "এই কারিগরি নির্দেশিকাটির সম্পূর্ণ বিবরণ, ধাপে ধাপে কমপ্লায়েন্স প্রোটোকল এবং ফায়ার সেফটি অডিট চেকলিস্ট শুধুমাত্র সক্রিয় সাবস্ক্রাইবারদের জন্য সংরক্ষিত..."
                  : "Complete step-by-step statutory compliance protocols, inspection criteria, and safety engineering procedures are restricted to active subscribers..."}
              </p>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/80 to-white" />
            </div>

            {/* Luxury Locked Gating Card */}
            <div className="relative rounded-2xl border-2 border-amber-200/90 bg-linear-to-b from-amber-50/70 via-white to-amber-50/30 p-6 sm:p-8 text-center shadow-lg mt-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 shadow-inner ring-8 ring-amber-500/5 mb-4">
                <Lock className="h-7 w-7 text-amber-600" />
              </div>

              <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-2">
                {isBn
                  ? "এই নিবন্ধটি শুধুমাত্র সাবস্ক্রাইবারদের জন্য উন্মুক্ত"
                  : "Exclusive Subscriber Content"}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed mb-6">
                {isBn
                  ? "সম্পূর্ণ নিরাপত্তা বিশ্লেষণ, বিস্তারিত গাইডলাইন এবং সকল প্রশিক্ষণ কোর্সে বাধাহীন অ্যাক্সেস পেতে আমাদের সাবস্ক্রিপশন প্ল্যানে যুক্ত হন।"
                  : "Unlock full unrestricted access to all technical publications, certified masterclasses, safety audit checklists, and premium PDFs."}
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
                    href={`/login?redirect=/blogs/${currentPost.slug || currentPost._id}`}
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
        ) : (
          <>
            {(() => {
              const rawContent = isBn
                ? currentPost.contentBn || currentPost.content
                : currentPost.content || currentPost.contentBn;
              if (!rawContent) return null;
              const isHtml = /<[a-z][\s\S]*>/i.test(rawContent);
              if (isHtml) {
                return (
                  <div
                    className="rich-text-output text-slate-700 leading-relaxed text-sm space-y-3 break-words [overflow-wrap:anywhere] max-w-full overflow-hidden [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>blockquote]:border-l-4 [&>blockquote]:border-primary/40 [&>blockquote]:pl-4 [&>blockquote]:italic [&>h2]:text-lg [&>h2]:font-bold [&>h3]:text-base [&>h3]:font-bold [&>a]:text-primary [&>a]:underline [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_img]:max-w-full [&_img]:h-auto [&_pre]:max-w-full [&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_code]:break-words [&_iframe]:max-w-full"
                    dangerouslySetInnerHTML={{ __html: rawContent }}
                  />
                );
              }
              return (
                <div className="space-y-4 whitespace-pre-line text-sm text-slate-700 leading-relaxed font-sans break-words [overflow-wrap:anywhere] max-w-full overflow-hidden">
                  {rawContent}
                </div>
              );
            })()}

            {currentPost.sections && currentPost.sections.length > 0 ? (
              currentPost.sections.map((section, idx) => (
                <div key={idx} className="space-y-2 break-words [overflow-wrap:anywhere] max-w-full">
                  <H3 className="text-base font-bold text-slate-900 break-words [overflow-wrap:anywhere]">
                    {isBn ? section.headingBn : section.headingEn}
                  </H3>
                  <P color="gray" className="leading-relaxed break-words [overflow-wrap:anywhere]">
                    {isBn ? section.bodyBn : section.bodyEn}
                  </P>
                  {idx === 0 && (
                    /* Embedded Video Mockup with Play Button after first section */
                    <div className="relative aspect-16/9 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-900 my-4">
                      <Image
                        src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=800&auto=format&fit=crop"
                        alt="Video demonstration of cylinder check"
                        fill
                        className="object-cover opacity-80"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <button
                          onClick={() => {
                            setIsPlaying(true);
                            toast.info(
                              isBn
                                ? "ভিডিও প্রদর্শনী শুরু হয়েছে।"
                                : "Video playback demonstration started."
                            );
                          }}
                          className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-primary shadow-xl transition-all hover:bg-white active:scale-95"
                        >
                          <Play className="h-6 w-6 fill-current translate-x-0.5" />
                        </button>
                      </div>
                      <div className="absolute bottom-3 left-3 rounded-md bg-slate-950/80 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-md">
                        {isBn
                          ? "নিরাপত্তা প্রদর্শনী ভিডিও (৩:৪৫)"
                          : "Safety Demonstration Video (3:45)"}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div>
                <H3 className="text-base">
                  {isBn
                    ? "১. নিরাপত্তা নির্দেশিকা মেনে চলুন"
                    : "1. Follow Recommended Safety Guidelines"}
                </H3>
                <P color="gray" className="mt-2">
                  {isBn
                    ? "সর্বদা অনুমোদিত সরঞ্জাম ও প্রত্যয়িত অপারেটরের সেবা গ্রহণ করুন।"
                    : "Always adhere to certified operating guidelines and use approved equipment."}
                </P>
              </div>
            )}
          </>
        )}

        {/* Emergency Alert Box */}
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-800">
          <span className="font-bold">
            {isBn
              ? "⚠️ জরুরি নিরাপত্তা প্রোটোকল:"
              : "⚠️ Critical Emergency Protocol:"}
          </span>{" "}
          {isBn ? (
            <span>
              গ্যাসের তীব্র গন্ধ (ইথাইল মারক্যাপটান) পেলে কোনো বৈদ্যুতিক সুইচ অন
              বা অফ করবেন না, দিয়াশলাই জ্বালাবেন না। তাৎক্ষণিকভাবে সিলিন্ডারের
              রেগুলেটর বন্ধ করে ঘরের সবাইকে নিয়ে খোলা বাতাসে চলে যান এবং ২৪/৭
              জাতীয় জরুরি হেল্পলাইন <strong>১৬১৩৭</strong>-এ কল করুন।
            </span>
          ) : (
            <span>
              If you detect distinct ethyl mercaptan odor, DO NOT operate any
              electrical switches, exhaust fans, or open flames. Immediately turn
              off the cylinder valve, evacuate all occupants to open air, and dial
              the 24/7 National Emergency Hotline <strong>16137</strong>.
            </span>
          )}
        </div>
      </div>

      {/* Commercial Mid-Content Ad Slot */}
      <AdSlot slot="mid_content" />

      {/* Author Bio Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-linear-to-br from-slate-50 via-white to-slate-50 p-5 sm:p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-2xl border-2 border-white bg-slate-200 shadow-xs shrink-0">
            <Image
              src={getMediaUrl(currentPost.authorImage, "/default_person.jpg")}
              alt={author}
              fill
              className="object-cover"
              onError={(e) => {
                e.currentTarget.src = "/default_person.jpg";
              }}
            />
          </div>

          <div className="flex-1 text-center sm:text-left space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {isBn ? "নিবন্ধের লেখক" : "Article Author"}
              </span>
            </div>

            <H3 className="text-base font-bold text-slate-900">
              <Link
                href={`/authors/${currentPost.authorUsername || currentPost.createdBy?.userName || encodeURIComponent(currentPost.author || currentPost.authorEn || "author")}`}
                className="hover:text-primary hover:underline transition-colors"
              >
                {author}
              </Link>
            </H3>

            <P className="text-xs text-slate-500 leading-relaxed">
              {currentPost.authorDesignation ||
                (isBn
                  ? "সেইফ এলপিজি জ্ঞানভাণ্ডার ও সুরক্ষা সেলের নিয়মিত টেকনিক্যাল লেখক ও গবেষক।"
                  : "Safe LPG technical contributor & specialized energy author.")}
            </P>

            <div className="pt-2">
              <Link
                href={`/authors/${currentPost.authorUsername || currentPost.createdBy?.userName || encodeURIComponent(currentPost.author || currentPost.authorEn || "author")}`}
                className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
              >
                <span>{isBn ? "লেখকের সকল প্রবন্ধ ও প্রোফাইল দেখুন" : "View Author Profile & All Articles"}</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Live Subscriber Comments Section */}
      <CommentSection
        targetId={currentPost.slug || String(currentPost.id)}
        targetType="blog"
        targetTitle={isBn ? currentPost.titleBn || currentPost.title : currentPost.title}
        locale={locale}
      />
    </article>
  );
}

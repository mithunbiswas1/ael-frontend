// src/app/(pages)/blogs/[slug]/_components/BlogArticleContent.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Play, Lock, Sparkles, ShieldCheck } from "lucide-react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { H1, H3, P } from "@/components/ui/Typography";
import { LinkButton } from "@/components/ui/LinkButton";
import { useDictionary } from "@/context/DictionaryContext";
import CommentSection from "@/components/shared/CommentSection";
import AdSlot from "@/components/shared/AdSlot";

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

  return (
    <article className="space-y-6 lg:col-span-8">
      {/* Header: Title & Meta & Social Share */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary">
            {category}
          </span>

          {isPaid && (
            isSubscribed ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-0.5 text-[10px] font-bold text-emerald-800 shadow-2xs">
                <Sparkles className="h-3 w-3 text-emerald-600" />
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
              {isBn ? "লেখক:" : "By"} {author}
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
          </div>

          {/* Share Icons */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">
              {isBn ? "শেয়ার:" : "Share:"}
            </span>
            <button
              onClick={() => handleShare("Facebook")}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white shadow-2xs hover:opacity-90 transition-opacity"
              title="Share on Facebook"
            >
              <FaFacebookF className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => handleShare("Twitter")}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500 text-white shadow-2xs hover:opacity-90 transition-opacity"
              title="Share on Twitter"
            >
              <FaTwitter className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => handleShare("LinkedIn")}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-700 text-white shadow-2xs hover:opacity-90 transition-opacity"
              title="Share on LinkedIn"
            >
              <FaLinkedinIn className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => handleShare("WhatsApp")}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white shadow-2xs hover:opacity-90 transition-opacity"
              title="Share on WhatsApp"
            >
              <FaWhatsapp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="relative aspect-16/9 w-full overflow-hidden rounded-xl border border-slate-200/80 bg-slate-100 shadow-xs">
        <Image
          src={currentPost.imageUrl}
          alt={title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 65vw"
          className="object-cover"
        />
      </div>

      {/* Article Body Content */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-6 sm:p-8 text-slate-700 shadow-xs space-y-6 text-sm leading-relaxed">
        {(() => {
          const rawDesc = isBn
            ? currentPost.descriptionBn || currentPost.description
            : currentPost.description;
          if (!rawDesc) return null;
          const isHtml = /<[a-z][\s\S]*>/i.test(rawDesc);
          if (isHtml) {
            return (
              <div
                className="rich-text-output text-slate-800 leading-relaxed text-sm sm:text-base space-y-3 [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>blockquote]:border-l-4 [&>blockquote]:border-primary/40 [&>blockquote]:pl-4 [&>blockquote]:italic [&>h2]:text-lg [&>h2]:font-bold [&>h3]:text-base [&>h3]:font-bold [&>a]:text-primary [&>a]:underline"
                dangerouslySetInnerHTML={{ __html: rawDesc }}
              />
            );
          }
          return (
            <P weight="semibold" color="dark" size="lg">
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
                  href="/pricing"
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-bold gap-2 shadow-md"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{isBn ? "সাবস্ক্রিপশন প্ল্যান দেখুন" : "Explore Subscription Plans"}</span>
                </LinkButton>

                {!isLoggedIn && (
                  <LinkButton
                    href={`/sign-in?redirect=/blogs/${currentPost.slug || currentPost._id}`}
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
                    className="rich-text-output text-slate-700 leading-relaxed text-sm space-y-3 [&>p]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>blockquote]:border-l-4 [&>blockquote]:border-primary/40 [&>blockquote]:pl-4 [&>blockquote]:italic [&>h2]:text-lg [&>h2]:font-bold [&>h3]:text-base [&>h3]:font-bold [&>a]:text-primary [&>a]:underline"
                    dangerouslySetInnerHTML={{ __html: rawContent }}
                  />
                );
              }
              return (
                <div className="space-y-4 whitespace-pre-line text-sm text-slate-700 leading-relaxed font-sans">
                  {rawContent}
                </div>
              );
            })()}

            {currentPost.sections && currentPost.sections.length > 0 ? (
              currentPost.sections.map((section, idx) => (
                <div key={idx} className="space-y-2">
                  <H3 className="text-base font-bold text-slate-900">
                    {isBn ? section.headingBn : section.headingEn}
                  </H3>
                  <P color="gray" className="leading-relaxed">
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

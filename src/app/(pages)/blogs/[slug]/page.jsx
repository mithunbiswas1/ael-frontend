// src/app/(pages)/blogs/[slug]/page.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronRight,
  Calendar,
  User,
  Tag,
  Play,
  Lock,
  Share2,
  Clock,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";
import { toast } from "sonner";
import { H1, H2, H3, H4, P } from "@/components/ui/Typography";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { blogsData } from "../page";

export default function BlogSinglePage() {
  const params = useParams();
  const slug = params?.slug;

  const [isPlaying, setIsPlaying] = useState(false);

  // Match by slug or by id
  const currentPost =
    blogsData.find((b) => b.slug === slug || b.id === slug) || blogsData[0];

  const relatedPosts = blogsData
    .filter((b) => b.id !== currentPost.id)
    .slice(0, 3);

  const handleShare = (platform) => {
    toast.success(`Sharing to ${platform}...`);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 sm:py-12">
      <div className="site-container">
        
        {/* 1. Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blogs" },
            { label: currentPost.title },
          ]}
          className="mb-6"
        />

        {/* 2. Main Content & Sidebar Layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* Main Article (8 cols) */}
          <article className="space-y-6 lg:col-span-8">
            
            {/* Header: Title & Meta & Social Share */}
            <div>
              <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                {currentPost.category}
              </span>

              <H1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                {currentPost.title}
              </H1>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-y border-slate-200/80 py-3 text-xs text-slate-500">
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <span className="font-semibold text-slate-800">
                    By {currentPost.author}
                  </span>
                  <span>|</span>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>{currentPost.date}</span>
                  </div>
                  <span>|</span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <span>{currentPost.readTime}</span>
                  </div>
                </div>

                {/* Share Icons */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Share:</span>
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
                alt={currentPost.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 65vw"
                className="object-cover"
              />
            </div>

            {/* Article Body Content */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-6 sm:p-8 text-slate-700 shadow-xs space-y-6 text-sm leading-relaxed">
              <p className="font-semibold text-slate-800 text-base leading-relaxed">
                Liquefied Petroleum Gas (LPG) is a clean, cost-efficient, and versatile fuel when handled in accordance with established regulatory protocols. However, inadvertent negligence can lead to avoidable hazard scenarios. Adhere to these certified procedures to guarantee safety in your home or commercial establishment.
              </p>

              <div>
                <H3 className="text-base font-black text-slate-900">
                  1. Conduct Periodic Soap Solution Leak Tests
                </H3>
                <p className="mt-2 text-slate-600">
                  Always inspect regulator o-rings and hose connections by dabbing a mild soap-water mixture around all joints. Formation of expanding bubbles signals an active gas escape. Never use open flames or matches to detect leaks. Should a leak occur, immediately disengage the regulator valve and ensure cross-ventilation.
                </p>
              </div>

              {/* Embedded Video Mockup with Play Button */}
              <div className="relative aspect-16/9 w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-900">
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
                      toast.info("Video playback demonstration started.");
                    }}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-primary shadow-xl transition-all hover:bg-white active:scale-95"
                  >
                    <Play className="h-6 w-6 fill-current translate-x-0.5" />
                  </button>
                </div>
                <div className="absolute bottom-3 left-3 rounded-md bg-slate-950/80 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-md">
                  Safety Demonstration Video (3:45)
                </div>
              </div>

              <div>
                <H3 className="text-base font-black text-slate-900">
                  2. Ensure Constant Low-Level Kitchen Ventilation
                </H3>
                <p className="mt-2 text-slate-600">
                  Because LPG vapors are denser than ambient air, escaped gas tends to settle along floor levels and corners rather than rising toward ceiling vents. Keep lower kitchen windows cracked and ensure baseboards allow airflow.
                </p>
              </div>

              <div>
                <H3 className="text-base font-black text-slate-900">
                  3. Maintain Cylinders in an Upright Vertical Position
                </H3>
                <p className="mt-2 text-slate-600">
                  Never tilt, invert, or store LPG cylinders horizontally. Cylinders must always rest vertically on dry, even ground. Storing cylinders on their side allows liquid LPG to bypass internal safety vapor spaces and enter burners, provoking catastrophic flash fires.
                </p>
              </div>

              <div>
                <H3 className="text-base font-black text-slate-900">
                  4. Disengage Cylinder Regulator When Not in Use
                </H3>
                <p className="mt-2 text-slate-600">
                  Do not rely exclusively on the stove knob. Turn off the main cylinder regulator switch every night before sleeping and prior to departing the residence.
                </p>
              </div>

              {/* Emergency Alert Box */}
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-xs text-red-800">
                <span className="font-bold">⚠️ Critical Emergency Protocol:</span> If you detect distinct ethyl mercaptan odor, DO NOT operate any electrical switches, exhaust fans, or open flames. Immediately turn off the cylinder valve, evacuate all occupants to open air, and dial the 24/7 National Emergency Hotline <strong>16137</strong>.
              </div>
            </div>

            {/* Subscriber Comments Section */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
                <div>
                  <H3 className="text-sm font-black uppercase tracking-wider text-slate-900">
                    SUBSCRIBER COMMENTS
                  </H3>
                  <span className="text-[11px] text-slate-400">
                    (Verified members only)
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>0 Comments</span>
                  <span>•</span>
                  <span>Sort by: Newest</span>
                </div>
              </div>

              {/* Login Prompt Box */}
              <div className="mt-6 flex flex-col items-center justify-center rounded-lg border border-slate-200/80 bg-slate-50/60 p-6 sm:p-8 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-500 mb-3">
                  <Lock className="h-5 w-5" />
                </div>
                <p className="text-xs text-slate-600 mb-3 font-medium">
                  Please log in with your registered account to participate in the safety discussion.
                </p>
                <Link
                  href="/login"
                  className="rounded-lg bg-primary px-5 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-xs"
                >
                  Login to Account
                </Link>
              </div>
            </div>

          </article>

          {/* Right Sidebar (4 cols) */}
          <aside className="space-y-5 lg:col-span-4">
            
            {/* Related Posts */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <H4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3.5">
                RELATED POSTS
              </H4>

              <div className="space-y-3.5">
                {relatedPosts.map((item) => (
                  <Link
                    key={item.id}
                    href={`/blogs/${item.slug}`}
                    className="group flex items-center gap-3"
                  >
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes="60px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                        {item.title}
                      </div>
                      <div className="mt-1 text-[10px] text-slate-400">
                        {item.date}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs">
              <H4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                CATEGORIES
              </H4>

              <div className="space-y-1">
                {[
                  "LPG Safety",
                  "Industry News",
                  "Tips & Awareness",
                  "Regulations",
                  "Technology",
                  "Environment",
                ].map((catName, idx) => (
                  <Link
                    key={idx}
                    href={`/blogs?category=${encodeURIComponent(catName)}`}
                    className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-primary transition-colors"
                  >
                    <span>{catName}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Back to all blogs button */}
            <Link
              href="/blogs"
              className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 shadow-2xs hover:border-primary hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to All Articles</span>
            </Link>

          </aside>

        </div>
      </div>
    </main>
  );
}

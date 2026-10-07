// src/app/(pages)/authors/[username]/_components/AuthorHero.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import {
  FaGlobe,
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaBookOpen,
  FaEye,
  FaCheckCircle,
  FaShieldAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import { getMediaUrl } from "@/utils/mediaUrl";
import { H1, H3, P } from "@/components/ui/Typography";

export default function AuthorHero({ author, stats = {}, isBn }) {
  const defaultPerson = "/default_person.jpg";
  const [imgSrc, setImgSrc] = useState(getMediaUrl(author?.image, defaultPerson));

  const designation =
    author.designation ||
    (isBn ? "কন্ট্রিবিউটর ও এলপিজি গবেষক" : "Technical Contributor & LPG Researcher");

  const bio =
    author.bio ||
    (isBn
      ? "সেইফ এলপিজি জ্ঞানভাণ্ডার, শিল্প সুরক্ষা প্রোটোকল ও এলপিজি বাজার গবেষণা সেলের নিয়মিত অবদানকারী ও লেখক।"
      : "Active contributor and verified author for Safe LPG industrial safety standards, technical dossiers, and energy market intelligence.");

  const memberSince = author.createdAt
    ? new Date(author.createdAt).toLocaleDateString(isBn ? "bn-BD" : "en-US", {
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <section className="border-b border-slate-200/80 bg-linear-to-b from-warm-sand/40 via-warm-sand/15 to-white py-10 sm:py-14">
      <div className="site-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left / Main Section: Image, Name, Designation, Description, Social */}
          <div className="lg:col-span-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            {/* Author Avatar with Default Fallback */}
            <div className="relative shrink-0">
              <div className="relative h-28 w-28 sm:h-32 sm:w-32 overflow-hidden rounded-2xl border-3 border-white bg-slate-100 shadow-md">
                <Image
                  src={imgSrc}
                  alt={author.fullName || "Author"}
                  fill
                  className="object-cover"
                  sizes="128px"
                  priority
                  onError={() => setImgSrc(defaultPerson)}
                />
              </div>

              {/* Verified Author Badge */}
              <div
                className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-xl bg-primary text-white shadow-xs border-2 border-white"
                title={isBn ? "প্রত্যয়িত লেখক" : "Verified Author"}
              >
                <FaCheckCircle className="h-3.5 w-3.5" />
              </div>
            </div>

            {/* Author Identity & Description */}
            <div className="flex-1 space-y-2.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-[11px] font-bold text-primary">
                  {isBn ? "লেখক প্রোফাইল" : "Author Profile"}
                </span>
              </div>

              <H1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
                {author.fullName}
              </H1>

              <p className="text-xs sm:text-sm font-semibold text-primary">
                {designation}
              </p>

              <P className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl pt-1">
                {bio}
              </P>

              {/* Social Links */}
              {(author.website || author.linkedin || author.twitter || author.facebook) && (
                <div className="flex items-center justify-center sm:justify-start gap-2 pt-2">
                  {author.website && (
                    <a
                      href={
                        author.website.startsWith("http")
                          ? author.website
                          : `https://${author.website}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-primary hover:text-white transition-colors text-xs shadow-2xs"
                      title="Website"
                    >
                      <FaGlobe className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {author.linkedin && (
                    <a
                      href={
                        author.linkedin.startsWith("http")
                          ? author.linkedin
                          : `https://${author.linkedin}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-[#0077b5] hover:bg-[#0077b5] hover:text-white transition-colors text-xs font-bold shadow-2xs"
                      title="LinkedIn"
                    >
                      <FaLinkedin className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {author.twitter && (
                    <a
                      href={
                        author.twitter.startsWith("http")
                          ? author.twitter
                          : `https://${author.twitter}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-900 hover:text-white transition-colors text-xs font-bold shadow-2xs"
                      title="Twitter / X"
                    >
                      <FaTwitter className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {author.facebook && (
                    <a
                      href={
                        author.facebook.startsWith("http")
                          ? author.facebook
                          : `https://${author.facebook}`
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-white border border-slate-200 text-[#1877f2] hover:bg-[#1877f2] hover:text-white transition-colors text-xs font-bold shadow-2xs"
                      title="Facebook"
                    >
                      <FaFacebook className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Side: Clean Author Card */}
          <div className="lg:col-span-4 w-full">
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {isBn ? "লেখক ওভারভিউ" : "Author Overview"}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                  <FaShieldAlt className="h-2.5 w-2.5" />
                  <span>{isBn ? "ভেরিফায়েড" : "Verified"}</span>
                </span>
              </div>

              {/* Stats Counters */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-center">
                  <div className="flex items-center justify-center text-primary mb-1">
                    <FaBookOpen className="h-3.5 w-3.5" />
                  </div>
                  <div className="text-xl font-bold font-mono text-slate-900">
                    {stats.totalArticles || stats.totalBlogs || 0}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {isBn ? "মোট প্রকাশনা" : "Total Articles"}
                  </div>
                </div>

                <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-center">
                  <div className="flex items-center justify-center text-amber-500 mb-1">
                    <FaEye className="h-3.5 w-3.5" />
                  </div>
                  <div className="text-xl font-bold font-mono text-slate-900">
                    {stats.totalViews || 0}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {isBn ? "মোট ভিউজ" : "Total Views"}
                  </div>
                </div>
              </div>

              {/* Attributes */}
              <div className="space-y-2 pt-1 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">
                    {isBn ? "ইউজারনেম:" : "Username:"}
                  </span>
                  <span className="font-mono font-semibold text-slate-800">
                    @{author.userName || "author"}
                  </span>
                </div>

                {memberSince && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">
                      {isBn ? "কন্ট্রিবিউটর:" : "Contributor Since:"}
                    </span>
                    <span className="font-medium text-slate-700">
                      {memberSince}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

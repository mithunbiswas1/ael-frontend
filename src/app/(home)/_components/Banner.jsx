// src/app/(home)/_components/Banner.jsx

"use client";

import Link from "next/link";
import { Search, ArrowRight, Check } from "lucide-react";
import Image from "next/image";
import { LinkButton } from "@/components/ui/LinkButton";

const benefits = [
  "Verified Sellers",
  "Secure Payments",
  "Buyer Protection",
  "Fast Delivery",
];

export default function Banner() {
  return (
    <section className="w-full">
      <div className="site-container py-8 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-20 lg:gap-0">
          {/* ================= LEFT CONTENT ================= */}
          <div className="">
            <div className="max-w-143.75">
              {/* Small Label */}
              <span className="px-3 py-1 text-xs font-semibold text-gray-900 bg-gray-100 rounded-full uppercase">
                The Digital Marketplace
              </span>

              {/* Heading */}
              <h1 className="mt-3 text-[46px] font-bold leading-[1.2] text-primary">
                Your Trusted Marketplace for{" "}
                <span className="text-brand">Digital Accounts</span>
              </h1>

              {/* Description */}
              <p className="mt-6 text-base leading-[1.6]">
                Buy and sell digital accounts &amp; assets from trusted sellers
                with secure payments, buyer protection, and fast delivery.
              </p>

              {/* Search */}
              <div className="mt-6 px-3 py-2 w-full flex items-center gap-1.5 rounded-[14px] border border-border bg-white">
                <div
                  aria-label="Search"
                  className="size-11 flex items-center justify-center"
                >
                  <Search className="size-5 text-gray-900" />
                </div>

                <input
                  type="text"
                  placeholder="Search accounts, games, software & more..."
                  className="flex-1 bg-transparent text-base leading-[1.2] text-tertiary outline-none placeholder:text-tertiary"
                />

                <button
                  type="button"
                  aria-label="Search"
                  className="ml-3 px-4 py-2 text-white bg-primary-2 rounded-lg transition"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>

              {/* CTA Buttons */}
              <div className="mt-12.5 flex items-center gap-3.5">
                <LinkButton href="/#" variant="solid" className="px-6 py-3">
                  Explore Marketplace
                </LinkButton>

                <LinkButton
                  href="/#"
                  variant="outline"
                  className="border-secondary text-base-black px-6 py-3"
                >
                  Start Selling
                </LinkButton>
              </div>
            </div>

            {/* Benefits */}
            <div className="mt-12.5  flex flex-wrap gap-x-7 gap-y-4">
              {benefits.map((benefit) => (
                <div key={benefit} className="flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success text-white">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>

                  <span className="text-base text-primary font-medium leading-1.6">
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ================= RIGHT VISUAL ================= */}
          <div className="flex h-full justify-center lg:justify-end">
            <video
              src="/video.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="h-full w-full max-w-100 object-cover rounded-[20px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

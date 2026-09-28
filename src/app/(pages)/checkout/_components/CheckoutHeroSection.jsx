// src/app/(pages)/checkout/_components/CheckoutHeroSection.jsx
"use client";

import { H1, P } from "@/components/ui/Typography";
import AmbientGlow from "@/components/ui/AmbientGlow";
import Breadcrumb from "@/components/ui/Breadcrumb";
import { useDictionary } from "@/context/DictionaryContext";

export default function CheckoutHeroSection() {
  const { locale, dict } = useDictionary();
  const isBn = locale === "bn";
  const co = dict?.checkout || {};
  const common = dict?.common || {};

  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 pb-12 pt-10 text-white">
      <AmbientGlow />

      <div className="site-container relative z-10 max-w-5xl mx-auto">
        <Breadcrumb
          dark
          items={[
            { label: common.home || "Home", href: "/" },
            { label: isBn ? "সাবস্ক্রিপশন প্ল্যান" : "Pricing", href: "/pricing" },
            { label: isBn ? "নিরাপদ চেকআউট" : "Secure Checkout" },
          ]}
          className="mb-3"
        />

        <div className="flex items-center justify-between">
          <div>
            <H1 color="white" className="leading-tight text-xl sm:text-2xl md:text-3xl">
              <span>{co.title || (isBn ? "নিরাপদ" : "SECURE")}</span>{" "}
              <span className="text-primary">{co.accent || (isBn ? "চেকআউট।" : "CHECKOUT.")}</span>
            </H1>
            <P size="xs" color="slate400" className="mt-1">
              {co.subtitle ||
                (isBn
                  ? "বাংলাদেশ ব্যাংক স্বীকৃত মার্চেন্ট চ্যানেল দ্বারা চালিত ২৫৬-বিট এসএসএল সুরক্ষিত গেটওয়ে।"
                  : "256-bit SSL encrypted gateway powered by Bangladesh Bank recognized merchant channels.")}
            </P>
          </div>
        </div>
      </div>
    </section>
  );
}

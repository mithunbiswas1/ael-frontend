// src/app/(pages)/pricing/_components/PricingCardsSection.jsx
"use client";

import { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Check, ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/LinkButton";
import { Button } from "@/components/ui/Button";
import { H3, P } from "@/components/ui/Typography";
import { useDictionary } from "@/context/DictionaryContext";
import { useGetSubscriptionPlansQuery } from "@/redux/api/subscriptionApi";
import CheckoutModal from "@/components/shared/CheckoutModal";
import AuthModal from "@/components/shared/AuthModal";

const DEFAULT_PLANS = [
  {
    planKey: "free",
    nameEn: "Free / Newsletter",
    nameBn: "ফ্রি / নিউজলেটার",
    taglineEn: "Essential ongoing safety awareness & fundamental guidance",
    taglineBn: "মৌলিক নিরাপত্তা সচেতনতা ও উন্মুক্ত কোর্স সহায়িকা",
    durationDays: 0,
    durationLabelEn: "Lifetime Free",
    durationLabelBn: "আজীবন ফ্রি",
    price: 0,
    originalPrice: 0,
    badgeEn: "Free Tier",
    badgeBn: "উন্মুক্ত",
    featuresEn: [
      "Access to all open safety guidelines & newsletters",
      "Enrollment in foundational free safety courses",
      "Public incident registry & blog advisories",
      "24/7 National Emergency Hotline (16137)",
    ],
    featuresBn: [
      "সকল উন্মুক্ত নিরাপত্তা নির্দেশিকা ও নিউজলেটার",
      "ফ্রি নিরাপত্তা কোর্সসমূহে সরাসরি এনরোলমেন্ট",
      "জাতীয় দুর্ঘটনা পর্যবেক্ষণ ও সচেতনতামূলক ব্লগ",
      "২৪/৭ জাতীয় জরুরি হেল্পলাইন (১৬১৩৭)",
    ],
    isPopular: false,
    order: 1,
  },
  {
    planKey: "monthly",
    nameEn: "Monthly Premium",
    nameBn: "মাসিক প্রিমিয়াম",
    taglineEn: "Complete premium training, official certificates, and circular downloads",
    taglineBn: "সার্টিফায়েড অনলাইন কোর্স, অফিশিয়াল সনদপত্র ও সার্কুলার ডাউনলোড",
    durationDays: 30,
    durationLabelEn: "30 Days (1 Month)",
    durationLabelBn: "৩০ দিন (১ মাস)",
    price: 990,
    originalPrice: 1200,
    badgeEn: "Standard",
    badgeBn: "স্ট্যান্ডার্ড",
    featuresEn: [
      "Full unrestricted access to all premium video masterclasses",
      "Verifiable QR-coded digital certificates upon completion",
      "Unrestricted high-resolution PDF circulars & probe downloads",
      "Exclusive premium market telemetry & BERC pricing alerts",
      "Post comments and participate in technical discussions",
    ],
    featuresBn: [
      "সকল প্রিমিয়াম ভিডিও মাস্টারক্লাসে পূর্ণ অ্যাক্সেস",
      "কোর্স সমাপ্তির পর কিউআর-কোডযুক্ত যাচাইযোগ্য সনদপত্র",
      "উচ্চমানের সরকারি সার্কুলার ও তদন্ত প্রতিবেদন পিডিএফ ডাউনলোড",
      "বিইআরসি মূল্য পরিবর্তনের তাৎক্ষণিক বার্তা ও পরিসংখ্যান",
      "টেকনিক্যাল ব্লগে সরাসরি মন্তব্য ও আলোচনা করার সুযোগ",
    ],
    isPopular: false,
    order: 2,
  },
  {
    planKey: "half_yearly",
    nameEn: "Half-Yearly Professional",
    nameBn: "ষান্মাসিক প্রফেশনাল",
    taglineEn: "Enhanced training continuity with substantial semi-annual discount",
    taglineBn: "দীর্ঘমেয়াদী প্রশিক্ষণ ও বিশেষ সেমি-অ্যানুয়াল মূল্যছাড় প্যাকেজ",
    durationDays: 180,
    durationLabelEn: "180 Days (6 Months)",
    durationLabelBn: "১৮০ দিন (৬ মাস)",
    price: 4990,
    originalPrice: 5940,
    badgeEn: "Best Value",
    badgeBn: "সেরা পছন্দ",
    featuresEn: [
      "All Monthly Premium features included",
      "180 days uninterrupted access to all existing and new courses",
      "Download official regulatory dossiers & inspection forms",
      "Priority customer & technical audit support",
      "Quarterly regulatory compliance digest booklet (Digital)",
    ],
    featuresBn: [
      "মাসিক প্রিমিয়ামের সকল ফিচারসমূহ অন্তর্ভুক্ত",
      "১৮০ দিনের জন্য বিদ্যমান এবং নতুন সকল কোর্সে নিরবচ্ছিন্ন অ্যাক্সেস",
      "বিস্ফোরক অধিদপ্তরের সংবিধিবদ্ধ ফর্ম ও নীতিমালা ডাউনলোড",
      "অগ্রাধিকারমূলক টেকনিক্যাল সাপোর্ট ও পরামর্শ",
      "ত্রৈমাসিক রেগুলেটরি কমপ্লায়েন্স সাময়িকী (ডিজিটাল)",
    ],
    isPopular: true,
    order: 3,
  },
  {
    planKey: "yearly",
    nameEn: "Yearly Elite",
    nameBn: "বাৎসরিক এলিট",
    taglineEn: "",
    taglineBn: "",
    durationDays: 365,
    durationLabelEn: "365 Days (1 Year)",
    durationLabelBn: "৩৬৫ দিন (১ বছর)",
    price: 8990,
    originalPrice: 11880,
    badgeEn: "Max Savings",
    badgeBn: "সর্বাধিক সাশ্রয়",
    featuresEn: [
      "All Half-Yearly features included",
      "Full 365 days VIP access to all masterclasses & certificates",
      "Maximum discount (Over 25% annual savings)",
      "Priority fast-track certificate verification and issuance",
      "Direct consultation hotline with senior safety engineers",
      "Exclusive invitations to annual safety symposiums",
    ],
    featuresBn: [
      "ষান্মাসিক প্যাকেজের সকল সুবিধাসমূহ অন্তর্ভুক্ত",
      "৩৬৫ দিনের জন্য সকল মাস্টারক্লাস ও সার্টিফিকেটে ভিআইপি প্রবেশাধিকার",
      "সর্বোচ্চ ২৫%+ আর্থিক সাশ্রয়ী বাৎসরিক প্ল্যান",
      "ফাস্ট-ট্র্যাক সার্টিফিকেট যাচাই ও দ্রুততম ডেলিভারি",
      "সিনিয়র সেফটি ইঞ্জিনিয়ারদের সাথে সরাসরি পরামর্শ সহায়তা",
      "বার্ষিক জাতীয় সেফটি কনফারেন্সে বিশেষ আমন্ত্রণ",
    ],
    isPopular: false,
    order: 4,
  },
  {
    planKey: "professional",
    nameEn: "Dealer / Industry Professional",
    nameBn: "ডিলার / ইন্ডাস্ট্রিয়াল প্রফেশনাল",
    taglineEn: "Full enterprise regulatory compliance, bulk data access, and corporate staff licensing",
    taglineBn: "ডিলার ও কারখানা পর্যায়ে প্রাতিষ্ঠানিক কমপ্লায়েন্স মডিউল ও ডেটাবেজ অ্যাক্সেস",
    durationDays: 365,
    durationLabelEn: "365 Days (Corporate)",
    durationLabelBn: "৩৬৫ দিন (প্রাতিষ্ঠানিক)",
    price: 14990,
    originalPrice: 19990,
    badgeEn: "Enterprise",
    badgeBn: "এন্টারপ্রাইজ",
    featuresEn: [
      "All Yearly Elite features included",
      "Professional DoE & BERC compliance audit modules",
      "Bulk data export & national LPG directory access",
      "Staff safety training portal for up to 5 employees",
      "Commercial dealer authorization display badge",
      "Dedicated corporate relationship manager",
    ],
    featuresBn: [
      "বাৎসরিক এলিট প্যাকেজের সকল ফিচার-সুবিধা",
      "বিস্ফোরক অধিদপ্তর ও বিইআরসি অডিট কমপ্লায়েন্স গাইড",
      "সারাদেশের এলপিজি ডিরেক্টরি ও বাল্ক ডেটাবেজ ব্রাউজিং সুবিধা",
      "প্রতিষ্ঠানের ৫ জন কর্মীর জন্য যৌথ প্রশিক্ষণ পোর্টাল",
      "বাণিজ্যিক ডিলার অথোরাইজেশন ভেরিফাইড ব্যাজ",
      "ডেডিকেটেড করপোরেট রিলেশনশিপ অফিসার সাপোর্ট",
    ],
    isPopular: false,
    order: 5,
  },
];

export default function PricingCardsSection() {
  const { locale, dict } = useDictionary();
  const isBn = locale === "bn";
  const pricingDict = dict?.pricing || {};

  const { isLoggedIn } = useSelector((state) => state.auth);

  // Modal states
  const [selectedCheckoutPlan, setSelectedCheckoutPlan] = useState(null);
  const [pendingPlan, setPendingPlan] = useState(null);
  const pendingPlanRef = useRef(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const { data: plansData } = useGetSubscriptionPlansQuery();

  const rawPlans = plansData?.data?.length > 0 ? plansData.data : DEFAULT_PLANS;
  const plans = [...rawPlans]
    .filter((p) => p.isActive !== false)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const handlePlanClick = (plan) => {
    if (!isLoggedIn) {
      pendingPlanRef.current = plan;
      setPendingPlan(plan);
      setIsAuthModalOpen(true);
      return;
    }
    setSelectedCheckoutPlan(plan);
  };

  return (
    <section className="relative z-20 -mt-10 mx-auto w-full max-w-7xl px-4 sm:px-6">
      {/* 3 Cards per row on LG screen as requested */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
        {plans.map((plan) => {
          const name = isBn ? plan.nameBn : plan.nameEn;
          const tagline = isBn ? plan.taglineBn : plan.taglineEn;
          const durationLabel = isBn ? plan.durationLabelBn : plan.durationLabelEn;
          const badge = isBn ? plan.badgeBn : plan.badgeEn;
          const features = (isBn ? plan.featuresBn : plan.featuresEn) || [];
          const isFree = plan.price === 0;
          const buttonVariant = plan.isPopular ? "primary" : "secondary";

          return (
            <div
              key={plan.planKey || plan._id}
              className={`group relative flex flex-col justify-between rounded-2xl bg-white p-6 sm:p-7 transition-colors duration-200 ${
                plan.isPopular
                  ? "border-2 border-primary shadow-xs ring-4 ring-primary/10"
                  : "border border-slate-200/90 shadow-2xs hover:border-slate-300"
              }`}
            >
              {/* Floating Top Badge */}
              {plan.isPopular ? (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-md flex items-center gap-1.5 whitespace-nowrap">
                  <span>{badge || (isBn ? "জনপ্রিয় প্যাকেজ" : "Recommended")}</span>
                </div>
              ) : badge ? (
                <div className="absolute -top-3 left-6 rounded-full bg-slate-100 border border-slate-200 px-3 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-600 shadow-2xs">
                  {badge}
                </div>
              ) : null}

              <div>
                {/* Header */}
                <div className="mt-1">
                  <H3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                    {name}
                  </H3>
                  <P
                    color="muted"
                    size="xs"
                    className="mt-1.5 min-h-[36px] text-xs leading-relaxed text-slate-500"
                  >
                    {tagline}
                  </P>
                </div>

                {/* Price Display */}
                <div className="my-5 border-y border-slate-100 py-4">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                      {isFree
                        ? isBn
                          ? "ফ্রি"
                          : "FREE"
                        : `৳ ${Number(plan.price).toLocaleString()}`}
                    </span>
                    {!isFree && (
                      <span className="text-xs font-semibold text-slate-500">
                        / {durationLabel}
                      </span>
                    )}
                  </div>

                  {plan.originalPrice > plan.price && (
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-xs text-slate-400 line-through">
                        ৳ {Number(plan.originalPrice).toLocaleString()}
                      </span>
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                        {Math.round(
                          ((plan.originalPrice - plan.price) / plan.originalPrice) * 100
                        )}
                        % {isBn ? "সাশ্রয়" : "SAVINGS"}
                      </span>
                    </div>
                  )}

                  {isFree && (
                    <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                      {isBn
                        ? "আজীবন উন্মুক্ত অ্যাক্সেস"
                        : "Lifetime Continuous Access"}
                    </div>
                  )}
                </div>

                {/* Features List */}
                <div className="space-y-3 mb-8">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-900">
                    {pricingDict.includedFeatures ||
                      (isBn
                        ? "প্যাকেজে অন্তর্ভুক্ত সুবিধাসমূহ:"
                        : "What's Included:")}
                  </div>

                  <div className="space-y-2.5">
                    {features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2.5">
                        <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mt-0.5 border border-emerald-200">
                          <Check className="h-2.5 w-2.5 stroke-[3]" />
                        </div>
                        <span className="text-xs text-slate-700 leading-snug">
                          {feat}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Action Section */}
              <div className="pt-2">
                {isFree ? (
                  <LinkButton
                    href="/courses"
                    variant="secondary"
                    size="lg"
                    className="w-full text-xs font-bold gap-2 shadow-xs transition-all hover:border-primary hover:bg-primary hover:text-white"
                  >
                    <span>
                      {isBn ? "বিনামূল্যে শুরু করুন" : "Get Started Free"}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </LinkButton>
                ) : (
                  <Button
                    type="button"
                    variant={buttonVariant}
                    size="lg"
                    fullWidth
                    onClick={() => handlePlanClick(plan)}
                    className="text-xs font-bold gap-2 shadow-xs transition-all"
                  >
                    <span>
                      {isBn ? "সাবস্ক্রাইব করুন" : "Subscribe Now"}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={Boolean(selectedCheckoutPlan)}
        onClose={() => setSelectedCheckoutPlan(null)}
        selectedPlan={selectedCheckoutPlan}
        onSuccess={() => {
          setSelectedCheckoutPlan(null);
        }}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          pendingPlanRef.current = null;
          setPendingPlan(null);
        }}
        onSuccess={() => {
          setIsAuthModalOpen(false);
          const planToCheckout = pendingPlanRef.current || pendingPlan;
          if (planToCheckout) {
            setSelectedCheckoutPlan(planToCheckout);
            pendingPlanRef.current = null;
            setPendingPlan(null);
          }
        }}
      />
    </section>
  );
}

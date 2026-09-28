// src/app/(pages)/pricing/_components/PricingCardsSection.jsx
"use client";

import { Check, X, ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/LinkButton";
import { H3, P } from "@/components/ui/Typography";
import { useDictionary } from "@/context/DictionaryContext";

const EN_PRICING_PLANS = [
  {
    id: "free",
    name: "Public Visitor",
    tagline: "Essential awareness for everyday household users",
    priceMonthly: 0,
    priceYearly: 0,
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
    isPopular: false,
    features: [
      "Access to all public Safety Guidelines",
      "National Incident registry viewing",
      "Public blog articles & safety tips",
      "Access to 1 Basic Safety Course",
      "24/7 National Emergency Hotline (16137)",
    ],
    notIncluded: [
      "Official certified safety certificates",
      "DoE regulatory inspection checklists",
      "Full inquiry dossier PDF downloads",
      "Priority staff safety licensing portal",
    ],
    ctaText: "Get Started Free",
    ctaHref: "/courses",
  },
  {
    id: "consumer",
    name: "Household Plus",
    tagline: "Comprehensive home kitchen protection & certification",
    priceMonthly: 199,
    priceYearly: 1990,
    badgeColor: "bg-blue-50 text-primary border-blue-200",
    isPopular: false,
    features: [
      "All features of Public Visitor",
      "Full access to all 4 Consumer Safety Courses",
      "QR-coded Verifiable Certificate of Safety",
      "SMS alerts for BERC price revisions & recalls",
      "Quarterly cylinder replacement safety reminder",
      "Direct technical Q&A with certified safety trainers",
    ],
    notIncluded: [
      "Commercial dealer regulatory tools",
      "Multi-staff employee progress dashboard",
    ],
    ctaText: "Upgrade to Plus",
    ctaHref: "/checkout?plan=consumer",
  },
  {
    id: "dealer",
    name: "Licensed Dealer",
    tagline: "Full compliance & regulatory safety for LPG retailers",
    priceMonthly: 799,
    priceYearly: 7990,
    badgeColor: "bg-primary text-white",
    isPopular: true,
    features: [
      "All features of Household Plus",
      "DoE statutory compliance audit checklist",
      "Staff safety training portal (up to 5 staff)",
      "Unrestricted inquiry dossiers & incident reports",
      "Fire Service inspection compliance guide",
      "Official Dealer Certificate badge for display",
      "Priority phone & email support",
    ],
    notIncluded: ["On-site industrial plant safety consultation"],
    ctaText: "Subscribe Dealer Pro",
    ctaHref: "/checkout?plan=dealer",
  },
  {
    id: "enterprise",
    name: "Industrial Enterprise",
    tagline: "Heavy-duty safety monitoring for stations & factories",
    priceMonthly: 2499,
    priceYearly: 24990,
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    isPopular: false,
    features: [
      "All features of Licensed Dealer",
      "Unlimited staff enrollment in all certified courses",
      "High-Pressure manifold & vaporizer inspection SOPs",
      "Automated sensor telemetry calibration logs",
      "Quarterly consultation with senior safety engineer",
      "Dedicated account manager with 24/7 direct access",
      "Custom branded LMS portal for corporate teams",
    ],
    notIncluded: [],
    ctaText: "Contact Enterprise",
    ctaHref: "/checkout?plan=enterprise",
  },
];

const BN_PRICING_PLANS = [
  {
    id: "free",
    name: "পাবলিক ভিজিটর",
    tagline: "সাধারণ গৃহস্থালী ব্যবহারকারীদের জন্য প্রাথমিক সচেতনতা",
    priceMonthly: 0,
    priceYearly: 0,
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
    isPopular: false,
    features: [
      "সকল উন্মুক্ত নিরাপত্তা নির্দেশিকায় প্রবেশাধিকার",
      "জাতীয় দুর্ঘটনা রেজিস্ট্রি দেখার সুবিধা",
      "নিয়মিত সচেতনতামূলক ব্লগ ও পরামর্শ",
      "১টি মৌলিক নিরাপত্তা কোর্সে অ্যাক্সেস",
      "২৪/৭ জাতীয় জরুরি হেল্পলাইন (১৬১৩৭)",
    ],
    notIncluded: [
      "অফিশিয়াল প্রত্যয়িত সার্টিফিকেট",
      "বিস্ফোরক পরিদপ্তরের কমপ্লায়েন্স চেকলিস্ট",
      "পূর্ণাঙ্গ তদন্ত প্রতিবেদন পিডিএফ ডাউনলোড",
      "কর্মীদের জন্য ডেডিকেটেড প্রশিক্ষণ পোর্টাল",
    ],
    ctaText: "বিনামূল্যে শুরু করুন",
    ctaHref: "/courses",
  },
  {
    id: "consumer",
    name: "হাউসহোল্ড প্লাস",
    tagline: "রান্নাঘরের সার্বিক নিরাপত্তা সুরক্ষা ও সার্টিফিকেশন",
    priceMonthly: 199,
    priceYearly: 1990,
    badgeColor: "bg-blue-50 text-primary border-blue-200",
    isPopular: false,
    features: [
      "পাবলিক ভিজিটরের সকল সুবিধাসমূহ",
      "সকল ৪টি গৃহস্থালী নিরাপত্তা কোর্সে পূর্ণ অ্যাক্সেস",
      "কিউআর কোডযুক্ত যাচাইযোগ্য নিরাপত্তা সার্টিফিকেট",
      "বিইআরসি মূল্য পরিবর্তন ও সিলিন্ডার ত্রুটির এসএমএস সতর্কতা",
      "ত্রৈমাসিক সিলিন্ডার ও পাইপ রক্ষণাবেক্ষণ রিমাইন্ডার",
      "নিরাপত্তা প্রশিক্ষকদের সাথে সরাসরি প্রশ্নোত্তর",
    ],
    notIncluded: [
      "বাণিজ্যিক ডিলার নিয়ন্ত্রক টুলস",
      "মাল্টি-স্টাফ কর্মী ট্র্যাকিং ড্যাশবোর্ড",
    ],
    ctaText: "প্লাসে আপগ্রেড করুন",
    ctaHref: "/checkout?plan=consumer",
  },
  {
    id: "dealer",
    name: "লাইসেন্সপ্রাপ্ত ডিলার",
    tagline: "এলপিজি রিটেইলারদের জন্য পূর্ণাঙ্গ কমপ্লায়েন্স ও নিরাপত্তা",
    priceMonthly: 799,
    priceYearly: 7990,
    badgeColor: "bg-primary text-white",
    isPopular: true,
    features: [
      "হাউসহোল্ড প্লাসের সকল সুবিধাসমূহ",
      "বিস্ফোরক পরিদপ্তরের সংবিধিবদ্ধ অডিট চেকলিস্ট",
      "দোকানের কর্মচারীদের নিরাপত্তা প্রশিক্ষণ (৫ জন পর্যন্ত)",
      "অবাধ দুর্ঘটনা তদন্ত রিপোর্ট ও প্রযুক্তিগত ফাইল",
      "ফায়ার সার্ভিস অনাপত্তিপত্র প্রস্তুতি গাইড",
      "দোকানে প্রদর্শনের জন্য অফিশিয়াল ডিলার সেফটি ব্যাজ",
      "অগ্রাধিকারমূলক ফোন ও ইমেইল সহায়তা",
    ],
    notIncluded: ["অন-সাইট শিল্প কারখানা নিরাপত্তা কনসালটেন্সি"],
    ctaText: "ডিলার সাবস্ক্রাইব করুন",
    ctaHref: "/checkout?plan=dealer",
  },
  {
    id: "enterprise",
    name: "ইন্ডাস্ট্রিয়াল এন্টারপ্রাইজ",
    tagline: "অটোগ্যাস স্টেশন ও শিল্প কারখানার জন্য ভারী নিরাপত্তা প্যাকেজ",
    priceMonthly: 2499,
    priceYearly: 24990,
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
    isPopular: false,
    features: [
      "লাইসেন্সপ্রাপ্ত ডিলারের সকল সুবিধাসমূহ",
      "সকল প্রকৌশলী ও কর্মীর জন্য আনলিমিটেড কোর্স এনরোলমেন্ট",
      "হাই-প্রেশার ম্যানিফোল্ড ও ভেপোরাইজার পরিদর্শন এসওপি",
      "সেন্সর ও গ্যাস ডিটেক্টর ক্যালিব্রেশন লগ",
      "ত্রৈমাসিক সিনিয়র সেফটি ইঞ্জিনিয়ারের পরিদর্শন ও পরামর্শ",
      "ডেডিকেটেড একাউন্ট ম্যানেজার ও ২৪/৭ সরাসরি সাপোর্ট",
      "কর্পোরেট প্রতিষ্ঠানের জন্য কাস্টম এলএমএস পোর্টাল",
    ],
    notIncluded: [],
    ctaText: "যোগাযোগ করুন",
    ctaHref: "/checkout?plan=enterprise",
  },
];

export default function PricingCardsSection({ isAnnual, plansConfig }) {
  const { locale, dict } = useDictionary();
  const isBn = locale === "bn";
  const pricingDict = dict?.pricing || {};

  const basePlans = isBn ? BN_PRICING_PLANS : EN_PRICING_PLANS;

  const plans = basePlans.map((plan) => {
    if (plan.id === "consumer" && plansConfig?.consumerPrice) {
      const parsed = parseInt(String(plansConfig.consumerPrice).replace(/[^0-9]/g, ""), 10);
      return {
        ...plan,
        name: plansConfig.consumerLabel || plan.name,
        priceMonthly: !isNaN(parsed) && parsed > 0 ? parsed : plan.priceMonthly,
        priceYearly: !isNaN(parsed) && parsed > 0 ? parsed * 10 : plan.priceYearly,
      };
    }
    if (plan.id === "dealer" && plansConfig?.dealerPrice) {
      const parsed = parseInt(String(plansConfig.dealerPrice).replace(/[^0-9]/g, ""), 10);
      return {
        ...plan,
        name: plansConfig.dealerLabel || plan.name,
        priceMonthly: !isNaN(parsed) && parsed > 0 ? parsed : plan.priceMonthly,
        priceYearly: !isNaN(parsed) && parsed > 0 ? parsed * 10 : plan.priceYearly,
      };
    }
    if (plan.id === "enterprise" && plansConfig?.corporatePrice) {
      const parsed = parseInt(String(plansConfig.corporatePrice).replace(/[^0-9]/g, ""), 10);
      return {
        ...plan,
        name: plansConfig.corporateLabel || plan.name,
        priceMonthly: !isNaN(parsed) && parsed > 0 ? parsed : plan.priceMonthly,
        priceYearly: !isNaN(parsed) && parsed > 0 ? parsed * 10 : plan.priceYearly,
      };
    }
    return plan;
  });

  return (
    <section className="relative z-20 -mt-8 mx-auto w-full max-w-6xl px-4 pb-20">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 items-stretch">
        {plans.map((plan) => {
          const price = isAnnual ? plan.priceYearly : plan.priceMonthly;
          const period = isAnnual
            ? pricingDict.perYear || (isBn ? "/ বছর" : "/ year")
            : pricingDict.perMonth || (isBn ? "/ মাস" : "/ month");

          return (
            <div
              key={plan.id}
              className={`relative flex flex-col justify-between rounded-xl bg-white p-6 transition-all duration-200 ${
                plan.isPopular
                  ? "border-2 border-primary shadow-lg ring-4 ring-primary/10"
                  : "border border-slate-200/80 shadow-2xs"
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-xs">
                  {isBn ? "জনপ্রিয় প্যাকেজ" : "Recommended"}
                </div>
              )}

              <div>
                <H3 className="text-base font-bold text-slate-900">
                  {plan.name}
                </H3>

                <P color="muted" size="xs" className="min-h-[36px] leading-relaxed mt-1">
                  {plan.tagline}
                </P>

                <div className="my-5 border-y border-slate-100 py-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-slate-900">
                      ৳ {price.toLocaleString()}
                    </span>
                    {price > 0 && (
                      <span className="text-xs font-medium text-slate-500">
                        {period}
                      </span>
                    )}
                  </div>
                  {isAnnual && price > 0 && (
                    <div className="text-[10px] text-emerald-600 font-semibold mt-1">
                      {isBn
                        ? "বার্ষিক বিলিং (২০% সাশ্রয়)"
                        : "Billed annually (Save 2 months free)"}
                    </div>
                  )}
                </div>

                {/* Feature List */}
                <div className="space-y-2.5 text-xs text-slate-600 mb-6">
                  <div className="font-bold text-slate-900 text-[11px] uppercase tracking-wider mb-2">
                    {pricingDict.includedFeatures ||
                      (isBn ? "প্যাকেজে অন্তর্ভুক্ত:" : "Included Features:")}
                  </div>

                  {plan.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2">
                      <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{feat}</span>
                    </div>
                  ))}

                  {plan.notIncluded.map((feat, fIdx) => (
                    <div
                      key={fIdx}
                      className="flex items-start gap-2 text-slate-400"
                    >
                      <X className="h-3.5 w-3.5 text-slate-300 shrink-0 mt-0.5" />
                      <span className="line-through leading-snug">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <LinkButton
                  href={
                    plan.id === "free"
                      ? plan.ctaHref
                      : `${plan.ctaHref}&billing=${
                          isAnnual ? "yearly" : "monthly"
                        }`
                  }
                  variant={plan.isPopular ? "primary" : "secondary"}
                  size="md"
                  className="w-full text-xs font-bold gap-1.5"
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </LinkButton>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// src/app/(pages)/pricing/page.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  X,
  ShieldCheck,
  Zap,
  Building,
  Award,
  ArrowRight,
  HelpCircle,
  Clock,
  Sparkles,
} from "lucide-react";
import { H1, H2, H3, H4, P } from "@/components/ui/Typography";
import AmbientGlow from "@/components/ui/AmbientGlow";
import Breadcrumb from "@/components/ui/Breadcrumb";

const PRICING_PLANS = [
  {
    id: "free",
    name: "Public Visitor",
    tagline: "Essential awareness for everyday household users",
    priceMonthly: 0,
    priceYearly: 0,
    badge: "Always Free",
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
    badge: "For Families",
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
    badge: "Most Popular",
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
    notIncluded: [
      "On-site industrial plant safety consultation",
    ],
    ctaText: "Subscribe Dealer Pro",
    ctaHref: "/checkout?plan=dealer",
  },
  {
    id: "enterprise",
    name: "Industrial Enterprise",
    tagline: "Heavy-duty safety monitoring for stations & factories",
    priceMonthly: 2499,
    priceYearly: 24990,
    badge: "For Plants & Stations",
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

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* 1. Page Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 pb-16 pt-10 text-white">
        <AmbientGlow />

        <div className="site-container relative z-10 text-center max-w-3xl mx-auto">
          <Breadcrumb
            dark
            items={[
              { label: "Home", href: "/" },
              { label: "Pricing & Plans" },
            ]}
            className="justify-center mb-3"
          />

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-blue-400 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>TRANSPARENT NATIONAL PRICING</span>
          </div>

          <H1 color="white" className="leading-tight">
            <span>FLEXIBLE SAFETY</span>{" "}
            <span className="text-primary">PLANS.</span>
          </H1>

          <P className="mt-3 text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Choose the safety, training, and regulatory compliance package tailored for your home, retail outlet, auto gas station, or manufacturing facility.
          </P>

          {/* Billing Cycle Toggle */}
          <div className="mt-8 inline-flex items-center gap-1.5 sm:gap-3 rounded-full border border-slate-700 bg-slate-900/80 p-1 sm:p-1.5 shadow-md max-w-full">
            <button
              onClick={() => setIsAnnual(false)}
              className={`rounded-full px-3 sm:px-4 py-1.5 text-xs font-bold transition-all ${
                !isAnnual
                  ? "bg-primary text-white shadow-2xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Monthly
            </button>

            <button
              onClick={() => setIsAnnual(true)}
              className={`flex items-center gap-1.5 rounded-full px-3 sm:px-4 py-1.5 text-xs font-bold transition-all ${
                isAnnual
                  ? "bg-primary text-white shadow-2xs"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span>Annual</span>
              <span className="rounded-full bg-emerald-500 px-1.5 sm:px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-slate-950">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Pricing Cards Grid */}
      <section className="relative z-20 -mt-8 mx-auto w-full max-w-6xl px-4 pb-20">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 items-stretch">
          {PRICING_PLANS.map((plan) => {
            const price = isAnnual ? plan.priceYearly : plan.priceMonthly;
            const period = isAnnual ? "/ year" : "/ month";

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
                    Recommended
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-bold text-slate-900">
                      {plan.name}
                    </h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border ${plan.badgeColor}`}
                    >
                      {plan.badge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 min-h-[36px] leading-relaxed">
                    {plan.tagline}
                  </p>

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
                        Billed annually (Save 2 months free)
                      </div>
                    )}
                  </div>

                  {/* Feature List */}
                  <div className="space-y-2.5 text-xs text-slate-600 mb-6">
                    <div className="font-bold text-slate-900 text-[11px] uppercase tracking-wider mb-2">
                      Included Features:
                    </div>

                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}

                    {plan.notIncluded.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-slate-400">
                        <X className="h-3.5 w-3.5 text-slate-300 shrink-0 mt-0.5" />
                        <span className="line-through leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Link
                    href={
                      plan.id === "free"
                        ? plan.ctaHref
                        : `${plan.ctaHref}&billing=${isAnnual ? "yearly" : "monthly"}`
                    }
                    className={`w-full flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-xs font-bold transition-all shadow-xs ${
                      plan.isPopular
                        ? "bg-primary text-white hover:bg-primary/90"
                        : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Support Note */}
        <div className="mt-12 rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-primary border border-blue-100">
              <Building className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                Need customized training for large corporate fleets or nationwide distributor networks?
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                We provide custom on-premise safety drills, bulk licensing discounts, and DoE audit readiness.
              </p>
            </div>
          </div>

          <Link
            href="/contact"
            className="shrink-0 rounded-lg bg-slate-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-xs"
          >
            Contact Institutional Sales
          </Link>
        </div>
      </section>
    </main>
  );
}

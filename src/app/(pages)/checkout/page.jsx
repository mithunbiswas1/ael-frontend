// src/app/(pages)/checkout/page.jsx
"use client";

import { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  CreditCard,
  Smartphone,
  Building,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { H1, H2, H3, P } from "@/components/ui/Typography";
import AmbientGlow from "@/components/ui/AmbientGlow";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Input from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";

const PLANS_DATA = {
  consumer: {
    name: "Household Plus Subscription",
    monthlyPrice: 199,
    yearlyPrice: 1990,
    target: "Home & Residential Kitchens",
  },
  dealer: {
    name: "Licensed Dealer Compliance Pro",
    monthlyPrice: 799,
    yearlyPrice: 7990,
    target: "LPG Retail Points & Distributors",
  },
  enterprise: {
    name: "Industrial Enterprise Safety Fleet",
    monthlyPrice: 2499,
    yearlyPrice: 24990,
    target: "Industrial Plants & Auto Gas Stations",
  },
};

function CheckoutContent() {
  const searchParams = useSearchParams();
  const planKey = searchParams.get("plan") || "dealer";
  const billingType = searchParams.get("billing") || "yearly";
  const courseId = searchParams.get("courseId");

  const [paymentMethod, setPaymentMethod] = useState("bkash");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const selectedPlan = PLANS_DATA[planKey] || PLANS_DATA.dealer;

  const basePrice = useMemo(() => {
    if (courseId) return 500; // single paid course
    return billingType === "yearly"
      ? selectedPlan.yearlyPrice
      : selectedPlan.monthlyPrice;
  }, [courseId, billingType, selectedPlan]);

  const vatAmount = Math.round(basePrice * 0.05);
  const grandTotal = basePrice + vatAmount;

  const handlePay = (e) => {
    e.preventDefault();
    if (!fullName || !phone) {
      toast.error("Please enter your full name and phone number.");
      return;
    }
    if (!agreeTerms) {
      toast.error("Please accept the terms and safety compliance disclaimer.");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      toast.success("Payment verified! Your license has been activated.");
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* 1. Page Header */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 pb-12 pt-10 text-white">
        <AmbientGlow />

        <div className="site-container relative z-10 max-w-5xl mx-auto">
          <Breadcrumb
            dark
            items={[
              { label: "Home", href: "/" },
              { label: "Pricing", href: "/pricing" },
              { label: "Secure Checkout" },
            ]}
            className="mb-3"
          />

          <div className="flex items-center justify-between">
            <div>
              <H1 color="white" className="leading-tight text-xl sm:text-2xl md:text-3xl">
                <span>SECURE</span>{" "}
                <span className="text-primary">CHECKOUT.</span>
              </H1>
              <P className="text-xs text-slate-400 mt-1">
                256-bit SSL encrypted gateway powered by Bangladesh Bank recognized merchant channels.
              </P>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs text-emerald-400">
              <Lock className="h-3.5 w-3.5" />
              <span>Bank-Grade Encryption</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Checkout Form & Summary */}
      <section className="relative z-20 -mt-6 mx-auto w-full max-w-5xl px-4 pb-20">
        {paymentSuccess ? (
          /* Payment Success State */
          <div className="rounded-xl border border-emerald-200 bg-white p-8 shadow-lg text-center max-w-xl mx-auto">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border-2 border-emerald-500">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h2 className="text-xl font-black text-slate-900">
              Payment Confirmed!
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Thank you, <strong>{fullName}</strong>. Your subscription to{" "}
              <strong>{selectedPlan.name}</strong> is now officially active. An invoice and
              activation PIN have been sent to <strong>{phone}</strong>.
            </p>

            <div className="my-6 rounded-lg border border-slate-100 bg-slate-50 p-4 text-left text-xs space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Transaction ID:</span>
                <span className="font-mono font-bold text-slate-900">TXN-AEL-849204</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Amount Paid:</span>
                <span className="font-bold text-emerald-700">৳ {grandTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Method:</span>
                <span className="font-semibold text-slate-800 uppercase">{paymentMethod}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/courses"
                className="rounded-lg bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary/90 transition-colors"
              >
                Go to Training Portal
              </Link>
              <Link
                href="/"
                className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handlePay} className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
            {/* LEFT COLUMN: Customer & Payment Method (7 cols) */}
            <div className="space-y-6 lg:col-span-7">
              {/* Box 1: Customer Details */}
              <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs">
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
                  <span>1. BILLING DETAILS</span>
                </h2>

                <div className="space-y-3.5">
                  <Input
                    label="Full Name / Authorized Representative"
                    required
                    placeholder="e.g. Md. Rafiqul Islam"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    size="sm"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      label="Mobile Phone (for SMS PIN & Alerts)"
                      required
                      placeholder="e.g. 01712345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      size="sm"
                    />

                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="name@organization.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      size="sm"
                    />
                  </div>

                  <Input
                    label="Business Name / Dealership Name (Optional)"
                    placeholder="e.g. Meghna LPG Distribution Agency"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    size="sm"
                  />
                </div>
              </div>

              {/* Box 2: Payment Methods */}
              <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs">
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
                  <span>2. SELECT PAYMENT METHOD</span>
                </h2>

                <div className="space-y-2.5">
                  {/* bKash */}
                  <label
                    className={`flex items-center justify-between rounded-lg border p-3.5 cursor-pointer transition-all ${
                      paymentMethod === "bkash"
                        ? "border-pink-500 bg-pink-50/40 ring-2 ring-pink-500/20"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="pay"
                        value="bkash"
                        checked={paymentMethod === "bkash"}
                        onChange={() => setPaymentMethod("bkash")}
                        className="text-pink-600 focus:ring-pink-500"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          bKash Direct Gateway
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Instant verification via official bKash merchant gateway
                        </div>
                      </div>
                    </div>
                    <span className="rounded bg-pink-100 px-2 py-0.5 text-[10px] font-black text-pink-700">
                      bKash
                    </span>
                  </label>

                  {/* Nagad */}
                  <label
                    className={`flex items-center justify-between rounded-lg border p-3.5 cursor-pointer transition-all ${
                      paymentMethod === "nagad"
                        ? "border-orange-500 bg-orange-50/40 ring-2 ring-orange-500/20"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="pay"
                        value="nagad"
                        checked={paymentMethod === "nagad"}
                        onChange={() => setPaymentMethod("nagad")}
                        className="text-orange-600 focus:ring-orange-500"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          Nagad Payment
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Postal division digital gateway
                        </div>
                      </div>
                    </div>
                    <span className="rounded bg-orange-100 px-2 py-0.5 text-[10px] font-black text-orange-700">
                      Nagad
                    </span>
                  </label>

                  {/* Debit / Credit Cards */}
                  <label
                    className={`flex items-center justify-between rounded-lg border p-3.5 cursor-pointer transition-all ${
                      paymentMethod === "card"
                        ? "border-blue-500 bg-blue-50/40 ring-2 ring-blue-500/20"
                        : "border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="pay"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900">
                          Credit / Debit Cards
                        </div>
                        <div className="text-[10px] text-slate-500">
                          Visa, Mastercard, DBBL Nexus, AMEX
                        </div>
                      </div>
                    </div>
                    <CreditCard className="h-4 w-4 text-slate-400" />
                  </label>
                </div>

                {/* Agreement Checkbox */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-start gap-2.5">
                  <Checkbox
                    id="termsCheck"
                    checked={agreeTerms}
                    onCheckedChange={(checked) => setAgreeTerms(Boolean(checked))}
                    className="mt-0.5"
                  />
                  <label htmlFor="termsCheck" className="text-[11px] text-slate-600 leading-snug cursor-pointer select-none">
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary font-bold hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and confirm that training will be utilized strictly in accordance with national safety guidelines.
                  </label>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Order Summary & Pay Button (5 cols) */}
            <div className="lg:col-span-5 sticky top-24">
              <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-md">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3 mb-4">
                  ORDER SUMMARY
                </h3>

                <div className="rounded-lg bg-slate-50 p-4 border border-slate-200/60 mb-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900">
                      {courseId ? "Specialized Safety Course" : selectedPlan.name}
                    </span>
                    <span className="text-xs font-bold text-primary">
                      ৳ {basePrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Billing Cycle: {courseId ? "One-Time Access" : billingType.toUpperCase()}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 text-xs text-slate-600 border-b border-slate-100 pb-4 mb-4">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-semibold text-slate-800">
                      ৳ {basePrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Govt VAT / Regulatory Tax (5%):</span>
                    <span className="font-semibold text-slate-800">
                      ৳ {vatAmount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-dashed border-slate-200 text-sm font-black text-slate-900">
                    <span>Total Amount:</span>
                    <span className="text-primary">
                      ৳ {grandTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Submit Pay Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-3 text-xs font-bold text-white hover:bg-primary/90 transition-colors shadow-xs disabled:opacity-50"
                >
                  {isProcessing ? (
                    <span>Verifying with Merchant...</span>
                  ) : (
                    <>
                      <Lock className="h-3.5 w-3.5" />
                      <span>Pay Securely ৳ {grandTotal.toLocaleString()}</span>
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-slate-400 mt-3">
                  Safe & encrypted checkout. Instant digital license activation.
                </p>
              </div>
            </div>
          </form>
        )}
      </section>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="flex items-center gap-3 text-slate-600 font-semibold text-sm">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span>Loading Checkout...</span>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}

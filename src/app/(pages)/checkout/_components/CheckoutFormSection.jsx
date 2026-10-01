// src/app/(pages)/checkout/_components/CheckoutFormSection.jsx
"use client";

import Link from "next/link";
import { Lock, CreditCard } from "lucide-react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import { useDictionary } from "@/context/DictionaryContext";

export default function CheckoutFormSection({
  fullName,
  setFullName,
  phone,
  setPhone,
  email,
  setEmail,
  companyName,
  setCompanyName,
  paymentMethod,
  setPaymentMethod,
  agreeTerms,
  setAgreeTerms,
  handlePay,
  isProcessing,
  courseId,
  selectedPlan,
  billingType,
  basePrice,
  grandTotal,
  isPrefilled = false,
}) {
  const { locale, dict } = useDictionary();
  const isBn = locale === "bn";
  const co = dict?.checkout || {};

  return (
    <form onSubmit={handlePay} className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
      {/* LEFT COLUMN: Customer & Payment Method (7 cols) */}
      <div className="space-y-6 lg:col-span-7">
        {/* Box 1: Customer Details */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span>{isBn ? "১. বিলিং বিবরণ" : "1. BILLING DETAILS"}</span>
            </h2>
            {isPrefilled && (
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80 w-fit">
                {isBn ? "✓ প্রোফাইল থেকে পূরণ করা (পরিবর্তনযোগ্য)" : "✓ Filled from profile (editable)"}
              </span>
            )}
          </div>

          <div className="space-y-3.5">
            <Input
              label={isBn ? "পূর্ণ নাম / অনুমোদিত প্রতিনিধি" : "Full Name / Authorized Representative"}
              required
              placeholder={isBn ? "যেমন: মো: রফিকুল ইসলাম" : "e.g. Md. Rafiqul Islam"}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              size="sm"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label={isBn ? "মোবাইল ফোন (এসএমএস পিন ও অ্যালার্টের জন্য)" : "Mobile Phone (for SMS PIN & Alerts)"}
                required
                placeholder={isBn ? "যেমন: ০১৭১২৩৪৫৬৭৮" : "e.g. 01712345678"}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                size="sm"
              />

              <Input
                label={isBn ? "ইমেইল ঠিকানা" : "Email Address"}
                type="email"
                placeholder={isBn ? "name@organization.com" : "name@organization.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="sm"
              />
            </div>

            <Input
              label={isBn ? "ব্যবসা প্রতিষ্ঠান / ডিলারশিপের নাম (ঐচ্ছিক)" : "Business Name / Dealership Name (Optional)"}
              placeholder={isBn ? "যেমন: মেঘনা এলপিজি ডিস্ট্রিবিউশন এজেন্সি" : "e.g. Meghna LPG Distribution Agency"}
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              size="sm"
            />
          </div>
        </div>

        {/* Box 2: Payment Methods */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-2xs">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
            <span>{isBn ? "২. পেমেন্ট মাধ্যম নির্বাচন করুন" : "2. SELECT PAYMENT METHOD"}</span>
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
                    {isBn ? "বিকাশ ডিরেক্ট গেটওয়ে" : "bKash Direct Gateway"}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {isBn
                      ? "অফিসিয়াল বিকাশ মার্চেন্ট গেটওয়ের মাধ্যমে তাত্ক্ষণিক যাচাই"
                      : "Instant verification via official bKash merchant gateway"}
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
                    {isBn ? "নগদ পেমেন্ট" : "Nagad Payment"}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {isBn ? "ডাক বিভাগীয় ডিজিটাল গেটওয়ে" : "Postal division digital gateway"}
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
                    {isBn ? "ক্রেডিট / ডেবিট কার্ড" : "Credit / Debit Cards"}
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
              {isBn ? "আমি " : "I agree to the "}
              <Link href="/terms" className="text-primary font-bold hover:underline">
                {isBn ? "ব্যবহারের শর্তাবলী" : "Terms of Service"}
              </Link>
              {isBn
                ? "-র সাথে সম্মত এবং নিশ্চিত করছি যে প্রশিক্ষণ জাতীয় নিরাপত্তা নির্দেশিকা অনুসারে ব্যবহৃত হবে।"
                : " and confirm that training will be utilized strictly in accordance with national safety guidelines."}
            </label>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: Order Summary & Pay Button (5 cols) */}
      <div className="lg:col-span-5 sticky top-24">
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-md">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-3 mb-4">
            {co.orderSummary || (isBn ? "অর্ডারের সারসংক্ষেপ" : "ORDER SUMMARY")}
          </h3>

          <div className="rounded-lg bg-slate-50 p-4 border border-slate-200/60 mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900">
                {courseId ? (isBn ? "বিশেষায়িত নিরাপত্তা কোর্স" : "Specialized Safety Course") : selectedPlan.name}
              </span>
              <span className="text-xs font-bold text-primary">
                ৳ {basePrice.toLocaleString()}
              </span>
            </div>
            <div className="text-[10px] text-slate-500">
              {isBn ? "বিলিং চক্র: " : "Billing Cycle: "}
              {courseId
                ? isBn ? "এককালীন অ্যাক্সেস" : "One-Time Access"
                : billingType === "yearly"
                ? isBn ? "বার্ষিক" : "YEARLY"
                : isBn ? "মাসিক" : "MONTHLY"}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2 text-xs text-slate-600 border-b border-slate-100 pb-4 mb-4">
            <div className="flex justify-between">
              <span>{isBn ? "সাবটোটাল:" : "Subtotal:"}</span>
              <span className="font-semibold text-slate-800">
                ৳ {basePrice.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between pt-2 border-t border-dashed border-slate-200 text-sm font-black text-slate-900">
              <span>{co.totalAmount || (isBn ? "সর্বমোট প্রদেয়:" : "Total Amount:")}</span>
              <span className="text-primary">
                ৳ {grandTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Submit Pay Button */}
          <Button
            type="submit"
            isLoading={isProcessing}
            fullWidth
            size="lg"
            variant="primary"
            icon={Lock}
          >
            {isProcessing ? (
              <span>{co.processing || (isBn ? "পেমেন্ট প্রক্রিয়াধীন..." : "Verifying with Merchant...")}</span>
            ) : (
              <span>
                {isBn
                  ? `নিরাপদে পরিশোধ করুন ৳ ${grandTotal.toLocaleString()}`
                  : `Pay Securely ৳ ${grandTotal.toLocaleString()}`}
              </span>
            )}
          </Button>

          <p className="text-[10px] text-center text-slate-400 mt-3">
            {isBn
              ? "নিরাপদ ও এনক্রিপ্ট করা চেকআউট। তাত্ক্ষণিক ডিজিটাল লাইসেন্স সক্রিয়করণ।"
              : "Safe & encrypted checkout. Instant digital license activation."}
          </p>
        </div>
      </div>
    </form>
  );
}

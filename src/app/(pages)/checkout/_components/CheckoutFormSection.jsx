// src/app/(pages)/checkout/_components/CheckoutFormSection.jsx
"use client";

import Link from "next/link";
import { Lock, CreditCard } from "lucide-react";
import Input from "@/components/ui/Input";
import Checkbox from "@/components/ui/Checkbox";

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
  vatAmount,
  grandTotal,
}) {
  return (
    <form onSubmit={handlePay} className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-start">
      {/* LEFT COLUMN: Customer & Payment Method (7 cols) */}
      <div className="space-y-6 lg:col-span-7">
        {/* Box 1: Customer Details */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-2xs">
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
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-2xs">
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
        <div className="rounded-xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-md">
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
  );
}

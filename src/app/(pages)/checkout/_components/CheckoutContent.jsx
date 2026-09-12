// src/app/(pages)/checkout/_components/CheckoutContent.jsx
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import SharedHeroSection from "@/components/shared/SharedHeroSection";
import CheckoutSuccessState from "./CheckoutSuccessState";
import CheckoutFormSection from "./CheckoutFormSection";

const PLANS = {
  free: { name: "Public Visitor", priceMonthly: 0, priceYearly: 0 },
  consumer: { name: "Household Plus", priceMonthly: 199, priceYearly: 1990 },
  dealer: { name: "Licensed Dealer", priceMonthly: 799, priceYearly: 7990 },
  enterprise: { name: "Industrial Enterprise", priceMonthly: 2499, priceYearly: 24990 },
};

export default function CheckoutContent() {
  const searchParams = useSearchParams();
  const planParam = searchParams.get("plan") || "dealer";
  const billingParam = searchParams.get("billing") || "yearly";
  const courseId = searchParams.get("courseId");

  const selectedPlan = PLANS[planParam] || PLANS.dealer;
  const billingType = billingParam === "monthly" ? "monthly" : "yearly";

  const basePrice = courseId
    ? 500
    : billingType === "yearly"
    ? selectedPlan.priceYearly
    : selectedPlan.priceMonthly;

  const vatAmount = Math.round(basePrice * 0.05);
  const grandTotal = basePrice + vatAmount;

  const [paymentMethod, setPaymentMethod] = useState("bkash");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handlePay = (e) => {
    e.preventDefault();
    if (!fullName || !phone) {
      toast.error("Please fill in your name and contact phone number.");
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
      <SharedHeroSection
        variant="between"
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Pricing", href: "/pricing" },
          { label: "Secure Checkout" },
        ]}
        title="SECURE"
        accent="CHECKOUT."
        description="256-bit SSL encrypted gateway powered by Bangladesh Bank recognized merchant channels."
      >
        <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-secondary/40 bg-secondary/15 px-3 py-1 text-xs text-secondary">
          <Lock className="h-3.5 w-3.5" />
          <span>Bank-Grade Encryption</span>
        </div>
      </SharedHeroSection>

      <section className="relative z-20 -mt-6 mx-auto w-full max-w-5xl px-4 pb-20">
        {paymentSuccess ? (
          <CheckoutSuccessState
            fullName={fullName}
            selectedPlan={selectedPlan}
            phone={phone}
            grandTotal={grandTotal}
            paymentMethod={paymentMethod}
          />
        ) : (
          <CheckoutFormSection
            fullName={fullName}
            setFullName={setFullName}
            phone={phone}
            setPhone={setPhone}
            email={email}
            setEmail={setEmail}
            companyName={companyName}
            setCompanyName={setCompanyName}
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
            agreeTerms={agreeTerms}
            setAgreeTerms={setAgreeTerms}
            handlePay={handlePay}
            isProcessing={isProcessing}
            courseId={courseId}
            selectedPlan={selectedPlan}
            billingType={billingType}
            basePrice={basePrice}
            vatAmount={vatAmount}
            grandTotal={grandTotal}
          />
        )}
      </section>
    </main>
  );
}

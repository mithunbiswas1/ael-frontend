"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import CheckoutSuccessState from "./CheckoutSuccessState";
import CheckoutFormSection from "./CheckoutFormSection";

export const PLANS = {
  free: { name: "Public Visitor", priceMonthly: 0, priceYearly: 0 },
  consumer: { name: "Household Plus", priceMonthly: 199, priceYearly: 1990 },
  dealer: { name: "Licensed Dealer", priceMonthly: 799, priceYearly: 7990 },
  enterprise: { name: "Industrial Enterprise", priceMonthly: 2499, priceYearly: 24990 },
};

export default function CheckoutInteractive() {
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
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePay = (e) => {
    e.preventDefault();
    if (!fullName || !phone) {
      toast.error("Please enter your name and phone number.");
      return;
    }
    if (!agreeTerms) {
      toast.error("You must agree to the Terms of Service.");
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      toast.success("Payment processed successfully!");
    }, 1500);
  };

  return (
    <section className="py-12 sm:py-16">
      <div className="site-container max-w-5xl mx-auto">
        {isSuccess ? (
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
      </div>
    </section>
  );
}

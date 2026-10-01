// src/app/(pages)/checkout/_components/CheckoutSuccessState.jsx
"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useDictionary } from "@/context/DictionaryContext";

export default function CheckoutSuccessState({
  fullName,
  selectedPlan,
  phone,
  grandTotal,
  paymentMethod,
  transactionId,
}) {
  const { locale } = useDictionary();
  const isBn = locale === "bn";

  return (
    <div className="rounded-xl border border-emerald-200 bg-white p-8 shadow-lg text-center max-w-xl mx-auto">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border-2 border-emerald-500">
        <CheckCircle2 className="h-10 w-10" />
      </div>
      <h2 className="text-xl font-black text-slate-900">
        {isBn ? "পেমেন্ট সফলভাবে সম্পন্ন হয়েছে!" : "Payment Confirmed!"}
      </h2>
      <p className="text-xs text-slate-600 mt-1">
        {isBn ? "ধন্যবাদ, " : "Thank you, "}
        <strong>{fullName}</strong>
        {isBn
          ? `। আপনার ${selectedPlan?.name || "সার্টিফিকেশন"} সাবস্ক্রিপশন সক্রিয় করা হয়েছে। ইনভয়েস এবং অ্যাক্টিভেশন পিন `
          : `. Your subscription to ${selectedPlan?.name || "Certification"} is now officially active. An invoice and activation PIN have been sent to `}
        <strong>{phone}</strong>
        {isBn ? " নম্বরে পাঠানো হয়েছে।" : "."}
      </p>

      <div className="my-6 rounded-lg border border-slate-100 bg-slate-50 p-4 text-left text-xs space-y-1.5">
        <div className="flex justify-between">
          <span className="text-slate-500">{isBn ? "ট্রানজ্যাকশন আইডি:" : "Transaction ID:"}</span>
          <span className="font-mono font-bold text-slate-900">
            {transactionId || "TXN-SSL-172750-101"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">{isBn ? "পরিশোধিত অর্থ:" : "Amount Paid:"}</span>
          <span className="font-bold text-emerald-700">৳ {grandTotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">{isBn ? "পেমেন্ট মাধ্যম:" : "Method:"}</span>
          <span className="font-semibold text-slate-800 uppercase">{paymentMethod}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/subscriber/courses"
          className="rounded-lg bg-amber-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors shadow-xs"
        >
          {isBn ? "আমার সাবস্ক্রিপশন ও ক্লাসরুমে যান" : "Go to My Classroom"}
        </Link>
        <Link
          href="/courses"
          className="rounded-lg bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary/90 transition-colors"
        >
          {isBn ? "প্রশিক্ষণ ক্যাটালগ" : "Browse Catalog"}
        </Link>
        <Link
          href="/"
          className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          {isBn ? "হোমে ফিরে যান" : "Return to Home"}
        </Link>
      </div>
    </div>
  );
}

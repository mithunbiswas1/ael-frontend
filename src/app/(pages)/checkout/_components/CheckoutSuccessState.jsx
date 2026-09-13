// src/app/(pages)/checkout/_components/CheckoutSuccessState.jsx
"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function CheckoutSuccessState({
  fullName,
  selectedPlan,
  phone,
  grandTotal,
  paymentMethod,
}) {
  return (
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
          <span className="font-mono font-bold text-slate-900">TXN-SAFE-849204</span>
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
  );
}

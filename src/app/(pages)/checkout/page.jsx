// src/app/(pages)/checkout/page.jsx
import { Suspense } from "react";
import CheckoutContent from "./_components/CheckoutContent";

export const metadata = {
  title: "Secure Checkout | Bangladesh Bank Authorized Gateways | AEL",
  description:
    "256-bit SSL encrypted checkout for LPG safety certification and compliance licenses in Bangladesh.",
};

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

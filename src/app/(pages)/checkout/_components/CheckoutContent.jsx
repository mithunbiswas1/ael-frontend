// src/app/(pages)/checkout/_components/CheckoutContent.jsx
import { Lock } from "lucide-react";
import SharedHeroSection from "@/components/shared/SharedHeroSection";
import CheckoutInteractive from "../_client/CheckoutInteractive";

export default function CheckoutContent() {
  return (
    <main className="min-h-screen bg-slate-50">
      <SharedHeroSection
        variant="others"
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Pricing", href: "/pricing" },
          { label: "Secure Checkout" },
        ]}
        title="SECURE"
        accent="CHECKOUT."
        description="256-bit SSL encrypted checkout for LPG safety certification and compliance licenses in Bangladesh."
      >
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-400">
            <Lock className="h-3 w-3" />
            <span>256-Bit SSL Encrypted</span>
          </div>
          <span className="hidden sm:inline text-slate-400">
            Bangladesh Bank Authorized Gateways
          </span>
        </div>
      </SharedHeroSection>

      <CheckoutInteractive />
    </main>
  );
}

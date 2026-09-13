// src/app/(home)/_components/NewsletterSection.jsx

import { Mail } from "lucide-react";
import { H3, P } from "@/components/ui/Typography";
import NewsletterForm from "../_client/NewsletterForm";

export default function NewsletterSection() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-tertiary via-[#0c1a33] to-tertiary p-5 text-white shadow-lg backdrop-blur-xl">
      {/* Subtle top glow inside newsletter card */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-secondary/15 blur-3xl" />

      {/* Header */}
      <div className="relative z-10 flex items-start gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-secondary/30 bg-secondary/15 text-secondary shadow-sm backdrop-blur-md">
          <Mail className="h-5 w-5" />
        </div>
        <div>
          <span className="mb-1 inline-flex items-center gap-1 rounded-full border border-secondary/30 bg-secondary/15 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-secondary">
            NEWSLETTER
          </span>
          <H3 color="white" className="text-base font-black uppercase tracking-wider">
            SUBSCRIBE TO <span className="text-secondary">NEWSLETTER.</span>
          </H3>
          <P size="sm" className="mt-1 text-slate-300">
            Get instant LPG safety bulletins, circulars, and emergency alerts directly to your inbox.
          </P>
        </div>
      </div>

      {/* Client Form Component */}
      <NewsletterForm />
    </div>
  );
}

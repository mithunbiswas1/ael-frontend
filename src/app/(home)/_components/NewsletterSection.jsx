"use client"

import { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { H3, P } from "@/components/ui/Typography";
import Input from "@/components/ui/Input";

export default function NewsletterSection() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Please provide both name and email address");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Thank you for subscribing to our safety newsletter!");
      setFormData({ name: "", phone: "", email: "" });
    }, 800);
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-slate-950/85 p-5 text-white shadow-sm backdrop-blur-xl">
      {/* Subtle top glow inside newsletter card */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-blue-500/20 blur-3xl" />

      {/* Header */}
      <div className="relative z-10 flex items-start gap-3.5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-blue-500/30 bg-blue-600/20 text-blue-400 shadow-sm backdrop-blur-md">
          <Mail className="h-5 w-5" />
        </div>
        <div>
          <span className="mb-1 inline-flex items-center gap-1 rounded-full border border-blue-400/30 bg-blue-500/15 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest text-blue-400">
            NEWSLETTER
          </span>
          <H3 color="white" className="text-base font-black uppercase tracking-wider">
            SUBSCRIBE TO <span className="text-primary">NEWSLETTER.</span>
          </H3>
          <P className="mt-1 text-xs text-slate-400 leading-relaxed">
            Get instant LPG safety bulletins, circulars, and emergency alerts directly to your inbox.
          </P>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="relative z-10 mt-4 space-y-2.5">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Input
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            variant="dark"
            required
          />
          <Input
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
            variant="dark"
          />
        </div>

        <Input
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          variant="dark"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2.5 text-xs font-bold text-white transition-colors hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50"
        >
          <span>{loading ? "Subscribing..." : "Subscribe Now"}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </form>

      <p className="mt-3 text-center text-[10px] text-gray-400">
        By subscribing, you agree to our{" "}
        <a href="/terms" className="underline hover:text-white">
          Terms &amp; Conditions
        </a>{" "}
        and{" "}
        <a href="/privacy" className="underline hover:text-white">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}

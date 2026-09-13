// src/app/(home)/_components/NewsletterSection.jsx

"use client"

import { useState } from "react";
import { Mail, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { H3, P } from "@/components/ui/Typography";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

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

        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={loading}
          className="text-xs"
        >
          <span>{loading ? "Subscribing..." : "Subscribe Now"}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </form>
    </div>
  );
}

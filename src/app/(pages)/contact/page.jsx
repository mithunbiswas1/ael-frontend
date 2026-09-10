// src/app/(pages)/contact/page.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Send,
  ExternalLink,
  ChevronRight,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { FaFacebookF, FaLinkedinIn, FaTwitter, FaYoutube } from "react-icons/fa";
import { toast } from "sonner";
import { H1, H2, H3, H4, P } from "@/components/ui/Typography";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import Breadcrumb from "@/components/ui/Breadcrumb";
import AmbientGlow from "@/components/ui/AmbientGlow";
import SectionHeader from "@/components/ui/SectionHeader";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Thank you! Your inquiry has been submitted successfully.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    }, 800);
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* 1. Page Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 pb-16 pt-10 md:pb-20 md:pt-14 text-white">
        <AmbientGlow />

        <div className="site-container relative z-10">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-8">
            
            {/* Left Column */}
            <div className="flex flex-col items-start lg:col-span-7">
              {/* Breadcrumb */}
              <Breadcrumb
                dark
                items={[
                  { label: "Home", href: "/" },
                  { label: "Contact Us" },
                ]}
                className="mb-3"
              />

              {/* Pill tag */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-blue-400 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400 animate-pulse" />
                <span>24/7 CITIZEN &amp; INDUSTRY SUPPORT</span>
              </div>

              {/* Dual-tone H1 */}
              <H1 color="white" className="leading-[1.08] tracking-tight">
                <span>CONTACT</span>{" "}
                <span className="text-primary">US.</span>
              </H1>

              <P className="mt-4 max-w-xl text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
                We are here to assist with safety protocols, regulatory compliance inquiries, institutional LMS training, and technical advisory services across Bangladesh.
              </P>

              {/* Quick Contact Badges */}
              <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-slate-300">
                <div className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3.5 py-2 backdrop-blur-md">
                  <Phone className="h-4 w-4 text-primary" />
                  <span className="font-bold text-white">Hotline: 16137</span>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3.5 py-2 backdrop-blur-md">
                  <Mail className="h-4 w-4 text-primary" />
                  <span>support@ael-bd.com</span>
                </div>
              </div>
            </div>

            {/* Right Column: Visual */}
            <div className="relative flex items-center justify-center lg:col-span-5">
              <div className="group relative aspect-4/3 w-full max-w-lg overflow-hidden rounded-xl border border-white/15 bg-slate-800/80 shadow-md backdrop-blur-sm">
                <Image
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop"
                  alt="Customer Support Helpdesk"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 45vw"
                  className="object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                {/* Floating info tag */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between rounded-lg border border-white/20 bg-slate-950/75 p-3 text-white backdrop-blur-md">
                  <div>
                    <div className="text-xs font-black tracking-wide text-white">
                      Dedicated Response Team
                    </div>
                    <div className="text-[10px] text-slate-300">
                      Average response time under 15 minutes
                    </div>
                  </div>
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50 animate-pulse" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Main Contact Form & Location */}
      <section className="py-12 sm:py-16">
        <div className="site-container">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">

            {/* Left Column: Get In Touch Form (7 cols) */}
            <div className="rounded-xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs lg:col-span-7">
              <SectionHeader
                tag="DIRECT INQUIRY"
                title="GET IN"
                accent="TOUCH."
                subtitle="Send us a message and our safety coordination officers will follow up promptly."
              />

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="Full Name"
                    required
                    placeholder="e.g. Md. Anwar Hossain"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    variant="filled"
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    required
                    placeholder="e.g. anwar@domain.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    variant="filled"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Input
                    label="Phone Number"
                    type="tel"
                    required
                    placeholder="e.g. 01700-000000"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    variant="filled"
                  />

                  <Select
                    label="Inquiry Subject"
                    required
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, subject: e.target.value }))
                    }
                    placeholder="Select Topic"
                    variant="filled"
                    options={[
                      { value: "Safety Incident Inquiry", label: "Safety Incident Inquiry" },
                      { value: "Training & LMS Certification", label: "Training & LMS Certification" },
                      { value: "Dealer Regulatory Compliance", label: "Dealer Regulatory Compliance" },
                      { value: "Auto Gas Operational Safety", label: "Auto Gas Operational Safety" },
                      { value: "General Support", label: "General Support" },
                    ]}
                  />
                </div>

                <Textarea
                  label="Your Message"
                  required
                  rows={4}
                  placeholder="Provide details about your query or incident context..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, message: e.target.value }))
                  }
                  variant="filled"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-primary py-3 text-xs font-bold uppercase tracking-wider text-white shadow-xs transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Submit Message"}
                </button>
              </form>
            </div>

            {/* Right Column: Office Location & Map & Follow Us (5 cols) */}
            <div className="space-y-6 lg:col-span-5">

              {/* Location Card */}
              <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs">
                <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                  HEADQUARTERS
                </span>
                <H3 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-3">
                  OUR OFFICE LOCATION
                </H3>

                <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3.5">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 shrink-0 text-primary mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-slate-900 leading-snug">
                        House # 13, Road # 13, Sector # 03, Uttara, Dhaka-1230, Bangladesh
                      </div>
                      <a
                        href="https://maps.google.com/?q=Sector+3+Uttara+Dhaka"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
                      >
                        <span>View larger interactive map</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Styled Map Container */}
                <div className="mt-4 relative aspect-4/3 w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
                  <iframe
                    title="AEL Office Location Map"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14594.385317765104!2d90.3842539!3d23.8684617!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c4217144793f%3A0xb36d755745e69bf0!2sSector%203%2C%20Uttara%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
                    className="h-full w-full border-0"
                    loading="lazy"
                    allowFullScreen
                  />
                </div>
              </div>

              {/* Follow Us Card */}
              <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs">
                <H3 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-3">
                  CONNECT ON SOCIAL CHANNELS
                </H3>

                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-xs font-bold text-white transition-opacity hover:opacity-90 shadow-2xs"
                  >
                    <FaFacebookF className="h-3.5 w-3.5" />
                    <span>Facebook</span>
                  </a>

                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-lg bg-blue-700 py-2.5 text-xs font-bold text-white transition-opacity hover:opacity-90 shadow-2xs"
                  >
                    <FaLinkedinIn className="h-3.5 w-3.5" />
                    <span>LinkedIn</span>
                  </a>

                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-lg bg-sky-500 py-2.5 text-xs font-bold text-white transition-opacity hover:opacity-90 shadow-2xs"
                  >
                    <FaTwitter className="h-3.5 w-3.5" />
                    <span>Twitter</span>
                  </a>

                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-lg bg-red-600 py-2.5 text-xs font-bold text-white transition-opacity hover:opacity-90 shadow-2xs"
                  >
                    <FaYoutube className="h-3.5 w-3.5" />
                    <span>YouTube</span>
                  </a>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>
    </main>
  );
}

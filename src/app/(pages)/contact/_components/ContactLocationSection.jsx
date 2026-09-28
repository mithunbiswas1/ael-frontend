// src/app/(pages)/contact/_components/ContactLocationSection.jsx
"use client";

import { MapPin, ExternalLink } from "lucide-react";
import { FaFacebookF, FaLinkedinIn, FaTwitter, FaYoutube } from "react-icons/fa";
import { H3 } from "@/components/ui/Typography";
import { useDictionary } from "@/context/DictionaryContext";

export default function ContactLocationSection({ contactInfo }) {
  const { locale, dict } = useDictionary();
  const isBn = locale === "bn";
  const contact = dict?.contact || {};

  const address = (isBn ? contactInfo?.officeAddressBn : contactInfo?.officeAddress) ||
    contact.locationAddress ||
    (isBn
      ? "প্লট ১৪, বীর উত্তম এ কে খন্দকার সড়ক, মহাখালী বা/এ, ঢাকা-১২১২"
      : "Plot 14, Bir Uttam AK Khandakar Road, Mohakhali C/A, Dhaka-1212");

  const hours = (isBn ? contactInfo?.operatingHoursBn : contactInfo?.operatingHours) ||
    (isBn ? "রবিবার - বৃহস্পতিবার: সকাল ৯:০০ - বিকাল ৫:০০ (জরুরি ২৪/৭)" : "Sunday - Thursday: 9:00 AM - 5:00 PM (Emergency 24/7)");

  return (
    <div className="space-y-6 lg:col-span-5">
      {/* Location Card */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs">
        <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary">
          {isBn ? "প্রধান কার্যালয়" : "HEADQUARTERS"}
        </span>
        <H3 className="text-sm font-black uppercase tracking-wider text-slate-900 mb-3">
          {contact.locationTitle || (isBn ? "আমাদের অফিসের ঠিকানা" : "OUR OFFICE LOCATION")}
        </H3>

        <div className="rounded-lg border border-slate-200 bg-slate-50/80 p-3.5 space-y-2">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 shrink-0 text-primary mt-0.5" />
            <div>
              <div className="text-xs font-bold text-slate-900 leading-snug">
                {address}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                {hours}
              </div>
              <a
                href="https://maps.google.com/?q=Mohakhali+Dhaka"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
              >
                <span>{isBn ? "গুগল ম্যাপে বড় করে দেখুন" : "View larger interactive map"}</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Styled Map Container */}
        <div className="mt-4 relative aspect-4/3 w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
          <iframe
            title="Safe LPG Office Location Map"
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
          {isBn ? "সামাজিক মাধ্যমে যুক্ত হোন" : "CONNECT ON SOCIAL CHANNELS"}
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
  );
}

// src/app/(home)/_components/EmergencySupportBar.jsx
"use client";

import Link from "next/link";
import { PhoneCall, FileText, PhoneForwarded, Scale, Image as ImageIcon } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { H4, P } from "@/components/ui/Typography";

export default function EmergencySupportBar() {
  return (
    <section className="mt-14 pb-12">
      <div className="site-container">
        <div className="grid grid-cols-1 gap-6 rounded-xl border border-slate-200/80 bg-white/95 p-6 shadow-xs backdrop-blur-xl lg:grid-cols-12 lg:items-center lg:gap-8">

          {/* 1. Emergency Hotline (4 cols) */}
          <div className="flex items-center gap-4 lg:col-span-4 lg:border-r lg:border-slate-200/80 lg:pr-6">
            <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-xs">
              <PhoneCall className="h-6 w-6" />
            </div>
            <div>
              <span className="mb-0.5 inline-block text-[10px] font-black uppercase tracking-widest text-primary">
                EMERGENCY HOTLINE
              </span>
              <P className="text-xs text-slate-500">
                In case of LPG emergency, call us immediately
              </P>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-black tracking-tight text-slate-900">
                  16137
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  (24/7 Support)
                </span>
              </div>
            </div>
          </div>

          {/* 2. Safety Resources (5 cols) */}
          <div className="lg:col-span-5 lg:border-r lg:border-slate-200/80 lg:px-4">
            <span className="mb-1 inline-block text-[10px] font-black uppercase tracking-widest text-slate-800">
              SAFETY RESOURCES
            </span>

            <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-2">
              <Link
                href="/safety-guidelines"
                className="flex items-center gap-2 rounded-lg border border-slate-200/80 bg-white/90 p-2.5 text-xs font-semibold text-slate-700 backdrop-blur-xs transition-colors duration-200 hover:border-red-400 hover:bg-white hover:text-red-600"
              >
                <FileText className="h-4 w-4 shrink-0 text-red-500" />
                <span className="truncate">LPG Safety Guidelines</span>
              </Link>

              <Link
                href="/contact"
                className="flex items-center gap-2 rounded-lg border border-slate-200/80 bg-white/90 p-2.5 text-xs font-semibold text-slate-700 backdrop-blur-xs transition-colors duration-200 hover:border-purple-400 hover:bg-white hover:text-purple-600"
              >
                <PhoneForwarded className="h-4 w-4 shrink-0 text-purple-500" />
                <span className="truncate">Emergency Contact Desk</span>
              </Link>

              <Link
                href="/acts-and-rules"
                className="flex items-center gap-2 rounded-lg border border-slate-200/80 bg-white/90 p-2.5 text-xs font-semibold text-slate-700 backdrop-blur-xs transition-colors duration-200 hover:border-blue-400 hover:bg-white hover:text-blue-600"
              >
                <Scale className="h-4 w-4 shrink-0 text-blue-500" />
                <span className="truncate">LPG Related Acts &amp; Rules</span>
              </Link>

              <Link
                href="/verify-certificate"
                className="flex items-center gap-2 rounded-lg border border-slate-200/80 bg-white/90 p-2.5 text-xs font-semibold text-slate-700 backdrop-blur-xs transition-colors duration-200 hover:border-emerald-400 hover:bg-white hover:text-emerald-600"
              >
                <ImageIcon className="h-4 w-4 shrink-0 text-emerald-500" />
                <span className="truncate">Verify Certificate</span>
              </Link>
            </div>
          </div>

          {/* 3. WhatsApp Chat (3 cols) */}
          <div className="flex flex-col items-start justify-center lg:col-span-3 lg:pl-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <FaWhatsapp className="h-6 w-6" />
              </div>
              <div>
                <H4 className="text-xs font-black text-slate-900">
                  Chat with us on WhatsApp
                </H4>
                <P className="text-[11px] text-slate-500">
                  We are here to help you!
                </P>
              </div>
            </div>

            <a
              href="https://wa.me/8809603446689"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-emerald-700 active:scale-[0.99]"
            >
              <span>Chat Now</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}

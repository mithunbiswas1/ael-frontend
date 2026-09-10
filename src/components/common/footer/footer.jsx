// src/components/common/footer/footer.jsx
"use client";

import Link from "next/link";
import { MapPin, Phone, Mail, Globe } from "lucide-react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import AelLogo from "@/components/common/AelLogo";

export default function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-slate-950 text-slate-400">
      <div className="site-container py-12 lg:py-14">
        {/* 5 Columns Layout matching the mockup */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 lg:gap-8">
          
          {/* Column 1: AEL Logo & Overview (3.5 cols) */}
          <div className="lg:col-span-3">
            <AelLogo light={true} />

            <p className="mt-4 text-xs leading-relaxed text-slate-400 max-w-xs">
              Promoting LPG safety awareness across Bangladesh for a safer today
              and sustainable tomorrow.
            </p>

            {/* Social Icons matching mockup */}
            <div className="mt-5 flex items-center gap-2.5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white transition-transform hover:scale-110"
              >
                <FaFacebookF className="h-3 w-3" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-sky-500 text-white transition-transform hover:scale-110"
              >
                <FaTwitter className="h-3 w-3" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-700 text-white transition-transform hover:scale-110"
              >
                <FaLinkedinIn className="h-3 w-3" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white transition-transform hover:scale-110"
              >
                <FaYoutube className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* Column 2: QUICK LINKS (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              QUICK LINKS
            </h4>
            <ul className="mt-3.5 space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/safety-guidelines" className="hover:text-white transition-colors">
                  Safety Guidelines
                </Link>
              </li>
              <li>
                <Link href="/market-updates" className="hover:text-white transition-colors">
                  LPG Market Update
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-white transition-colors">
                  Training &amp; Quiz
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: RESOURCES (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              RESOURCES
            </h4>
            <ul className="mt-3.5 space-y-2 text-xs">
              <li>
                <Link href="/safety-guidelines.pdf" className="hover:text-white transition-colors">
                  Safety Guidelines (PDF)
                </Link>
              </li>
              <li>
                <a href="tel:16137" className="hover:text-white transition-colors">
                  Emergency Hotline
                </a>
              </li>
              <li>
                <Link href="/acts-and-rules" className="hover:text-white transition-colors">
                  Related Acts &amp; Rules
                </Link>
              </li>
              <li>
                <Link href="/downloads" className="hover:text-white transition-colors">
                  Downloads
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: SUPPORT (2 cols) */}
          <div className="lg:col-span-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              SUPPORT
            </h4>
            <ul className="mt-3.5 space-y-2 text-xs">
              <li>
                <Link href="/help" className="hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/data-security" className="hover:text-white transition-colors">
                  Data Security Policy
                </Link>
              </li>
              <li>
                <Link href="/refund" className="hover:text-white transition-colors">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: CONTACT US (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              CONTACT US
            </h4>
            <ul className="mt-3.5 space-y-2.5 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-blue-400 mt-0.5" />
                <span className="leading-relaxed">
                  House # 12, Road # 7, Dhanmondi, Dhaka-1205
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 shrink-0 text-blue-400" />
                <a href="tel:+8801712345678" className="hover:text-white transition-colors">
                  +880 1712-345678
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 shrink-0 text-blue-400" />
                <a href="mailto:info@lpgsafety.org.bd" className="hover:text-white transition-colors">
                  info@lpgsafety.org.bd
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Globe className="h-3.5 w-3.5 shrink-0 text-blue-400" />
                <a
                  href="https://www.lpgsafety.org.bd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  www.lpgsafety.org.bd
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div className="mt-12 border-t border-slate-900 pt-6 text-center text-xs text-slate-500">
          <p>© 2024 AEL. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}

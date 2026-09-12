// src/components/common/navbar/navbar.jsx

import Link from "next/link";
import Image from "next/image";
import { Phone, Mail } from "lucide-react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { LinkButton } from "@/components/ui/LinkButton";
import NavbarInteractive from "./_client/NavbarInteractive";

const SOCIAL_LINKS = [
  {
    name: "Facebook",
    href: "https://facebook.com",
    icon: FaFacebookF,
    bgClass: "bg-blue-600 hover:bg-blue-700",
  },
  {
    name: "Twitter",
    href: "https://twitter.com",
    icon: FaTwitter,
    bgClass: "bg-sky-500 hover:bg-sky-600",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: FaLinkedinIn,
    bgClass: "bg-blue-700 hover:bg-blue-800",
  },
  {
    name: "YouTube",
    href: "https://youtube.com",
    icon: FaYoutube,
    bgClass: "bg-red-600 hover:bg-red-700",
  },
];

const navLinks = [
  { name: "Home", href: "/" },
  {
    name: "Safety Guidelines",
    href: "/safety-guidelines",
  },
  {
    name: "Market Updates",
    href: "/market-updates",
  },
  {
    name: "Training & Quiz",
    href: "/courses",
  },
  { name: "Blog", href: "/blogs" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full shadow-xs">
      {/* 1. Top Utility Header Bar */}
      <div className="bg-slate-950 text-slate-300 py-1.5 border-b border-slate-900 text-xs">
        <div className="site-container flex items-center justify-between gap-3">
          {/* Left: Hotline & Official Support */}
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <LinkButton
              href="tel:16137"
              variant="ghost"
              className="p-0 h-auto font-normal text-[11px] sm:text-xs text-slate-300 hover:text-white hover:bg-transparent inline-flex items-center gap-1.5 active:scale-100 shadow-none border-0"
            >
              <Phone className="h-3.5 w-3.5 text-blue-400" />
              <span>
                Hotline: <strong className="text-white font-semibold">16137</strong>
              </span>
            </LinkButton>

            <span className="hidden sm:inline text-slate-700">|</span>

            <LinkButton
              href="mailto:info@lpgsafety.org.bd"
              variant="ghost"
              className="hidden sm:inline-flex p-0 h-auto font-normal text-[11px] sm:text-xs text-slate-300 hover:text-white hover:bg-transparent items-center gap-1.5 active:scale-100 shadow-none border-0"
            >
              <Mail className="h-3.5 w-3.5 text-blue-400" />
              <span>info@lpgsafety.org.bd</span>
            </LinkButton>
          </div>

          {/* Right: National Recognition & Social Icons */}
          <div className="flex items-center gap-3 text-[11px] sm:text-xs">
            <div className="flex items-center gap-1.5">
              {SOCIAL_LINKS.map((item) => {
                const Icon = item.icon;
                return (
                  <LinkButton
                    key={item.name}
                    href={item.href}
                    aria-label={item.name}
                    className={`h-5 w-5 min-w-[20px] rounded-full p-0 flex items-center justify-center text-white transition-all shadow-none border-0 ${item.bgClass}`}
                  >
                    <Icon className="h-2.5 w-2.5" />
                  </LinkButton>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <nav className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="site-container flex h-16 sm:h-[70px] items-center justify-between gap-4">
          {/* Left: Brand Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center transition-opacity hover:opacity-95">
              <Image
                src="/safe_lpg.png"
                alt="Safe LPG Logo"
                width={170}
                height={42}
                priority
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Interactive Navigation, Search & Actions (Client) */}
          <NavbarInteractive navLinks={navLinks} />
        </div>
      </nav>
    </header>
  );
}

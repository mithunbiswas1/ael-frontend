// src/components/common/navbar/navbar.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Phone,
  Mail,
  Search,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import SearchModal from "@/components/shared/SearchModal";

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
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Close mobile drawer and modal on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
    setSearchModalOpen(false);
  }, [pathname]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

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
          {/* Left: Mobile Toggle & Brand Logo */}
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden text-slate-700 hover:bg-slate-100"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </Button>

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

          {/* Center: Desktop Navigation Menu */}
          <div className="hidden lg:flex items-center">
            {navLinks.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              if (item.subItems) {
                const isOpen = openDropdown === item.name;
                return (
                  <div
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(item.name)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      type="button"
                      className={`flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-semibold transition-all ${isActive
                        ? "text-primary bg-primary/5 font-bold"
                        : "text-slate-700 hover:text-primary hover:bg-slate-50"
                        }`}
                    >
                      <span>{item.name}</span>
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? "rotate-180 text-primary" : "text-slate-400"
                          }`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {isOpen && (
                      <div className="absolute left-0 top-full pt-1.5 z-50 w-64 animate-in fade-in slide-in-from-top-1.5 duration-150">
                        <div className="rounded-xl border border-slate-200/90 bg-white p-1.5 shadow-xl shadow-slate-900/10">
                          {item.subItems.map((sub) => (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-semibold text-slate-700 transition-all duration-150 hover:bg-blue-50 hover:text-primary group"
                            >
                              <span className="flex items-center gap-2.5">
                                <span>{sub.name}</span>
                              </span>
                              <ArrowRight className="h-3.5 w-3.5 text-slate-300 transition-all duration-150 group-hover:translate-x-1 group-hover:text-primary" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative rounded-md px-3 py-2 text-sm font-semibold transition-all ${isActive
                    ? "text-primary bg-primary/5 font-bold"
                    : "text-slate-700 hover:text-primary hover:bg-slate-50"
                    }`}
                >
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right: Search + Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger Button */}
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setSearchModalOpen(true)}
              className="h-8 w-8 sm:h-9 sm:w-9 text-slate-700 hover:text-primary hover:border-primary/50"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Login Button */}
            <LinkButton
              href="/login"
              variant="outline"
              className="text-xs py-2"
            >
              Login
            </LinkButton>

            {/* Subscribe Button (hidden on very small screens) */}
            <LinkButton
              href="/pricing"
              variant="primary"
              className="hidden sm:inline-flex text-xs shadow-xs py-2"
            >
              Subscribe
            </LinkButton>
          </div>
        </div>
      </nav>

      {/* 3. Mobile Slide-Over Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer */}
          <div className="relative mr-auto flex h-full w-full max-w-xs flex-col bg-white p-5 shadow-2xl animate-in slide-in-from-left duration-200">
            {/* Top Close & Logo Row */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center"
              >
                <Image
                  src="/safe_lpg.png"
                  alt="Safe LPG Logo"
                  width={150}
                  height={38}
                  className="h-8 w-auto object-contain"
                />
              </Link>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(false)}
                className="h-8 w-8 text-slate-500 hover:bg-slate-100"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile Search Quick Trigger */}
            <div className="mt-3 px-1">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchModalOpen(true);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-500 bg-slate-50 text-xs hover:border-primary hover:text-primary transition-colors text-left"
              >
                <Search className="h-3.5 w-3.5 text-slate-400" />
                <span>Search guidelines, courses...</span>
              </button>
            </div>

            {/* Links List with Collapsible Submenus */}
            <div className="mt-3 flex-1 overflow-y-auto space-y-1 pr-1">
              {navLinks.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                if (item.subItems) {
                  const isExpanded = expandedMobileMenu === item.name;
                  return (
                    <div key={item.name} className="border-b border-slate-100 pb-1">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedMobileMenu(isExpanded ? null : item.name)
                        }
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                      >
                        <span className={isActive ? "text-primary" : ""}>
                          {item.name}
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 text-slate-400 transition-transform ${isExpanded ? "rotate-180 text-primary" : ""
                            }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="ml-3 pl-3 space-y-1 py-1">
                          {item.subItems.map((sub) => (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              onClick={() => setMobileMenuOpen(false)}
                              className="flex items-center justify-between rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-600 hover:text-primary hover:bg-blue-50/60 transition-colors group"
                            >
                              <span>{sub.name}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <div key={item.name} className="border-b border-slate-100 pb-1">
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${isActive
                        ? "text-primary bg-primary/5"
                        : "text-slate-800 hover:bg-slate-50 hover:text-primary"
                        }`}
                    >
                      {item.name}
                    </Link>
                  </div>
                );
              })}
            </div>

            {/* Bottom Actions */}
            <div className="mt-auto pt-4 border-t border-slate-100 space-y-2">
              <LinkButton
                href="/login"
                variant="outline"
                size="sm"
                fullWidth
                onClick={() => setMobileMenuOpen(false)}
              >
                Login to Portal
              </LinkButton>
              <LinkButton
                href="/pricing"
                variant="primary"
                size="sm"
                fullWidth
                onClick={() => setMobileMenuOpen(false)}
              >
                Subscribe Now
              </LinkButton>
            </div>
          </div>
        </div>
      )}

      {/* 4. Global Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </header>
  );
}


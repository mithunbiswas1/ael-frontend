// src/components/common/navbar/navbar.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Phone,
  Mail,
  Search,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import AelLogo from "@/components/common/AelLogo";

const navLinks = [
  { name: "Home", href: "/" },
  {
    name: "Safety Guidelines",
    href: "/safety-guidelines",
    subItems: [
      { name: "Consumer Safety", href: "/safety-guidelines?tab=consumer" },
      { name: "LPG Dealers", href: "/safety-guidelines?tab=dealer" },
      { name: "Distributors", href: "/safety-guidelines?tab=distributor" },
      { name: "Auto Gas Stations", href: "/safety-guidelines?tab=auto-gas" },
      { name: "Industrial Plants", href: "/safety-guidelines?tab=industrial" },
    ],
  },
  {
    name: "LPG Market Update",
    href: "/market-updates",
    subItems: [
      { name: "Incident Reports", href: "/market-updates?category=incident" },
      { name: "BERC Notices", href: "/market-updates?category=berc" },
      { name: "Stakeholder Circulars", href: "/market-updates?category=stakeholder" },
      { name: "Global Price Indexes", href: "/market-updates?category=global" },
    ],
  },
  { name: "Training & Quiz", href: "/courses" },
  { name: "Blog", href: "/blogs" },
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full shadow-xs">
      {/* 1. Top Utility Header Bar */}
      <div className="bg-slate-950 text-slate-300 py-1.5 px-4 border-b border-slate-900 text-xs">
        <div className="site-container flex flex-wrap items-center justify-between gap-3">
          {/* Left: Hotline & Email */}
          <div className="flex flex-wrap items-center gap-5 text-[11px] sm:text-xs">
            <a
              href="tel:16137"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="h-3.5 w-3.5 text-blue-400" />
              <span>
                Emergency Hotline: <strong className="text-white">16137</strong>
              </span>
            </a>

            <span className="hidden sm:inline text-slate-600">|</span>

            <a
              href="mailto:info@lpgsafety.org.bd"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Mail className="h-3.5 w-3.5 text-blue-400" />
              <span>
                Email: <span className="text-slate-200">info@lpgsafety.org.bd</span>
              </span>
            </a>
          </div>

          {/* Right: Follow Us & Social Icons */}
          <div className="flex items-center gap-2.5 text-[11px] sm:text-xs">
            <span className="text-slate-400 font-medium">Follow Us:</span>
            <div className="flex items-center gap-1.5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white transition-transform hover:scale-110"
              >
                <FaFacebookF className="h-2.5 w-2.5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-white transition-transform hover:scale-110"
              >
                <FaTwitter className="h-2.5 w-2.5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-700 text-white transition-transform hover:scale-110"
              >
                <FaLinkedinIn className="h-2.5 w-2.5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white transition-transform hover:scale-110"
              >
                <FaYoutube className="h-2.5 w-2.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <nav className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="site-container flex items-center justify-between py-2.5">
          {/* Left: Mobile Menu Toggle & AEL Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="flex items-center justify-center p-1.5 text-slate-800 lg:hidden rounded-lg hover:bg-slate-100"
              aria-label="Open navigation menu"
            >
              <Menu className="h-6 w-6" />
            </button>

            <AelLogo />
          </div>

          {/* Center: Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
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
                      className={`flex items-center gap-1 text-xs font-bold transition-colors py-2 ${
                        isActive ? "text-primary" : "text-slate-800 hover:text-primary"
                      }`}
                    >
                      <span>{item.name}</span>
                      <ChevronDown
                        className={`h-3 w-3 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-primary" : "text-slate-500"
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {isOpen && (
                      <div className="absolute left-0 top-full pt-1 z-50 w-52 animate-in fade-in slide-in-from-top-2 duration-150">
                        <div className="rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl">
                          {item.subItems.map((sub) => (
                            <Link
                              key={sub.name}
                              href={sub.href}
                              className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-blue-50 hover:text-primary"
                            >
                              <span>{sub.name}</span>
                              <ArrowRight className="h-3 w-3 opacity-60" />
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
                  className={`relative text-xs font-bold transition-colors py-2 ${
                    isActive ? "text-primary" : "text-slate-800 hover:text-primary"
                  }`}
                >
                  <span>{item.name}</span>
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-primary" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right: Search, Login, Subscribe */}
          <div className="flex items-center gap-2.5">
            {/* Search Icon Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setSearchOpen(!searchOpen)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 text-slate-600 transition-colors hover:border-primary hover:text-primary hover:bg-slate-50"
                aria-label="Search"
              >
                <Search className="h-3.5 w-3.5" />
              </button>

              {/* Popover Search Box */}
              {searchOpen && (
                <div className="absolute right-0 top-10 z-50 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-xl animate-in fade-in duration-150">
                  <form onSubmit={handleSearchSubmit} className="flex items-center gap-1.5">
                    <input
                      type="text"
                      placeholder="Search guidelines, courses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-900 focus:border-primary focus:outline-none"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="rounded-lg bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
                    >
                      Go
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Login Button */}
            <Link
              href="/login"
              className="rounded-lg border border-slate-300 bg-white px-4 py-1.5 text-xs font-bold text-slate-800 transition-colors hover:border-primary hover:text-primary hover:bg-slate-50"
            >
              Login
            </Link>

            {/* Subscribe Button */}
            <Link
              href="/pricing"
              className="rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-blue-700 active:scale-95"
            >
              Subscribe
            </Link>
          </div>
        </div>
      </nav>

      {/* 3. Mobile Slide-Over Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer */}
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col bg-white p-5 shadow-2xl">
            {/* Top Close Row */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <AelLogo />
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Links List */}
            <div className="mt-4 flex-1 overflow-y-auto space-y-1">
              {navLinks.map((item) => (
                <div key={item.name} className="border-b border-slate-100 pb-1">
                  <Link
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-xs font-bold text-slate-800 hover:bg-blue-50 hover:text-primary"
                  >
                    {item.name}
                  </Link>
                  {item.subItems && (
                    <div className="ml-3 pl-2 border-l border-slate-200 space-y-1 pb-1">
                      {item.subItems.map((sub) => (
                        <Link
                          key={sub.name}
                          href={sub.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block text-[11px] font-medium text-slate-600 py-1 hover:text-primary"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Actions */}
            <div className="mt-auto pt-4 border-t border-slate-100 space-y-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center rounded-lg border border-slate-300 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50"
              >
                Login
              </Link>
              <Link
                href="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center rounded-lg bg-primary py-2 text-xs font-bold text-white hover:bg-blue-700"
              >
                Subscription Plans
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

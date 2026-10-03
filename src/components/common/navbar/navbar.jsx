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
} from "lucide-react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube, FaInstagram } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import SearchModal from "@/components/shared/SearchModal";
import LanguageSelector from "./LanguageSelector";
import ProfileDropdown from "./ProfileDropdown";
import { useSelector, useDispatch } from "react-redux";
import { setLogout } from "@/redux/slice/authSlice";
import { useGetPublicSettingsQuery } from "@/redux/api/adminApi";

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

export default function Navbar({ dict = {}, commonDict = {}, locale = "en" }) {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isUserLoggedIn = isMounted && isLoggedIn;

  const roleName = (typeof user?.role === "string" ? user.role : user?.role?.name || "").toLowerCase();
  const isAdmin = roleName === "admin" || roleName === "super_admin" || roleName === "superadmin";

  const navLinks = [
    { name: dict?.navLinks?.home || "Home", href: "/" },
    {
      name: dict?.navLinks?.safetyGuidelines || "Safety Guidelines",
      href: "/safety-guidelines",
    },
    {
      name: dict?.navLinks?.marketUpdates || "LPG Market Updates",
      href: "/market-updates",
    },
    {
      name: dict?.navLinks?.trainingQuiz || "Training & Quiz",
      href: "/courses",
    },
    { name: dict?.navLinks?.blog || "Blog", href: "/blogs" },
    { name: dict?.navLinks?.about || "About", href: "/about" },
    { name: dict?.navLinks?.contact || "Contact", href: "/contact" },
  ];

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

  const { data: publicSettingsData } = useGetPublicSettingsQuery();
  const settings = publicSettingsData?.data;

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8005";
  const rawLogo = settings?.siteLogo || "/safe_lpg_2.png";
  const siteLogoUrl =
    rawLogo.startsWith("http") || rawLogo.startsWith("/")
      ? rawLogo
      : `${backendUrl}${rawLogo.startsWith("/") ? "" : "/"}${rawLogo}`;

  const hotlineLabel = settings?.hotlineLabel || commonDict?.hotlineLabel || "Hotline";
  const hotlineNumber = settings?.sitePhone || commonDict?.hotlineNumber || "16137";
  const emailText = settings?.siteEmail || commonDict?.email || "info@lpgsafety.org.bd";

  const socialList = [
    {
      name: "Facebook",
      href: settings?.facebookUrl || "https://facebook.com",
      icon: FaFacebookF,
      bgClass: "bg-blue-600 hover:bg-blue-700",
      configured: Boolean(settings?.facebookUrl),
    },
    {
      name: "Twitter",
      href: settings?.twitterUrl || "https://twitter.com",
      icon: FaTwitter,
      bgClass: "bg-sky-500 hover:bg-sky-600",
      configured: Boolean(settings?.twitterUrl),
    },
    {
      name: "LinkedIn",
      href: settings?.linkedinUrl || "https://linkedin.com",
      icon: FaLinkedinIn,
      bgClass: "bg-blue-700 hover:bg-blue-800",
      configured: Boolean(settings?.linkedinUrl),
    },
    {
      name: "YouTube",
      href: settings?.youtubeUrl || "https://youtube.com",
      icon: FaYoutube,
      bgClass: "bg-red-600 hover:bg-red-700",
      configured: Boolean(settings?.youtubeUrl),
    },
    {
      name: "Instagram",
      href: settings?.instagramUrl || "https://instagram.com",
      icon: FaInstagram,
      bgClass: "bg-pink-600 hover:bg-pink-700",
      configured: Boolean(settings?.instagramUrl),
    },
  ];

  const activeSocials = socialList.some((s) => s.configured)
    ? socialList.filter((s) => s.configured && s.href)
    : socialList.slice(0, 4);

  return (
    <header className="sticky top-0 z-50 w-full shadow-xs">
      {/* 1. Top Utility Header Bar */}
      {settings?.topbarEnabled !== false && (
        <div className="bg-slate-950 text-slate-300 py-1.5 border-b border-slate-900 text-xs">
          <div className="site-container flex items-center justify-between gap-3">
            {/* Left: Hotline & Official Support */}
            <div className="flex items-center gap-4 text-[11px] sm:text-xs">
              <LinkButton
                href={`tel:${hotlineNumber.replace(/[^0-9+]/g, "")}`}
                variant="ghost"
                className="p-0 h-auto font-normal text-[11px] sm:text-xs text-slate-300 hover:text-white hover:bg-transparent inline-flex items-center gap-1.5 active:scale-100 shadow-none border-0"
              >
                <Phone className="h-3.5 w-3.5 text-blue-400" />
                <span>
                  {hotlineLabel}: <strong className="text-white font-semibold">{hotlineNumber}</strong>
                </span>
              </LinkButton>

              <span className="hidden sm:inline text-slate-700">|</span>

              <LinkButton
                href={`mailto:${emailText}`}
                variant="ghost"
                className="hidden sm:inline-flex p-0 h-auto font-normal text-[11px] sm:text-xs text-slate-300 hover:text-white hover:bg-transparent items-center gap-1.5 active:scale-100 shadow-none border-0"
              >
                <Mail className="h-3.5 w-3.5 text-blue-400" />
                <span>{emailText}</span>
              </LinkButton>

              {settings?.topbarAnnouncement && (
                <>
                  <span className="hidden md:inline text-slate-700">|</span>
                  <span className="hidden md:inline-flex items-center gap-1.5 text-amber-400 font-medium">
                    {settings.topbarAnnouncementUrl ? (
                      <Link href={settings.topbarAnnouncementUrl} className="hover:underline">
                        {settings.topbarAnnouncement}
                      </Link>
                    ) : (
                      <span>{settings.topbarAnnouncement}</span>
                    )}
                  </span>
                </>
              )}
            </div>

            {/* Right: Social Icons */}
            <div className="flex items-center gap-3 text-[11px] sm:text-xs">
              <div className="flex items-center gap-1.5">
                {activeSocials.map((item) => {
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
      )}

      {/* 2. Main Navigation Bar */}
      <nav className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
        <div className="w-full max-w-[1380px] mx-auto px-4 sm:px-6 flex h-16 sm:h-[70px] items-center justify-between gap-3 xl:gap-5">
          {/* Left: Mobile Toggle & Brand Logo */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
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

            <Link href="/" className="flex items-center shrink-0 transition-opacity hover:opacity-95">
              <Image
                src={siteLogoUrl}
                alt={settings?.siteName || "Safe LPG Logo"}
                width={165}
                height={40}
                priority
                unoptimized={siteLogoUrl.startsWith("http")}
                className="h-8 sm:h-9.5 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Center: Desktop Navigation Menu */}
          <div className="hidden lg:flex items-center gap-1 shrink-0">
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
                      className={`flex items-center gap-1 rounded-md px-2.5 py-2 text-sm font-semibold tracking-tight whitespace-nowrap transition-all ${isActive
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
                  className={`relative rounded-md px-2.5 py-2 text-sm font-semibold tracking-tight whitespace-nowrap transition-all ${isActive
                    ? "text-primary bg-primary/5 font-bold"
                    : "text-slate-700 hover:text-primary hover:bg-slate-50"
                    }`}
                >
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Right: Language Selector + Search + Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Search Trigger Button (temporarily commented out) */}
            {/*
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setSearchModalOpen(true)}
              className="h-9 w-9 text-slate-700 hover:text-primary hover:border-primary/50"
              aria-label={dict?.search || "Search"}
            >
              <Search className="h-4 w-4" />
            </Button>
            */}

            {/* Language Selector in Navbar */}
            <LanguageSelector currentLocale={locale} />

            {/* Auth State: Profile Dropdown when logged in, or Login & Subscribe when logged out */}
            {isUserLoggedIn ? (
              <ProfileDropdown locale={locale} />
            ) : (
              <>
                <LinkButton
                  href="/login"
                  variant="outline"
                  size="sm"
                  className="h-9 px-3.5 text-xs sm:text-sm font-bold"
                >
                  {dict?.login || commonDict?.login || "Login"}
                </LinkButton>

                <LinkButton
                  href="/subscription"
                  variant="primary"
                  size="sm"
                  className="hidden sm:inline-flex h-9 px-4 text-xs sm:text-sm font-bold shadow-xs"
                >
                  {dict?.subscribe || commonDict?.subscribe || "Subscribe"}
                </LinkButton>
              </>
            )}
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
                  src={siteLogoUrl}
                  alt={settings?.siteName || "Safe LPG Logo"}
                  width={150}
                  height={38}
                  unoptimized={siteLogoUrl.startsWith("http")}
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

            {/* Mobile Language Switcher Row */}
            <div className="mt-3 px-1 flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200/80">
              <span className="text-xs font-semibold text-slate-600">
                {commonDict?.language || "Language"}:
              </span>
              <LanguageSelector currentLocale={locale} />
            </div>

            {/* Mobile Search Quick Trigger (temporarily commented out) */}
            {/*
            <div className="mt-2 px-1">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setSearchModalOpen(true);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-500 bg-slate-50 text-xs hover:border-primary hover:text-primary transition-colors text-left"
              >
                <Search className="h-3.5 w-3.5 text-slate-400" />
                <span>{commonDict?.searchPlaceholder || "Search guidelines, courses..."}</span>
              </button>
            </div>
            */}

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

            {/* Bottom Actions: User Account Card or Login/Subscribe */}
            <div className="mt-auto pt-4 border-t border-slate-100 space-y-2">
              {isUserLoggedIn ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-2.5 border border-slate-100">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-xs font-black text-white">
                      {(user?.fullName || user?.userName || "U").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {user?.fullName || user?.userName || "User"}
                      </div>
                      <div className="text-[10px] text-slate-500 truncate">
                        {user?.email || (isAdmin ? "Admin" : "Subscriber")}
                      </div>
                    </div>
                  </div>

                  {isAdmin ? (
                    <div className="grid grid-cols-2 gap-2">
                      <LinkButton
                        href="/admin"
                        variant="primary"
                        size="sm"
                        fullWidth
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Admin Panel
                      </LinkButton>
                      <LinkButton
                        href="/user-dashboard/courses"
                        variant="outline"
                        size="sm"
                        fullWidth
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        My Courses
                      </LinkButton>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <LinkButton
                        href="/user-dashboard"
                        variant="primary"
                        size="sm"
                        fullWidth
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Dashboard
                      </LinkButton>
                      <LinkButton
                        href="/user-dashboard/courses"
                        variant="outline"
                        size="sm"
                        fullWidth
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        My Courses
                      </LinkButton>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <LinkButton
                      href="/profile"
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Profile
                    </LinkButton>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        dispatch(setLogout());
                        setMobileMenuOpen(false);
                      }}
                      className="text-rose-600 hover:bg-rose-50 border-rose-200"
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <LinkButton
                    href="/login"
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {commonDict?.loginToPortal || "Login to Portal"}
                  </LinkButton>
                  <LinkButton
                    href="/subscription"
                    variant="primary"
                    size="sm"
                    fullWidth
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {commonDict?.subscribeNow || "Subscribe Now"}
                  </LinkButton>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. Global Search Modal (temporarily commented out) */}
      {/*
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
      */}
    </header>
  );
}

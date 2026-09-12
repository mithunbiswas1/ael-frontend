// src/components/common/footer/footer.jsx

import Link from "next/link";
import { MapPin, Phone, Mail, Globe } from "lucide-react";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import AelLogo from "@/components/common/AelLogo";
import { H4, P } from "@/components/ui/Typography";

const SOCIAL_LINKS = [
  {
    name: "Facebook",
    href: "https://facebook.com",
    icon: FaFacebookF,
    bgClass: "bg-blue-600/80 hover:bg-blue-600",
  },
  {
    name: "Twitter",
    href: "https://twitter.com",
    icon: FaTwitter,
    bgClass: "bg-sky-500/80 hover:bg-sky-500",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: FaLinkedinIn,
    bgClass: "bg-blue-700/80 hover:bg-blue-700",
  },
  {
    name: "YouTube",
    href: "https://youtube.com",
    icon: FaYoutube,
    bgClass: "bg-red-600/80 hover:bg-red-600",
  },
];

const FOOTER_COLUMNS = [
  {
    title: "QUICK LINKS",
    colSpan: "lg:col-span-2",
    links: [
      { label: "Home", href: "/" },
      { label: "Safety Guidelines", href: "/safety-guidelines" },
      { label: "LPG Market Update", href: "/market-updates" },
      { label: "Training & Quiz", href: "/courses" },
      { label: "Blog & Insights", href: "/blogs" },
    ],
  },
  {
    title: "RESOURCES & SUPPORT",
    colSpan: "lg:col-span-3",
    links: [
      { label: "Subscription Plans", href: "/pricing" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "FAQ & Help Center", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

const CONTACT_ITEMS = [
  {
    icon: MapPin,
    text: "House # 12, Road # 7, Dhanmondi, Dhaka-1205",
    href: null,
  },
  {
    icon: Phone,
    text: "+880 1712-345678",
    href: "tel:+8801712345678",
  },
  {
    icon: Mail,
    text: "info@safelpg.com",
    href: "mailto:info@safelpg.com",
  },
  {
    icon: Globe,
    text: "www.safelpg.com",
    href: "https://www.safelpg.com",
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-900 bg-gradient-to-b from-slate-950 to-[#090e1a] text-slate-400">
      <div className="site-container py-12 lg:py-16">

        {/* Main Grid: Brand + Navigation Columns + Contact */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">

          {/* Column 1: Brand Info & Social Media (4 cols) */}
          <div className="flex flex-col lg:col-span-4">
            <AelLogo light={true} />

            <P size="xs" color="slate400" className="mt-4 max-w-xs">
              Promoting certified LPG safety awareness and regulatory compliance across Bangladesh for a safer today and sustainable tomorrow.
            </P>

            {/* Social Icons mapped */}
            <div className="mt-5 flex items-center gap-2">
              {SOCIAL_LINKS.map((item) => {
                const IconComponent = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.name}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg ${item.bgClass} text-white shadow-xs transition-all duration-200 active:scale-95`}
                  >
                    <IconComponent className="h-3.5 w-3.5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Columns 2-3: Navigation link groups mapped */}
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title} className={column.colSpan || "lg:col-span-3"}>
              <H4 color="white" uppercase className="text-xs lg:text-sm font-black tracking-wider">
                {column.title}
              </H4>
              <ul className="mt-4 space-y-2.5 text-xs lg:text-sm">
                {column.links.map((link) => {
                  const isExternal = link.href.startsWith("http") || link.href.startsWith("tel:") || link.href.startsWith("mailto:");
                  return (
                    <li key={link.label}>
                      {isExternal ? (
                        <a
                          href={link.href}
                          className="inline-block text-slate-400 hover:text-white transition-all duration-150"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="inline-block text-slate-400 hover:text-white transition-all duration-150"
                        >
                          {link.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {/* Column 4: Contact Info mapped (3 cols) */}
          <div className="lg:col-span-3">
            <H4 color="white" uppercase className="text-xs lg:text-sm font-black tracking-wider">
              CONTACT US
            </H4>
            <ul className="mt-4 space-y-3 text-xs lg:text-sm">
              {CONTACT_ITEMS.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <li key={idx} className="flex items-start gap-2.5">
                    <IconComponent className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="text-slate-400 hover:text-white transition-colors duration-150"
                      >
                        {item.text}
                      </a>
                    ) : (
                      <span className="leading-relaxed text-slate-400">
                        {item.text}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Subtle Utility Badges */}
        <div className="mt-12 sm:mt-16 border-t border-slate-900/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs lg:text-sm">
          <P size="xs" className="text-center sm:text-left">
            © {new Date().getFullYear()} Safe LPG. All Rights Reserved.
          </P>

          <div className="flex items-center gap-6 text-slate-400 text-xs lg:text-sm">
            <Link href="/privacy" className="hover:text-slate-200 transition-colors">
              Privacy Policy
            </Link>
            <span className="text-slate-700">•</span>
            <Link href="/terms" className="hover:text-slate-200 transition-colors">
              Terms of Service
            </Link>
            <span className="text-slate-700">•</span>
            <Link href="/faq" className="hover:text-slate-200 transition-colors">
              Help Center
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

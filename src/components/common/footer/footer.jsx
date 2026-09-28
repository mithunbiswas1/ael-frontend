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

export default function Footer({ dict = {}, commonDict = {}, locale = "en" }) {
  const quickLinksTitle = dict?.quickLinksTitle || "QUICK LINKS";
  const resourcesTitle = dict?.resourcesTitle || "RESOURCES & SUPPORT";
  const contactTitle = dict?.contactTitle || "CONTACT US";
  const tagline = dict?.tagline || "Promoting certified LPG safety awareness and regulatory compliance across Bangladesh for a safer today and sustainable tomorrow.";
  const addressText = dict?.address || "House # 12, Road # 7, Dhanmondi, Dhaka-1205";
  const phoneText = dict?.phone || "+880 1712-345678";
  const emailText = dict?.email || "info@safelpg.com";
  const websiteText = dict?.website || "www.safelpg.com";
  const copyrightText = dict?.copyright || "All rights reserved. Powered by Safe LPG Bangladesh.";

  const footerColumns = [
    {
      title: quickLinksTitle,
      colSpan: "lg:col-span-2",
      links: [
        { label: dict?.quickLinks?.safetyGuidelines || "Safety Guidelines", href: "/safety-guidelines" },
        { label: dict?.quickLinks?.marketUpdates || "LPG Market Update", href: "/market-updates" },
        { label: dict?.quickLinks?.trainingQuiz || "Training & Quiz", href: "/courses" },
        { label: dict?.quickLinks?.blogInsights || "Blog & Insights", href: "/blogs" },
        { label: dict?.quickLinks?.contactSupport || "Contact Support", href: "/contact" },
      ],
    },
    {
      title: resourcesTitle,
      colSpan: "lg:col-span-3",
      links: [
        { label: dict?.resources?.actsRules || "Related Acts & Rules", href: "/acts-and-rules" },
        { label: dict?.resources?.terms || "Terms & Conditions", href: "/terms" },
        { label: dict?.resources?.privacy || "Privacy Policy", href: "/privacy" },
        { label: dict?.resources?.faq || "FAQ & Help Center", href: "/faq" },
      ],
    },
  ];

  const contactItems = [
    {
      icon: MapPin,
      text: addressText,
      href: null,
    },
    {
      icon: Phone,
      text: phoneText,
      href: "tel:+8801712345678",
    },
    {
      icon: Mail,
      text: emailText,
      href: `mailto:${emailText}`,
    },
    {
      icon: Globe,
      text: websiteText,
      href: `https://${websiteText}`,
    },
  ];

  return (
    <footer className="border-t border-slate-900 bg-gradient-to-b from-slate-950 to-[#090e1a] text-slate-400">
      <div className="site-container py-12 lg:pt-16 lg:pb-6">
        {/* Main Grid: Brand (4 cols) + Quick Links (2 cols) + Resources (3 cols) + Contact (3 cols) = 12 cols */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Column 1: Brand Info & Social Media (4 cols) */}
          <div className="flex flex-col lg:col-span-4">
            <AelLogo light={true} />

            <P size="xs" color="slate400" className="mt-4 max-w-sm">
              {tagline}
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

          {/* Columns 2 & 3: Navigation link groups mapped (2 + 3 cols = 5 cols) */}
          {footerColumns.map((column) => (
            <div key={column.title} className={column.colSpan}>
              <H4 color="white" uppercase className="text-xs font-black tracking-wider">
                {column.title}
              </H4>
              <ul className="mt-4 space-y-2.5 text-xs">
                {column.links.map((link) => {
                  const isExternal =
                    link.href.startsWith("http") ||
                    link.href.startsWith("tel:") ||
                    link.href.startsWith("mailto:");
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
            <H4 color="white" uppercase className="text-xs font-black tracking-wider">
              {contactTitle}
            </H4>
            <ul className="mt-4 space-y-3 text-xs">
              {contactItems.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <li key={idx} className="flex items-start gap-2.5">
                    <IconComponent className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={
                          item.href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
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
        <div className="mt-12 sm:mt-16 border-t border-slate-900/80 pt-6">
          <P size="xs" className="text-center">
            © {new Date().getFullYear()} {copyrightText}
          </P>
        </div>
      </div>
    </footer>
  );
}

// src/components/shared/SearchModal.jsx
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import {
  Search,
  X,
  ArrowRight,
  BookOpen,
  ShieldCheck,
  FileText,
  TrendingUp,
  Award,
  AlertTriangle,
  Scale,
  Sparkles,
} from "lucide-react";
import { H4, P } from "@/components/ui/Typography";

const SEARCH_DATABASE = [
  // Courses
  {
    id: "c-1",
    title: "Commercial LPG Cylinder Handling & Storage",
    description: "Certified safety protocols for commercial kitchen operators and restaurant staff.",
    category: "Course",
    categoryColor: "bg-blue-600 text-white",
    icon: BookOpen,
    href: "/courses/1",
  },
  {
    id: "c-2",
    title: "Industrial LPG Storage & Bulk Tank Installation",
    description: "Engineering standards, valve maintenance, and bulk refilling safety.",
    category: "Course",
    categoryColor: "bg-blue-600 text-white",
    icon: BookOpen,
    href: "/courses/2",
  },
  {
    id: "c-4",
    title: "Household LPG Safety & Kitchen Hazard Prevention",
    description: "Essential home safety, soap-water leak testing, and child protection procedures.",
    category: "Course",
    categoryColor: "bg-blue-600 text-white",
    icon: BookOpen,
    href: "/courses/4",
  },

  // Safety Guidelines
  {
    id: "sg-consumer",
    title: "Household Consumer Safety Guidelines",
    description: "Regulator disconnection, kitchen ventilation, and cylinder positioning protocols.",
    category: "Guideline",
    categoryColor: "bg-emerald-600 text-white",
    icon: ShieldCheck,
    href: "/safety-guidelines?tab=consumer",
  },
  {
    id: "sg-dealer",
    title: "LPG Dealers Operating & Compliance Protocol",
    description: "Retail inventory storage limits, fire extinguisher readiness, and DoE compliance.",
    category: "Guideline",
    categoryColor: "bg-emerald-600 text-white",
    icon: ShieldCheck,
    href: "/safety-guidelines?tab=dealer",
  },
  {
    id: "sg-distributor",
    title: "Distributor & Logistics Transportation Safety",
    description: "Safe road transit, cylinder strapping, and emergency spill response.",
    category: "Guideline",
    categoryColor: "bg-emerald-600 text-white",
    icon: ShieldCheck,
    href: "/safety-guidelines?tab=distributor",
  },
  {
    id: "sg-auto-gas",
    title: "Auto Gas Stations Safety & Refueling Standards",
    description: "Vehicle dispensing nozzle security, static grounding, and emergency shutdown.",
    category: "Guideline",
    categoryColor: "bg-emerald-600 text-white",
    icon: ShieldCheck,
    href: "/safety-guidelines?tab=auto-gas",
  },
  {
    id: "sg-industrial",
    title: "Industrial Plants & High-Pressure Bulk Storage",
    description: "Vaporizer inspection, hydrostatic testing schedules, and fire pump readiness.",
    category: "Guideline",
    categoryColor: "bg-emerald-600 text-white",
    icon: ShieldCheck,
    href: "/safety-guidelines?tab=industrial",
  },

  // Market Updates
  {
    id: "mu-incident",
    title: "National LPG Incident Registry & Inquiry Reports",
    description: "Official investigation findings, root cause analysis, and safety directives.",
    category: "Market Update",
    categoryColor: "bg-amber-600 text-white",
    icon: AlertTriangle,
    href: "/market-updates?category=incident",
  },
  {
    id: "mu-berc",
    title: "BERC Official LPG Price Notifications",
    description: "Monthly statutory maximum retail price (MRP) gazettes across Bangladesh.",
    category: "Market Update",
    categoryColor: "bg-amber-600 text-white",
    icon: TrendingUp,
    href: "/market-updates?category=berc",
  },
  {
    id: "mu-stakeholder",
    title: "Stakeholder Circulars & Regulatory Directives",
    description: "Notices issued by LOAB, Department of Explosives, and Ministry of Power & Energy.",
    category: "Market Update",
    categoryColor: "bg-amber-600 text-white",
    icon: TrendingUp,
    href: "/market-updates?category=stakeholder",
  },

  // Blogs
  {
    id: "b-1",
    title: "10 Essential LPG Safety Tips for Every Home",
    description: "Simple yet crucial habits to avoid gas leakage and fire accidents.",
    category: "Blog",
    categoryColor: "bg-purple-600 text-white",
    icon: FileText,
    href: "/blogs/10-essential-lpg-safety-tips-for-every-home",
  },
  {
    id: "b-2",
    title: "How to Detect LPG Gas Leakage Quickly and Safely",
    description: "Soap solution testing method and odor detection procedures explained.",
    category: "Blog",
    categoryColor: "bg-purple-600 text-white",
    icon: FileText,
    href: "/blogs/how-to-detect-lpg-gas-leakage-quickly",
  },
  {
    id: "b-3",
    title: "New LPG Safety Regulations Issued by Department of Explosives",
    description: "Updated legal rules regarding high-pressure cylinders and licensing.",
    category: "Blog",
    categoryColor: "bg-purple-600 text-white",
    icon: FileText,
    href: "/blogs/new-lpg-safety-regulations-issued-by-doe",
  },
  {
    id: "b-4",
    title: "Smart LPG Monitoring Systems for Safety",
    description: "IoT sensors, smart regulators, and automated shut-off valve developments.",
    category: "Blog",
    categoryColor: "bg-purple-600 text-white",
    icon: FileText,
    href: "/blogs/smart-lpg-monitoring-systems-for-safety",
  },

  // Verification & Portals
  {
    id: "tool-verify",
    title: "Certificate Verification Portal",
    description: "Instant validation of safety certificates issued under LOAB and DoE programs.",
    category: "Portal",
    categoryColor: "bg-teal-600 text-white",
    icon: Award,
    href: "/verify-certificate",
  },
  {
    id: "tool-acts",
    title: "Statutory Acts, Rules & Petroleum Laws",
    description: "Official legal compendium governing LPG import, bottling, and storage.",
    category: "Legal",
    categoryColor: "bg-slate-800 text-white",
    icon: Scale,
    href: "/acts-and-rules",
  },
];

const POPULAR_TAGS = [
  "Cylinder safety",
  "Leak detection",
  "Verify certificate",
  "BERC prices",
  "Auto Gas",
  "Commercial kitchen",
  "Hotline 16137",
];

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setQuery("");
    }
  }, [isOpen]);

  // Handle Body Scroll Lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Filter search results
  const searchResults = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];

    return SEARCH_DATABASE.filter((item) => {
      const titleMatch = item.title.toLowerCase().includes(trimmed);
      const descMatch = item.description.toLowerCase().includes(trimmed);
      const catMatch = item.category.toLowerCase().includes(trimmed);
      return titleMatch || descMatch || catMatch;
    });
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Site Search"
      className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 md:pt-20 bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
        {/* Top Input Row */}
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5 sm:px-5">
          <Search className="h-5 w-5 shrink-0 text-primary" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search courses, safety protocols, circulars, blogs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              aria-label="Clear input"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {/* Active Search Results */}
          {query.trim() ? (
            <div>
              <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
                <span>Search results ({searchResults.length})</span>
                {searchResults.length > 0 && (
                  <span className="text-[11px] text-slate-400">Click an item to open</span>
                )}
              </div>

              {searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={onClose}
                        className="group flex items-start gap-3.5 rounded-xl border border-slate-100 p-3 transition-all duration-150 hover:border-primary/40 hover:bg-blue-50/40 hover:shadow-xs"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors group-hover:bg-primary group-hover:text-white mt-0.5">
                          <IconComponent className="h-4.5 w-4.5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${item.categoryColor}`}
                            >
                              {item.category}
                            </span>
                            <H4 className="truncate text-xs sm:text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">
                              {item.title}
                            </H4>
                          </div>
                          <P size="xs" color="muted" className="line-clamp-1">
                            {item.description}
                          </P>
                        </div>

                        <ArrowRight className="h-4 w-4 shrink-0 text-slate-300 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary mt-2" />
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <Search className="h-6 w-6" />
                  </div>
                  <H4 className="text-sm font-bold text-slate-800">
                    No matching results found for &ldquo;{query}&rdquo;
                  </H4>
                  <P size="xs" color="muted" className="mt-1">
                    Try searching for different keywords like &quot;cylinder&quot;, &quot;training&quot;, &quot;guideline&quot; or &quot;hotline&quot;.
                  </P>
                </div>
              )}
            </div>
          ) : (
            /* Empty State: Popular Topics & Quick Actions */
            <div>
              <div className="mb-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2.5">
                  Popular Search Topics
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {POPULAR_TAGS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setQuery(tag)}
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 hover:border-primary hover:bg-primary/5 hover:text-primary transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

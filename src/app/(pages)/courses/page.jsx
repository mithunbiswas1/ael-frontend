// src/app/(pages)/courses/page.jsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  GraduationCap,
  Clock,
  HelpCircle,
  Award,
  CheckCircle2,
  Search,
  ChevronRight,
  User,
  BookOpen,
  ArrowRight,
  PlaySquare,
  ShieldCheck,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { H1, H2, H3, H4, P } from "@/components/ui/Typography";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Breadcrumb from "@/components/ui/Breadcrumb";
import AmbientGlow from "@/components/ui/AmbientGlow";
import SectionHeader from "@/components/ui/SectionHeader";

const categories = [
  { id: "all", name: "All Categories" },
  { id: "consumer", name: "Consumer Safety" },
  { id: "dealer", name: "Dealer Compliance" },
  { id: "industrial", name: "Industrial Use" },
  { id: "auto-gas", name: "Auto Gas Station" },
  { id: "emergency", name: "Emergency Response" },
  { id: "environment", name: "Environment & Sustainability" },
];

const courseCatalog = [
  {
    id: 1,
    title: "LPG Safety for Regular Consumers",
    description: "Essential safety tips for safe handling, leak testing, and daily use of LPG cylinders at home.",
    category: "consumer",
    badge: "FREE",
    badgeColor: "bg-amber-500",
    audience: "Consumers",
    level: "Beginner",
    imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=600&auto=format&fit=crop",
    isPaid: false,
  },
  {
    id: 2,
    title: "LPG Dealer Safety & Regulatory Compliance",
    description: "Learn storage protocols, legal compliance, fire department mandates and inventory management.",
    category: "dealer",
    badge: "FREE",
    badgeColor: "bg-blue-600",
    audience: "Dealers",
    level: "Intermediate",
    imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600&auto=format&fit=crop",
    isPaid: false,
  },
  {
    id: 3,
    title: "Operational Safety in Auto Gas Stations",
    description: "Comprehensive operational safety guidelines for refueling, dispenser testing and staff safety.",
    category: "auto-gas",
    badge: "FREE",
    badgeColor: "bg-blue-600",
    audience: "Station Staff",
    level: "Intermediate",
    imageUrl: "https://images.unsplash.com/photo-1545459720-aac8509eb02c?q=80&w=600&auto=format&fit=crop",
    isPaid: false,
  },
  {
    id: 4,
    title: "LPG Safety for High-Pressure Industrial Use",
    description: "Safe handling, manifold inspections, and bulk storage operations in industrial facilities.",
    category: "industrial",
    badge: "৳ 500",
    badgeColor: "bg-emerald-600",
    audience: "Industrial Users",
    level: "Advanced",
    imageUrl: "https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?q=80&w=600&auto=format&fit=crop",
    isPaid: true,
  },
  {
    id: 5,
    title: "Rapid Emergency Response & Fire Incident Drill",
    description: "How to respond to vapor leaks, valve failures, flare-ups and evacuate personnel safely.",
    category: "emergency",
    badge: "৳ 300",
    badgeColor: "bg-emerald-600",
    audience: "All Stakeholders",
    level: "Intermediate",
    imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=600&auto=format&fit=crop",
    isPaid: true,
  },
];

const features = [
  {
    icon: PlaySquare,
    title: "Video Lessons",
    description: "High-quality video lessons with modular chapter progress tracking.",
  },
  {
    icon: HelpCircle,
    title: "Quiz Engine",
    description: "Randomized questions dynamically curated from nationwide banks.",
  },
  {
    icon: CheckCircle2,
    title: "Instant Results",
    description: "Immediate score breakdown and review upon quiz submission.",
  },
  {
    icon: Award,
    title: "Certificates",
    description: "Official downloadable PDF with verifiable unique QR code.",
  },
  {
    icon: Clock,
    title: "Resume Anytime",
    description: "Continue seamlessly across desktop, tablet, and mobile devices.",
  },
];

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [audienceFilter, setAudienceFilter] = useState("all");
  const [verifyId, setVerifyId] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const filteredCourses = courseCatalog.filter((course) => {
    const matchesCategory =
      selectedCategory === "all" || course.category === selectedCategory;
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesAudience =
      audienceFilter === "all" ||
      course.audience.toLowerCase() === audienceFilter.toLowerCase();
    return matchesCategory && matchesSearch && matchesAudience;
  });

  const handleVerify = (e) => {
    e.preventDefault();
    if (!verifyId.trim()) {
      toast.error("Please enter a Certificate ID");
      return;
    }
    toast.info(`Checking Certificate ID: ${verifyId}...`);
    setTimeout(() => {
      toast.success(`Verified: Certificate ${verifyId} is valid and authentic.`);
    }, 600);
  };

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!newsletterEmail) {
      toast.error("Please enter your email");
      return;
    }
    toast.success("Thank you for subscribing to training updates!");
    setNewsletterEmail("");
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 pb-16 pt-10 md:pb-20 md:pt-14 text-white">
        <AmbientGlow />

        <div className="site-container relative z-10">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-8">
            
            {/* Left Column */}
            <div className="flex flex-col items-start lg:col-span-7">
              {/* Breadcrumb */}
              <Breadcrumb
                dark
                items={[
                  { label: "Home", href: "/" },
                  { label: "Training & Quiz" },
                ]}
                className="mb-3"
              />

              {/* Pill tag */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-blue-400 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400 animate-pulse" />
                <span>ONLINE LMS &amp; CERTIFICATION</span>
              </div>

              {/* Dual-tone H1 */}
              <H1 color="white" className="leading-[1.08] tracking-tight">
                <span>TRAINING &amp;</span>{" "}
                <span className="text-primary">QUIZ.</span>
              </H1>

              <P className="mt-4 max-w-xl text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
                Industry-aligned LPG safety training for regular consumers, commercial dealers, and industrial operators. Learn at your own pace, take the quiz, and earn your verified certificate.
              </P>

              {/* 4 Feature Badges */}
              <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary border border-primary/30">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <span className="text-[11px]">Expert Courses</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary border border-primary/30">
                    <Clock className="h-4 w-4" />
                  </div>
                  <span className="text-[11px]">Self-Paced</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary border border-primary/30">
                    <HelpCircle className="h-4 w-4" />
                  </div>
                  <span className="text-[11px]">Dynamic Quiz</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary border border-primary/30">
                    <Award className="h-4 w-4" />
                  </div>
                  <span className="text-[11px]">QR Certificate</span>
                </div>
              </div>
            </div>

            {/* Right Column: Floating LMS Card */}
            <div className="relative flex items-center justify-center lg:col-span-5">
              <div className="w-full max-w-md rounded-xl border border-white/15 bg-slate-900/80 p-5 sm:p-6 text-white backdrop-blur-xl shadow-md">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                      LEARN ANYWHERE
                    </span>
                    <H3 color="white" className="text-base font-bold">
                      Digital Academy
                    </H3>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-white shadow-xs">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-4 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs text-slate-200">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Self-paced video modules with safety guidelines</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-200">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Instant score grading &amp; re-attempt option</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-200">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Trusted by 25,000+ certified nationwide users</span>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-white/10">
                  <Link
                    href="#catalog"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-xs font-bold text-white shadow-xs transition-colors hover:bg-blue-700"
                  >
                    <span>Browse Courses Below</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Course Catalog Section */}
      <section id="catalog" className="py-12 sm:py-16">
        <div className="site-container">
          
          {/* Header matching Home */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary backdrop-blur-md">
                E-LEARNING CATALOG
              </span>
              <H2>
                AVAILABLE <span className="text-primary">COURSES.</span>
              </H2>
              <P className="mt-1 text-xs sm:text-sm text-slate-500">
                Explore certified courses by stakeholder category and enhance your safety credentials.
              </P>
            </div>

            {/* Search & Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="min-w-[190px]">
                <Input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  prefix={<Search className="h-3.5 w-3.5" />}
                />
              </div>

              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                options={categories.map((c) => ({ value: c.id, label: c.name }))}
                className="w-36"
              />

              <Select
                value={audienceFilter}
                onChange={(e) => setAudienceFilter(e.target.value)}
                options={[
                  { value: "all", label: "All Audiences" },
                  { value: "Consumers", label: "Consumers" },
                  { value: "Dealers", label: "Dealers" },
                  { value: "Station Staff", label: "Station Staff" },
                  { value: "Industrial Users", label: "Industrial Users" },
                  { value: "All Stakeholders", label: "All Stakeholders" },
                ]}
                className="w-36"
              />
            </div>
          </div>

          {/* Main Grid with Left Categories Sidebar */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            
            {/* Left Sidebar (3 cols) */}
            <div className="space-y-4 lg:col-span-3">
              <div className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs">
                <H4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5">
                  Categories
                </H4>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full text-left rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                        selectedCategory === cat.id
                          ? "bg-primary text-white font-bold shadow-xs"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Need Help Box */}
              <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4">
                <H4 className="text-xs font-bold text-slate-900">Need Guidance?</H4>
                <p className="mt-1 text-[11px] text-slate-600 leading-relaxed">
                  Have questions about bulk corporate LMS enrollment or certification?
                </p>
                <Link
                  href="/contact"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                >
                  <span>Contact Support Team</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>

            {/* Right Courses Grid (9 cols) */}
            <div className="lg:col-span-9">
              {filteredCourses.length === 0 ? (
                <div className="rounded-xl border border-slate-200 bg-white p-12 text-center text-slate-500">
                  No courses found matching your criteria.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredCourses.map((course) => (
                    <div
                      key={course.id}
                      className="group flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs transition-colors duration-200 hover:border-primary/50"
                    >
                      {/* Image + Badge */}
                      <div className="relative aspect-16/10 w-full overflow-hidden bg-slate-100">
                        <Image
                          src={course.imageUrl}
                          alt={course.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover"
                        />
                        <span
                          className={`absolute left-2.5 top-2.5 rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-white shadow-xs ${course.badgeColor}`}
                        >
                          {course.badge}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex flex-1 flex-col justify-between p-4">
                        <div>
                          <H4 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                            {course.title}
                          </H4>
                          <p className="mt-1.5 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {course.description}
                          </p>
                        </div>

                        <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-[11px] text-slate-500">
                          <div className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-slate-400" />
                            <span>Audience: {course.audience}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <BookOpen className="h-3.5 w-3.5 text-slate-400" />
                            <span>Level: {course.level}</span>
                          </div>
                        </div>

                        <div className="mt-4">
                          <button
                            onClick={() =>
                              toast.success(`Redirecting to enrollment for ${course.title}`)
                            }
                            className="w-full rounded-lg bg-primary py-2 text-xs font-bold text-white transition-colors hover:bg-blue-700 shadow-xs"
                          >
                            {course.isPaid ? "Buy Now" : "Enroll Free"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* 3. How It Works Section */}
      <section className="py-12 sm:py-16 bg-white border-t border-slate-200/80">
        <div className="site-container">
          <SectionHeader
            tag="CERTIFICATION PATHWAY"
            title="HOW IT"
            accent="WORKS."
            subtitle="Simple 4-step process to complete your module and earn your verified certificate."
          />

          <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
            
            {/* 4 Steps (8 cols) */}
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:col-span-8 md:grid-cols-4">
              {[
                {
                  step: "1. Enroll",
                  desc: "Select a topic & start immediately.",
                  icon: User,
                },
                {
                  step: "2. Learn",
                  desc: "Watch lessons & read guidelines.",
                  icon: BookOpen,
                },
                {
                  step: "3. Quiz",
                  desc: "Pass the randomized safety quiz.",
                  icon: HelpCircle,
                },
                {
                  step: "4. Certify",
                  desc: "Instant QR-coded PDF certificate.",
                  icon: Award,
                },
              ].map((s, idx) => {
                const Icon = s.icon;
                return (
                  <div
                    key={idx}
                    className="flex flex-col items-start rounded-xl border border-slate-200/80 bg-slate-50/70 p-4"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <H4 className="mt-3 text-xs font-black uppercase tracking-wider text-slate-900">
                      {s.step}
                    </H4>
                    <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Right Card: Your Progress (4 cols) */}
            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-5 lg:col-span-4">
              <H4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Your Learning Status
              </H4>
              <p className="text-[11px] text-slate-500">
                Track your active course progress
              </p>

              <div className="mt-4 flex items-center gap-3.5">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-emerald-500 bg-white font-black text-emerald-600 text-sm shadow-xs">
                  65%
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-400">
                    Active Module
                  </div>
                  <div className="text-xs font-bold text-slate-800 line-clamp-1">
                    LPG Safety for Regular Consumers
                  </div>
                </div>
              </div>

              <Link
                href="/login"
                className="mt-4 block w-full rounded-lg bg-primary py-2 text-center text-xs font-bold text-white transition-colors hover:bg-blue-700 shadow-xs"
              >
                Login to Resume
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Features Grid */}
      <section className="py-12 bg-slate-100/60 border-t border-slate-200/60">
        <div className="site-container">
          <SectionHeader
            tag="PLATFORM ADVANTAGES"
            title="KEY"
            accent="FEATURES."
          />

          <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs transition-colors duration-200 hover:border-primary/40"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <H4 className="mt-3 text-xs font-bold text-slate-900">
                    {feat.title}
                  </H4>
                  <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Certificate Verification Section */}
      <section className="py-12 sm:py-16 bg-slate-950 text-white">
        <div className="site-container">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            
            {/* Left USPs (4 cols) */}
            <div className="lg:col-span-4">
              <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-blue-400 backdrop-blur-md">
                AUTHENTICITY GUARANTEED
              </span>
              <H3 color="white" className="text-lg font-black uppercase tracking-wider">
                VERIFIED <span className="text-primary">CERTIFICATE.</span>
              </H3>

              <div className="mt-4 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Auto-generated upon achieving passing score</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Tamper-evident unique serial &amp; QR verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Direct employer or regulatory validation portal</span>
                </div>
              </div>
            </div>

            {/* Middle Mockup (4 cols) */}
            <div className="flex justify-center lg:col-span-4">
              <div className="relative aspect-4/3 w-full max-w-xs rounded-lg border-2 border-amber-300/50 bg-white p-4 text-slate-900 shadow-xl">
                <div className="text-center">
                  <div className="text-[10px] font-black uppercase text-primary">
                    AEL LPG ACADEMY
                  </div>
                  <div className="mt-0.5 text-xs font-black text-slate-900 uppercase">
                    Certificate of Completion
                  </div>
                  <div className="mt-1 text-[8px] text-slate-500">
                    This certifies that
                  </div>
                  <div className="mt-0.5 text-xs font-black underline text-slate-800">
                    Md. Rafiqul Islam
                  </div>
                  <div className="mt-1 text-[8px] text-slate-500">
                    has completed
                  </div>
                  <div className="text-[9px] font-bold text-primary">
                    LPG Safety for Regular Consumers
                  </div>
                  <div className="mt-1 text-[8px] text-slate-400">
                    May 2024 • ID: AEL-2024-8849
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-1.5 text-[8px] text-slate-500">
                  <span>Authorized Signature</span>
                  <span className="font-bold text-emerald-600">✓ QR Authentic</span>
                </div>
              </div>
            </div>

            {/* Right Verification Input (4 cols) */}
            <div className="lg:col-span-4">
              <div className="rounded-xl border border-white/15 bg-white/5 p-5 backdrop-blur-md">
                <H4 className="text-xs font-black uppercase tracking-wider text-white">
                  VERIFY ANY CERTIFICATE
                </H4>
                <p className="mt-1 text-[11px] text-slate-400">
                  Enter Certificate ID to verify instant authenticity.
                </p>

                <form onSubmit={handleVerify} className="mt-3.5 flex gap-2">
                  <Input
                    type="text"
                    placeholder="e.g. AEL-2024-8849"
                    value={verifyId}
                    onChange={(e) => setVerifyId(e.target.value)}
                    variant="dark"
                    className="flex-1"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-colors shadow-xs"
                  >
                    Verify
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Stay Updated & Stats */}
      <section className="py-8 bg-white border-t border-slate-200/80">
        <div className="site-container">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            
            {/* Newsletter */}
            <div className="flex-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                ACADEMY BULLETINS
              </span>
              <p className="text-xs text-slate-500">
                Subscribe to receive fresh training modules &amp; safety protocols.
              </p>
              <form onSubmit={handleNewsletter} className="mt-2 flex max-w-md gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  required
                  className="flex-1"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700 shadow-xs"
                >
                  Subscribe
                </button>
              </form>
            </div>

            {/* Metrics */}
            <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-8">
              <div>
                <div className="text-xl font-black text-slate-900">1,250+</div>
                <div className="text-[10px] uppercase font-bold text-slate-500">Trainings Held</div>
              </div>
              <div>
                <div className="text-xl font-black text-slate-900">25,340+</div>
                <div className="text-[10px] uppercase font-bold text-slate-500">Learners</div>
              </div>
              <div>
                <div className="text-xl font-black text-slate-900">98%</div>
                <div className="text-[10px] uppercase font-bold text-slate-500">Pass Rate</div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}

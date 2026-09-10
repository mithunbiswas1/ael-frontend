// src/app/(pages)/about/page.jsx
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  BookOpen,
  Handshake,
  Target,
  Compass,
  GraduationCap,
  FileText,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { H1, H2, H3, H4, P } from "@/components/ui/Typography";
import Breadcrumb from "@/components/ui/Breadcrumb";
import AmbientGlow from "@/components/ui/AmbientGlow";
import SectionHeader from "@/components/ui/SectionHeader";

const whoWeAreFeatures = [
  {
    icon: ShieldCheck,
    title: "Safety First",
    description: "We promote safety as a core value in every aspect of the LPG industry.",
  },
  {
    icon: Users,
    title: "Awareness for All",
    description: "We spread awareness among all stakeholders to ensure a safer LPG ecosystem.",
  },
  {
    icon: BookOpen,
    title: "Knowledge & Training",
    description: "We provide expert training, resources and guidance to build skills and confidence.",
  },
  {
    icon: Handshake,
    title: "Stronger Together",
    description: "We collaborate with industry leaders and organizations to create a safer tomorrow.",
  },
];

const expertTrainers = [
  {
    name: "Engr. Md. Shafiqul Islam",
    role: "Safety & Risk Management",
    bio: "25+ years in LPG safety protocols, risk assessment and hazard mitigation.",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "Mst. Nusrat Jahan",
    role: "Environment & Compliance",
    bio: "Specialist in environmental compliance, national regulations and energy safety.",
    imageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "Engr. A. K. M. Rakib",
    role: "LPG Operations Specialist",
    bio: "15+ years in plant operations, maintenance engineering and process safety.",
    imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "Md. Kamrul Hasan",
    role: "Fire & Emergency Expert",
    bio: "Specialist in fire safety standards, rapid emergency response and investigation.",
    imageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
  },
  {
    name: "Dr. Tanvir Ahmed",
    role: "Training & Development",
    bio: "10+ years in technical curriculum design, safety drills and capacity development.",
    imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop",
  },
];

const stats = [
  {
    icon: Users,
    value: "25,340+",
    label: "Registered Users",
  },
  {
    icon: GraduationCap,
    value: "1,250+",
    label: "Safety Trainings",
  },
  {
    icon: FileText,
    value: "820+",
    label: "Resources & Guides",
  },
  {
    icon: ShieldCheck,
    value: "120+",
    label: "Incidents Reported",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* 1. Page Hero Banner */}
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
                  { label: "About Us" },
                ]}
                className="mb-3"
              />

              {/* Pill tag */}
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-blue-400 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 shadow-sm shadow-blue-400 animate-pulse" />
                <span>NATIONAL LPG SAFETY MISSION</span>
              </div>

              {/* Dual-tone H1 */}
              <H1 color="white" className="leading-[1.08] tracking-tight">
                <span>ABOUT</span>{" "}
                <span className="text-primary">US.</span>
              </H1>

              <P className="mt-4 max-w-xl text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
                Dedicated to promoting nationwide safety, building public awareness, and strengthening
                Bangladesh’s LPG sector through knowledge, technical training, and institutional collaboration.
              </P>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-xs md:text-sm font-bold text-white shadow-xs transition-colors duration-200 hover:bg-blue-700"
                >
                  <span>Explore Training Courses</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-5 py-2.5 text-xs md:text-sm font-bold text-white backdrop-blur-md transition-colors duration-200 hover:bg-white/20"
                >
                  <span>Contact Our Team</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Visual */}
            <div className="relative flex items-center justify-center lg:col-span-5">
              <div className="group relative aspect-4/3 w-full max-w-lg overflow-hidden rounded-xl border border-white/15 bg-slate-800/80 shadow-md backdrop-blur-sm">
                <Image
                  src="https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=800&auto=format&fit=crop"
                  alt="LPG Storage and Cylinders"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 45vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                {/* Floating info tag */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between rounded-lg border border-white/20 bg-slate-950/75 p-3 text-white backdrop-blur-md">
                  <div>
                    <div className="text-xs font-black tracking-wide text-white">
                      Nationwide Awareness Network
                    </div>
                    <div className="text-[10px] text-slate-300">
                      Standardizing safety across all 64 districts
                    </div>
                  </div>
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50 animate-pulse" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Who We Are Section */}
      <section className="py-12 sm:py-16">
        <div className="site-container">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">

            {/* Left Content */}
            <div className="lg:col-span-6">
              <SectionHeader
                tag="WHO WE ARE"
                title="DEDICATED TO"
                accent="LPG SAFETY."
              />

              <div className="mt-5 space-y-3.5 text-xs sm:text-sm text-slate-600 leading-relaxed">
                <p>
                  We are a dedicated national platform working for a safer and more sustainable LPG sector
                  in Bangladesh. We create awareness, provide up-to-date information, deliver quality
                  training and support all stakeholders including investors, companies, dealers,
                  distributors and consumers.
                </p>
                <p>
                  Through collaboration with government bodies, industry associations and safety
                  experts, we aim to reduce operational risks, prevent incidents and build a proactive
                  culture of safety across the entire LPG supply chain.
                </p>
              </div>
            </div>

            {/* Right 2x2 Feature Grid */}
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:col-span-6">
              {whoWeAreFeatures.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200/80 bg-white/95 p-4 sm:p-5 shadow-xs transition-colors duration-200 hover:border-primary/50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20 shadow-xs">
                      <Icon className="h-5 w-5" strokeWidth={2.2} />
                    </div>
                    <H4 className="mt-3 text-sm font-bold text-slate-900">
                      {item.title}
                    </H4>
                    <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      </section>

      {/* 3. Mission & Vision Section */}
      <section className="pb-12 sm:pb-16">
        <div className="site-container">
          <SectionHeader
            align="center"
            tag="CORE FOUNDATION"
            title="MISSION &"
            accent="VISION."
            subtitle="Guiding the future of clean energy handling and incident-free LPG adoption."
          />

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Mission Card */}
            <div className="flex items-start gap-4 rounded-xl border border-slate-200/80 bg-white/95 p-6 shadow-xs transition-colors duration-200 hover:border-primary/50">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-primary border border-blue-100">
                <Target className="h-6 w-6" strokeWidth={2} />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                  OUR MISSION
                </span>
                <H3 className="mt-0.5 text-base sm:text-lg font-black text-slate-900">
                  Mission
                </H3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  To promote LPG safety awareness and best practices through education, training,
                  information sharing and collaboration, ensuring the protection of lives, property
                  and the environment across Bangladesh.
                </p>
              </div>
            </div>

            {/* Vision Card */}
            <div className="flex items-start gap-4 rounded-xl border border-slate-200/80 bg-white/95 p-6 shadow-xs transition-colors duration-200 hover:border-emerald-500/50">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Compass className="h-6 w-6" strokeWidth={2} />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">
                  OUR VISION
                </span>
                <H3 className="mt-0.5 text-base sm:text-lg font-black text-slate-900">
                  Vision
                </H3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  To be the leading platform for LPG safety and awareness in Bangladesh,
                  contributing to a sustainable, safe and responsible energy future for all consumers
                  and industrial users.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Consultation Pool / Our Expert Trainers */}
      <section className="py-12 sm:py-16 bg-slate-100/60 border-t border-slate-200/60">
        <div className="site-container">
          <SectionHeader
            align="center"
            tag="CONSULTATION POOL"
            title="EXPERT"
            accent="TRAINERS."
            subtitle="Experienced industry veterans dedicated to building skills, hazard mitigation, and practical guidance."
          />

          {/* 5 Trainers Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {expertTrainers.map((trainer, idx) => (
              <div
                key={idx}
                className="flex flex-col overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs transition-colors duration-200 hover:border-primary/50"
              >
                <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                  <Image
                    src={trainer.imageUrl}
                    alt={trainer.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col p-3.5 text-center">
                  <H4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1">
                    {trainer.name}
                  </H4>
                  <span className="mt-0.5 text-[10px] font-bold text-primary">
                    {trainer.role}
                  </span>
                  <p className="mt-2 text-[11px] leading-relaxed text-slate-500 line-clamp-3">
                    {trainer.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Stats Counter Bar */}
      <section className="py-10 bg-white border-t border-slate-200/80">
        <div className="site-container">
          <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-200/80 bg-slate-50/70 p-5 sm:p-6 md:grid-cols-4 md:gap-6">
            {stats.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20 shadow-xs">
                    <Icon className="h-5 w-5" strokeWidth={2.2} />
                  </div>
                  <div>
                    <div className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                      {item.value}
                    </div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      {item.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

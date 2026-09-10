// src/app/(pages)/faq/page.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  Search,
  Phone,
  ArrowRight,
} from "lucide-react";
import { H1, H2, H3, P } from "@/components/ui/Typography";
import AmbientGlow from "@/components/ui/AmbientGlow";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Input from "@/components/ui/Input";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/Accordion";

const FAQ_CATEGORIES = [
  "All",
  "General Safety",
  "Cylinders & Regulators",
  "Auto Gas Stations",
  "Dealers & Licensing",
  "Certificates & LMS",
];

const FAQ_ITEMS = [
  {
    category: "General Safety",
    question: "What should I do immediately if I smell gas in my home?",
    answer:
      "1. Immediately turn OFF the cylinder regulator knob.\n2. Extinguish all open flames (such as mosquito coils or candles).\n3. Open all windows and exterior doors to ensure cross-ventilation.\n4. DO NOT turn any electrical light switches or exhaust fans ON or OFF, as electrical contact sparks can ignite the air-gas mixture.\n5. If the smell persists, evacuate the premises and call the 24/7 Emergency Support Hotline at 16137 from a safe distance outside.",
  },
  {
    category: "Cylinders & Regulators",
    question: "How do I perform a soap-solution leak test at home?",
    answer:
      "Mix regular liquid dishwashing soap with water to produce rich foam. Using a sponge or soft brush, apply the soapy water generously over the cylinder valve neck, the regulator connection joint, and both ends of the rubber hose clamps. If growing bubbles appear, a leak is present. Close the valve immediately and replace the defective O-ring, regulator, or hose. Never use a flame or matchstick!",
  },
  {
    category: "Cylinders & Regulators",
    question: "How often should I replace the domestic LPG flexible rubber hose?",
    answer:
      "According to national safety standards (BDS 1499), flexible reinforced LPG rubber hoses must be inspected monthly and mandatorily replaced every 2 years—or sooner if signs of surface hardening, pinhole cracking, or discoloration are observed.",
  },
  {
    category: "General Safety",
    question: "Can I store an LPG cylinder horizontally under my sink?",
    answer:
      "No. LPG cylinders must always be kept strictly vertical and upright on a firm, level floor. Storing a cylinder horizontally or upside down forces liquid LPG into the regulator, creating extremely high pressure that can rupture appliances or cause uncontrollable liquid flame flares.",
  },
  {
    category: "Auto Gas Stations",
    question: "What are the key safety protocols during auto-gas refueling?",
    answer:
      "During vehicle refueling at auto gas stations: All passengers must disembark, vehicle engine and mobile phones must be switched OFF, smoking is strictly forbidden within 15 meters, and dispenser nozzles must remain locked until the dispensing cycle is terminated by the certified operator.",
  },
  {
    category: "Dealers & Licensing",
    question: "What licenses are mandatory to operate an LPG retail retail point in Bangladesh?",
    answer:
      "A retail dealer must possess: 1. Department of Explosives (DoE) Storage License. 2. Fire Service & Civil Defense Fire Safety Clearance (NOC). 3. Trade License from the local Municipality/Union Parishad. 4. Dealership appointment agreement with a licensed LOAB primary operator.",
  },
  {
    category: "Certificates & LMS",
    question: "Are the training certificates issued on this portal legally recognized?",
    answer:
      "Yes. All certificates are issued jointly under AEL safety initiatives in alignment with Department of Explosives (DoE) curriculum benchmarks and LOAB guidelines. Each certificate contains a unique digital QR verification code verifiable on /verify-certificate.",
  },
  {
    category: "Certificates & LMS",
    question: "Can I retake a course quiz if I score below 80%?",
    answer:
      "Yes. If you score below 80%, you can immediately review your incorrect answers and retake the assessment quiz as many times as necessary at no additional fee.",
  },
];

export default function FaqPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;
    const matchesSearch =
      !searchTerm ||
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-slate-50">
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 pb-16 pt-10 text-white">
        <AmbientGlow />

        <div className="site-container relative z-10 text-center max-w-3xl mx-auto">
          <Breadcrumb
            dark
            items={[{ label: "Home", href: "/" }, { label: "FAQ & Help Center" }]}
            className="justify-center mb-3"
          />

          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-widest text-blue-400 backdrop-blur-md">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>KNOWLEDGE BASE & SUPPORT DESK</span>
          </div>

          <H1 color="white" className="leading-tight">
            <span>FREQUENTLY ASKED</span>{" "}
            <span className="text-primary">QUESTIONS.</span>
          </H1>

          <P className="mt-3 text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Clear, authoritative guidance on LPG household handling, regulator maintenance, commercial compliance, and emergency protocols.
          </P>
        </div>
      </section>

      {/* 2. Main FAQ Accordion Area */}
      <section className="relative z-20 -mt-8 mx-auto w-full max-w-4xl px-4 pb-20">
        <div className="rounded-xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xs">
          {/* Search Box */}
          <div className="mb-6">
            <Input
              placeholder="Type your question or search keywords (e.g. leak, regulator, license)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              prefix={<Search className="h-4 w-4 text-slate-400" />}
              size="md"
              className="bg-slate-50/80"
            />
          </div>

          {/* Category Tabs */}
          <div className="mb-8 flex flex-wrap gap-1.5 border-b border-slate-100 pb-4">
            {FAQ_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? "bg-primary text-white shadow-2xs"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Modular Accessible Accordion Component */}
          {filteredFaqs.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No questions found matching your search. Please reach out to our team directly.
            </div>
          ) : (
            <Accordion
              type="multiple"
              defaultValue={["faq-0"]}
              className="space-y-3"
            >
              {filteredFaqs.map((faq, idx) => (
                <AccordionItem
                  key={idx}
                  value={`faq-${idx}`}
                  variant="card"
                >
                  <AccordionTrigger iconType="chevron">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent variant="card">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>

        {/* Still Have Questions Box */}
        <div className="mt-8 rounded-xl border border-slate-200/80 bg-white p-6 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Still have questions or facing an emergency?
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Contact our safety engineers or call the 24/7 National Emergency Hotline.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="tel:16137"
              className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition-colors shadow-xs"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Hotline 16137</span>
            </a>
            <Link
              href="/contact"
              className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-xs"
            >
              <span>Contact Us</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

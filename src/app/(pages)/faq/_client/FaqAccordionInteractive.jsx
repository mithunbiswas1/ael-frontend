"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import Input from "@/components/ui/Input";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/Accordion";

export const FAQ_CATEGORIES = [
  "All",
  "General Safety",
  "Cylinders & Regulators",
  "Auto Gas Stations",
  "Dealers & Licensing",
  "Certificates & LMS",
];

export const FAQ_ITEMS = [
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
    question: "How can an employer or authority verify a training certificate?",
    answer:
      "Any certificate issued by Safe LPG Academy carries a unique serial number and QR code. Navigate to the 'Verify Certificate' page, enter the Certificate ID (e.g. CERT-LPG-1-2024), and the national database will instantly confirm validity, issue date, score, and authorized inspector sign-off.",
  },
  {
    category: "Auto Gas Stations",
    question: "What is the mandatory pressure test frequency for CNG/Auto Gas vehicle cylinders?",
    answer:
      "Under national motor vehicle safety statutory codes, automotive LPG conversion tanks and high-pressure cylinders must undergo hydrostatic pressure re-testing every 3 to 5 years at an authorized DoE cylinder testing facility.",
  },
];

export default function FaqAccordionInteractive() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredFaqs = FAQ_ITEMS.filter((faq) => {
    const matchesCategory =
      activeCategory === "All" || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-xs">
      {/* Search Input Bar */}
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search safety questions (e.g. leak test, regulator, hotline)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          prefix={<Search className="h-4 w-4 text-slate-500" />}
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
  );
}

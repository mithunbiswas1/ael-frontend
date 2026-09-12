// src/app/(pages)/market-updates/_client/BercMessageSection.jsx
"use client";

import { BellRing, FileText, Download, CheckCircle2, AlertCircle, Calendar, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";

const BERC_CIRCULARS = [
  {
    id: "BERC-CIR-2024-06",
    title: "Determination of Monthly Consumer Price of LPG for June 2024",
    date: "June 02, 2024",
    type: "Price Order",
    fileSize: "1.2 MB",
    description:
      "Statutory determination of maximum retail price (MRP) for 12kg household cylinders, auto gas at station level, and bulk commercial LPG across Bangladesh under Section 22(B) of the BERC Act.",
    keyPoints: [
      "Standard 12kg Private LPG Cylinder: BDT 1,363 inclusive of VAT",
      "Auto Gas at Dispensing Stations: BDT 62.40 per litre inclusive of VAT",
      "Cross-subsidized Reticulated System Price: BDT 109.80 per kg",
    ],
  },
  {
    id: "BERC-DIR-2024-04",
    title: "Enforcement Order on Cross-Refilling & Hydrostatic Testing Compliance",
    date: "May 14, 2024",
    type: "Safety Directive",
    fileSize: "2.4 MB",
    description:
      "Strict prohibition of cross-refilling cylinders belonging to other marketing companies. Operators must ensure 5-year periodic hydrostatic pressure testing before market circulation.",
    keyPoints: [
      "Immediate confiscation of unauthorized third-party refilled cylinders",
      "Mandatory serial tracking integration with central safety portal",
      "Strict penal actions under Section 43 of BERC Act for violations",
    ],
  },
  {
    id: "BERC-ADV-2024-03",
    title: "Advisory on Retail Point Weighing Scales & Consumer Grievance Mechanism",
    date: "April 28, 2024",
    type: "Consumer Advisory",
    fileSize: "980 KB",
    description:
      "All authorized distributors and retailers must maintain calibrated digital weighing scales. Consumers have the right to verify gross and tare weight before purchase.",
    keyPoints: [
      "Certified digital weighing scale mandatory at every retail point",
      "Toll-free consumer grievance hotline 16137 active 24/7",
      "Price display board must be prominently visible at premises entrance",
    ],
  },
  {
    id: "BERC-REG-2024-01",
    title: "Quarterly Auto Gas Dispenser Meter Recalibration Standard",
    date: "April 05, 2024",
    type: "Regulatory Standard",
    fileSize: "1.7 MB",
    description:
      "Technical protocol for dispensing accuracy, temperature compensation, and nozzle emergency breakaway couplings at all licensed auto gas stations.",
    keyPoints: [
      "Quarterly calibration by BSTI certified technicians mandatory",
      "Max allowable dispensing tolerance ±0.5%",
      "Emergency shutoff valves (ESV) inspection certificate renewal",
    ],
  },
];

const PRICE_ITEMS = [
  {
    category: "12 kg Cylinder",
    spec: "Standard Household Retail",
    price: "৳ 1,363",
    vat: "Inclusive of VAT",
    tag: "Standard",
    accent: "border-primary/40 bg-primary/5 text-primary",
  },
  {
    category: "Auto Gas",
    spec: "Per Litre at Station",
    price: "৳ 62.40",
    vat: "Inclusive of VAT",
    tag: "Automotive",
    accent: "border-emerald-500/40 bg-emerald-50 text-emerald-800",
  },
  {
    category: "35 kg Cylinder",
    spec: "Commercial / Restaurant",
    price: "৳ 3,975",
    vat: "Inclusive of VAT",
    tag: "Commercial",
    accent: "border-amber-500/40 bg-amber-50 text-amber-900",
  },
  {
    category: "45 kg Cylinder",
    spec: "Heavy Industrial / Bulk",
    price: "৳ 5,110",
    vat: "Inclusive of VAT",
    tag: "Industrial",
    accent: "border-indigo-500/40 bg-indigo-50 text-indigo-900",
  },
];

export default function BercMessageSection() {
  const handleDownload = (circular) => {
    toast.success(`Downloading ${circular.id} (${circular.fileSize})...`);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Official BERC Hero Header Card */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-200/80 bg-gradient-to-br from-amber-50/80 via-white to-amber-50/30 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-200/60 pb-6 mb-6">
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-white shadow-xs">
              <BellRing className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block rounded bg-amber-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-amber-900">
                  Official Gazette
                </span>
                <span className="text-xs text-slate-600 font-medium">
                  Ref: BERC/Sec-22/LPG-2024
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider text-slate-900 mt-1">
                MESSAGE FROM BERC
              </h2>
              <p className="text-xs font-semibold text-amber-900 mt-0.5">
                Bangladesh Energy Regulatory Commission • গণপ্রজাতন্ত্রী বাংলাদেশ সরকার
              </p>
            </div>
          </div>

          {/* Official Emblem Badge */}
          <div className="flex items-center gap-3 self-start sm:self-center">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-emerald-600 bg-white p-1 shadow-2xs">
              <div className="h-full w-full rounded-full bg-red-600 flex items-center justify-center text-[9px] font-black text-white text-center leading-none">
                BERC
              </div>
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-slate-800">Statutory Authority</div>
              <div className="text-[11px] text-slate-500">Act No. 13 of 2003</div>
            </div>
          </div>
        </div>

        {/* Commission Official Message Text */}
        <div className="rounded-xl border border-amber-200/60 bg-white/90 p-4 sm:p-5 mb-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
          <p className="font-medium">
            The Bangladesh Energy Regulatory Commission (BERC) regularly determines the maximum retail price (MRP) of private LPG based on Saudi Aramco Contract Price (CP), international ocean freight, US Dollar exchange rates, and operator margins to protect consumer interest and ensure transparent market stability.
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs font-bold text-amber-900">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
            <span>Charging prices above the BERC-approved monthly rate is a punishable legal offense.</span>
          </div>
        </div>

        {/* Current Month Price Cards Grid */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-primary" />
              <span>Current Official BERC Price Tariffs (Effective June 2024)</span>
            </h3>
            <span className="text-[11px] text-slate-600 font-semibold">
              Updated on 1st of every month
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {PRICE_ITEMS.map((item) => (
              <div
                key={item.category}
                className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-2xs hover:border-primary/50 transition-all"
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold text-slate-900">{item.category}</span>
                  <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${item.accent}`}>
                    {item.tag}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mb-2">{item.spec}</div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {item.price}
                </div>
                <div className="text-[10px] text-slate-600 font-semibold mt-0.5">{item.vat}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Official Circulars & Directives List */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-6">
          <div>
            <h3 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span>BERC CIRCULARS & NOTICES</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Official circulars, price determinations, and regulatory directives
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600">
            Showing 4 Latest Gazettes
          </span>
        </div>

        <div className="flex flex-col divide-y divide-slate-100">
          {BERC_CIRCULARS.map((circular) => (
            <div key={circular.id} className="py-5 first:pt-0 last:pb-0">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200/60">
                    {circular.type}
                  </span>
                  <span className="text-xs font-bold text-slate-700 font-mono">
                    {circular.id}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{circular.date}</span>
                </div>
              </div>

              <h4 className="text-sm sm:text-base font-bold text-slate-900 hover:text-primary transition-colors">
                {circular.title}
              </h4>

              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {circular.description}
              </p>

              {/* Key Bullet Points */}
              <div className="mt-3 rounded-lg border border-slate-100 bg-slate-50/70 p-3 space-y-1.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  Key Directives & Mandates:
                </div>
                {circular.keyPoints.map((point, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between gap-3">
                <span className="text-[11px] text-slate-400 font-medium">
                  Format: Official Signed PDF ({circular.fileSize})
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(circular)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Circular</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

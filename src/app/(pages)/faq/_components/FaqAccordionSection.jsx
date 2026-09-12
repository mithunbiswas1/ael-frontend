// src/app/(pages)/faq/_components/FaqAccordionSection.jsx
import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";
import FaqAccordionInteractive from "../_client/FaqAccordionInteractive";

export default function FaqAccordionSection() {
  return (
    <section className="py-12 sm:py-16">
      <div className="site-container max-w-4xl">
        <FaqAccordionInteractive />

        {/* Still Have Questions / Emergency Box */}
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
      </div>
    </section>
  );
}

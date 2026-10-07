import Link from "next/link";
import { Download } from "lucide-react";
import { getLocale } from "@/lib/i18n";

export default async function IncidentDetailCard({ incident }) {
  const locale = await getLocale();
  const isBn = locale === "bn";

  const isIncident = incident.category === "incident";
  const bodyLabel = isIncident
    ? isBn ? "তদন্তকারী কর্তৃপক্ষ" : "Investigating Body"
    : isBn ? "উৎস / নিয়ন্ত্রক সংস্থা" : "Source / Authority";
  const summaryLabel = isIncident
    ? isBn ? "দুর্ঘটনার সারসংক্ষেপ ও প্রাথমিক অনুসন্ধান" : "Incident Summary & Initial Findings"
    : isBn ? "সারসংক্ষেপ" : "Summary";
  const impactLabel = isIncident
    ? isBn ? "হতাহত ও ক্ষয়ক্ষতির মূল্যায়ন" : "Casualties & Impact Assessment"
    : isBn ? "মূল পরিসংখ্যান ও প্রভাব" : "Key Figures & Impact";
  const capaLabel = isIncident
    ? isBn ? "সংশোধনমূলক ও প্রতিরোধমূলক ব্যবস্থা (CAPA)" : "Corrective & Preventive Action (CAPA)"
    : isBn ? "পরবর্তী পদক্ষেপ ও কমপ্লায়েন্স নোট" : "Follow-up / Compliance Note";
  const dossierLabel = isIncident
    ? isBn ? "অফিশিয়াল তদন্ত নথি" : "Official Inquiry Dossier"
    : isBn ? "অফিশিয়াল রেফারেন্স" : "Official Reference";
  const certifiedByLabel = isIncident
    ? isBn ? "প্রত্যয়নকারী:" : "Certified by"
    : isBn ? "জারি করেছে:" : "Issued by";

  return (
    <section className="relative z-20 -mt-8 mx-auto w-full max-w-4xl px-4 pb-20">
      <div className="rounded-xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-slate-100">
          <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200/60">
            <span className="text-[11px] font-bold text-slate-500 block uppercase">
              {isBn ? "স্থান" : "Location"}
            </span>
            <span className="text-xs font-bold text-slate-900 mt-1 block">
              {incident.specificLocation}
            </span>
          </div>

          <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200/60">
            <span className="text-[11px] font-bold text-slate-500 block uppercase">
              {isBn ? "ঘটনার তারিখ" : "Date of Incident"}
            </span>
            <span className="text-xs font-bold text-slate-900 mt-1 block">
              {incident.date}
            </span>
          </div>

          <div className="rounded-lg bg-slate-50 p-3.5 border border-slate-200/60">
            <span className="text-[11px] font-bold text-slate-500 block uppercase">
              {bodyLabel}
            </span>
            <span className="text-xs font-bold text-slate-900 mt-1 block">
              {incident.conductedBy}
            </span>
          </div>
        </div>

        <div className="py-6 space-y-6">
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-2">
              {summaryLabel}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-4 rounded-lg border border-slate-200/80 break-words [overflow-wrap:anywhere]">
              {incident.details}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-2">
              {impactLabel}
            </h3>
            <div className="rounded-lg border border-slate-200 bg-white p-4 text-xs font-medium text-slate-800 break-words [overflow-wrap:anywhere]">
              {incident.casualties}
            </div>
          </div>

          {incident.preventiveAction && (
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-2">
                {capaLabel}
              </h3>
              <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-4 text-xs text-slate-700 leading-relaxed break-words [overflow-wrap:anywhere]">
                {incident.preventiveAction}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-lg bg-blue-50/60 border border-blue-200 p-4">
            <div>
              <span className="text-xs font-bold text-blue-900 block">
                {dossierLabel}
              </span>
              <span className="text-[11px] text-blue-700">
                {isBn ? "রেফ আইডি: " : "Ref ID: "}
                {incident.investigationReport} ({certifiedByLabel} {incident.conductedBy})
              </span>
            </div>
            <a
              href="#"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary/90 transition-colors shadow-xs"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isBn ? "প্রত্যয়িত পিডিএফ ডাউনলোড" : "Download Certified PDF"}</span>
            </a>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
          <Link
            href="/market-updates"
            className="text-xs font-bold text-primary hover:underline"
          >
            {isBn ? "← মার্কেট আপডেটে ফিরে যান" : "← Back to Market Updates"}
          </Link>
          <Link
            href="/safety-guidelines"
            className="text-xs font-bold text-slate-600 hover:text-slate-900 hover:underline"
          >
            {isBn ? "নিরাপত্তা নির্দেশিকা দেখুন →" : "View Safety Guidelines →"}
          </Link>
        </div>
      </div>
    </section>
  );
}

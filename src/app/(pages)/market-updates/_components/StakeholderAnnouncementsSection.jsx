import { BellRing, ArrowRight, Building, Globe2 } from "lucide-react";
import { toast } from "sonner";

export default function StakeholderAnnouncementsSection({
  stakeholderAnnouncements,
  globalNews,
  activeStakeholderTab,
  setActiveStakeholderTab,
}) {
  return (
    <div className="flex flex-col gap-6 lg:col-span-4">
      {/* CARD 1: BERC MESSAGE / ANNOUNCEMENT */}
      <div className="relative overflow-hidden rounded-xl border border-amber-200/80 bg-gradient-to-br from-amber-50/80 via-white to-amber-50/30 p-5 shadow-2xs">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500 text-white shadow-xs">
              <BellRing className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                BERC ANNOUNCEMENT
              </h3>
              <p className="text-[10px] text-amber-700 font-semibold">
                Bangladesh Energy Regulatory Commission
              </p>
            </div>
          </div>

          {/* BERC Seal Badge */}
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-emerald-600 bg-white p-1 shadow-2xs">
            <div className="h-full w-full rounded-full bg-red-600 flex items-center justify-center text-[8px] font-black text-white text-center leading-none">
              BERC
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-amber-200/60 bg-white/90 p-3.5 mb-3">
          <div className="text-xs font-bold text-slate-900 mb-1">
            Monthly LPG Price Revision Circular
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            BERC has revised the standard 12kg cylinder LPG price effective from 1st June 2024. Please check the official circular for itemized pricing and regional auto-gas quotas.
          </p>
        </div>

        <button
          onClick={() =>
            toast.info(
              "BERC Circular #2024/06: Standard 12kg LPG price announced at BDT 1,363 inclusive of VAT."
            )
          }
          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800 hover:text-amber-900 hover:underline transition-colors"
        >
          <span>View Price Circular Details</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* CARD 2: GLOBAL LPG MARKET UPDATE */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-2xs">
        <div className="border-b border-slate-100 pb-3 mb-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
            <Globe2 className="h-3.5 w-3.5 text-emerald-600" />
            <span>GLOBAL LPG MARKET UPDATE</span>
          </h3>
          <p className="text-[10px] text-slate-500 mt-0.5">
            International freight, contract price (CP), and commodity trends
          </p>
        </div>

        <div className="flex flex-col divide-y divide-slate-100">
          {globalNews.map((news) => (
            <div key={news.id} className="py-3 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-[10px] font-bold text-slate-700">
                  {news.source}
                </span>
                <span className="text-[10px] text-slate-500">{news.time}</span>
              </div>
              <div className="text-xs font-bold text-slate-900 leading-snug hover:text-primary transition-colors cursor-pointer">
                {news.title}
              </div>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                {news.summary}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

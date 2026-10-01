import { Suspense } from "react";
import MarketUpdatesContent from "./_view/MarketUpdatesContent";
import { getPageContent } from "@/next-api/getPageContent";
import { getMarketUpdates } from "@/next-api/getMarketUpdates";

export const metadata = {
  title: "LPG Market Update & Incident Registry | Safe LPG Platform",
  description:
    "Real-time official LPG incident registry, DoE inquiry reports, BERC circulars, and global market price trends in Bangladesh.",
};

export default async function MarketUpdatesPage() {
  const [cmsData, initialUpdates] = await Promise.all([
    getPageContent("market-updates"),
    getMarketUpdates({ limit: 50 }),
  ]);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="flex items-center gap-3 text-slate-600 font-semibold text-sm">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span>Loading Market Updates...</span>
          </div>
        </div>
      }
    >
      <MarketUpdatesContent
        bannerData={cmsData.banner}
        sections={cmsData.sections}
        initialUpdates={initialUpdates}
      />
    </Suspense>
  );
}

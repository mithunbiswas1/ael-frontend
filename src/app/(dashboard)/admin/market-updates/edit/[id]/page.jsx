// src/app/(dashboard)/admin/market-updates/edit/[id]/page.jsx
"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import PermissionGuard from "@/components/ui/PermissionGuard";
import { useGetMarketUpdateByIdQuery } from "@/redux/api/marketUpdateApi";
import MarketUpdateForm from "../../_components/MarketUpdateForm";

export default function EditMarketUpdatePage({ params }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const { data: response, isLoading, error } = useGetMarketUpdateByIdQuery(id);
  const updateData = response?.data;

  return (
    <PermissionGuard module="market-updates" action="edit">
      <title>
        {updateData?.titleEn
          ? `Edit "${updateData.titleEn.slice(0, 30)}..." | Safe LPG Admin`
          : "Edit Market Update | Safe LPG Admin"}
      </title>
      <div className="max-w-7xl mx-auto py-2">
        {isLoading ? (
          <div className="p-16 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="mt-3 text-xs text-slate-500 font-semibold">
              Loading market update data for editing...
            </p>
          </div>
        ) : error || !updateData ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-rose-200 shadow-2xs">
            <AlertCircle className="mx-auto h-10 w-10 text-rose-500 mb-3" />
            <h2 className="text-sm font-bold text-slate-800">Record Not Found</h2>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Unable to locate the specified market update for editing.
            </p>
            <Link
              href="/admin/market-updates"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Market Updates</span>
            </Link>
          </div>
        ) : (
          <MarketUpdateForm initialData={updateData} isEdit={true} />
        )}
      </div>
    </PermissionGuard>
  );
}

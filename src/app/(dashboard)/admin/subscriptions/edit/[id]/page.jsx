// src/app/(dashboard)/admin/subscriptions/edit/[id]/page.jsx
"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, AlertCircle } from "lucide-react";
import PermissionGuard from "@/components/ui/PermissionGuard";
import { useGetSubscriptionPlanByIdQuery } from "@/redux/api/subscriptionApi";
import SubscriptionPlanForm from "../../_components/SubscriptionPlanForm";

export default function EditSubscriptionPlanPage({ params: propParams }) {
  const routeParams = useParams();
  const id = routeParams?.id || propParams?.id;

  const { data: planResponse, isLoading, error } = useGetSubscriptionPlanByIdQuery(id, {
    skip: !id,
  });
  const plan = planResponse?.data;

  return (
    <PermissionGuard module="subscriptions" page="/admin/subscriptions" action="edit">
      <title>
        {plan?.nameEn
          ? `Edit "${plan.nameEn}" Plan | Safe LPG Admin`
          : "Edit Subscription Plan | Safe LPG Admin"}
      </title>
      <div className="max-w-7xl mx-auto py-2">
        {isLoading ? (
          <div className="p-16 text-center bg-white rounded-2xl border border-slate-200 shadow-2xs">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="mt-3 text-xs text-slate-500 font-semibold">
              Loading subscription plan details...
            </p>
          </div>
        ) : error || !plan ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-rose-200 shadow-2xs">
            <AlertCircle className="mx-auto h-10 w-10 text-rose-500 mb-3" />
            <h2 className="text-sm font-bold text-slate-800">Plan Not Found</h2>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Unable to locate the specified subscription plan for editing.
            </p>
            <Link
              href="/admin/subscriptions"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Plans</span>
            </Link>
          </div>
        ) : (
          <SubscriptionPlanForm initialData={plan} isEdit={true} />
        )}
      </div>
    </PermissionGuard>
  );
}

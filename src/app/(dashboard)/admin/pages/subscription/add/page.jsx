// src/app/(dashboard)/admin/pages/subscription/add/page.jsx
"use client";

import PermissionGuard from "@/components/ui/PermissionGuard";
import SubscriptionPlanForm from "@/app/(dashboard)/admin/subscriptions/_components/SubscriptionPlanForm";

export default function AdminPageAddSubscription() {
  return (
    <PermissionGuard module="pages_subscription" page="/admin/pages/subscription" action="create">
      <title>Create New Subscription Plan | Safe LPG Admin</title>
      <div className="max-w-7xl mx-auto py-2">
        <SubscriptionPlanForm isEdit={false} />
      </div>
    </PermissionGuard>
  );
}

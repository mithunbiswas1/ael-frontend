// src/app/(dashboard)/admin/subscriptions/add/page.jsx
"use client";

import PermissionGuard from "@/components/ui/PermissionGuard";
import SubscriptionPlanForm from "../_components/SubscriptionPlanForm";

export default function AddSubscriptionPlanPage() {
  return (
    <PermissionGuard module="roles" action="create">
      <title>Create New Subscription Plan | Safe LPG Admin</title>
      <div className="max-w-7xl mx-auto py-2">
        <SubscriptionPlanForm isEdit={false} />
      </div>
    </PermissionGuard>
  );
}

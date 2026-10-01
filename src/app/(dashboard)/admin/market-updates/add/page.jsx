// src/app/(dashboard)/admin/market-updates/add/page.jsx
"use client";

import PermissionGuard from "@/components/ui/PermissionGuard";
import MarketUpdateForm from "../_components/MarketUpdateForm";

export default function AddMarketUpdatePage() {
  return (
    <PermissionGuard module="market-updates" action="create">
      <title>Publish Market Update | Safe LPG Admin</title>
      <MarketUpdateForm isEdit={false} />
    </PermissionGuard>
  );
}

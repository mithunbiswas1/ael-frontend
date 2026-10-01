// src/app/(dashboard)/profile/_components/ProfileSecurityCard.jsx
"use client";

import { FaKey, FaCheckCircle } from "react-icons/fa";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { H4, P } from "@/components/ui/Typography";

export default function ProfileSecurityCard({ isBn, onOpenPasswordModal }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
            <Lock className="h-4 w-4" />
          </div>
          <div>
            <H4 className="text-xs font-bold text-slate-900">
              {isBn ? "অ্যাকাউন্ট নিরাপত্তা" : "Account Security"}
            </H4>
            <P className="text-[11px] text-slate-500">
              {isBn ? "পাসওয়ার্ড ও প্রমাণীকরণ" : "Password & Credentials"}
            </P>
          </div>
        </div>
        <Badge variant="success" size="xs" icon={FaCheckCircle}>
          {isBn ? "সুরক্ষিত" : "Protected"}
        </Badge>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        fullWidth
        onClick={onOpenPasswordModal}
        icon={FaKey}
        className="mt-2"
      >
        <span>{isBn ? "পাসওয়ার্ড পরিবর্তন করুন" : "Update Password"}</span>
      </Button>
    </div>
  );
}

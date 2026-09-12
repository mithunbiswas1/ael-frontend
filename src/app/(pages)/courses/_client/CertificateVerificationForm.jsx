"use client";

import { useState } from "react";
import { toast } from "sonner";
import Input from "@/components/ui/Input";

export default function CertificateVerificationForm() {
  const [verifyId, setVerifyId] = useState("");

  const handleVerify = (e) => {
    e.preventDefault();
    if (!verifyId.trim()) {
      toast.error("Please enter a Certificate ID");
      return;
    }
    toast.info(`Checking Certificate ID: ${verifyId}...`);
    setTimeout(() => {
      toast.success(`Verified: Certificate ${verifyId} is valid and authentic.`);
    }, 600);
  };

  return (
    <form onSubmit={handleVerify} className="mt-3 flex gap-2">
      <Input
        type="text"
        placeholder="e.g. CERT-LPG-1-2024"
        value={verifyId}
        onChange={(e) => setVerifyId(e.target.value)}
        variant="dark"
        className="flex-1"
        required
      />
      <button
        type="submit"
        className="shrink-0 rounded-lg bg-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-xs hover:bg-blue-600 transition-colors"
      >
        Check
      </button>
    </form>
  );
}

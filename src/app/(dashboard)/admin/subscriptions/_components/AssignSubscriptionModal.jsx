// src/app/(dashboard)/admin/subscriptions/_components/AssignSubscriptionModal.jsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useGetUsersQuery } from "@/redux/api/userApi";
import {
  useAssignUserSubscriptionMutation,
  useGetSubscriptionPlansQuery,
} from "@/redux/api/subscriptionApi";

export default function AssignSubscriptionModal({ isOpen, onClose, onAssigned }) {
  const [userSearch, setUserSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedPlanKey, setSelectedPlanKey] = useState("monthly");
  const [customDays, setCustomDays] = useState(30);
  const [transactionId, setTransactionId] = useState("");

  const { data: usersData, isLoading: isUsersLoading } = useGetUsersQuery({
    search: userSearch.trim() || undefined,
    limit: 20,
  });

  const { data: plansData } = useGetSubscriptionPlansQuery();
  const plans = plansData?.data || [];

  const [assignSubscription, { isLoading: isAssigning }] = useAssignUserSubscriptionMutation();

  const users = usersData?.data?.users || (Array.isArray(usersData?.data) ? usersData.data : []);

  const handlePlanChange = (planKey) => {
    setSelectedPlanKey(planKey);
    const plan = plans.find((p) => p.planKey === planKey);
    if (plan && plan.durationDays > 0) {
      setCustomDays(plan.durationDays);
    } else if (planKey === "free") {
      setCustomDays(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserId) {
      toast.error("Please select a user to grant subscription");
      return;
    }

    try {
      await assignSubscription({
        userId: selectedUserId,
        planKey: selectedPlanKey,
        durationDays: Number(customDays),
        transactionId: transactionId.trim() || `MANUAL_GRANT_${Date.now()}`,
      }).unwrap();

      toast.success("Subscription granted successfully to user!");
      if (onAssigned) onAssigned();
      onClose();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to grant subscription");
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title="Grant / Extend User Subscription"
      description="Manually allocate a subscription tier, duration, and full LMS course access to a user account."
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* User Search & Select */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800">
            Find User (Search by Name, Phone, or Email) *
          </label>
          <Input
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            placeholder="Type name, email, or 017... to filter"
            size="sm"
          />

          <div className="mt-2 max-h-40 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/50 p-1.5 space-y-1">
            {isUsersLoading ? (
              <p className="text-xs text-slate-400 p-2 text-center">Searching registered users...</p>
            ) : users.length === 0 ? (
              <p className="text-xs text-slate-400 p-2 text-center">No users match query</p>
            ) : (
              users.map((u) => (
                <div
                  key={u._id}
                  onClick={() => setSelectedUserId(u._id)}
                  className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                    selectedUserId === u._id
                      ? "bg-primary text-white font-bold"
                      : "hover:bg-slate-100 text-slate-800"
                  }`}
                >
                  <div>
                    <span className="font-semibold">{u.fullName || u.userName}</span>
                    <span className={`text-[10px] ml-1.5 ${selectedUserId === u._id ? "text-white/80" : "text-slate-400"}`}>
                      {u.phone || u.email}
                    </span>
                  </div>
                  <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded ${
                    selectedUserId === u._id ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                  }`}>
                    {u.role}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Plan Select */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800">Subscription Tier *</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { key: "monthly", label: "Monthly (30d)" },
              { key: "half_yearly", label: "Half-Yearly (180d)" },
              { key: "yearly", label: "Yearly (365d)" },
              { key: "professional", label: "Dealer / Enterprise" },
              { key: "free", label: "Free / Downgrade" },
            ].map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => handlePlanChange(p.key)}
                className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all cursor-pointer ${
                  selectedPlanKey === p.key
                    ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/20"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Duration (Days) */}
        {selectedPlanKey !== "free" && (
          <Input
            label="Duration in Days (From Today)"
            type="number"
            min="1"
            value={customDays}
            onChange={(e) => setCustomDays(e.target.value)}
            placeholder="30"
            required
          />
        )}

        {/* Reference / Transaction ID */}
        <Input
          label="Internal Reference / Memo (Optional)"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          placeholder="e.g. Bank wire ref #99823 or Office payment"
        />

        {/* Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isAssigning || !selectedUserId}
          >
            {isAssigning ? "Processing..." : "Grant Subscription"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

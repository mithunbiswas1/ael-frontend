// src/app/(dashboard)/admin/users/_components/UserEditModal.jsx
"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { FaUserShield, FaSave } from "react-icons/fa";

const ROLE_OPTIONS = [
  { value: "customer", label: "Customer / Learner" },
  { value: "author", label: "Author / Instructor" },
  { value: "admin", label: "Administrator" },
  { value: "super_admin", label: "Super Administrator" },
];

export default function UserEditModal({
  user,
  isOpen,
  onClose,
  onSave,
  isUpdating,
}) {
  const [formData, setFormData] = useState({
    fullName: "",
    role: "customer",
    is_active: true,
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        role: user.role || "customer",
        is_active: user.is_active !== false,
        email: user.email || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!user) return null;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title={`Edit User: ${user.fullName || user.userName}`}
      description={`System Username: @${user.userName}`}
    >
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Full Name */}
        <Input
          label="Full Name"
          value={formData.fullName}
          onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          placeholder="User's full name"
          required
        />

        {/* Contact Info (Read-only or editable) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="user@example.com"
          />
          <Input
            label="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="01XXXXXXXXX"
          />
        </div>

        {/* Role Selection */}
        <Select
          label="Assigned System Role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          options={ROLE_OPTIONS}
          required
        />

        {/* Active Account Status Toggle */}
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3.5">
          <div>
            <p className="text-xs font-bold text-slate-800">Account Access Status</p>
            <p className="text-[11px] text-slate-500">
              When inactive, the user cannot log in or perform actions.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none cursor-pointer ${
              formData.is_active ? "bg-emerald-600" : "bg-slate-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                formData.is_active ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* Modal Actions */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isUpdating}
            className="gap-2"
          >
            <FaSave className="h-3.5 w-3.5" />
            <span>{isUpdating ? "Saving..." : "Save Changes"}</span>
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

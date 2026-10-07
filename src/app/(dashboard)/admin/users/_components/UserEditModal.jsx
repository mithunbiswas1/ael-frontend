// src/app/(dashboard)/admin/users/_components/UserEditModal.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { FaUserShield, FaSave, FaKey } from "react-icons/fa";
import { useGetRolesQuery } from "@/redux/api/roleApi";

const DEFAULT_ROLE_OPTIONS = [
  { value: "super_admin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "instructor", label: "Instructor" },
  { value: "subscriber", label: "Subscriber" },
  { value: "user", label: "User" },
];

export default function UserEditModal({
  user,
  isOpen,
  onClose,
  onSave,
  isUpdating,
}) {
  const { data: rolesData } = useGetRolesQuery();

  const [formData, setFormData] = useState({
    fullName: "",
    role: "user",
    is_active: true,
    email: "",
    phone: "",
    description: "",
  });

  const availableRoles = [
    ...(rolesData?.data?.map((r) => ({
      value: r.name,
      label: r.label || r.name,
    })) || DEFAULT_ROLE_OPTIONS),
  ];

  if (formData.role && !availableRoles.some((r) => r.value === formData.role)) {
    availableRoles.push({
      value: formData.role,
      label: formData.role.replace(/_/g, " "),
    });
  }

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        role: user.role || "user",
        is_active: user.is_active !== false,
        email: user.email || "",
        phone: user.phone || "",
        description: user.description || user.bio || "",
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

        {/* Description / Bio */}
        <Textarea
          label="Profile Description"
          rows={2}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="User bio or administrative remarks..."
        />

        {/* Subscription Info Card */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3.5 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">Subscription Status</span>
            {user.subscription?.status === "active" ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
                ● Active ({user.subscription.planName || user.subscription.planKey || "Subscriber"})
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                No Active Plan (Free)
              </span>
            )}
          </div>
          {user.subscription?.status === "active" && user.subscription?.expiresAt && (
            <p className="text-[11px] text-slate-500">
              Valid until: {new Date(user.subscription.expiresAt).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Role Selection */}
        <Select
          label="Assigned System Role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          options={availableRoles}
          required
        />

        {/* Granular Page Control Link */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-3 text-xs">
          <span className="text-slate-700 font-medium">
            Granular page access & permissions:
          </span>
          <Link
            href={`/admin/users/${user._id}`}
            className="text-xs font-bold text-primary hover:underline shrink-0"
            onClick={onClose}
          >
            Configure Permissions →
          </Link>
        </div>

        {/* Active Account Status Toggle */}
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3.5">
          <div>
            <p className="text-xs font-bold text-slate-800">Account Access Status</p>
            <p className="text-[11px] text-slate-500">
              When inactive, the user cannot log in or perform actions.
            </p>
          </div>
          <Switch
            checked={Boolean(formData.is_active)}
            onCheckedChange={(val) =>
              setFormData({ ...formData, is_active: val })
            }
          />
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
            isLoading={isUpdating}
            icon={FaSave}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

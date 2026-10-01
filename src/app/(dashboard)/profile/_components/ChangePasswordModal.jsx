// src/app/(dashboard)/profile/_components/ChangePasswordModal.jsx
"use client";

import { useState } from "react";
import { FaKey } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";
import { Dialog, DialogBody, DialogFooter } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { P } from "@/components/ui/Typography";

export default function ChangePasswordModal({
  isOpen,
  onClose,
  onSubmit,
  passwordData,
  setPasswordData,
  isUpdatingPassword,
  isBn,
}) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title={isBn ? "পাসওয়ার্ড পরিবর্তন করুন" : "Change Password"}
    >
      <form onSubmit={onSubmit}>
        <DialogBody className="space-y-4">
          <P className="text-xs text-slate-500">
            {isBn
              ? "আপনার অ্যাকাউন্টের নিরাপত্তা নিশ্চিত করতে শক্তিশালী পাসওয়ার্ড প্রদান করুন (কমপক্ষে ৬ অক্ষর)।"
              : "Create a strong password with at least 6 characters to ensure your account security."}
          </P>

          {/* Current Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {isBn ? "বর্তমান পাসওয়ার্ড *" : "Current Password *"}
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    currentPassword: e.target.value,
                  }))
                }
                required
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 pr-10 text-xs text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-hidden transition-all"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => setShowCurrentPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {isBn ? "নতুন পাসওয়ার্ড *" : "New Password *"}
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    newPassword: e.target.value,
                  }))
                }
                required
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 pr-10 text-xs text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-hidden transition-all"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => setShowNewPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showNewPassword ? (
                  <EyeOff className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              {isBn ? "নতুন পাসওয়ার্ড নিশ্চিত করুন *" : "Confirm New Password *"}
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                required
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 pr-10 text-xs text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-hidden transition-all"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-3.5 w-3.5" />
                ) : (
                  <Eye className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
          >
            <span>{isBn ? "বাতিল" : "Cancel"}</span>
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isUpdatingPassword}
            isLoading={isUpdatingPassword}
            icon={FaKey}
          >
            <span>
              {isUpdatingPassword
                ? isBn
                  ? "পরিবর্তন হচ্ছে..."
                  : "Updating..."
                : isBn
                  ? "পাসওয়ার্ড পরিবর্তন করুন"
                  : "Update Password"}
            </span>
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}

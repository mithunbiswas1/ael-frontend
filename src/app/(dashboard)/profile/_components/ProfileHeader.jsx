// src/app/(dashboard)/profile/_components/ProfileHeader.jsx
"use client";

import { FaUser, FaKey, FaEdit, FaTimes, FaSave, FaGraduationCap } from "react-icons/fa";
import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { AdminPageHeader } from "@/components/ui/AdminPageHeader";

export default function ProfileHeader({
  isBn,
  isEditing,
  setIsEditing,
  onCancel,
  isUpdatingProfile,
  isSubscriberUser,
  onOpenPasswordModal,
}) {
  return (
    <AdminPageHeader
      icon={FaUser}
      title={isBn ? "প্রোফাইল সেটিংস" : "Profile Settings"}
      action={
        <div className="flex items-center gap-2.5">
          {!isEditing ? (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onOpenPasswordModal}
                icon={FaKey}
              >
                <span>{isBn ? "পাসওয়ার্ড পরিবর্তন" : "Change Password"}</span>
              </Button>

              <Button
                type="button"
                variant="primary"
                size="sm"
                onClick={() => setIsEditing(true)}
                icon={FaEdit}
              >
                <span>{isBn ? "সম্পাদনা করুন" : "Edit Profile"}</span>
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onCancel}
                icon={FaTimes}
              >
                <span>{isBn ? "বাতিল" : "Cancel"}</span>
              </Button>

              <Button
                form="profileForm"
                type="submit"
                variant="primary"
                size="sm"
                disabled={isUpdatingProfile}
                isLoading={isUpdatingProfile}
                icon={FaSave}
              >
                <span>{isBn ? "সংরক্ষণ করুন" : "Save Changes"}</span>
              </Button>
            </>
          )}
        </div>
      }
    />
  );
}

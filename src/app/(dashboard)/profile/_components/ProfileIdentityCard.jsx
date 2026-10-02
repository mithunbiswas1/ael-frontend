// src/app/(dashboard)/profile/_components/ProfileIdentityCard.jsx
"use client";

import Image from "next/image";
import {
  FaCamera,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Badge } from "@/components/ui/Badge";
import { H3, P } from "@/components/ui/Typography";

export default function ProfileIdentityCard({
  profile,
  avatarSrc,
  previewUrl,
  isEditing,
  handleFileChange,
  roleInfo,
  memberSince,
  isBn,
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white shadow-2xs overflow-hidden">
      {/* Subtle Header Accent */}
      <div className="h-20 bg-linear-to-r from-slate-100 via-primary/5 to-slate-100 border-b border-slate-100 relative" />

      {/* Avatar & Core Identity */}
      <div className="px-6 pb-6 pt-0">
        <div className="flex items-end justify-between -mt-10 mb-4">
          {/* Avatar */}
          <div className="relative group">
            <div className="relative h-20 w-20 overflow-hidden rounded-2xl border-3 border-white bg-slate-100 shadow-xs">
              <Image
                src={avatarSrc || "/default_person.jpg"}
                alt={profile?.fullName || "Avatar"}
                fill
                className="object-cover"
                unoptimized={Boolean(previewUrl)}
                onError={(e) => {
                  e.currentTarget.src = "/default_person.jpg";
                }}
              />
            </div>

            {isEditing && (
              <label
                htmlFor="profilePhotoInput"
                className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-white hover:bg-secondary transition-all cursor-pointer shadow-xs border-2 border-white"
                title={isBn ? "ছবি আপলোড করুন" : "Upload Photo"}
              >
                <FaCamera className="h-3 w-3" />
                <input
                  id="profilePhotoInput"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>

          {/* Role Badge */}
          <div className="mb-1">
            <Badge
              variant={roleInfo.variant}
              size="sm"
              icon={roleInfo.icon}
            >
              {roleInfo.label}
            </Badge>
          </div>
        </div>

        {/* Name & Tag */}
        <div className="space-y-0.5">
          <H3 className="text-lg font-bold text-slate-900 leading-tight">
            {profile?.fullName || (isBn ? "নাম নেই" : "Unnamed User")}
          </H3>
          <P className="text-xs text-slate-500 font-mono">
            @{profile?.userName || "user"}
          </P>
        </div>

        {/* Contact & Account Attributes */}
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 text-xs text-slate-600">
          <div className="flex items-center gap-2.5">
            <FaEnvelope className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="truncate" title={profile?.email || ""}>
              {profile?.email || (isBn ? "ইমেইল প্রদান করা হয়নি" : "No email")}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <FaPhone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="font-mono font-medium text-slate-800">
              {profile?.phone || (isBn ? "মোবাইল নম্বর নেই" : "No phone")}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <FaCalendarAlt className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span>
              {isBn ? "যুক্ত হয়েছেন: " : "Joined: "}
              <strong className="font-semibold text-slate-700">
                {memberSince}
              </strong>
            </span>
          </div>

          {(profile?.city || profile?.country) && (
            <div className="flex items-center gap-2.5">
              <FaMapMarkerAlt className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>
                {[profile.city, profile.country || "Bangladesh"]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

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
          {profile?.designation && (
            <p className="text-xs font-semibold text-primary pt-0.5">
              {profile.designation}
            </p>
          )}
        </div>

        {/* Bio if exists */}
        {profile?.bio && (
          <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 leading-relaxed italic">
            &ldquo;{profile.bio}&rdquo;
          </div>
        )}

        {/* Social Links if available */}
        {(profile?.website || profile?.linkedin || profile?.twitter || profile?.facebook) && (
          <div className="mt-3 flex items-center gap-2 pt-2 border-t border-slate-100">
            {profile?.website && (
              <a
                href={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`}
                target="_blank"
                rel="noreferrer"
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-primary hover:text-white transition-colors text-xs"
                title="Website"
              >
                🌐
              </a>
            )}
            {profile?.linkedin && (
              <a
                href={profile.linkedin.startsWith("http") ? profile.linkedin : `https://${profile.linkedin}`}
                target="_blank"
                rel="noreferrer"
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0077b5]/10 text-[#0077b5] hover:bg-[#0077b5] hover:text-white transition-colors text-xs font-bold"
                title="LinkedIn"
              >
                in
              </a>
            )}
            {profile?.twitter && (
              <a
                href={profile.twitter.startsWith("http") ? profile.twitter : `https://${profile.twitter}`}
                target="_blank"
                rel="noreferrer"
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-900 hover:text-white transition-colors text-xs font-bold"
                title="Twitter / X"
              >
                𝕏
              </a>
            )}
            {profile?.facebook && (
              <a
                href={profile.facebook.startsWith("http") ? profile.facebook : `https://${profile.facebook}`}
                target="_blank"
                rel="noreferrer"
                className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1877f2]/10 text-[#1877f2] hover:bg-[#1877f2] hover:text-white transition-colors text-xs font-bold"
                title="Facebook"
              >
                f
              </a>
            )}
          </div>
        )}

        {/* View Public Author Page Link */}
        {profile?.userName && (
          <div className="mt-4">
            <a
              href={`/authors/${profile.userName}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl border border-primary/20 bg-primary/5 text-primary text-xs font-bold hover:bg-primary hover:text-white transition-all shadow-2xs"
            >
              <span>{isBn ? "পাবলিক লেখক পেজ দেখুন" : "View Public Author Page"}</span>
              <span>→</span>
            </a>
          </div>
        )}

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

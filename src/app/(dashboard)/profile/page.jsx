// src/app/(dashboard)/profile/page.jsx
"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Image from "next/image";
import { toast } from "sonner";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCity,
  FaEdit,
  FaSave,
  FaTimes,
  FaCamera,
  FaKey,
  FaShieldAlt,
  FaCheckCircle,
  FaGraduationCap,
  FaCalendarAlt,
} from "react-icons/fa";
import { Eye, EyeOff, ShieldCheck, UserCheck } from "lucide-react";

import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
} from "@/redux/api/userApi";
import { updateUser } from "@/redux/slice/authSlice";
import { baseUriBackend } from "@/config/base-url";
import { useDictionary } from "@/context/DictionaryContext";
import { Button } from "@/components/ui/Button";
import { AdminPageHeader } from "@/components/ui/AdminPageHeader";
import { H1, H2, H3, P } from "@/components/ui/Typography";

export default function ProfilePage() {
  const { locale } = useDictionary();
  const isBn = locale === "bn";
  const dispatch = useDispatch();

  const { user: authUser } = useSelector((state) => state.auth);

  // RTK Query: fetch profile
  const {
    data: profileResponse,
    isLoading: isFetchingProfile,
    refetch,
  } = useGetProfileQuery();

  const [updateProfileApi, { isLoading: isUpdatingProfile }] =
    useUpdateProfileMutation();
  const [updatePasswordApi, { isLoading: isUpdatingPassword }] =
    useUpdatePasswordMutation();

  const profile = profileResponse?.data || authUser;

  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Password modal show/hide state
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    userName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    district: "",
    state: "",
    postal_code: "",
    country: "",
    bio: "",
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Sync profile data to form and Redux on load
  useEffect(() => {
    if (profileResponse?.data) {
      const u = profileResponse.data;
      setFormData({
        fullName: u.fullName || "",
        userName: u.userName || "",
        email: u.email || "",
        phone: u.phone || "",
        address: u.address || "",
        city: u.city || "",
        district: u.district || "",
        state: u.state || "",
        postal_code: u.postal_code || "",
        country: u.country || "",
        bio: u.bio || "",
      });

      // Keep Redux auth slice updated
      dispatch(updateUser(u));
    }
  }, [profileResponse, dispatch]);

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle avatar file selection
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle profile update submit
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      let payload;

      if (selectedFile) {
        const fd = new FormData();
        Object.entries(formData).forEach(([key, val]) => {
          if (val !== undefined && val !== null) {
            fd.append(key, val);
          }
        });
        fd.append("profilePhoto", selectedFile);
        payload = fd;
      } else {
        payload = formData;
      }

      const res = await updateProfileApi(payload).unwrap();

      if (res?.data) {
        dispatch(updateUser(res.data));
        toast.success(
          isBn
            ? "প্রোফাইল সফলভাবে আপডেট করা হয়েছে!"
            : "Profile updated successfully!"
        );
        setIsEditing(false);
        setSelectedFile(null);
        setPreviewUrl(null);
        refetch();
      }
    } catch (err) {
      toast.error(
        err?.data?.message ||
          err?.message ||
          (isBn ? "প্রোফাইল আপডেট ব্যর্থ হয়েছে" : "Failed to update profile")
      );
    }
  };

  // Handle password update submit
  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword) {
      toast.error(
        isBn ? "বর্তমান পাসওয়ার্ড প্রদান করুন" : "Current password is required"
      );
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error(
        isBn ? "নতুন পাসওয়ার্ডের মিল নেই" : "New passwords do not match"
      );
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error(
        isBn
          ? "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"
          : "Password must be at least 6 characters long"
      );
      return;
    }

    try {
      const res = await updatePasswordApi({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }).unwrap();

      toast.success(
        res?.message ||
          (isBn
            ? "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!"
            : "Password updated successfully!")
      );

      setIsPasswordModalOpen(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(
        err?.data?.message ||
          err?.message ||
          (isBn ? "পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে" : "Failed to update password")
      );
    }
  };

  // Avatar Image Source calculation
  const getAvatarSrc = () => {
    if (previewUrl) return previewUrl;
    if (profile?.image) {
      if (profile.image.startsWith("http")) return profile.image;
      return `${baseUriBackend}${profile.image.replace(/^\//, "")}`;
    }
    return null;
  };

  // Role Display format
  const formatRole = (role) => {
    switch (role) {
      case "super_admin":
        return isBn ? "সুপার অ্যাডমিন" : "Super Administrator";
      case "admin":
        return isBn ? "অ্যাডমিনিস্ট্রেটর" : "Administrator";
      case "course_admin":
        return isBn ? "কোর্স অ্যাডমিন" : "Course Administrator";
      case "subscriber":
        return isBn ? "সাবস্ক্রাইবার শিক্ষার্থী" : "Certified Subscriber";
      default:
        return isBn ? "সাধারণ ব্যবহারকারী" : "Learner Account";
    }
  };

  if (isFetchingProfile && !profile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <P className="mt-4 text-xs font-semibold text-slate-500">
            {isBn ? "প্রোফাইল লোড হচ্ছে..." : "Loading profile workspace..."}
          </P>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Action Bar */}
      <AdminPageHeader
        icon={FaUser}
        title={isBn ? "ব্যবহারকারী প্রোফাইল" : "Account Profile"}
        description={
          isBn
            ? "আপনার ব্যক্তিগত তথ্য, যোগাযোগ এবং নিরাপত্তা সেটিংস পরিচালনা করুন।"
            : "Manage your personal credentials, contact details, and account security."
        }
        action={
          <div className="flex items-center gap-2.5">
            {!isEditing ? (
              <>
                <Button
                  type="button"
                  variant="primary"
                  size="default"
                  onClick={() => setIsEditing(true)}
                  className="gap-2"
                >
                  <FaEdit className="h-3.5 w-3.5" />
                  <span>{isBn ? "সম্পাদনা করুন" : "Edit Profile"}</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="gap-2"
                >
                  <FaKey className="h-3.5 w-3.5 text-slate-500" />
                  <span>{isBn ? "পাসওয়ার্ড পরিবর্তন" : "Change Password"}</span>
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="default"
                  onClick={() => {
                    setIsEditing(false);
                    setSelectedFile(null);
                    setPreviewUrl(null);
                    if (profile) {
                      setFormData({
                        fullName: profile.fullName || "",
                        userName: profile.userName || "",
                        email: profile.email || "",
                        phone: profile.phone || "",
                        address: profile.address || "",
                        city: profile.city || "",
                        district: profile.district || "",
                        state: profile.state || "",
                        postal_code: profile.postal_code || "",
                        country: profile.country || "",
                        bio: profile.bio || "",
                      });
                    }
                  }}
                  className="gap-2"
                >
                  <FaTimes className="h-3.5 w-3.5" />
                  <span>{isBn ? "বাতিল" : "Cancel"}</span>
                </Button>

                <Button
                  form="profileForm"
                  type="submit"
                  variant="primary"
                  size="default"
                  disabled={isUpdatingProfile}
                  className="gap-2"
                >
                  <FaSave className="h-3.5 w-3.5" />
                  <span>
                    {isUpdatingProfile
                      ? isBn
                        ? "সংরক্ষণ হচ্ছে..."
                        : "Saving..."
                      : isBn
                        ? "সংরক্ষণ করুন"
                        : "Save Changes"}
                  </span>
                </Button>
              </>
            )}
          </div>
        }
      />

      {/* Main Profile Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white">
        {/* Banner with Brand Gradient */}
        <div className="relative h-36 bg-gradient-to-r from-tertiary via-primary to-tertiary p-6 text-white">
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md">
              <ShieldCheck className="h-3.5 w-3.5 text-secondary" />
              <span>{formatRole(profile?.role)}</span>
            </span>
          </div>
        </div>

        {/* Profile Avatar & Header Summary */}
        <div className="relative px-6 pb-6 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 mb-6 pb-6 border-b border-slate-100">
            <div className="flex items-end gap-4">
              {/* Avatar Container */}
              <div className="relative group">
                <div className="relative h-24 w-24 sm:h-28 sm:w-28 overflow-hidden rounded-2xl border-4 border-white bg-slate-100">
                  {getAvatarSrc() ? (
                    <Image
                      src={getAvatarSrc()}
                      alt={profile?.fullName || "User Avatar"}
                      fill
                      className="object-cover"
                      unoptimized={Boolean(previewUrl)}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary text-2xl font-black text-white">
                      {(profile?.fullName || profile?.userName || "U")
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}
                </div>

                {isEditing && (
                  <label
                    htmlFor="avatarInput"
                    className="absolute bottom-1 right-1 flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white hover:bg-primary/90 transition-all cursor-pointer border-2 border-white"
                    title={isBn ? "ছবি পরিবর্তন করুন" : "Upload Photo"}
                  >
                    <FaCamera className="h-3.5 w-3.5" />
                    <input
                      id="avatarInput"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>

              {/* Name & Title */}
              <div className="mb-1">
                <H2 className="text-xl font-black text-slate-900">
                  {profile?.fullName || "AEL User"}
                </H2>
                <P className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <span>@{profile?.userName || "user"}</span>
                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                  <span className="text-primary font-bold">{profile?.phone}</span>
                </P>
              </div>
            </div>

            {/* Quick Status Chips */}
            <div className="flex flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-1.5 rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-1.5 text-slate-600">
                <FaCheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                <span className="font-semibold">
                  {isBn ? "সক্রিয় অ্যাকাউন্ট" : "Verified Account"}
                </span>
              </div>

              {profile?.enrolledCourses?.length > 0 && (
                <div className="flex items-center gap-1.5 rounded-lg border border-slate-100 bg-slate-50/80 px-3 py-1.5 text-slate-600">
                  <FaGraduationCap className="h-3.5 w-3.5 text-primary" />
                  <span className="font-semibold">
                    {profile.enrolledCourses.length}{" "}
                    {isBn ? "কোর্স এনরোল্ড" : "Courses Enrolled"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Profile Form Details */}
          <form id="profileForm" onSubmit={handleUpdateProfile}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isBn ? "পূর্ণ নাম *" : "Full Name *"}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                    placeholder={isBn ? "আপনার নাম" : "Enter your full name"}
                    className={`w-full rounded-lg border px-3.5 py-2.5 text-xs text-slate-900 transition-all ${
                      isEditing
                        ? "bg-white border-slate-300 focus:border-primary focus:outline-hidden"
                        : "bg-slate-50/70 border-slate-200 text-slate-700 cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isBn ? "ব্যবহারকারী নাম (Username) *" : "Username *"}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="userName"
                    value={formData.userName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                    placeholder={isBn ? "ইউজারনেম" : "username"}
                    className={`w-full rounded-lg border px-3.5 py-2.5 text-xs text-slate-900 transition-all ${
                      isEditing
                        ? "bg-white border-slate-300 focus:border-primary focus:outline-hidden"
                        : "bg-slate-50/70 border-slate-200 text-slate-700 cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isBn ? "ইমেইল অ্যাড্রেস" : "Email Address"}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="name@example.com"
                    className={`w-full rounded-lg border px-3.5 py-2.5 text-xs text-slate-900 transition-all ${
                      isEditing
                        ? "bg-white border-slate-300 focus:border-primary focus:outline-hidden"
                        : "bg-slate-50/70 border-slate-200 text-slate-700 cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isBn ? "মোবাইল নম্বর *" : "Mobile Phone *"}
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    required
                    placeholder="+8801XXXXXXXXX"
                    className={`w-full rounded-lg border px-3.5 py-2.5 text-xs text-slate-900 transition-all ${
                      isEditing
                        ? "bg-white border-slate-300 focus:border-primary focus:outline-hidden"
                        : "bg-slate-50/70 border-slate-200 text-slate-700 cursor-not-allowed"
                    }`}
                  />
                </div>
              </div>

              {/* Street Address */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isBn ? "ঠিকানা (Street Address)" : "Street Address"}
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder={
                    isBn
                      ? "বাড়ি, সড়ক, এলাকা..."
                      : "House, Street, Area..."
                  }
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-xs text-slate-900 transition-all ${
                    isEditing
                      ? "bg-white border-slate-300 focus:border-primary focus:outline-hidden"
                      : "bg-slate-50/70 border-slate-200 text-slate-700 cursor-not-allowed"
                  }`}
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isBn ? "শহর" : "City"}
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder={isBn ? "যেমন: ঢাকা" : "e.g. Dhaka"}
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-xs text-slate-900 transition-all ${
                    isEditing
                      ? "bg-white border-slate-300 focus:border-primary focus:outline-hidden"
                      : "bg-slate-50/70 border-slate-200 text-slate-700 cursor-not-allowed"
                  }`}
                />
              </div>

              {/* District */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isBn ? "জেলা" : "District"}
                </label>
                <input
                  type="text"
                  name="district"
                  value={formData.district}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder={isBn ? "যেমন: ঢাকা" : "e.g. Dhaka"}
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-xs text-slate-900 transition-all ${
                    isEditing
                      ? "bg-white border-slate-300 focus:border-primary focus:outline-hidden"
                      : "bg-slate-50/70 border-slate-200 text-slate-700 cursor-not-allowed"
                  }`}
                />
              </div>

              {/* State / Division */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isBn ? "বিভাগ / স্টেট" : "State / Division"}
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder={isBn ? "যেমন: ঢাকা বিভাগ" : "e.g. Dhaka Division"}
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-xs text-slate-900 transition-all ${
                    isEditing
                      ? "bg-white border-slate-300 focus:border-primary focus:outline-hidden"
                      : "bg-slate-50/70 border-slate-200 text-slate-700 cursor-not-allowed"
                  }`}
                />
              </div>

              {/* Postal Code */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isBn ? "পোস্টাল কোড" : "Postal Code"}
                </label>
                <input
                  type="text"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="1205"
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-xs text-slate-900 transition-all ${
                    isEditing
                      ? "bg-white border-slate-300 focus:border-primary focus:outline-hidden"
                      : "bg-slate-50/70 border-slate-200 text-slate-700 cursor-not-allowed"
                  }`}
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isBn ? "দেশ" : "Country"}
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country || "Bangladesh"}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="Bangladesh"
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-xs text-slate-900 transition-all ${
                    isEditing
                      ? "bg-white border-slate-300 focus:border-primary focus:outline-hidden"
                      : "bg-slate-50/70 border-slate-200 text-slate-700 cursor-not-allowed"
                  }`}
                />
              </div>

              {/* Bio / Description */}
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isBn ? "সংক্ষিপ্ত পরিচিতি (Bio)" : "Personal Bio"}
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={3}
                  placeholder={
                    isBn
                      ? "আপনার পেশাগত বা শিক্ষাগত পরিচিতি..."
                      : "Brief description of your background or professional role..."
                  }
                  className={`w-full rounded-lg border px-3.5 py-2.5 text-xs text-slate-900 transition-all resize-none ${
                    isEditing
                      ? "bg-white border-slate-300 focus:border-primary focus:outline-hidden"
                      : "bg-slate-50/70 border-slate-200 text-slate-700 cursor-not-allowed"
                  }`}
                />
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Password Change Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div>
                <H3 className="text-base font-black text-slate-900">
                  {isBn ? "পাসওয়ার্ড পরিবর্তন করুন" : "Change Password"}
                </H3>
                <P className="text-xs text-slate-500 mt-0.5">
                  {isBn
                    ? "আপনার অ্যাকাউন্টের নিরাপত্তা নিশ্চিত করতে শক্তিশালী পাসওয়ার্ড দিন।"
                    : "Create a strong password with at least 6 characters."}
                </P>
              </div>
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <FaTimes className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleUpdatePassword} className="space-y-4">
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
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 pr-10 text-xs text-slate-800 placeholder:text-slate-400 focus:border-primary focus:outline-hidden transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
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
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 pr-10 text-xs text-slate-800 placeholder:text-slate-400 focus:border-primary focus:outline-hidden transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
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
                    className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 pr-10 text-xs text-slate-800 placeholder:text-slate-400 focus:border-primary focus:outline-hidden transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="flex-1 rounded-lg border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  {isBn ? "বাতিল" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingPassword}
                  className="flex-1 rounded-lg bg-primary py-2.5 text-xs font-bold text-white hover:bg-primary/90 transition-all disabled:opacity-60 cursor-pointer"
                >
                  {isUpdatingPassword
                    ? isBn
                      ? "পরিবর্তন হচ্ছে..."
                      : "Updating..."
                    : isBn
                      ? "পাসওয়ার্ড পরিবর্তন করুন"
                      : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

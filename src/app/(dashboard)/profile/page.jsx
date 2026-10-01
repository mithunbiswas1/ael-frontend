// src/app/(dashboard)/profile/page.jsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  FaUser,
  FaUserShield,
  FaGraduationCap,
} from "react-icons/fa";
import { ShieldCheck, CheckCircle2 } from "lucide-react";

import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
} from "@/redux/api/userApi";
import { updateUser } from "@/redux/slice/authSlice";
import { baseUriBackend } from "@/config/base-url";
import { useDictionary } from "@/context/DictionaryContext";
import { P } from "@/components/ui/Typography";

import ProfileHeader from "./_components/ProfileHeader";
import ProfileIdentityCard from "./_components/ProfileIdentityCard";
import ProfileSecurityCard from "./_components/ProfileSecurityCard";
import ProfileCoursesCard from "./_components/ProfileCoursesCard";
import ProfileForm from "./_components/ProfileForm";
import ChangePasswordModal from "./_components/ChangePasswordModal";

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
        country: u.country || "Bangladesh",
        bio: u.bio || "",
      });

      // Keep Redux auth slice updated
      dispatch(updateUser(u));
    } else if (authUser) {
      setFormData({
        fullName: authUser.fullName || "",
        userName: authUser.userName || "",
        email: authUser.email || "",
        phone: authUser.phone || "",
        address: authUser.address || "",
        city: authUser.city || "",
        district: authUser.district || "",
        state: authUser.state || "",
        postal_code: authUser.postal_code || "",
        country: authUser.country || "Bangladesh",
        bio: authUser.bio || "",
      });
    }
  }, [profileResponse, authUser, dispatch]);

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

  // Reset form to latest saved profile
  const handleCancelEdit = () => {
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
        country: profile.country || "Bangladesh",
        bio: profile.bio || "",
      });
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
  const avatarSrc = useMemo(() => {
    if (previewUrl) return previewUrl;
    if (profile?.image) {
      if (profile.image.startsWith("http")) return profile.image;
      return `${baseUriBackend}${profile.image.replace(/^\//, "")}`;
    }
    return null;
  }, [previewUrl, profile?.image]);

  // Role Display format
  const roleInfo = useMemo(() => {
    switch (profile?.role) {
      case "super_admin":
        return {
          label: isBn ? "সুপার অ্যাডমিন" : "Super Admin",
          variant: "primary",
          icon: FaUserShield,
        };
      case "admin":
        return {
          label: isBn ? "অ্যাডমিনিস্ট্রেটর" : "Administrator",
          variant: "primary",
          icon: ShieldCheck,
        };
      case "instructor":
      case "course_admin":
        return {
          label: isBn ? "ইন্সট্রাক্টর" : "Instructor",
          variant: "secondary",
          icon: FaGraduationCap,
        };
      case "subscriber":
        return {
          label: isBn ? "সাবস্ক্রাইবার শিক্ষার্থী" : "Subscriber",
          variant: "success",
          icon: CheckCircle2,
        };
      default:
        return {
          label: isBn ? "সাধারণ ব্যবহারকারী" : "User",
          variant: "default",
          icon: FaUser,
        };
    }
  }, [profile?.role, isBn]);

  // Formatted registration date
  const memberSince = useMemo(() => {
    if (!profile?.createdAt) return isBn ? "তথ্য নেই" : "N/A";
    try {
      return new Date(profile.createdAt).toLocaleDateString(
        isBn ? "bn-BD" : "en-US",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        }
      );
    } catch {
      return isBn ? "তথ্য নেই" : "N/A";
    }
  }, [profile?.createdAt, isBn]);

  if (isFetchingProfile && !profile) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-3 border-primary border-t-transparent" />
          <P className="mt-4 !text-xs font-semibold text-slate-500">
            {isBn ? "প্রোফাইল লোড হচ্ছে..." : "Loading profile workspace..."}
          </P>
        </div>
      </div>
    );
  }

  const isSubscriberUser =
    profile?.role === "subscriber" ||
    (profile?.enrolledCourses && profile.enrolledCourses.length > 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <ProfileHeader
        isBn={isBn}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        onCancel={handleCancelEdit}
        isUpdatingProfile={isUpdatingProfile}
        isSubscriberUser={isSubscriberUser}
        onOpenPasswordModal={() => setIsPasswordModalOpen(true)}
      />

      {/* Main Grid: Left Identity Sidebar + Right Detail Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Identity & Quick Summary */}
        <div className="lg:col-span-4 space-y-6">
          <ProfileIdentityCard
            profile={profile}
            avatarSrc={avatarSrc}
            previewUrl={previewUrl}
            isEditing={isEditing}
            handleFileChange={handleFileChange}
            roleInfo={roleInfo}
            memberSince={memberSince}
            isBn={isBn}
          />

          <ProfileSecurityCard
            isBn={isBn}
            onOpenPasswordModal={() => setIsPasswordModalOpen(true)}
          />

          {isSubscriberUser && profile?.enrolledCourses?.length > 0 && (
            <ProfileCoursesCard
              coursesCount={profile.enrolledCourses.length}
              isBn={isBn}
            />
          )}
        </div>

        {/* RIGHT COLUMN: Profile Form & Details */}
        <div className="lg:col-span-8 space-y-6">
          <ProfileForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleUpdateProfile={handleUpdateProfile}
            handleCancelEdit={handleCancelEdit}
            isEditing={isEditing}
            isUpdatingProfile={isUpdatingProfile}
            isBn={isBn}
          />
        </div>
      </div>

      {/* Change Password Dialog Modal */}
      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={handleUpdatePassword}
        passwordData={passwordData}
        setPasswordData={setPasswordData}
        isUpdatingPassword={isUpdatingPassword}
        isBn={isBn}
      />
    </div>
  );
}

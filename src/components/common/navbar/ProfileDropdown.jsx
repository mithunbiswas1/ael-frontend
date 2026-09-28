// src/components/common/navbar/ProfileDropdown.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  User,
  LayoutDashboard,
  GraduationCap,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { setLogout } from "@/redux/slice/authSlice";

export default function ProfileDropdown({ locale = "en" }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const isBn = locale === "bn";

  // Check role: admin vs subscriber
  const roleName = (typeof user?.role === "string" ? user.role : user?.role?.name || "").toLowerCase();
  const isAdmin = roleName === "admin" || roleName === "super_admin" || roleName === "superadmin";

  // Close on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleLogout = () => {
    dispatch(setLogout());
    setIsOpen(false);
    toast.success(isBn ? "লগআউট সম্পন্ন হয়েছে।" : "Logged out successfully.");
    router.push("/");
  };

  const initials = (user?.fullName || user?.userName || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-8 sm:h-9 items-center gap-2 rounded-lg border border-slate-200/90 bg-white px-2.5 text-xs font-semibold text-slate-800 shadow-2xs hover:border-primary/50 hover:bg-slate-50 transition-all focus:outline-hidden"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-[10px] font-black text-white shadow-2xs">
          {initials}
        </div>
        <span className="hidden sm:inline-block text-xs font-bold text-slate-800 max-w-[90px] truncate">
          {user?.fullName?.split(" ")[0] || user?.userName || "Account"}
        </span>
        <ChevronDown
          className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>

      {/* Simplified Clean Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 z-50 w-56 origin-top-right rounded-xl border border-slate-200/90 bg-white p-1.5 shadow-lg animate-in fade-in zoom-in-95 duration-100">
          {/* User Info Header */}
          <div className="px-3 py-2 border-b border-slate-100 mb-1">
            <div className="text-xs font-bold text-slate-900 truncate">
              {user?.fullName || user?.userName || "User"}
            </div>
            <div className="text-[11px] text-slate-500 truncate">
              {user?.email || (isAdmin ? "Admin" : "Subscriber")}
            </div>
          </div>

          {/* Role-Based Primary Action */}
          {isAdmin ? (
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-primary transition-colors"
            >
              <LayoutDashboard className="h-4 w-4 text-slate-400" />
              <span>{isBn ? "ড্যাশবোর্ড" : "Dashboard"}</span>
            </Link>
          ) : (
            <Link
              href="/subscriber/courses"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-primary transition-colors"
            >
              <GraduationCap className="h-4 w-4 text-slate-400" />
              <span>{isBn ? "আমার কোর্সসমূহ" : "My Courses"}</span>
            </Link>
          )}

          {/* Profile */}
          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 hover:text-primary transition-colors"
          >
            <User className="h-4 w-4 text-slate-400" />
            <span>{isBn ? "প্রোফাইল" : "Profile"}</span>
          </Link>

          {/* Logout */}
          <div className="border-t border-slate-100 mt-1 pt-1">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="h-4 w-4 text-rose-500" />
              <span>{isBn ? "লগআউট" : "Logout"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

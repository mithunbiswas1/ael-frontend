// src/components/shared/AuthModal.jsx
"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaLock,
  FaUser,
  FaEye,
  FaEyeSlash,
  FaArrowRight,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";

import { Dialog, DialogBody } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { H3, P } from "@/components/ui/Typography";
import { useLoginMutation, useRegistrationMutation } from "@/redux/api/authApi";
import { setLogin } from "@/redux/slice/authSlice";
import { useDictionary } from "@/context/DictionaryContext";

export default function AuthModal({
  isOpen = false,
  onClose,
  onSuccess,
  initialTab = "login",
  defaultTab,
}) {
  const dispatch = useDispatch();
  const { locale } = useDictionary();
  const isBn = locale === "bn";

  const [activeTab, setActiveTab] = useState(defaultTab || initialTab || "login");
  const [loginMethod, setLoginMethod] = useState("phone"); // "phone" | "email"
  const [showPassword, setShowPassword] = useState(false);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    phone: "",
    email: "",
    password: "",
  });

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
  });

  const [loginApi, { isLoading: isLoggingIn }] = useLoginMutation();
  const [registerApi, { isLoading: isRegistering }] = useRegistrationMutation();

  // Reset password visibility when tab changes
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowPassword(false);
  };

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    if (loginMethod === "phone" && !loginForm.phone.trim()) {
      toast.error(isBn ? "মোবাইল নম্বর প্রদান করুন" : "Please enter phone number");
      return;
    }
    if (loginMethod === "email" && !loginForm.email.trim()) {
      toast.error(isBn ? "ইমেইল প্রদান করুন" : "Please enter email");
      return;
    }
    if (!loginForm.password) {
      toast.error(isBn ? "পাসওয়ার্ড প্রদান করুন" : "Please enter password");
      return;
    }

    try {
      const payload = {
        password: loginForm.password,
        ...(loginMethod === "phone"
          ? { phone: loginForm.phone.trim() }
          : { email: loginForm.email.trim() }),
      };

      const res = await loginApi(payload).unwrap();

      if (res?.data) {
        dispatch(
          setLogin({
            user: res.data.user,
            token: res.data.accessToken,
          })
        );
        toast.success(
          isBn
            ? `স্বাগতম ${res.data.user?.fullName || "ব্যবহারকারী"}!`
            : `Welcome back ${res.data.user?.fullName || "User"}!`
        );
        onClose?.();
        if (onSuccess) onSuccess(res.data.user);
      }
    } catch (err) {
      toast.error(
        err?.data?.message ||
          err?.message ||
          (isBn
            ? "লগইন ব্যর্থ হয়েছে। তথ্য যাচাই করুন।"
            : "Login failed. Please check credentials.")
      );
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    if (!registerForm.fullName.trim()) {
      toast.error(isBn ? "পূর্ণ নাম প্রদান করুন" : "Full name is required");
      return;
    }
    if (!registerForm.phone.trim()) {
      toast.error(isBn ? "মোবাইল নম্বর প্রদান করুন" : "Phone number is required");
      return;
    }
    if (!registerForm.password || registerForm.password.length < 6) {
      toast.error(
        isBn
          ? "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"
          : "Password must be at least 6 characters"
      );
      return;
    }

    try {
      const userName =
        registerForm.fullName
          .toLowerCase()
          .replace(/\s+/g, "")
          .replace(/[^a-z0-9]/g, "") || `user_${Date.now()}`;

      const payload = {
        userName,
        fullName: registerForm.fullName.trim(),
        phone: registerForm.phone.trim(),
        email: registerForm.email.trim(),
        password: registerForm.password,
        role: "customer",
      };

      const res = await registerApi(payload).unwrap();

      if (res?.success) {
        toast.success(
          isBn
            ? "নিবন্ধন সফল হয়েছে! এখন লগইন হচ্ছে..."
            : "Registration successful! Logging you in..."
        );

        // Auto login after registration
        try {
          const loginRes = await loginApi({
            phone: registerForm.phone.trim(),
            password: registerForm.password,
          }).unwrap();

          if (loginRes?.data) {
            dispatch(
              setLogin({
                user: loginRes.data.user,
                token: loginRes.data.accessToken,
              })
            );
            onClose?.();
            if (onSuccess) onSuccess(loginRes.data.user);
            return;
          }
        } catch (_) {
          // If auto login fails, switch to login tab with prefilled phone
          setActiveTab("login");
          setLoginForm((prev) => ({
            ...prev,
            phone: registerForm.phone,
          }));
        }
      }
    } catch (err) {
      toast.error(
        err?.data?.message ||
          err?.message ||
          (isBn ? "নিবন্ধন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।" : "Registration failed.")
      );
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      title={
        activeTab === "login"
          ? isBn
            ? "অ্যাকাউন্টে লগইন করুন"
            : "Sign In to Your Account"
          : isBn
            ? "নতুন অ্যাকাউন্ট তৈরি করুন"
            : "Create New Account"
      }
      description={
        isBn
          ? "কোর্সে ভর্তি, ক্লাসরুম অ্যাক্সেস ও সার্টিফিকেট পেতে লগইন করুন।"
          : "Sign in or register to access courses, track learning, and earn verified certificates."
      }
    >
      <DialogBody className="p-5 sm:p-6 space-y-5">
        {/* Segmented Tab Switcher */}
        <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1 border border-slate-200/80">
          <Button
            type="button"
            variant={activeTab === "login" ? "primary" : "ghost"}
            size="sm"
            onClick={() => handleTabChange("login")}
            className={`gap-2 transition-all ${
              activeTab === "login"
                ? "shadow-xs"
                : "text-slate-600 hover:text-slate-900 bg-transparent"
            }`}
          >
            <FaSignInAlt className="h-3 w-3" />
            <span>{isBn ? "লগইন" : "Sign In"}</span>
          </Button>

          <Button
            type="button"
            variant={activeTab === "register" ? "primary" : "ghost"}
            size="sm"
            onClick={() => handleTabChange("register")}
            className={`gap-2 transition-all ${
              activeTab === "register"
                ? "shadow-xs"
                : "text-slate-600 hover:text-slate-900 bg-transparent"
            }`}
          >
            <FaUserPlus className="h-3 w-3" />
            <span>{isBn ? "নিবন্ধন" : "Register"}</span>
          </Button>
        </div>

        {/* 1. LOGIN TAB CONTENT */}
        {activeTab === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Phone vs Email Switcher */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant={loginMethod === "phone" ? "secondary" : "outline"}
                size="xs"
                onClick={() => setLoginMethod("phone")}
                className={`flex-1 gap-1.5 ${
                  loginMethod === "phone"
                    ? "border-primary text-primary bg-primary/5 font-bold"
                    : "text-slate-600 border-slate-200"
                }`}
              >
                <FaPhoneAlt className="h-2.5 w-2.5" />
                <span>{isBn ? "মোবাইল লগইন" : "Phone Login"}</span>
              </Button>

              <Button
                type="button"
                variant={loginMethod === "email" ? "secondary" : "outline"}
                size="xs"
                onClick={() => setLoginMethod("email")}
                className={`flex-1 gap-1.5 ${
                  loginMethod === "email"
                    ? "border-primary text-primary bg-primary/5 font-bold"
                    : "text-slate-600 border-slate-200"
                }`}
              >
                <FaEnvelope className="h-2.5 w-2.5" />
                <span>{isBn ? "ইমেইল লগইন" : "Email Login"}</span>
              </Button>
            </div>

            {/* Input: Phone or Email */}
            {loginMethod === "phone" ? (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isBn ? "মোবাইল নম্বর" : "Phone Number"}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3.5 rounded-l-lg border border-r-0 border-slate-200 bg-slate-50 text-slate-600 text-xs font-mono font-bold select-none">
                    +88
                  </span>
                  <input
                    type="tel"
                    value={loginForm.phone}
                    onChange={(e) =>
                      setLoginForm((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    placeholder={isBn ? "০১XXXXXXXXX" : "01XXXXXXXXX"}
                    className="flex-1 rounded-r-lg border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-hidden shadow-2xs"
                  />
                </div>
              </div>
            ) : (
              <Input
                label={isBn ? "ইমেইল অ্যাড্রেস" : "Email Address"}
                required
                type="email"
                placeholder="name@example.com"
                value={loginForm.email}
                onChange={(e) =>
                  setLoginForm((prev) => ({ ...prev, email: e.target.value }))
                }
                prefix={<FaEnvelope className="h-3.5 w-3.5 text-slate-400" />}
              />
            )}

            {/* Input: Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {isBn ? "পাসওয়ার্ড" : "Password"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pr-10 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-hidden shadow-2xs"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 text-slate-400 hover:text-slate-600 rounded-md"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-3.5 w-3.5" />
                  ) : (
                    <FaEye className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="default"
              fullWidth
              disabled={isLoggingIn}
              className="gap-2 shadow-xs font-bold"
            >
              {isLoggingIn ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>{isBn ? "যাচাই হচ্ছে..." : "Signing in..."}</span>
                </>
              ) : (
                <>
                  <span>{isBn ? "লগইন করুন" : "Sign In"}</span>
                  <FaArrowRight className="h-3 w-3" />
                </>
              )}
            </Button>

            {/* Footer switch prompt */}
            <div className="pt-2 text-center text-xs text-slate-500">
              <span>
                {isBn ? "অ্যাকাউন্ট নেই?" : "Don't have an account?"}{" "}
              </span>
              <button
                type="button"
                onClick={() => handleTabChange("register")}
                className="font-bold text-primary hover:underline cursor-pointer"
              >
                {isBn ? "নতুন অ্যাকাউন্ট খুলুন" : "Create one now"}
              </button>
            </div>
          </form>
        )}

        {/* 2. REGISTER TAB CONTENT */}
        {activeTab === "register" && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <Input
              label={isBn ? "পূর্ণ নাম" : "Full Name"}
              required
              type="text"
              placeholder={isBn ? "আপনার পূর্ণ নাম" : "Enter your full name"}
              value={registerForm.fullName}
              onChange={(e) =>
                setRegisterForm((prev) => ({ ...prev, fullName: e.target.value }))
              }
              prefix={<FaUser className="h-3.5 w-3.5 text-slate-400" />}
            />

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {isBn ? "মোবাইল নম্বর" : "Phone Number"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3.5 rounded-l-lg border border-r-0 border-slate-200 bg-slate-50 text-slate-600 text-xs font-mono font-bold select-none">
                  +88
                </span>
                <input
                  type="tel"
                  value={registerForm.phone}
                  onChange={(e) =>
                    setRegisterForm((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder={isBn ? "০১XXXXXXXXX" : "01XXXXXXXXX"}
                  className="flex-1 rounded-r-lg border border-slate-200 bg-white px-3 py-2 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-hidden shadow-2xs"
                />
              </div>
            </div>

            <Input
              label={isBn ? "ইমেইল (ঐচ্ছিক)" : "Email (Optional)"}
              type="email"
              placeholder="name@example.com"
              value={registerForm.email}
              onChange={(e) =>
                setRegisterForm((prev) => ({ ...prev, email: e.target.value }))
              }
              prefix={<FaEnvelope className="h-3.5 w-3.5 text-slate-400" />}
            />

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {isBn ? "পাসওয়ার্ড" : "Password"}{" "}
                <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={registerForm.password}
                  onChange={(e) =>
                    setRegisterForm((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  placeholder={isBn ? "কমপক্ষে ৬ অক্ষর" : "Minimum 6 characters"}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 pr-10 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-primary focus:outline-hidden shadow-2xs"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 h-7 w-7 text-slate-400 hover:text-slate-600 rounded-md"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-3.5 w-3.5" />
                  ) : (
                    <FaEye className="h-3.5 w-3.5" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="default"
              fullWidth
              disabled={isRegistering}
              className="gap-2 shadow-xs font-bold mt-2"
            >
              {isRegistering ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>{isBn ? "নিবন্ধন সম্পন্ন হচ্ছে..." : "Creating account..."}</span>
                </>
              ) : (
                <>
                  <span>{isBn ? "নিবন্ধন সম্পন্ন করুন" : "Complete Registration"}</span>
                  <FaArrowRight className="h-3 w-3" />
                </>
              )}
            </Button>

            {/* Footer switch prompt */}
            <div className="pt-2 text-center text-xs text-slate-500">
              <span>
                {isBn ? "পূর্বেই অ্যাকাউন্ট আছে?" : "Already have an account?"}{" "}
              </span>
              <button
                type="button"
                onClick={() => handleTabChange("login")}
                className="font-bold text-primary hover:underline cursor-pointer"
              >
                {isBn ? "লগইন করুন" : "Sign in here"}
              </button>
            </div>
          </form>
        )}
      </DialogBody>
    </Dialog>
  );
}

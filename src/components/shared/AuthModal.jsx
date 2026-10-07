// src/components/shared/AuthModal.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowRight, Loader2, X } from "lucide-react";

import { Dialog } from "@/components/ui/Dialog";
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

  // false = Login Form, true = Registration Form (Switched via link, NO tabs)
  const [isRegisterView, setIsRegisterView] = useState(
    (defaultTab || initialTab) === "register"
  );

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsRegisterView((defaultTab || initialTab) === "register");
      setShowPassword(false);
      setErrors({});
    }
  }, [isOpen, defaultTab, initialTab]);

  // Login Form State
  const [loginForm, setLoginForm] = useState({
    identifier: "",
    password: "",
  });

  // Registration Form State
  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
  });

  const [loginApi, { isLoading: isLoggingIn }] = useLoginMutation();
  const [registerApi, { isLoading: isRegistering }] = useRegistrationMutation();

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    const rawInput = loginForm.identifier.trim();
    if (!rawInput) {
      newErrors.identifier = isBn
        ? "ইমেইল অথবা মোবাইল নম্বর লিখুন"
        : "Email or phone number is required";
    }

    if (!loginForm.password) {
      newErrors.password = isBn
        ? "পাসওয়ার্ড লিখুন"
        : "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const isEmail = rawInput.includes("@");
      const payload = {
        password: loginForm.password,
        identifier: rawInput,
        ...(isEmail
          ? { email: rawInput.toLowerCase() }
          : { phone: rawInput }),
      };

      const result = await loginApi(payload).unwrap();

      if (result?.data) {
        dispatch(
          setLogin({
            user: result.data.user,
            token: result.data.accessToken,
          })
        );

        toast.success(
          isBn
            ? `স্বাগতম ${result.data.user?.fullName || "ব্যবহারকারী"}!`
            : `Welcome back ${result.data.user?.fullName || "User"}!`
        );

        setLoginForm({ identifier: "", password: "" });
        if (onSuccess) {
          onSuccess(result.data.user);
        } else {
          onClose?.();
        }
      }
    } catch (err) {
      toast.error(
        err?.data?.message ||
        err?.data?.errors?.[0] ||
        (isBn
          ? "লগইন ব্যর্থ হয়েছে। নম্বর/ইমেইল ও পাসওয়ার্ড যাচাই করুন।"
          : "Login failed. Please verify credentials.")
      );
    }
  };

  // Register Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!registerForm.fullName.trim()) {
      newErrors.fullName = isBn ? "পূর্ণ নাম লিখুন" : "Full Name is required";
    }

    const cleanPhone = registerForm.phone.trim().replace(/^(\+88)/, "");
    if (!cleanPhone) {
      newErrors.phone = isBn ? "মোবাইল নম্বর লিখুন" : "Phone number is required";
    } else if (!/^[0-9+]+$/.test(registerForm.phone.trim())) {
      newErrors.phone = isBn
        ? "শুধুমাত্র সংখ্যা লিখুন"
        : "Phone must contain numbers only";
    } else if (cleanPhone.length < 10) {
      newErrors.phone = isBn
        ? "কমপক্ষে ১০ ডিজিটের নম্বর দিন"
        : "Phone must be at least 10 digits";
    }

    if (registerForm.email && !/\S+@\S+\.\S+/.test(registerForm.email.trim())) {
      newErrors.email = isBn
        ? "সঠিক ইমেইল ঠিকানা দিন"
        : "Please enter a valid email address";
    }

    if (!registerForm.password) {
      newErrors.password = isBn ? "পাসওয়ার্ড লিখুন" : "Password is required";
    } else if (registerForm.password.length < 6) {
      newErrors.password = isBn
        ? "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"
        : "Password must be at least 6 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
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
        email: registerForm.email.trim() || undefined,
        password: registerForm.password,
        role: "user",
      };

      const res = await registerApi(payload).unwrap();

      if (res?.success) {
        toast.success(
          isBn
            ? "নিবন্ধন সফল হয়েছে! লগইন করা হচ্ছে..."
            : "Registration successful! Logging in..."
        );

        // Auto login after registration
        try {
          const loginRes = await loginApi({
            identifier: registerForm.phone.trim(),
            password: registerForm.password,
          }).unwrap();

          if (loginRes?.data) {
            dispatch(
              setLogin({
                user: loginRes.data.user,
                token: loginRes.data.accessToken,
              })
            );
            if (onSuccess) {
              onSuccess(loginRes.data.user);
            } else {
              onClose?.();
            }
            return;
          }
        } catch (_) {
          // Fallback to login form with phone prefilled
          setIsRegisterView(false);
          setLoginForm({
            identifier: registerForm.phone,
            password: "",
          });
        }
      }
    } catch (err) {
      toast.error(
        err?.data?.message ||
        (isBn
          ? "নিবন্ধন ব্যর্থ হয়েছে। তথ্য যাচাই করুন।"
          : "Registration failed. Please check credentials.")
      );
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      showCloseButton={false}
    >
      <div className="relative p-6 sm:p-8 bg-white">
        {/* Modal Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer z-10"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {!isRegisterView ? (
          /* ========================================================= */
          /* 1. LOGIN FORM VIEW (Exact Login Page Form Side Design)     */
          /* ========================================================= */
          <div>
            {/* Header */}
            <div className="mb-6 pr-8">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {isBn ? "অ্যাকাউন্টে লগইন করুন" : "Sign In to Your Account"}
              </h2>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Unified Email or Phone Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {isBn ? "ইমেইল অথবা মোবাইল নম্বর *" : "Email or Phone Number *"}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="identifier"
                    value={loginForm.identifier}
                    onChange={handleLoginChange}
                    placeholder={
                      isBn
                        ? "ইমেইল বা ফোন নম্বর (যেমন: name@example.com বা 01XXXXXXXXX)"
                        : "Enter email or phone (e.g. name@example.com or 01XXXXXXXXX)"
                    }
                    className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs focus:border-primary focus:outline-hidden transition-all ${errors.identifier ? "border-rose-500" : "border-slate-300"
                      }`}
                  />
                </div>
                {errors.identifier && (
                  <p className="mt-1 text-[11px] font-medium text-rose-500">
                    {errors.identifier}
                  </p>
                )}
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    {isBn ? "পাসওয়ার্ড *" : "Password *"}
                  </label>
                  <Link
                    href="/reset-password"
                    onClick={onClose}
                    className="text-[11px] font-semibold text-primary hover:underline transition-colors"
                  >
                    {isBn ? "পাসওয়ার্ড ভুলে গেছেন?" : "Forgot Password?"}
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    placeholder="••••••••"
                    className={`w-full rounded-lg border bg-white px-3.5 py-2.5 pr-10 text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs focus:border-primary focus:outline-hidden transition-all ${errors.password ? "border-rose-500" : "border-slate-300"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-[11px] font-medium text-rose-500">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit Button (Matching Login Page) */}
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary/90 transition-all disabled:opacity-60 cursor-pointer active:scale-98"
              >
                <span>
                  {isLoggingIn
                    ? isBn
                      ? "লগইন হচ্ছে..."
                      : "Verifying..."
                    : isBn
                      ? "লগইন করুন"
                      : "Sign In"}
                </span>
                {isLoggingIn ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <ArrowRight className="h-3.5 w-3.5" />
                )}
              </button>
            </form>

            {/* Switch to Registration Link (No Tab - Matches Login Page button/link) */}
            <div className="mt-6 pt-4 border-t border-slate-200 text-center">
              <p className="text-xs text-slate-500">
                {isBn ? "এখনও কোনো অ্যাকাউন্ট নেই? " : "Don't have an account? "}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterView(true);
                    setErrors({});
                  }}
                  className="font-bold text-primary hover:underline transition-colors ml-1 cursor-pointer"
                >
                  {isBn ? "এখানে নিবন্ধন করুন" : "Register here"}
                </button>
              </p>
            </div>
          </div>
        ) : (
          /* ========================================================= */
          /* 2. REGISTRATION FORM VIEW (Switched smoothly, NO tabs)     */
          /* ========================================================= */
          <div>
            {/* Header */}
            <div className="mb-6 pr-8">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {isBn ? "নতুন অ্যাকাউন্ট তৈরি করুন" : "Create an Account"}
              </h2>

            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isBn ? "পূর্ণ নাম *" : "Full Name *"}
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={registerForm.fullName}
                  onChange={handleRegisterChange}
                  placeholder={
                    isBn ? "উদাঃ মোঃ আনোয়ার হোসেন" : "e.g. Md. Anwar Hossain"
                  }
                  className={`w-full rounded-lg border bg-white px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs focus:border-primary focus:outline-hidden transition-all ${errors.fullName ? "border-rose-500" : "border-slate-300"
                    }`}
                />
                {errors.fullName && (
                  <p className="mt-1 text-[11px] font-medium text-rose-500">
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isBn ? "মোবাইল নম্বর *" : "Phone Number *"}
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={registerForm.phone}
                  onChange={handleRegisterChange}
                  placeholder="01XXXXXXXXX"
                  className={`w-full rounded-lg border bg-white px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs focus:border-primary focus:outline-hidden transition-all ${errors.phone ? "border-rose-500" : "border-slate-300"
                    }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-[11px] font-medium text-rose-500">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isBn ? "ইমেইল ঠিকানা (ঐচ্ছিক)" : "Email Address (Optional)"}
                </label>
                <input
                  type="email"
                  name="email"
                  value={registerForm.email}
                  onChange={handleRegisterChange}
                  placeholder="name@example.com"
                  className={`w-full rounded-lg border bg-white px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs focus:border-primary focus:outline-hidden transition-all ${errors.email ? "border-rose-500" : "border-slate-300"
                    }`}
                />
                {errors.email && (
                  <p className="mt-1 text-[11px] font-medium text-rose-500">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isBn ? "পাসওয়ার্ড *" : "Password *"}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={registerForm.password}
                    onChange={handleRegisterChange}
                    placeholder="••••••••"
                    className={`w-full rounded-lg border bg-white px-3.5 py-2 pr-10 text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs focus:border-primary focus:outline-hidden transition-all ${errors.password ? "border-rose-500" : "border-slate-300"
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-[11px] font-medium text-rose-500">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isRegistering}
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary/90 transition-all disabled:opacity-60 cursor-pointer active:scale-98"
              >
                <span>
                  {isRegistering
                    ? isBn
                      ? "নিবন্ধন হচ্ছে..."
                      : "Creating Account..."
                    : isBn
                      ? "নিবন্ধন সম্পন্ন করুন"
                      : "Create Account"}
                </span>
                {isRegistering ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <ArrowRight className="h-3.5 w-3.5" />
                )}
              </button>
            </form>

            {/* Switch back to Login Link (No Tab - Matches Login Page format) */}
            <div className="mt-6 pt-4 border-t border-slate-200 text-center">
              <p className="text-xs text-slate-500">
                {isBn ? "ইতিমধ্যে একটি অ্যাকাউন্ট আছে? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterView(false);
                    setErrors({});
                  }}
                  className="font-bold text-primary hover:underline transition-colors ml-1 cursor-pointer"
                >
                  {isBn ? "লগইন করুন" : "Sign In"}
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
}

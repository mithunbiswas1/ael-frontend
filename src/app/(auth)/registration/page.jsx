// src/app/(auth)/registration/page.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Mail,
  ShieldCheck,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { H3, P } from "@/components/ui/Typography";
import {
  useRegistrationMutation,
  useSendRegistrationOtpMutation,
  useVerifyRegistrationOtpMutation,
} from "@/redux/api/authApi";
import { setLogin } from "@/redux/slice/authSlice";
import { useDictionary } from "@/context/DictionaryContext";

const RegisterForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { locale } = useDictionary();
  const isBn = locale === "bn";

  const [step, setStep] = useState("form"); // "form" | "otp"
  const [otpCode, setOtpCode] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [registration, { isLoading: regLoading }] = useRegistrationMutation();
  const [sendOtp, { isLoading: isSendingOtp }] = useSendRegistrationOtpMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyRegistrationOtpMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = isBn ? "পূর্ণ নাম লিখুন" : "Full Name is required";
    }

    const cleanPhone = formData.phone.trim().replace(/^(\+88)/, "");
    if (!cleanPhone) {
      newErrors.phone = isBn ? "মোবাইল নম্বর লিখুন" : "Phone number is required";
    } else if (!/^[0-9]+$/.test(cleanPhone)) {
      newErrors.phone = isBn ? "শুধুমাত্র সংখ্যা লিখুন" : "Phone must contain numbers only";
    } else if (cleanPhone.length < 10) {
      newErrors.phone = isBn ? "কমপক্ষে ১০ ডিজিটের নম্বর দিন" : "Phone must be at least 10 digits";
    }

    if (!formData.email.trim()) {
      newErrors.email = isBn ? "ইমেইল লিখুন" : "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      newErrors.email = isBn ? "সঠিক ইমেইল ঠিকানা দিন" : "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = isBn ? "পাসওয়ার্ড লিখুন" : "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = isBn ? "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে" : "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Step 1: Send OTP to Email
  const handleInitiateOtp = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await sendOtp({
        email: formData.email.trim(),
        fullName: formData.fullName.trim(),
      }).unwrap();

      toast.success(
        isBn
          ? `ভেরিফিকেশন কোড পাঠানো হয়েছে: ${formData.email}`
          : `Verification code sent to ${formData.email}`
      );
      setStep("otp");
    } catch (err) {
      toast.error(
        err?.data?.message ||
          (isBn ? "ভেরিফিকেশন কোড পাঠাতে ব্যর্থ হয়েছে" : "Failed to send verification code")
      );
    }
  };

  // Step 2: Verify OTP and Register
  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    if (!otpCode || otpCode.trim().length !== 6) {
      toast.error(isBn ? "৬ সংখ্যার ওটিপি কোড লিখুন" : "Please enter the 6-digit code");
      return;
    }

    try {
      // 1. Verify code
      await verifyOtp({
        email: formData.email.trim(),
        otp: otpCode.trim(),
      }).unwrap();

      // 2. Register user
      const userName =
        formData.fullName
          .toLowerCase()
          .replace(/\s+/g, "")
          .replace(/[^a-z0-9]/g, "") || `user_${Date.now()}`;

      const payload = {
        userName,
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: "user",
      };

      const res = await registration(payload).unwrap();

      if (res?.success) {
        toast.success(
          isBn
            ? "ইমেইল ভেরিফাইড ও নিবন্ধন সফল হয়েছে! অনুগ্রহ করে লগইন করুন।"
            : "Email verified & Registration successful! Please login."
        );
        router.push("/login");
      }
    } catch (err) {
      toast.error(
        err?.data?.message ||
          (isBn ? "ভেরিফিকেশন বা নিবন্ধনে সমস্যা হয়েছে" : "Verification or registration failed")
      );
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gray-100 p-4 sm:p-6 overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-600/5 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
          {/* Left: Branding & Benefits Panel */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-between bg-gradient-to-br from-primary via-primary/95 to-slate-900 p-8 text-white">
            <div className="space-y-4">
              <span className="inline-block rounded-md bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                Official Platform
              </span>
              <h2 className="text-2xl font-black tracking-tight leading-tight">
                {isBn
                  ? "নিরাপদ এলপিজি ইকোসিস্টেমে স্বাগতম"
                  : "Join Bangladesh's Premier LPG Safety Portal"}
              </h2>
              <p className="text-xs text-white/80 leading-relaxed">
                {isBn
                  ? "ডিলার, গ্রাহক এবং পেশাদার অপারেটরদের জন্য অনুমোদিত নিরাপত্তা নির্দেশিকা, সার্টিফাইড কোর্স ও রেগুলেটরি নির্দেশিকা।"
                  : "Access national safety directives, accredited LPG training, and verified digital certificates."}
              </p>
            </div>

            <div className="pt-6 border-t border-white/15 text-[11px] text-white/70">
              © {new Date().getFullYear()} AEL SafeLPG Bangladesh.
            </div>
          </div>

          {/* Right: Registration / OTP Form Panel */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center">
            {step === "form" ? (
              <>
                <div className="mb-6">
                  <H3 className="text-xl font-black text-slate-900">
                    {isBn ? "নতুন অ্যাকাউন্ট তৈরি করুন" : "Create an Account"}
                  </H3>
                  <P className="text-xs text-slate-500 mt-1">
                    {isBn
                      ? "ইমেইল ভেরিফিকেশনের মাধ্যমে নিরাপদে আপনার অ্যাকাউন্ট নিবন্ধন করুন।"
                      : "Register securely with instant email verification."}
                  </P>
                </div>

                <form onSubmit={handleInitiateOtp} className="space-y-3.5">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {isBn ? "পূর্ণ নাম *" : "Full Name *"}
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder={isBn ? "আপনার পূর্ণ নাম লিখুন" : "Enter your full name"}
                      className={`w-full rounded-lg border bg-white px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs focus:border-primary focus:outline-hidden transition-all ${
                        errors.fullName ? "border-rose-500" : "border-slate-300"
                      }`}
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-[11px] font-medium text-rose-500">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {isBn ? "মোবাইল নম্বর *" : "Phone Number *"}
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="01XXXXXXXXX"
                      className={`w-full rounded-lg border bg-white px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs focus:border-primary focus:outline-hidden transition-all ${
                        errors.phone ? "border-rose-500" : "border-slate-300"
                      }`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-[11px] font-medium text-rose-500">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {isBn ? "ইমেইল ঠিকানা *" : "Email Address *"}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="user@example.com"
                      className={`w-full rounded-lg border bg-white px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs focus:border-primary focus:outline-hidden transition-all ${
                        errors.email ? "border-rose-500" : "border-slate-300"
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
                        value={formData.password}
                        onChange={handleChange}
                        placeholder={
                          isBn
                            ? "পাসওয়ার্ড লিখুন (কমপক্ষে ৬ অক্ষর)"
                            : "Enter password (min 6 chars)"
                        }
                        className={`w-full rounded-lg border bg-white px-3.5 py-2 pr-10 text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs focus:border-primary focus:outline-hidden transition-all ${
                          errors.password ? "border-rose-500" : "border-slate-300"
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
                    disabled={isSendingOtp}
                    className="w-full mt-3 flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary/90 transition-all disabled:opacity-60 cursor-pointer active:scale-98"
                  >
                    <span>
                      {isSendingOtp
                        ? isBn
                          ? "ভেরিফিকেশন কোড পাঠানো হচ্ছে..."
                          : "Sending Verification Code..."
                        : isBn
                        ? "ইমেইল ভেরিফাই ও নিবন্ধন করুন →"
                        : "Verify Email & Register →"}
                    </span>
                    {!isSendingOtp && <ArrowRight className="h-3.5 w-3.5" />}
                  </button>
                </form>
              </>
            ) : (
              /* Step 2: Email OTP Input Screen */
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-200/80 px-3 py-2 rounded-xl text-xs font-medium">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span>
                    {isBn
                      ? `ভেরিফিকেশন কোড পাঠানো হয়েছে: ${formData.email}`
                      : `A 6-digit verification code has been sent to ${formData.email}`}
                  </span>
                </div>

                <div className="text-center py-2">
                  <Mail className="h-10 w-10 text-primary mx-auto mb-2" />
                  <h3 className="text-base font-bold text-slate-900">
                    {isBn ? "ইমেইল ভেরিফিকেশন কোড" : "Enter Verification Code"}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                    {isBn
                      ? "আপনার ইনবক্স বা স্প্যাম ফোল্ডার চেক করে ৬ সংখ্যার ওটিপি কোডটি লিখুন।"
                      : "Please check your inbox or spam folder for the 6-digit OTP code."}
                  </p>
                </div>

                <form onSubmit={handleVerifyAndRegister} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                      placeholder="••••••"
                      className="w-full text-center tracking-[8px] font-mono text-xl py-3 rounded-xl border border-slate-300 bg-slate-50/60 focus:bg-white focus:border-primary focus:outline-hidden font-bold text-slate-900"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifyingOtp || regLoading}
                    className="w-full flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary/90 transition-all disabled:opacity-60 cursor-pointer active:scale-98"
                  >
                    {isVerifyingOtp || regLoading ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>
                          {isBn
                            ? "যাচাই ও অ্যাকাউন্ট তৈরি হচ্ছে..."
                            : "Verifying & Creating Account..."}
                        </span>
                      </>
                    ) : (
                      <>
                        <span>
                          {isBn ? "ভেরিফাই ও সম্পন্ন করুন" : "Verify & Complete Registration"}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-xs pt-2">
                    <button
                      type="button"
                      onClick={() => setStep("form")}
                      className="text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
                    >
                      {isBn ? "← তথ্য পরিবর্তন করুন" : "← Edit Details"}
                    </button>

                    <button
                      type="button"
                      onClick={handleInitiateOtp}
                      disabled={isSendingOtp}
                      className="flex items-center gap-1 text-primary font-bold hover:underline cursor-pointer"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>{isBn ? "পুনরায় কোড পাঠান" : "Resend Code"}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Back to Login link */}
            <div className="mt-6 pt-4 border-t border-slate-200 text-center">
              <p className="text-xs text-slate-500">
                {isBn
                  ? "ইতিমধ্যে একটি অ্যাকাউন্ট আছে? "
                  : "Already have an account? "}
                <Link
                  href="/login"
                  className="font-bold text-primary hover:underline transition-colors ml-1"
                >
                  {isBn ? "লগইন করুন" : "Sign In"}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;

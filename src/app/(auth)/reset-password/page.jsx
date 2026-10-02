// src/app/(auth)/reset-password/page.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Mail,
  ShieldCheck,
  RotateCcw,
  KeyRound,
  CheckCircle2,
} from "lucide-react";
import { H3, P } from "@/components/ui/Typography";
import {
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from "@/redux/api/authApi";
import { useDictionary } from "@/context/DictionaryContext";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { locale } = useDictionary();
  const isBn = locale === "bn";

  // Steps: "request_otp" | "verify_reset" | "success"
  const [step, setStep] = useState("request_otp");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Resend cooldown timer
  const [resendTimer, setResendTimer] = useState(0);

  const [forgotPassword, { isLoading: isSendingOtp }] =
    useForgotPasswordMutation();
  const [resetPassword, { isLoading: isResetting }] =
    useResetPasswordMutation();

  useEffect(() => {
    let interval;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Step 1: Send OTP to Email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = isBn ? "ইমেইল ঠিকানা লিখুন" : "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(email.trim())) {
      newErrors.email = isBn
        ? "সঠিক ইমেইল ঠিকানা দিন"
        : "Please enter a valid email address";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    try {
      const res = await forgotPassword({ email: email.trim() }).unwrap();
      toast.success(
        res?.message ||
          (isBn
            ? "আপনার ইমেইলে ৬ সংখ্যার ভেরিফিকেশন কোড পাঠানো হয়েছে!"
            : "A 6-digit verification code has been sent to your email!")
      );
      setStep("verify_reset");
      setResendTimer(60);
    } catch (err) {
      toast.error(
        err?.data?.message ||
          (isBn
            ? "কোড পাঠাতে সমস্যা হয়েছে। আপনার ইমেইল যাচাই করুন।"
            : "Failed to send reset code. Please verify your email.")
      );
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    try {
      const res = await forgotPassword({ email: email.trim() }).unwrap();
      toast.success(
        res?.message ||
          (isBn
            ? "নতুন ভেরিফিকেশন কোড পুনরায় পাঠানো হয়েছে!"
            : "New verification code resent successfully!")
      );
      setResendTimer(60);
    } catch (err) {
      toast.error(
        err?.data?.message ||
          (isBn ? "পুনরায় কোড পাঠানো যায়নি" : "Failed to resend code")
      );
    }
  };

  // Step 2: Verify OTP and Set New Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!otp.trim()) {
      newErrors.otp = isBn ? "৬ সংখ্যার কোড লিখুন" : "Enter 6-digit code";
    } else if (otp.trim().length !== 6) {
      newErrors.otp = isBn
        ? "কোড অবশ্যই ৬ সংখ্যার হতে হবে"
        : "Code must be exactly 6 digits";
    }

    if (!newPassword) {
      newErrors.newPassword = isBn
        ? "নতুন পাসওয়ার্ড দিন"
        : "New password is required";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = isBn
        ? "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে"
        : "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = isBn
        ? "পাসওয়ার্ড নিশ্চিত করুন"
        : "Confirm your password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = isBn
        ? "দুইটি পাসওয়ার্ড মেলেনি"
        : "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    try {
      const res = await resetPassword({
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
        confirmPassword,
      }).unwrap();

      toast.success(
        res?.message ||
          (isBn
            ? "পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!"
            : "Password has been successfully reset!")
      );
      setStep("success");
    } catch (err) {
      toast.error(
        err?.data?.message ||
          (isBn
            ? "পাসওয়ার্ড রিসেট ব্যর্থ হয়েছে। কোডটি সঠিক কিনা যাচাই করুন।"
            : "Failed to reset password. Please verify the code.")
      );
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gray-100 p-4 sm:p-6 overflow-hidden">
      {/* Ambient backdrop glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-blue-600/5 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto my-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
          {/* Left: Branding & Security Info Panel */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-between bg-gradient-to-br from-primary via-primary/95 to-slate-900 p-8 text-white">
            <div className="space-y-4">
              <span className="inline-block rounded-md bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
                {isBn ? "নিরাপত্তা প্রোটোকল" : "Security Protocol"}
              </span>
              <H3 className="text-2xl font-black text-white leading-tight">
                {isBn
                  ? "পাসওয়ার্ড পুনরুদ্ধার ও নিরাপত্তা"
                  : "Account Recovery & Password Reset"}
              </H3>
              <P className="text-xs text-white/80 leading-relaxed">
                {isBn
                  ? "আপনার অ্যাকাউন্টের সুরক্ষার জন্য নিবন্ধিত ইমেইলে এককালীন ৬-সংখ্যার যাচাইকরণ কোড পাঠানো হবে।"
                  : "To protect your account integrity, a one-time 6-digit verification code is securely dispatched to your registered email address."}
              </P>
            </div>

            <div className="space-y-3 pt-6 border-t border-white/10 text-xs text-white/75">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>
                  {isBn
                    ? "এনক্রিপ্টেড পাসওয়ার্ড সুরক্ষা"
                    : "End-to-End Encrypted Authentication"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>
                  {isBn
                    ? "১০ মিনিট মেয়াদী ওটিপি কোড"
                    : "Time-Sensitive 10-Minute Security OTP"}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Interactive Form Panel */}
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center bg-white">
            {/* Step 1: Email Form */}
            {step === "request_otp" && (
              <div>
                <div className="mb-6">
                  <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10 text-primary mb-3">
                    <KeyRound className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-black text-slate-900">
                    {isBn ? "পাসওয়ার্ড ভুলে গেছেন?" : "Forgot Password?"}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    {isBn
                      ? "আপনার অ্যাকাউন্টের নিবন্ধিত ইমেইল ঠিকানাটি লিখুন। আমরা একটি ওটিপি কোড পাঠাব।"
                      : "Enter your registered email address and we'll send a 6-digit recovery code."}
                  </p>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {isBn ? "ইমেইল ঠিকানা *" : "Email Address *"}
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
                        }}
                        placeholder="user@example.com"
                        className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs focus:border-primary focus:outline-hidden transition-all ${
                          errors.email ? "border-rose-500" : "border-slate-300"
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-[11px] font-medium text-rose-500">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSendingOtp}
                    className="w-full mt-2 flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary/90 transition-all disabled:opacity-60 cursor-pointer active:scale-98"
                  >
                    <span>
                      {isSendingOtp
                        ? isBn
                          ? "কোড পাঠানো হচ্ছে..."
                          : "Sending Code..."
                        : isBn
                        ? "কোড পাঠান →"
                        : "Send Recovery Code →"}
                    </span>
                    {!isSendingOtp && <ArrowRight className="h-3.5 w-3.5" />}
                  </button>
                </form>

                <div className="mt-6 pt-4 border-t border-slate-200 text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-primary transition-colors"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>{isBn ? "লগইন পৃষ্ঠায় ফিরে যান" : "Back to Sign In"}</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Step 2: OTP and New Password Form */}
            {step === "verify_reset" && (
              <div>
                {/* Email badge indicator */}
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200/80 px-3.5 py-2.5 rounded-xl text-xs text-emerald-800 mb-5">
                  <div className="flex items-center gap-2 truncate">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span className="truncate">
                      {isBn
                        ? `কোড পাঠানো হয়েছে: ${email}`
                        : `Code sent to: ${email}`}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep("request_otp")}
                    className="text-[11px] font-bold text-primary hover:underline ml-2 shrink-0 cursor-pointer"
                  >
                    {isBn ? "পরিবর্তন" : "Change"}
                  </button>
                </div>

                <div className="mb-5">
                  <h2 className="text-xl font-black text-slate-900">
                    {isBn ? "নতুন পাসওয়ার্ড সেট করুন" : "Set New Password"}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    {isBn
                      ? "ইমেইল চেক করে ৬ সংখ্যার কোড এবং আপনার নতুন পাসওয়ার্ড লিখুন।"
                      : "Enter the 6-digit code from your email and create a new password."}
                  </p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-3.5">
                  {/* OTP Code */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {isBn ? "৬ সংখ্যার ওটিপি কোড *" : "6-Digit Verification Code *"}
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => {
                        setOtp(e.target.value);
                        if (errors.otp) setErrors((prev) => ({ ...prev, otp: "" }));
                      }}
                      placeholder={isBn ? "১২৩৪৫৬" : "123456"}
                      className={`w-full rounded-lg border bg-white px-3.5 py-2 text-center text-sm font-mono tracking-widest text-slate-900 placeholder:text-slate-400 shadow-2xs focus:border-primary focus:outline-hidden transition-all ${
                        errors.otp ? "border-rose-500" : "border-slate-300"
                      }`}
                    />
                    {errors.otp && (
                      <p className="mt-1 text-[11px] font-medium text-rose-500">
                        {errors.otp}
                      </p>
                    )}
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {isBn ? "নতুন পাসওয়ার্ড *" : "New Password *"}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          if (errors.newPassword)
                            setErrors((prev) => ({ ...prev, newPassword: "" }));
                        }}
                        placeholder="••••••••"
                        className={`w-full rounded-lg border bg-white px-3.5 py-2 pr-10 text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs focus:border-primary focus:outline-hidden transition-all ${
                          errors.newPassword
                            ? "border-rose-500"
                            : "border-slate-300"
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
                    {errors.newPassword && (
                      <p className="mt-1 text-[11px] font-medium text-rose-500">
                        {errors.newPassword}
                      </p>
                    )}
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {isBn ? "নতুন পাসওয়ার্ড নিশ্চিত করুন *" : "Confirm New Password *"}
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (errors.confirmPassword)
                            setErrors((prev) => ({
                              ...prev,
                              confirmPassword: "",
                            }));
                        }}
                        placeholder="••••••••"
                        className={`w-full rounded-lg border bg-white px-3.5 py-2 pr-10 text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs focus:border-primary focus:outline-hidden transition-all ${
                          errors.confirmPassword
                            ? "border-rose-500"
                            : "border-slate-300"
                        }`}
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
                    {errors.confirmPassword && (
                      <p className="mt-1 text-[11px] font-medium text-rose-500">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Resend Code Link */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-slate-500">
                      {isBn ? "কোড পাননি?" : "Didn't receive the code?"}
                    </span>
                    <button
                      type="button"
                      disabled={resendTimer > 0 || isSendingOtp}
                      onClick={handleResendOtp}
                      className="font-bold text-primary hover:underline disabled:text-slate-400 disabled:no-underline cursor-pointer"
                    >
                      {resendTimer > 0
                        ? `${isBn ? "পুনরায় পাঠান" : "Resend in"} (${resendTimer}s)`
                        : isBn
                        ? "পুনরায় কোড পাঠান"
                        : "Resend Code"}
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isResetting}
                    className="w-full mt-3 flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary/90 transition-all disabled:opacity-60 cursor-pointer active:scale-98"
                  >
                    <span>
                      {isResetting
                        ? isBn
                          ? "পাসওয়ার্ড সেট করা হচ্ছে..."
                          : "Resetting Password..."
                        : isBn
                        ? "পাসওয়ার্ড নিশ্চিত করুন ও লগইন করুন"
                        : "Reset Password & Login"}
                    </span>
                    {!isResetting && <ArrowRight className="h-3.5 w-3.5" />}
                  </button>
                </form>

                <div className="mt-5 pt-4 border-t border-slate-200 text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-primary transition-colors"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>{isBn ? "লগইন পৃষ্ঠায় ফিরে যান" : "Back to Sign In"}</span>
                  </Link>
                </div>
              </div>
            )}

            {/* Step 3: Success Screen */}
            {step === "success" && (
              <div className="text-center py-6">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-4">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  {isBn
                    ? "পাসওয়ার্ড সফলভাবে পরিবর্তন হয়েছে!"
                    : "Password Reset Successful!"}
                </h3>
                <p className="mt-2 text-xs text-slate-500 max-w-sm mx-auto">
                  {isBn
                    ? "আপনার নতুন পাসওয়ার্ড সেট করা হয়েছে। এখন আপনার নতুন পাসওয়ার্ড ব্যবহার করে লগইন করুন।"
                    : "Your account password has been securely updated. You can now sign in using your new credentials."}
                </p>

                <div className="mt-6">
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary/90 transition-all active:scale-98"
                  >
                    <span>{isBn ? "লগইন করুন" : "Sign In Now"}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

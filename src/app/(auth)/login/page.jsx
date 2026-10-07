// src/app/(auth)/login/page.jsx
"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import Link from "next/link";

import { H3, P } from "@/components/ui/Typography";
import { useLoginMutation } from "@/redux/api/authApi";
import { setLogin } from "@/redux/slice/authSlice";
import { useDictionary } from "@/context/DictionaryContext";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { locale } = useDictionary();
  const isBn = locale === "bn";

  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();

  // Validation Schema for unified identifier (email or phone) & password
  const validationSchema = Yup.object().shape({
    identifier: Yup.string()
      .required(isBn ? "ইমেইল অথবা মোবাইল নম্বর লিখুন" : "Email or phone number is required")
      .test(
        "is-valid-email-or-phone",
        isBn ? "সঠিক ইমেইল অথবা মোবাইল নম্বর দিন" : "Enter a valid email or phone number",
        (value) => {
          if (!value) return false;
          const trimmed = value.trim();
          // If contains @, validate email pattern
          if (trimmed.includes("@")) {
            return /\S+@\S+\.\S+/.test(trimmed);
          }
          // Otherwise validate phone pattern (digits only, min 10 digits)
          const cleanPhone = trimmed.replace(/^(\+88)/, "").replace(/^(88)/, "");
          return /^[0-9+]+$/.test(trimmed) && cleanPhone.length >= 10;
        }
      ),
    password: Yup.string()
      .required(isBn ? "পাসওয়ার্ড লিখুন" : "Password is required")
      .min(6, isBn ? "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে" : "Password must be at least 6 characters"),
  });

  const formik = useFormik({
    initialValues: {
      identifier: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const rawInput = values.identifier.trim();
        const isEmail = rawInput.includes("@");
        const payload = {
          password: values.password,
          identifier: rawInput,
          ...(isEmail
            ? { email: rawInput.toLowerCase() }
            : { phone: rawInput }),
        };

        const result = await login(payload).unwrap();

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
          resetForm();

          const userRole = result.data.user?.role;
          if (userRole === "instructor") {
            router.push("/admin/courses");
          } else if (
            userRole === "super_admin" ||
            userRole === "admin" ||
            userRole === "course_admin"
          ) {
            router.push("/admin");
          } else {
            router.push("/user-dashboard");
          }
        }
      } catch (err) {
        toast.error(
          err?.data?.message ||
          err?.data?.errors?.[0] ||
          (isBn ? "লগইন ব্যর্থ হয়েছে। নম্বর/ইমেইল ও পাসওয়ার্ড যাচাই করুন।" : "Login failed. Please verify credentials.")
        );
      }
    },
  });

  return (
    <div className="relative h-screen w-full flex items-center justify-center bg-gray-100 p-4 sm:p-6 overflow-hidden">
      {/* Subtle ambient backdrop glow */}
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
                {isBn ? "সুরক্ষিত পোর্টাল" : "Secure Portal Login"}
              </span>
              <H3 className="text-2xl font-black text-white leading-tight">
                {isBn ? "নিরাপদ এলপিজি অ্যাকাউন্টে প্রবেশ করুন" : "Welcome Back to Safe LPG Portal"}
              </H3>
              <P className="text-xs text-white/80 leading-relaxed">
                {isBn
                  ? "আপনার সার্টিফাইড ট্রেনিং কোর্স, পরীক্ষা, সনদপত্র এবং নিরাপত্তা প্রটোকল অ্যাক্সেস করতে লগইন করুন।"
                  : "Access your certified safety training courses, assessment quizzes, verified certificates, and regulatory updates."}
              </P>
            </div>

            <div className="space-y-3 pt-6 border-t border-white/10 text-xs text-white/75">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>{isBn ? "১০০% ভেরিফাইড সনদপত্র" : "100% Verified Digital Certification"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>{isBn ? "অন-ডিমান্ড এইচডি ভিডিও ক্লাস" : "On-Demand Interactive HD Lessons"}</span>
              </div>
            </div>
          </div>

          {/* Right: Login Form Panel */}
          <div className="lg:col-span-7 p-5 sm:p-6 lg:py-7 lg:px-8 flex flex-col justify-center bg-white">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-xl font-black text-slate-900">
                {isBn ? "অ্যাকাউন্টে লগইন করুন" : "Sign In to Your Account"}
              </h2>
            </div>

            {/* Form */}
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              {/* Unified Email or Phone Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {isBn ? "ইমেইল অথবা মোবাইল নম্বর *" : "Email or Phone Number *"}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="identifier"
                    value={formik.values.identifier}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder={
                      isBn
                        ? "ইমেইল বা ফোন নম্বর (যেমন: name@example.com বা 01XXXXXXXXX)"
                        : "Enter email or phone (e.g. name@example.com or 01XXXXXXXXX)"
                    }
                    className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs focus:border-primary focus:outline-hidden transition-all ${formik.touched.identifier && formik.errors.identifier
                        ? "border-rose-500"
                        : "border-slate-300"
                      }`}
                  />
                </div>
                {formik.touched.identifier && formik.errors.identifier && (
                  <p className="mt-1 text-[11px] font-medium text-rose-500">
                    {formik.errors.identifier}
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
                    className="text-[11px] font-semibold text-primary hover:underline transition-colors"
                  >
                    {isBn ? "পাসওয়ার্ড ভুলে গেছেন?" : "Forgot Password?"}
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="••••••••"
                    className={`w-full rounded-lg border bg-white px-3.5 py-2.5 pr-10 text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs focus:border-primary focus:outline-hidden transition-all ${formik.touched.password && formik.errors.password
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
                {formik.touched.password && formik.errors.password && (
                  <p className="mt-1 text-[11px] font-medium text-rose-500">
                    {formik.errors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary/90 transition-all disabled:opacity-60 cursor-pointer active:scale-98"
              >
                <span>
                  {isLoading
                    ? isBn
                      ? "লগইন হচ্ছে..."
                      : "Verifying..."
                    : isBn
                      ? "লগইন করুন"
                      : "Sign In"}
                </span>
                {!isLoading && <ArrowRight className="h-3.5 w-3.5" />}
              </button>
            </form>

            {/* Registration Link */}
            <div className="mt-6 pt-4 border-t border-slate-200 text-center">
              <p className="text-xs text-slate-500">
                {isBn ? "এখনও কোনো অ্যাকাউন্ট নেই? " : "Don't have an account? "}
                <Link
                  href="/registration"
                  className="font-bold text-primary hover:underline transition-colors ml-1"
                >
                  {isBn ? "এখানে নিবন্ধন করুন" : "Register here"}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

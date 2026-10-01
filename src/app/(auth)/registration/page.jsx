// src/app/(auth)/registration/page.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { H3, P } from "@/components/ui/Typography";
import { useRegistrationMutation } from "@/redux/api/authApi";
import { useDictionary } from "@/context/DictionaryContext";

const RegisterForm = () => {
  const router = useRouter();
  const { locale } = useDictionary();
  const isBn = locale === "bn";

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [registration, { isLoading: regLoading }] = useRegistrationMutation();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
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
            ? "নিবন্ধন সফল হয়েছে! লগইন করুন।"
            : "Registration successful! Please login to continue."
        );
        setFormData({
          fullName: "",
          phone: "",
          email: "",
          password: "",
        });
        router.push("/login");
      } else {
        if (res?.errors && Array.isArray(res.errors)) {
          res.errors.forEach((errorMessage) => toast.error(errorMessage));
        }
      }
    } catch (err) {
      toast.error(
        err?.data?.message ||
          err?.message ||
          (isBn ? "কিছু ভুল হয়েছে। আবার চেষ্টা করুন।" : "Something went wrong")
      );
    }
  };

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
                {isBn ? "নিরাপত্তা ও শিক্ষা" : "Safety & LMS Registry"}
              </span>
              <H3 className="text-2xl font-black text-white leading-tight">
                {isBn ? "নিরাপদ এলপিজি একাডেমিতে যোগ দিন!" : "Join Safe LPG Academy Today!"}
              </H3>
              <P className="text-xs text-white/80 leading-relaxed">
                {isBn
                  ? "বাংলাদেশের জাতীয় এলপিজি সুরক্ষা ও কারিগরি শিক্ষা প্ল্যাটফর্মে অংশ নিয়ে সার্টিফাইড প্রফেশনাল হিসেবে গড়ে উঠুন।"
                  : "Join Bangladesh's Premier LPG Safety & Technical Learning Platform and become a certified professional."}
              </P>
            </div>

            <div className="space-y-3 pt-6 border-t border-white/10 text-xs text-white/75">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>{isBn ? "১০০% ভেরিফাইড সনদপত্র" : "100% Verified Digital Certification"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>{isBn ? "অনুমোদিত এলএমএস মডিউল" : "Government Approved Modules"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>{isBn ? "জরুরি দুর্ঘটনা রিপোর্টিং রেজিস্ট্রি" : "Incident Reporting Registry"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>{isBn ? "২৪/৭ জরুরি নিরাপত্তা নোটিফিকেশন" : "24/7 National Safety Alerts"}</span>
              </div>
            </div>
          </div>

          {/* Right: Registration Form Panel */}
          <div className="lg:col-span-7 p-5 sm:p-6 lg:py-7 lg:px-8 flex flex-col justify-center bg-white">
            {/* Header */}
            <div className="mb-5">
              <h2 className="text-xl font-black text-slate-900">
                {isBn ? "নতুন অ্যাকাউন্ট তৈরি করুন" : "Create Your Account"}
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {isBn
                  ? "আপনার সঠিক তথ্য দিয়ে নিচের ফরমটি পূরণ করুন।"
                  : "Fill in your details below to register your account."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {isBn ? "পূর্ণ নাম *" : "Full Name *"}
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder={isBn ? "আপনার পূর্ণ নাম লিখুন" : "Enter full name"}
                  className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs focus:border-primary focus:outline-hidden transition-all ${
                    errors.fullName ? "border-rose-500" : "border-slate-300"
                  }`}
                />
                {errors.fullName && (
                  <p className="mt-1 text-[11px] font-medium text-rose-500">
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* Phone Number with +88 prefix */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {isBn ? "মোবাইল নম্বর *" : "Phone Number *"}
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3.5 rounded-l-lg border border-r-0 border-slate-300 bg-slate-100 text-slate-700 text-xs font-semibold select-none font-mono">
                    +88
                  </span>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder={isBn ? "০১XXXXXXXXX" : "01XXXXXXXXX"}
                    className={`flex-1 rounded-r-lg border bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs focus:border-primary focus:outline-hidden transition-all ${
                      errors.phone ? "border-rose-500" : "border-slate-300"
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-[11px] font-medium text-rose-500">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  {isBn ? "ইমেইল অ্যাড্রেস *" : "Email Address *"}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs focus:border-primary focus:outline-hidden transition-all ${
                    errors.email ? "border-rose-500" : "border-slate-300"
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-[11px] font-medium text-rose-500">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password with Eye Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    {isBn ? "পাসওয়ার্ড *" : "Password *"}
                  </label>
                </div>
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
                    className={`w-full rounded-lg border bg-white px-3.5 py-2.5 pr-10 text-xs text-slate-900 placeholder:text-slate-400 shadow-2xs focus:border-primary focus:outline-hidden transition-all ${
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
                disabled={regLoading}
                className="w-full mt-2 flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-xs font-bold text-white shadow-md hover:bg-primary/90 transition-all disabled:opacity-60 cursor-pointer active:scale-98"
              >
                <span>
                  {regLoading
                    ? isBn
                      ? "অ্যাকাউন্ট তৈরি হচ্ছে..."
                      : "Creating Account..."
                    : isBn
                      ? "অ্যাকাউন্ট তৈরি করুন"
                      : "Create Account"}
                </span>
                {!regLoading && <ArrowRight className="h-3.5 w-3.5" />}
              </button>
            </form>

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

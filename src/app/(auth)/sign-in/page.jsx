// src/app/(auth)/sign-in/page.jsx

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  useSendOtpMutation,
  useOtpVerifyLoginMutation,
} from "@/redux/api/authApi";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useDictionary } from "@/context/DictionaryContext";

const SignInForm = () => {
  const router = useRouter();
  const { locale } = useDictionary();
  const isBn = locale === "bn";

  const [formData, setFormData] = useState({
    mobile: "",
    otp: "",
  });

  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);

  const [sendOtp, { isLoading: otpLoading }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: verifyLoading }] = useOtpVerifyLoginMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validation
  const validate = () => {
    const newErrors = {};
    if (!formData.mobile) {
      newErrors.mobile = isBn
        ? "মোবাইল নম্বর প্রদান করা আবশ্যক"
        : "Mobile number is required";
    }
    if (otpSent && !formData.otp) {
      newErrors.otp = isBn ? "ওটিপি প্রদান করা আবশ্যক" : "OTP is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      // STEP 1: SEND OTP
      if (!otpSent) {
        const res = await sendOtp({ phone: formData.mobile }).unwrap();

        if (res.success) {
          toast.success(
            isBn ? "ওটিপি সফলভাবে পাঠানো হয়েছে!" : "OTP sent successfully!"
          );
          setOtpSent(true);
        } else {
          toast.error(
            res?.errors?.[0] ||
              (isBn ? "ওটিপি পাঠাতে ব্যর্থ হয়েছে" : "Failed to send OTP")
          );
        }
      }
      // STEP 2: VERIFY OTP
      else {
        const res = await verifyOtp({
          phone: formData.mobile,
          otp: formData.otp,
        }).unwrap();

        // Save token and user
        localStorage.setItem("accessToken", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));

        window.dispatchEvent(new Event("login"));

        toast.success(
          isBn
            ? `স্বাগতম ${res.user?.name || "ব্যবহারকারী"}!`
            : `Welcome back ${res.user?.name || "User"}!`
        );

        setFormData({ mobile: "", otp: "" });
        router.push("/");
      }
    } catch (err) {
      toast.error(
        err?.data?.errors?.[0] ||
          err?.data?.message ||
          (isBn ? "কিছু ভুল হয়েছে" : "Something went wrong")
      );
    }
  };

  return (
    <div className="p-4 py-12">
      {/* Mobile promo panel */}
      <div className="block lg:hidden bg-primary text-gray-50 px-4 py-8 rounded-md max-w-3xl mx-auto mb-4">
        <h2 className="text-2xl font-semibold mb-2">
          {isBn ? "স্বাগতম!" : "Welcome Back!"}
        </h2>
        <p className="text-gray-100 text-sm">
          {isBn
            ? "চলিয়ে যেতে আপনার মোবাইল নম্বর দিয়ে লগইন করুন"
            : "Login with your mobile number to continue"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center lg:max-w-3xl mx-auto p-4 bg-gray-50 lg:min-h-140 shadow border border-gray-200 lg:rounded-xl">
        {/* Desktop promo panel */}
        <div className="hidden lg:block lg:col-span-2 lg:h-full bg-primary text-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">
            {isBn ? "সহজ ওটিপি লগইন" : "Fast OTP Login"}
          </h2>
          <p className="text-blue-100 text-xs leading-relaxed">
            {isBn
              ? "পাসওয়ার্ড ভুলে গেছেন? সরাসরি আপনার ফোনে ওটিপি কোড পাঠিয়ে তাৎক্ষণিকভাবে লগইন করুন।"
              : "Forgot your password? Receive an instant secure SMS OTP to access your learning portal."}
          </p>
        </div>

        {/* Right form panel */}
        <div className="lg:col-span-3 lg:pr-4 lg:py-10">
          <form onSubmit={handleSubmit} className="space-y-4 py-4 lg:py-0">
            {/* Mobile input with +88 */}
            <div className="flex flex-col">
              <label className="text-gray-700 font-medium mb-1 text-xs">
                {isBn ? "মোবাইল নম্বর" : "Mobile Number"}
              </label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-100 text-gray-700 text-xs font-mono">
                  +88
                </span>
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder={isBn ? "০১XXXXXXXXX লিখুন" : "Enter Mobile Number"}
                  className={`flex-1 border border-gray-300 rounded-r-md px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary ${
                    errors.mobile ? "border-red-500" : ""
                  }`}
                />
              </div>
              {errors.mobile && (
                <p className="text-red-500 text-[11px] mt-1">{errors.mobile}</p>
              )}
            </div>

            {/* OTP Field (only after send) */}
            {otpSent && (
              <div className="flex flex-col">
                <label className="text-gray-700 font-medium mb-1 text-xs">
                  {isBn ? "ওটিপি কোড" : "OTP Code"}
                </label>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder={isBn ? "৬ সংখ্যার ওটিপি লিখুন" : "Enter OTP"}
                  className={`border border-gray-300 rounded-md px-4 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary ${
                    errors.otp ? "border-red-500" : ""
                  }`}
                />
                {errors.otp && (
                  <p className="text-red-500 text-[11px] mt-1">{errors.otp}</p>
                )}
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={otpLoading || verifyLoading}
              className={`w-full bg-primary text-gray-50 py-3 rounded-md font-semibold text-xs hover:bg-primary/90 transition shadow-xs ${
                otpLoading || verifyLoading
                  ? "opacity-70 cursor-not-allowed"
                  : ""
              }`}
            >
              {!otpSent
                ? otpLoading
                  ? isBn ? "ওটিপি পাঠানো হচ্ছে..." : "Sending OTP..."
                  : isBn ? "ওটিপি পাঠান →" : "Send OTP →"
                : verifyLoading
                  ? isBn ? "যাচাই করা হচ্ছে..." : "Verifying..."
                  : isBn ? "যাচাই করে লগইন করুন →" : "Verify & Login →"}
            </button>
          </form>

          <Link href="/login" className="block text-xs text-gray-500 mt-5">
            {isBn ? "পাসওয়ার্ড দিয়ে লগইন করতে চান? " : "Already registered manually? "}
            <span className="text-primary underline cursor-pointer">
              {isBn ? "পাসওয়ার্ড দিয়ে লগইন" : "Login with password"}
            </span>
          </Link>

          <Link
            href="/registration"
            className="block text-xs text-gray-500 mt-2"
          >
            {isBn ? "নতুন অ্যাকাউন্ট তৈরি করতে চান? " : "Want to register manually? "}
            <span className="text-primary underline cursor-pointer">
              {isBn ? "নিবন্ধন করুন" : "Register"}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;

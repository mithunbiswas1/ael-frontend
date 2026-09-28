// src/app/(auth)/otp-verify/page.jsx

"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";
import Link from "next/link";
import { toast } from "sonner";
import { useDictionary } from "@/context/DictionaryContext";

const OtpPage = () => {
  const { locale } = useDictionary();
  const isBn = locale === "bn";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setOtp(e.target.value);
    if (error) setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!otp) {
      setError(isBn ? "ওটিপি প্রদান করা আবশ্যক" : "OTP is required");
      return;
    }

    if (otp.length !== 6) {
      setError(isBn ? "ওটিপি অবশ্যই ৬ সংখ্যার হতে হবে" : "OTP must be 6 digits");
      return;
    }

    toast.success(
      isBn ? "ওটিপি সফলভাবে যাচাই হয়েছে!" : "OTP successfully verified!"
    );
  };

  const handleResend = () => {
    toast.info(
      isBn
        ? "নতুন ওটিপি কোড আপনার ফোনে পাঠানো হয়েছে।"
        : "A new OTP code has been sent to your phone."
    );
  };

  return (
    <div className="p-4 py-16">
      <div className="max-w-md mx-auto my-12 p-6 bg-white shadow-lg border border-slate-200 rounded-xl">
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          {isBn ? "ওটিপি কোড লিখুন" : "Enter OTP Code"}
        </h2>
        <p className="text-slate-500 text-xs mb-6">
          {isBn
            ? "আপনার মোবাইল নম্বরে পাঠানো ৬ সংখ্যার ওটিপি কোডটি লিখুন"
            : "Enter the 6-digit OTP sent to your registered mobile number"}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={isBn ? "ওটিপি" : "OTP"}
            name="otp"
            value={otp}
            onChange={handleChange}
            placeholder={isBn ? "৬ সংখ্যার ওটিপি লিখুন" : "Enter 6-digit OTP"}
            error={error}
            type="text"
            maxLength={6}
          />

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg text-xs font-bold hover:bg-primary/90 transition shadow-xs"
          >
            {isBn ? "ওটিপি যাচাই করুন →" : "Verify OTP →"}
          </button>
        </form>

        <div className="flex justify-between mt-6 text-xs text-slate-500 border-t border-slate-100 pt-4">
          <span>
            {isBn ? "কোড পাননি? " : "Didn't receive the OTP? "}
            <button
              type="button"
              onClick={handleResend}
              className="text-primary font-bold hover:underline"
            >
              {isBn ? "পুনরায় পাঠান" : "Resend"}
            </button>
          </span>
          <Link
            href="/sign-in"
            className="text-primary font-medium hover:underline cursor-pointer"
          >
            {isBn ? "নম্বর পরিবর্তন" : "Change Number"}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OtpPage;

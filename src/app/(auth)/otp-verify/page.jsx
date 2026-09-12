// src/app/(auth)/otp-verify/page.jsx
import OtpVerifyContent from "./_client/OtpVerifyContent";

export const metadata = {
  title: "OTP Verification | Safe LPG Bangladesh",
  description: "Verify your one-time password to complete sign in.",
};

export default function OtpVerifyPage() {
  return <OtpVerifyContent />;
}

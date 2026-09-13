// src/app/(auth)/login/page.jsx

"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { FaPhone, FaLock } from "react-icons/fa";
import Link from "next/link";

import { H3, P } from "@/components/ui/Typography";
import { useLoginMutation } from "@/redux/api/authApi";
import { setLogin } from "@/redux/slice/authSlice";

// ==================== Validation Schema ====================
const loginSchema = Yup.object({
  phone: Yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]+$/, "Phone number must contain only digits")
    .min(10, "Phone number must be at least 10 digits"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

// ==================== Login Page ====================
export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();

  const formik = useFormik({
    initialValues: {
      phone: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const result = await login({
          phone: values.phone,
          password: values.password,
        }).unwrap();

        if (result?.data) {
          dispatch(
            setLogin({
              user: result.data.user,
              token: result.data.accessToken,
            }),
          );

          toast.success(
            `Welcome back ${result.data.user?.fullName || "User"}!`,
          );
          resetForm();
          router.push("/");
        }
      } catch (err) {
        toast.error(
          err?.data?.message ||
            err?.data?.errors?.[0] ||
            "Login failed. Please try again.",
        );
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Mobile promo panel */}
        <div className="block lg:hidden bg-white border border-gray-200 text-gray-800 px-4 py-8 rounded-md mb-6">
          <H3 color="dark" className="mb-4">
            Welcome Back!
          </H3>
          <P color="muted">Login with your phone number to continue</P>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center lg:max-w-3xl mx-auto p-4 lg:p-6 bg-white border border-gray-200 rounded-xl">
          {/* Desktop promo panel */}
          <div className="hidden lg:block lg:col-span-2 lg:h-full bg-linear-to-br from-primary to-primary/90 text-white p-8 rounded-lg">
            <H3 color="white" className="mb-6">
              Welcome Back!
            </H3>
            <P color="white">Login with your phone number to continue</P>
          </div>

          {/* Form panel */}
          <div className="lg:col-span-3 lg:pr-4 lg:py-4">
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              {/* Phone Input */}
              <div>
                <label className="text-gray-700 font-medium mb-1 flex items-center gap-2">
                  <FaPhone className="h-4 w-4 text-primary" />
                  Phone Number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-600">
                    +88
                  </span>
                  <input
                    type="text"
                    name="phone"
                    value={formik.values.phone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter Phone Number"
                    className={`flex-1 bg-white border ${
                      formik.touched.phone && formik.errors.phone
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-r-md px-4 py-2.5 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all`}
                  />
                </div>
                {formik.touched.phone && formik.errors.phone && (
                  <P color="danger" className="text-xs mt-1">
                    {formik.errors.phone}
                  </P>
                )}
              </div>

              {/* Password Input */}
              <div>
                <label className="text-gray-700 font-medium mb-1 flex items-center gap-2">
                  <FaLock className="h-4 w-4 text-primary" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter Password"
                    className={`w-full bg-white border ${
                      formik.touched.password && formik.errors.password
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md px-4 py-2.5 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all pr-10`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                    )}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <P color="danger" className="text-xs mt-1">
                    {formik.errors.password}
                  </P>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full bg-primary hover:bg-secondary text-white font-semibold py-3 rounded-lg transition-all duration-300 ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Logging in..." : "Login →"}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-5">
              <P color="muted" className="text-center text-sm">
                Don't have an account?{" "}
                <Link
                  href="/registration"
                  className="text-primary hover:text-secondary underline transition-colors"
                >
                  Register
                </Link>
              </P>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

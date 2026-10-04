// src/redux/features/authApi.js

import { apiSlice } from "@/redux/api-slice/api-slice";
import { endpoints } from "@/redux/endpoints/endpoints";

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // Registration API
    registration: builder.mutation({
      query: (data) => ({
        url: endpoints.auth.registration,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [],
    }),

    // Login API
    login: builder.mutation({
      query: (data) => ({
        url: endpoints.auth.login,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Permissions", "Auth", "Profile", "Users", "Roles"],
    }),

    // Send OTP
    sendOtp: builder.mutation({
      query: (data) => ({
        url: endpoints.auth.sendOtp,
        method: "POST",
        body: data,
      }),
    }),

    // Verify OTP Login
    otpVerifyLogin: builder.mutation({
      query: (data) => ({
        url: endpoints.auth.otpVerifyLogin,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Permissions", "Auth", "Profile", "Users", "Roles"],
    }),

    // Send Registration OTP via Email
    sendRegistrationOtp: builder.mutation({
      query: (data) => ({
        url: endpoints.auth.sendRegistrationOtp,
        method: "POST",
        body: data,
      }),
    }),

    // Verify Registration OTP
    verifyRegistrationOtp: builder.mutation({
      query: (data) => ({
        url: endpoints.auth.verifyRegistrationOtp,
        method: "POST",
        body: data,
      }),
    }),

    // Send Forgot Password OTP via Email
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: endpoints.auth.forgotPassword,
        method: "POST",
        body: data,
      }),
    }),

    // Reset Password with OTP
    resetPassword: builder.mutation({
      query: (data) => ({
        url: endpoints.auth.resetPassword,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useRegistrationMutation,
  useLoginMutation,
  useSendOtpMutation,
  useOtpVerifyLoginMutation,
  useSendRegistrationOtpMutation,
  useVerifyRegistrationOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;

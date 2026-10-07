// src/redux/apiSlice/apiSlice.js

import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "@/config/base-url";

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    }
    return headers;
  },
});

// CUSTOM BASE QUERY WITH AUTH HANDLING
const baseQueryWithAuth = async (args, api, extraOptions) => {
  try {
    const result = await baseQuery(args, api, extraOptions);

    // HANDLE UNAUTHENTICATED ERROR
    if (result?.error) {
      const status = result.error.status;
      const data = result.error.data;

      if (status === 401 || data?.error === "Unauthenticated.") {
        // remove token
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
        }

        // redirect only if on client side and not already on auth pages
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.startsWith("/login") &&
          !window.location.pathname.startsWith("/registration")
        ) {
          window.location.href = "/login";
        }
      }
    }

    return result;
  } catch (err) {
    return {
      error: {
        status: "FETCH_ERROR",
        error: err?.message || String(err),
      },
    };
  }
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
  tagTypes: [
    "Product",
    "Setting",
    "Slider",
    "Category",
    "Auth",
    "Profile",
    "Users",
    "Orders",
    "ProductReviews",
    "Tracking",
    "Blogs",
    "BlogCategories",
    "Roles",
    "Permissions",
    "Courses",
    "Quizzes",
    "Certificates",
    "Pages",
    "ContactMessages",
    "HomeBanner",
    "AdminComments",
    "Comments",
    "Ads",
    "AdminAds",
    "Subscriptions",
    "SubscriptionPlans",
    "Directory",
    "Campaigns",
    "Archives",
    "MarketUpdates",
    "Newsletter",
    "AdminStats",
    "SystemSettings",
    "PublicSettings",
    "AnalyticsReports",
    "Author",
    "User",
    "Coupons",
  ],
  endpoints: () => ({}),
});

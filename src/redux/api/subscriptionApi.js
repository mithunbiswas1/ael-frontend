// src/redux/api/subscriptionApi.js

import { apiSlice } from "@/redux/api-slice/api-slice";
import { endpoints } from "@/redux/endpoints/endpoints";

export const subscriptionApi = apiSlice.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // Get public subscription tiers
    getSubscriptionPlans: builder.query({
      query: () => ({
        url: endpoints.subscriptions.plans,
        method: "GET",
      }),
      providesTags: ["Subscriptions"],
    }),

    // Initiate Checkout (SSLCommerz / bKash / Card)
    initiateCheckout: builder.mutation({
      query: (data) => ({
        url: endpoints.subscriptions.checkout,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subscriptions", "Courses"],
    }),

    // Admin: Get all transactions
    getAdminSubscriptions: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams(params).toString();
        return {
          url: `${endpoints.subscriptions.adminList}?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["Subscriptions"],
    }),

    // Admin: Refund transaction
    refundSubscription: builder.mutation({
      query: (id) => ({
        url: endpoints.subscriptions.refund(id),
        method: "POST",
      }),
      invalidatesTags: ["Subscriptions"],
    }),
  }),
});

export const {
  useGetSubscriptionPlansQuery,
  useInitiateCheckoutMutation,
  useGetAdminSubscriptionsQuery,
  useRefundSubscriptionMutation,
} = subscriptionApi;

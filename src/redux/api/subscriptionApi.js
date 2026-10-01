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
      invalidatesTags: ["Subscriptions", "Courses", "Profile"],
    }),

    // Get My Subscription (Current active package & remaining days)
    getMySubscription: builder.query({
      query: () => ({
        url: endpoints.subscriptions.my,
        method: "GET",
      }),
      providesTags: ["Subscriptions", "Profile"],
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

    // Admin: Get all plans
    getAdminSubscriptionPlans: builder.query({
      query: () => ({
        url: endpoints.subscriptions.adminPlans,
        method: "GET",
      }),
      providesTags: ["SubscriptionPlans"],
    }),

    // Admin: Get single plan by ID
    getSubscriptionPlanById: builder.query({
      query: (id) => ({
        url: endpoints.subscriptions.adminPlanDetail(id),
        method: "GET",
      }),
      providesTags: ["SubscriptionPlans"],
    }),

    // Admin: Create subscription plan
    createSubscriptionPlan: builder.mutation({
      query: (data) => ({
        url: endpoints.subscriptions.adminPlans,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SubscriptionPlans", "Subscriptions"],
    }),

    // Admin: Update subscription plan
    updateSubscriptionPlan: builder.mutation({
      query: ({ id, ...data }) => ({
        url: endpoints.subscriptions.adminPlanDetail(id),
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["SubscriptionPlans", "Subscriptions"],
    }),

    // Admin: Delete subscription plan
    deleteSubscriptionPlan: builder.mutation({
      query: (id) => ({
        url: endpoints.subscriptions.adminPlanDetail(id),
        method: "DELETE",
      }),
      invalidatesTags: ["SubscriptionPlans", "Subscriptions"],
    }),

    // Admin: Assign subscription to user
    assignUserSubscription: builder.mutation({
      query: (data) => ({
        url: endpoints.subscriptions.assign,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Subscriptions", "Users"],
    }),

    // Admin: Revoke subscription from user
    revokeUserSubscription: builder.mutation({
      query: (userId) => ({
        url: endpoints.subscriptions.revoke(userId),
        method: "POST",
      }),
      invalidatesTags: ["Subscriptions", "Users"],
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
  useGetMySubscriptionQuery,
  useGetAdminSubscriptionsQuery,
  useGetAdminSubscriptionPlansQuery,
  useGetSubscriptionPlanByIdQuery,
  useCreateSubscriptionPlanMutation,
  useUpdateSubscriptionPlanMutation,
  useDeleteSubscriptionPlanMutation,
  useAssignUserSubscriptionMutation,
  useRevokeUserSubscriptionMutation,
  useRefundSubscriptionMutation,
} = subscriptionApi;

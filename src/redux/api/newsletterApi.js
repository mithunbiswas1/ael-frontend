// src/redux/api/newsletterApi.js
import { apiSlice } from "@/redux/api-slice/api-slice";

export const newsletterApi = apiSlice.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // Public: Subscribe
    subscribeNewsletter: builder.mutation({
      query: (data) => ({
        url: "newsletter/subscribe",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Newsletter"],
    }),

    // Public: Unsubscribe
    unsubscribeNewsletter: builder.mutation({
      query: (data) => ({
        url: "newsletter/unsubscribe",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Newsletter"],
    }),

    // Admin: Get all subscribers
    getNewsletterSubscribers: builder.query({
      query: (params) => ({
        url: "newsletter/subscribers",
        method: "GET",
        params,
      }),
      providesTags: ["Newsletter"],
    }),

    // Admin: Toggle active status
    toggleNewsletterSubscriber: builder.mutation({
      query: (id) => ({
        url: `newsletter/subscribers/${id}/toggle`,
        method: "PATCH",
      }),
      invalidatesTags: ["Newsletter"],
    }),

    // Admin: Delete subscriber
    deleteNewsletterSubscriber: builder.mutation({
      query: (id) => ({
        url: `newsletter/subscribers/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Newsletter"],
    }),

    // Admin: Manual Broadcast
    broadcastNewsletter: builder.mutation({
      query: (data) => ({
        url: "newsletter/broadcast",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Newsletter", "Campaigns"],
    }),
  }),
});

export const {
  useSubscribeNewsletterMutation,
  useUnsubscribeNewsletterMutation,
  useGetNewsletterSubscribersQuery,
  useToggleNewsletterSubscriberMutation,
  useDeleteNewsletterSubscriberMutation,
  useBroadcastNewsletterMutation,
} = newsletterApi;

// src/redux/api/advertisementApi.js

import { apiSlice } from "@/redux/api-slice/api-slice";

export const advertisementApi = apiSlice.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // Public: Fetch active ad for specific slot
    getActiveAdBySlot: builder.query({
      query: (slot) => `advertisements/slot/${slot}`,
      providesTags: (result, error, slot) => [{ type: "Ads", id: slot }],
    }),

    // Public: Record click on an ad
    trackAdClick: builder.mutation({
      query: (id) => ({
        url: `advertisements/${id}/click`,
        method: "POST",
      }),
    }),

    // Admin: List all ads
    getAllAdsAdmin: builder.query({
      query: (params) => ({
        url: "advertisements/admin/all",
        params,
      }),
      providesTags: ["AdminAds"],
    }),

    // Admin: Create new ad
    createAd: builder.mutation({
      query: (data) => ({
        url: "advertisements/admin",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["AdminAds", "Ads"],
    }),

    // Admin: Update ad
    updateAd: builder.mutation({
      query: ({ id, data }) => ({
        url: `advertisements/admin/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["AdminAds", "Ads"],
    }),

    // Admin: Delete ad
    deleteAd: builder.mutation({
      query: (id) => ({
        url: `advertisements/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminAds", "Ads"],
    }),
  }),
});

export const {
  useGetActiveAdBySlotQuery,
  useTrackAdClickMutation,
  useGetAllAdsAdminQuery,
  useCreateAdMutation,
  useUpdateAdMutation,
  useDeleteAdMutation,
} = advertisementApi;

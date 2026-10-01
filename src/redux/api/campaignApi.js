// src/redux/api/campaignApi.js

import { apiSlice } from "@/redux/api-slice/api-slice";
import { endpoints } from "@/redux/endpoints/endpoints";

export const campaignApi = apiSlice.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // Get campaigns list by type (sms or email)
    getCampaigns: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams(params).toString();
        return {
          url: `${endpoints.campaigns.list}?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["Campaigns"],
    }),

    // Get aggregated campaign metrics
    getCampaignStats: builder.query({
      query: () => ({
        url: endpoints.campaigns.stats,
        method: "GET",
      }),
      providesTags: ["Campaigns"],
    }),

    // Create / Dispatch new campaign
    createCampaign: builder.mutation({
      query: (data) => ({
        url: endpoints.campaigns.create,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Campaigns"],
    }),

    // Delete campaign record
    deleteCampaign: builder.mutation({
      query: (id) => ({
        url: endpoints.campaigns.delete(id),
        method: "DELETE",
      }),
      invalidatesTags: ["Campaigns"],
    }),
  }),
});

export const {
  useGetCampaignsQuery,
  useGetCampaignStatsQuery,
  useCreateCampaignMutation,
  useDeleteCampaignMutation,
} = campaignApi;

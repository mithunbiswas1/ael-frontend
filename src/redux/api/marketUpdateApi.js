// src/redux/api/marketUpdateApi.js

import { apiSlice } from "@/redux/api-slice/api-slice";
import { endpoints } from "@/redux/endpoints/endpoints";

export const marketUpdateApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Public: List market updates with filter
    getMarketUpdates: builder.query({
      query: (params = {}) => {
        const cleanParams = {};
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== "") {
            cleanParams[k] = v;
          }
        });
        const queryParams = new URLSearchParams(cleanParams).toString();
        return {
          url: queryParams
            ? `${endpoints.marketUpdates.publicList}?${queryParams}`
            : endpoints.marketUpdates.publicList,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result?.data?.data
          ? [
              ...result.data.data.map(({ _id }) => ({
                type: "MarketUpdates",
                id: _id,
              })),
              { type: "MarketUpdates", id: "LIST" },
            ]
          : [{ type: "MarketUpdates", id: "LIST" }],
    }),

    // Public: Single market update by slug
    getMarketUpdateBySlug: builder.query({
      query: (slug) => ({
        url: endpoints.marketUpdates.getBySlug(slug),
        method: "GET",
      }),
      providesTags: (result, error, slug) => [
        { type: "MarketUpdates", id: slug },
      ],
    }),

    // Admin: List all market updates
    getAdminMarketUpdates: builder.query({
      query: (params = {}) => {
        const cleanParams = {};
        Object.entries(params).forEach(([k, v]) => {
          if (v !== undefined && v !== null && v !== "") {
            cleanParams[k] = v;
          }
        });
        const queryParams = new URLSearchParams(cleanParams).toString();
        return {
          url: queryParams
            ? `${endpoints.marketUpdates.adminList}?${queryParams}`
            : endpoints.marketUpdates.adminList,
          method: "GET",
        };
      },
      providesTags: (result) =>
        result?.data?.data
          ? [
              ...result.data.data.map(({ _id }) => ({
                type: "MarketUpdates",
                id: _id,
              })),
              { type: "MarketUpdates", id: "ADMIN_LIST" },
            ]
          : [{ type: "MarketUpdates", id: "ADMIN_LIST" }],
    }),

    // Admin: Get single by ID or Slug
    getMarketUpdateById: builder.query({
      query: (id) => ({
        url: endpoints.marketUpdates.getById(id),
        method: "GET",
      }),
      providesTags: (result, error, id) => [
        { type: "MarketUpdates", id },
      ],
    }),

    // Admin: Create market update
    createMarketUpdate: builder.mutation({
      query: (body) => ({
        url: endpoints.marketUpdates.create,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "MarketUpdates", id: "LIST" }, { type: "MarketUpdates", id: "ADMIN_LIST" }],
    }),

    // Admin: Update market update
    updateMarketUpdate: builder.mutation({
      query: ({ id, data }) => ({
        url: endpoints.marketUpdates.update(id),
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "MarketUpdates", id },
        { type: "MarketUpdates", id: "LIST" },
        { type: "MarketUpdates", id: "ADMIN_LIST" },
      ],
    }),

    // Admin: Delete market update
    deleteMarketUpdate: builder.mutation({
      query: (id) => ({
        url: endpoints.marketUpdates.delete(id),
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "MarketUpdates", id: "LIST" },
        { type: "MarketUpdates", id: "ADMIN_LIST" },
      ],
    }),
  }),
});

export const {
  useGetMarketUpdatesQuery,
  useGetMarketUpdateBySlugQuery,
  useGetAdminMarketUpdatesQuery,
  useGetMarketUpdateByIdQuery,
  useCreateMarketUpdateMutation,
  useUpdateMarketUpdateMutation,
  useDeleteMarketUpdateMutation,
} = marketUpdateApi;

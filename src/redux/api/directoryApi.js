// src/redux/api/directoryApi.js

import { apiSlice } from "@/redux/api-slice/api-slice";
import { endpoints } from "@/redux/endpoints/endpoints";

export const directoryApi = apiSlice.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // Get Directory database records
    getDirectoryRecords: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams(params).toString();
        return {
          url: `${endpoints.directory.list}?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["Directory"],
    }),

    // Get Directory summary metrics
    getDirectoryStats: builder.query({
      query: () => ({
        url: endpoints.directory.stats,
        method: "GET",
      }),
      providesTags: ["Directory"],
    }),

    // Add Directory Record
    createDirectoryRecord: builder.mutation({
      query: (data) => ({
        url: endpoints.directory.create,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Directory"],
    }),

    // Update Directory Record
    updateDirectoryRecord: builder.mutation({
      query: ({ id, data }) => ({
        url: endpoints.directory.update(id),
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Directory"],
    }),

    // Delete Directory Record
    deleteDirectoryRecord: builder.mutation({
      query: (id) => ({
        url: endpoints.directory.delete(id),
        method: "DELETE",
      }),
      invalidatesTags: ["Directory"],
    }),

    // Bulk Import Records
    bulkImportDirectory: builder.mutation({
      query: (records) => ({
        url: endpoints.directory.bulkImport,
        method: "POST",
        body: { records },
      }),
      invalidatesTags: ["Directory"],
    }),
  }),
});

export const {
  useGetDirectoryRecordsQuery,
  useGetDirectoryStatsQuery,
  useCreateDirectoryRecordMutation,
  useUpdateDirectoryRecordMutation,
  useDeleteDirectoryRecordMutation,
  useBulkImportDirectoryMutation,
} = directoryApi;

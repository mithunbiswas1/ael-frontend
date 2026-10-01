// src/redux/api/archiveApi.js

import { apiSlice } from "@/redux/api-slice/api-slice";
import { endpoints } from "@/redux/endpoints/endpoints";

export const archiveApi = apiSlice.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // Public: Get Archive records
    getArchiveRecords: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams(params).toString();
        return {
          url: `${endpoints.archives.publicList}?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["Archives"],
    }),

    // Public: Single Archive record
    getArchiveById: builder.query({
      query: (id) => ({
        url: endpoints.archives.detail(id),
        method: "GET",
      }),
      providesTags: ["Archives"],
    }),

    // Public: Record download
    trackArchiveDownload: builder.mutation({
      query: (id) => ({
        url: endpoints.archives.trackDownload(id),
        method: "POST",
      }),
      invalidatesTags: ["Archives"],
    }),

    // Admin: Get all archives
    getAdminArchives: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams(params).toString();
        return {
          url: `${endpoints.archives.adminList}?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["Archives"],
    }),

    // Admin: Create archive item
    createArchive: builder.mutation({
      query: (data) => ({
        url: endpoints.archives.create,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Archives"],
    }),

    // Admin: Update archive item
    updateArchive: builder.mutation({
      query: ({ id, data }) => ({
        url: endpoints.archives.update(id),
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Archives"],
    }),

    // Admin: Delete archive item
    deleteArchive: builder.mutation({
      query: (id) => ({
        url: endpoints.archives.delete(id),
        method: "DELETE",
      }),
      invalidatesTags: ["Archives"],
    }),
  }),
});

export const {
  useGetArchiveRecordsQuery,
  useGetArchiveByIdQuery,
  useTrackArchiveDownloadMutation,
  useGetAdminArchivesQuery,
  useCreateArchiveMutation,
  useUpdateArchiveMutation,
  useDeleteArchiveMutation,
} = archiveApi;

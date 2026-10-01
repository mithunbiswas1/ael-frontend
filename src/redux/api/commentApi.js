// src/redux/api/commentApi.js

import { apiSlice } from "@/redux/api-slice/api-slice";

export const commentApi = apiSlice.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // Get comments for specific blog/incident target
    getCommentsByTarget: builder.query({
      query: ({ targetId, targetType = "blog", userId }) => ({
        url: "comments",
        params: {
          targetId,
          targetType,
          ...(userId ? { userId } : {}),
        },
      }),
      providesTags: (result, error, { targetId, userId }) => [
        { type: "Comments", id: `${targetId}-${userId || "guest"}` },
        { type: "Comments", id: targetId },
      ],
    }),

    // Subscriber: Add new comment or reply
    addComment: builder.mutation({
      query: (data) => ({
        url: "comments",
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { targetId }) => [
        { type: "Comments", id: targetId },
        "AdminComments",
      ],
    }),

    // Admin: List all comments for moderation
    getAdminComments: builder.query({
      query: (params) => ({
        url: "comments/admin/all",
        params,
      }),
      providesTags: ["AdminComments"],
    }),

    // Admin: Update comment status (approve/reject)
    updateCommentStatus: builder.mutation({
      query: ({ id, data }) => ({
        url: `comments/admin/${id}/status`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["AdminComments", "Comments"],
    }),

    // Admin: Delete comment
    deleteComment: builder.mutation({
      query: (id) => ({
        url: `comments/admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["AdminComments", "Comments"],
    }),
  }),
});

export const {
  useGetCommentsByTargetQuery,
  useAddCommentMutation,
  useGetAdminCommentsQuery,
  useUpdateCommentStatusMutation,
  useDeleteCommentMutation,
} = commentApi;

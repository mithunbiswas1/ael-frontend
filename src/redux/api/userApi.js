// src/redux/api/userApi.js

import { apiSlice } from "@/redux/api-slice/api-slice";

export const userApi = apiSlice.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // Get logged-in user profile
    getProfile: builder.query({
      query: () => "user/profile",
      providesTags: ["Profile"],
    }),

    // Update profile (accepts JSON or FormData with profilePhoto)
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "user/update-profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Profile"],
    }),

    // Change / update password
    updatePassword: builder.mutation({
      query: (passwordData) => ({
        url: "user/update-password",
        method: "PATCH",
        body: passwordData,
      }),
    }),

    // Admin: List users with search, role filter & pagination
    getUsers: builder.query({
      query: (params) => ({
        url: "user/list-users",
        params,
      }),
      providesTags: ["Users"],
    }),

    // Admin: Update user role / active status / info
    updateUserByAdmin: builder.mutation({
      query: ({ userId, data }) => ({
        url: `user/update-user/${userId}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Users", "Profile"],
    }),

    // Admin: Delete user
    deleteUserByAdmin: builder.mutation({
      query: (userId) => ({
        url: `user/delete-user/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUpdatePasswordMutation,
  useGetUsersQuery,
  useUpdateUserByAdminMutation,
  useDeleteUserByAdminMutation,
} = userApi;

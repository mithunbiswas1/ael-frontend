// src/redux/api/roleApi.js

import { apiSlice } from "@/redux/api-slice/api-slice";
import { endpoints } from "@/redux/endpoints/endpoints";

export const roleApi = apiSlice.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // Get all roles
    getRoles: builder.query({
      query: () => ({
        url: endpoints.roles.list,
        method: "GET",
      }),
      providesTags: ["Roles"],
    }),

    // Get current user permissions
    getMyPermissions: builder.query({
      query: () => ({
        url: endpoints.roles.myPermissions,
        method: "GET",
      }),
      providesTags: ["Permissions"],
    }),

    // Create custom role
    createRole: builder.mutation({
      query: (data) => ({
        url: endpoints.roles.create,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Roles"],
    }),

    // Update role permissions
    updateRolePermissions: builder.mutation({
      query: ({ id, data }) => ({
        url: endpoints.roles.update(id),
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Roles", "Permissions"],
    }),

    // Delete role
    deleteRole: builder.mutation({
      query: (id) => ({
        url: endpoints.roles.delete(id),
        method: "DELETE",
      }),
      invalidatesTags: ["Roles"],
    }),
  }),
});

export const {
  useGetRolesQuery,
  useGetMyPermissionsQuery,
  useCreateRoleMutation,
  useUpdateRolePermissionsMutation,
  useDeleteRoleMutation,
} = roleApi;

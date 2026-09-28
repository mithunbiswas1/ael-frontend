// src/redux/api/blogApi.js

import { apiSlice } from "@/redux/api-slice/api-slice";
import { endpoints } from "@/redux/endpoints/endpoints";

export const blogApi = apiSlice.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // Get Admin Blogs List
    getAdminBlogs: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams(params).toString();
        return {
          url: `${endpoints.blogs.adminList}?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["Blogs"],
    }),

    // Create Blog
    createBlog: builder.mutation({
      query: (formData) => ({
        url: endpoints.blogs.create,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Blogs"],
    }),

    // Update Blog
    updateBlog: builder.mutation({
      query: ({ id, formData }) => ({
        url: endpoints.blogs.update(id),
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Blogs"],
    }),

    // Delete Blog
    deleteBlog: builder.mutation({
      query: (id) => ({
        url: endpoints.blogs.delete(id),
        method: "DELETE",
      }),
      invalidatesTags: ["Blogs"],
    }),
  }),
});

export const {
  useGetAdminBlogsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;

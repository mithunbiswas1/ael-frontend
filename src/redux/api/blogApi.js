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

    // Get Single Blog (by ID or Slug)
    getBlogById: builder.query({
      query: (id) => ({
        url: endpoints.blogs.getById(id),
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Blogs", id }],
    }),

    // Create Blog
    createBlog: builder.mutation({
      query: (body) => ({
        url: endpoints.blogs.create,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Blogs"],
    }),

    // Update Blog
    updateBlog: builder.mutation({
      query: ({ id, formData, data }) => ({
        url: endpoints.blogs.update(id),
        method: "PATCH",
        body: data || formData,
      }),
      invalidatesTags: ["Blogs"],
    }),

    // Get Blog Categories List
    getBlogCategories: builder.query({
      query: () => ({
        url: endpoints.blogs.categories,
        method: "GET",
      }),
      providesTags: ["BlogCategories"],
    }),

    // Create Blog Category
    createBlogCategory: builder.mutation({
      query: (body) => ({
        url: endpoints.blogs.categories,
        method: "POST",
        body,
      }),
      invalidatesTags: ["BlogCategories"],
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
  useGetBlogByIdQuery,
  useGetBlogCategoriesQuery,
  useCreateBlogCategoryMutation,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;

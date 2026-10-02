// src/redux/api/pageApi.js
import { apiSlice } from "@/redux/api-slice/api-slice";
import { endpoints } from "@/redux/endpoints/endpoints";

export const pageApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Get single page content by key
    getPageByKey: builder.query({
      query: (pageKey) => ({
        url: endpoints.cmsPages.getBySlug(pageKey),
        method: "GET",
      }),
      providesTags: (result, error, pageKey) => [{ type: "Pages", id: pageKey }],
    }),

    // Get all pages list
    getAllPages: builder.query({
      query: () => ({
        url: endpoints.cmsPages.list,
        method: "GET",
      }),
      providesTags: ["Pages"],
    }),

    // Update page content & banner
    updatePageByKey: builder.mutation({
      query: ({ pageKey, data }) => ({
        url: endpoints.cmsPages.update(pageKey),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { pageKey }) => [
        { type: "Pages", id: pageKey },
        "Pages",
      ],
    }),

    // Submit user contact message
    submitContactMessage: builder.mutation({
      query: (data) => ({
        url: endpoints.contactMessages.submit,
        method: "POST",
        body: data,
      }),
    }),

    // Admin: Get contact messages
    getContactMessages: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams(params).toString();
        return {
          url: `${endpoints.contactMessages.list}?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["ContactMessages"],
    }),

    // Admin: Update contact message status
    updateContactMessageStatus: builder.mutation({
      query: ({ id, data }) => ({
        url: endpoints.contactMessages.updateStatus(id),
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["ContactMessages"],
    }),

    // Admin: Upload page image (Drag & Drop)
    uploadPageImage: builder.mutation({
      query: (formData) => ({
        url: endpoints.homeBanner.uploadSlides,
        method: "POST",
        body: formData,
      }),
    }),

    // Admin: Delete contact message
    deleteContactMessage: builder.mutation({
      query: (id) => ({
        url: endpoints.contactMessages.delete(id),
        method: "DELETE",
      }),
      invalidatesTags: ["ContactMessages"],
    }),

    // Admin: Reply to contact message via Email SMTP
    replyContactMessage: builder.mutation({
      query: ({ id, data }) => ({
        url: endpoints.contactMessages.reply(id),
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["ContactMessages"],
    }),
  }),
});

export const {
  useGetPageByKeyQuery,
  useGetAllPagesQuery,
  useUpdatePageByKeyMutation,
  useUploadPageImageMutation,
  useSubmitContactMessageMutation,
  useGetContactMessagesQuery,
  useUpdateContactMessageStatusMutation,
  useDeleteContactMessageMutation,
  useReplyContactMessageMutation,
} = pageApi;

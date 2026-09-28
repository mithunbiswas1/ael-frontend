// src/redux/api/homeBannerApi.js
import { apiSlice } from "@/redux/api-slice/api-slice";
import { endpoints } from "@/redux/endpoints/endpoints";

export const homeBannerApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Get active home banner
    getHomeBanner: builder.query({
      query: () => ({
        url: endpoints.homeBanner.get,
        method: "GET",
      }),
      providesTags: ["HomeBanner"],
    }),

    // Update home banner content & slides
    updateHomeBanner: builder.mutation({
      query: (data) => ({
        url: endpoints.homeBanner.update,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["HomeBanner"],
    }),

    // Upload multiple slide images (Drag & Drop)
    uploadHomeBannerSlides: builder.mutation({
      query: (formData) => ({
        url: endpoints.homeBanner.uploadSlides,
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const {
  useGetHomeBannerQuery,
  useUpdateHomeBannerMutation,
  useUploadHomeBannerSlidesMutation,
} = homeBannerApi;

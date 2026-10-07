// src/redux/api/couponApi.js
import { apiSlice } from "@/redux/api-slice/api-slice";
import { endpoints } from "@/redux/endpoints/endpoints";

export const couponApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Customer/Checkout: Validate coupon code against cart/item
    validateCoupon: builder.mutation({
      query: (data) => ({
        url: endpoints.coupons.validate,
        method: "POST",
        body: data,
      }),
    }),

    // Admin: List all coupons with filters and aggregate metrics
    getCoupons: builder.query({
      query: (params = {}) => {
        const cleanParams = {};
        Object.entries(params || {}).forEach(([key, val]) => {
          if (val !== undefined && val !== null && val !== "" && val !== "all") {
            cleanParams[key] = val;
          }
        });
        const queryParams = new URLSearchParams(cleanParams).toString();
        return {
          url: queryParams
            ? `${endpoints.coupons.adminList}?${queryParams}`
            : endpoints.coupons.adminList,
          method: "GET",
        };
      },
      providesTags: ["Coupons"],
    }),

    // Admin: Get single coupon details
    getCouponById: builder.query({
      query: (id) => ({
        url: endpoints.coupons.getById(id),
        method: "GET",
      }),
      providesTags: ["Coupons"],
    }),

    // Admin: Create a new dynamic coupon / gift voucher
    createCoupon: builder.mutation({
      query: (data) => ({
        url: endpoints.coupons.create,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Coupons"],
    }),

    // Admin: Update coupon
    updateCoupon: builder.mutation({
      query: ({ id, data }) => ({
        url: endpoints.coupons.update(id),
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Coupons"],
    }),

    // Admin: Delete coupon
    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: endpoints.coupons.delete(id),
        method: "DELETE",
      }),
      invalidatesTags: ["Coupons"],
    }),

    // Admin: Quick status toggle (active / inactive)
    toggleCouponStatus: builder.mutation({
      query: (id) => ({
        url: endpoints.coupons.toggle(id),
        method: "PATCH",
      }),
      invalidatesTags: ["Coupons"],
    }),
  }),
});

export const {
  useValidateCouponMutation,
  useGetCouponsQuery,
  useGetCouponByIdQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useToggleCouponStatusMutation,
} = couponApi;

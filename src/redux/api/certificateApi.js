// src/redux/api/certificateApi.js

import { apiSlice } from "@/redux/api-slice/api-slice";

export const certificateApi = apiSlice.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // Admin: Get all certificates with search filter
    getCertificates: builder.query({
      query: (params) => ({
        url: "certificates/all",
        params,
      }),
      providesTags: ["Certificates"],
    }),

    // Public / Admin: Verify certificate by ID
    verifyCertificate: builder.query({
      query: (certId) => `certificates/verify/${certId}`,
    }),

    // Admin: Issue / create new certificate
    createCertificate: builder.mutation({
      query: (data) => ({
        url: "certificates",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Certificates"],
    }),

    // Admin: Update certificate
    updateCertificate: builder.mutation({
      query: ({ id, data }) => ({
        url: `certificates/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Certificates"],
    }),

    // Admin: Delete certificate
    deleteCertificate: builder.mutation({
      query: (id) => ({
        url: `certificates/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Certificates"],
    }),
  }),
});

export const {
  useGetCertificatesQuery,
  useVerifyCertificateQuery,
  useCreateCertificateMutation,
  useUpdateCertificateMutation,
  useDeleteCertificateMutation,
} = certificateApi;

// src/redux/api/adminApi.js
import { apiSlice } from "@/redux/api-slice/api-slice";
import { endpoints } from "@/redux/endpoints/endpoints";

export const adminApi = apiSlice.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // 1. Dashboard Overview Live Stats & Charts
    getDashboardStats: builder.query({
      query: () => ({
        url: endpoints.adminSuite.dashboardStats,
        method: "GET",
      }),
      providesTags: ["AdminStats"],
    }),

    // 2. System Settings
    getSystemSettings: builder.query({
      query: () => ({
        url: endpoints.adminSuite.settings,
        method: "GET",
      }),
      providesTags: ["SystemSettings"],
    }),

    // 3. Update System Settings
    updateSystemSettings: builder.mutation({
      query: (data) => ({
        url: endpoints.adminSuite.updateSettings,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["SystemSettings"],
    }),

    // 4. Analytics Reports
    getAnalyticsReports: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams(params).toString();
        return {
          url: `${endpoints.adminSuite.reports}?${queryParams}`,
          method: "GET",
        };
      },
      providesTags: ["AnalyticsReports"],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetSystemSettingsQuery,
  useUpdateSystemSettingsMutation,
  useGetAnalyticsReportsQuery,
} = adminApi;

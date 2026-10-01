// src/redux/api/courseApi.js

import { apiSlice } from "@/redux/api-slice/api-slice";
import { endpoints } from "@/redux/endpoints/endpoints";

export const courseApi = apiSlice.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // Get Courses List (Public)
    getCourses: builder.query({
      query: (params = {}) => {
        const cleanParams = new URLSearchParams();
        Object.entries(params || {}).forEach(([key, value]) => {
          if (
            value !== undefined &&
            value !== null &&
            value !== "" &&
            value !== "all"
          ) {
            cleanParams.append(key, value);
          }
        });
        const qs = cleanParams.toString();
        return {
          url: qs ? `${endpoints.courses.publicList}?${qs}` : endpoints.courses.publicList,
          method: "GET",
        };
      },
      providesTags: ["Courses"],
    }),

    // Get Admin Courses List (Instructor gets only their own, Admin gets all)
    getAdminCourses: builder.query({
      query: (params = {}) => {
        const cleanParams = new URLSearchParams();
        Object.entries(params || {}).forEach(([key, value]) => {
          if (
            value !== undefined &&
            value !== null &&
            value !== "" &&
            value !== "all"
          ) {
            cleanParams.append(key, value);
          }
        });
        const qs = cleanParams.toString();
        return {
          url: qs ? `${endpoints.courses.adminList}?${qs}` : endpoints.courses.adminList,
          method: "GET",
        };
      },
      providesTags: ["Courses"],
    }),

    // Get Course Enrollments & Sales History
    getCourseEnrollments: builder.query({
      query: () => ({
        url: endpoints.courses.enrollments,
        method: "GET",
      }),
      providesTags: ["Courses", "Orders"],
    }),

    // Get Course By ID
    getCourseById: builder.query({
      query: (id) => ({
        url: endpoints.courses.detail(id),
        method: "GET",
      }),
      providesTags: ["Courses"],
    }),

    // Create Course
    createCourse: builder.mutation({
      query: (data) => ({
        url: endpoints.courses.create,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Courses"],
    }),

    // Update Course
    updateCourse: builder.mutation({
      query: ({ id, data }) => ({
        url: endpoints.courses.update(id),
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Courses"],
    }),

    // Delete Course
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: endpoints.courses.delete(id),
        method: "DELETE",
      }),
      invalidatesTags: ["Courses"],
    }),

    // Subscriber: Get enrolled/purchased courses
    getMyLearningCourses: builder.query({
      query: () => ({
        url: endpoints.courses.subscriberMyLearning,
        method: "GET",
      }),
      providesTags: ["Courses"],
    }),

    // Subscriber: Enroll in a course
    enrollCourse: builder.mutation({
      query: (courseId) => ({
        url: endpoints.courses.subscriberEnroll,
        method: "POST",
        body: { courseId },
      }),
      invalidatesTags: ["Courses"],
    }),

    // Direct Video Upload
    uploadCourseVideo: builder.mutation({
      query: (formData) => ({
        url: endpoints.courses.uploadVideo,
        method: "POST",
        body: formData,
      }),
    }),

    // Direct Image Upload
    uploadCourseImage: builder.mutation({
      query: (formData) => ({
        url: endpoints.courses.uploadImage,
        method: "POST",
        body: formData,
      }),
    }),

    // Direct PDF Upload for Course Resource / Study Guide
    uploadCoursePdf: builder.mutation({
      query: (formData) => ({
        url: endpoints.courses.uploadPdf,
        method: "POST",
        body: formData,
      }),
    }),

    // Subscriber: Update Course Progress (10s interval heartbeat)
    updateCourseProgress: builder.mutation({
      query: ({ courseId, data }) => ({
        url: endpoints.courses.updateProgress(courseId),
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Courses"],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetAdminCoursesQuery,
  useGetCourseEnrollmentsQuery,
  useGetCourseByIdQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetMyLearningCoursesQuery,
  useEnrollCourseMutation,
  useUploadCourseVideoMutation,
  useUploadCourseImageMutation,
  useUploadCoursePdfMutation,
  useUpdateCourseProgressMutation,
} = courseApi;

// src/redux/api/quizApi.js

import { apiSlice } from "@/redux/api-slice/api-slice";
import { endpoints } from "@/redux/endpoints/endpoints";

export const quizApi = apiSlice.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // Get Quiz for a specific Course
    getQuizByCourseId: builder.query({
      query: (courseId) => ({
        url: endpoints.quizzes.getByCourseId(courseId),
        method: "GET",
      }),
      providesTags: ["Quizzes"],
    }),

    // Submit Quiz Answers
    submitQuiz: builder.mutation({
      query: (body) => ({
        url: endpoints.quizzes.submit,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Quizzes", "Certificates"],
    }),

    // Admin: Get all quizzes
    getAllQuizzes: builder.query({
      query: () => ({
        url: endpoints.quizzes.adminAll,
        method: "GET",
      }),
      providesTags: ["Quizzes"],
    }),

    // Admin: Save or update quiz
    saveQuiz: builder.mutation({
      query: (data) => ({
        url: endpoints.quizzes.save,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Quizzes"],
    }),

    // Admin: Delete quiz
    deleteQuiz: builder.mutation({
      query: (id) => ({
        url: endpoints.quizzes.delete(id),
        method: "DELETE",
      }),
      invalidatesTags: ["Quizzes"],
    }),
  }),
});

export const {
  useGetQuizByCourseIdQuery,
  useGetAllQuizzesQuery,
  useSubmitQuizMutation,
  useSaveQuizMutation,
  useDeleteQuizMutation,
} = quizApi;


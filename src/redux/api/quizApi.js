// src/redux/api/quizApi.js

import { apiSlice } from "@/redux/api-slice/api-slice";
import { endpoints } from "@/redux/endpoints/endpoints";

export const quizApi = apiSlice.injectEndpoints({
  overrideExisting: true,

  endpoints: (builder) => ({
    // Get Quiz for a specific Course (public/sanitized)
    getQuizByCourseId: builder.query({
      query: (courseId) => ({
        url: endpoints.quizzes.getByCourseId(courseId),
        method: "GET",
      }),
      providesTags: ["Quizzes"],
    }),

    // Get Active Quiz Attempt for Enrolled Learner (enforces 100% lessons prerequisite & anti-cheat)
    getQuizForAttempt: builder.query({
      query: (courseId) => ({
        url: endpoints.quizzes.getAttempt(courseId),
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
      invalidatesTags: ["Quizzes", "Certificates", "Courses", "User"],
    }),

    // Admin: Get all quizzes
    getAllQuizzes: builder.query({
      query: () => ({
        url: endpoints.quizzes.adminAll,
        method: "GET",
      }),
      providesTags: ["Quizzes"],
    }),

    // Admin: Get Question Bank for a Course
    getQuestionBank: builder.query({
      query: (courseId) => ({
        url: endpoints.quizzes.questionBank(courseId),
        method: "GET",
      }),
      providesTags: ["Quizzes"],
    }),

    // Admin: Add Question to Bank
    addQuestionToBank: builder.mutation({
      query: ({ courseId, data }) => ({
        url: endpoints.quizzes.questionBank(courseId),
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Quizzes"],
    }),

    // Admin: Update Question in Bank
    updateQuestionInBank: builder.mutation({
      query: ({ courseId, questionId, data }) => ({
        url: endpoints.quizzes.questionItem(courseId, questionId),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Quizzes"],
    }),

    // Admin: Delete Question from Bank
    deleteQuestionFromBank: builder.mutation({
      query: ({ courseId, questionId }) => ({
        url: endpoints.quizzes.questionItem(courseId, questionId),
        method: "DELETE",
      }),
      invalidatesTags: ["Quizzes"],
    }),

    // Admin: Update Quiz Settings (timer, cooldown, passing percentage, questionsPerQuiz)
    updateQuizSettings: builder.mutation({
      query: ({ courseId, data }) => ({
        url: endpoints.quizzes.settings(courseId),
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Quizzes"],
    }),

    // Admin: Save or update quiz (legacy)
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
  useGetQuizForAttemptQuery,
  useSubmitQuizMutation,
  useGetAllQuizzesQuery,
  useGetQuestionBankQuery,
  useAddQuestionToBankMutation,
  useUpdateQuestionInBankMutation,
  useDeleteQuestionFromBankMutation,
  useUpdateQuizSettingsMutation,
  useSaveQuizMutation,
  useDeleteQuizMutation,
} = quizApi;

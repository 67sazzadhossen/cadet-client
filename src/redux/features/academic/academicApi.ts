import { baseApi } from "@/redux/api/baseApi";
import { toQueryString } from "@/lib/queryBuilder";
const academicApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // নতুন: Add Subject Mutation
    addSubject: builder.mutation({
      query: (payload) => ({
        method: "POST",
        url: `/academic/add-subject`,
        body: payload,
      }),
    }),

    // নতুন: Get Filtered Subjects Query
    getFilteredSubjects: builder.query({
      query: (params) => {
        // ডাইনামিক কুয়েরি স্ট্রিং তৈরি করা
        const { search, className, version, isCadet } = params;

        return {
          method: "GET",
          url: `/academic/get-subjects${toQueryString({
            search,
            class: className,
            version,
            isCadet,
          })}`,
        };
      },
    }),

    // নতুন: Update Subject Mutation
    updateSubject: builder.mutation({
      query: (payload) => ({
        method: "PATCH",
        url: `/academic/update-subject`,
        body: payload,
      }),
    }),

    // নতুন: Delete Subject Mutation
    deleteSubject: builder.mutation({
      query: (payload) => ({
        method: "DELETE",
        url: `/academic/delete-subject`,
        body: payload, // এখানে _id সহ অবজেক্টটি পাঠাতে হবে
      }),
    }),

    createSubjects: builder.mutation({
      query: (payload) => ({
        method: "POST",
        url: `/academic/create-subjects`,
        body: payload,
      }),
    }),
    updateSubjects: builder.mutation({
      query: (payload) => ({
        method: "POST",
        url: `/academic/update-subjects`,
        body: payload,
      }),
    }),
    deleteSubjects: builder.mutation({
      query: (payload) => ({
        method: "POST",
        url: `/academic/delete-subjects`,
        body: payload,
      }),
    }),
    addStudentReport: builder.mutation({
      query: (payload) => ({
        method: "POST",
        url: `/academic/add-student-report`,
        body: payload,
      }),
    }),
    getAllSubjects: builder.query({
      query: () => ({
        method: "GET",
        url: `/academic/all-subjects`,
      }),
    }),
    getAllReports: builder.query({
      query: (payload) => ({
        method: "GET",
        url: `/academic/student-reports?&search=${payload.search}&class=${payload.class}&version=${payload.version}`,
      }),
    }),
    deleteSingleReport: builder.mutation({
      query: (payload) => ({
        method: "DELETE",
        url: `/academic/delete-single-report/${payload.id}`,
      }),
    }),
    getMyReports: builder.query({
      query: (payload) => ({
        method: "GET",
        url: `/academic/my-reports?id=${payload.id}&date=${payload.date}`,
      }),
    }),
    saveMarks: builder.mutation({
      query: (payload) => ({
        method: "POST",
        url: `/academic/save-marks`,
        body: payload,
      }),
    }),
    getMarks: builder.query({
      query: (payload) => ({
        url: `/academic/marks`, // Endpoint change kora hoyeche jeno save-marks er sathe na mile jay
        method: "POST", // Body pathanor jonno POST use kora hoyeche
        body: payload,
      }),
    }),
    getResult: builder.query({
      query: (payload) => ({
        url: `/academic/get-result`, // Endpoint change kora hoyeche jeno save-marks er sathe na mile jay
        method: "POST", // Body pathanor jonno POST use kora hoyeche
        body: payload,
      }),
    }),

    // --- Exam Management Endpoints ---

    // ১. Create Exam Mutation
    createExam: builder.mutation({
      query: (payload) => ({
        method: "POST",
        url: `/academic/create-exam`,
        body: payload,
      }),
    }),

    // ২. Get All Exams Query (Updated with year filter)
    getAllExams: builder.query({
      query: (year: string) => ({
        method: "GET",
        url: `/academic/all-exams${toQueryString({ year })}`,
      }),
    }),

    // ৩. Update Exam Mutation
    updateExam: builder.mutation({
      query: (payload) => ({
        method: "PATCH",
        url: `/academic/update-exam`,
        body: payload,
      }),
    }),

    // ৪. Delete Exam Mutation
    deleteExam: builder.mutation({
      query: (payload) => ({
        method: "DELETE",
        url: `/academic/delete-exam`,
        body: payload, // এখানে _id সহ অবজেক্টটি পাঠাতে হবে
      }),
    }),

    inputMarks: builder.mutation({
      query: (payload) => ({
        method: "POST",
        url: `/academic/input-marks`,
        body: payload,
      }),
    }),

    getInputMarks: builder.query({
      query: (params) => {
        const { examId, subjectId, year } = params;

        return {
          method: "GET",
          url: `/academic/input-marks${toQueryString({ examId, subjectId, year })}`,
        };
      },
    }),

    // নতুন: Generate Combined Exam Mutation
    generateCombinedExam: builder.mutation({
      query: (payload) => ({
        method: "POST",
        url: `/academic/generate-combined-exam`,
        body: payload,
      }),
    }),

    // নতুন: Get Dynamic Exam Result Query (Combined or Regular)
    getDynamicExamResult: builder.query({
      query: (payload) => ({
        url: `/academic/dynamic-result`,
        method: "POST", // যেহেতু আমরা body তে ডাটা পাঠাচ্ছি
        body: payload,
      }),
    }),
  }),
});

export const {
  useCreateSubjectsMutation,
  useGetAllSubjectsQuery,
  useUpdateSubjectsMutation,
  useDeleteSubjectsMutation,
  useAddStudentReportMutation,
  useGetAllReportsQuery,
  useDeleteSingleReportMutation,
  useGetMyReportsQuery,
  useSaveMarksMutation,
  useGetMarksQuery,
  useGetResultQuery,
  useAddSubjectMutation,
  useGetFilteredSubjectsQuery,
  useDeleteSubjectMutation,
  useUpdateSubjectMutation,
  useCreateExamMutation,
  useGetAllExamsQuery,
  useUpdateExamMutation,
  useDeleteExamMutation,
  useInputMarksMutation, // নতুন এন্ডপয়েন্ট এক্সপোর্ট করা হলো
  useGetInputMarksQuery, // নতুন যোগ করা হয়েছে
  useGenerateCombinedExamMutation, // নতুন যোগ করা হলো
  useGetDynamicExamResultQuery, // নতুন যোগ করা হলো
} = academicApi;

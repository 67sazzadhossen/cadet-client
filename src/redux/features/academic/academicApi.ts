import { baseApi } from "@/redux/api/baseApi";
const academicApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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
} = academicApi;

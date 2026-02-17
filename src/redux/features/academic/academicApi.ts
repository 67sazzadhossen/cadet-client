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
    getAllSubjects: builder.query({
      query: () => ({
        method: "GET",
        url: `/academic/all-subjects`,
      }),
    }),
  }),
});

export const {
  useCreateSubjectsMutation,
  useGetAllSubjectsQuery,
  useUpdateSubjectsMutation,
  useDeleteSubjectsMutation,
} = academicApi;

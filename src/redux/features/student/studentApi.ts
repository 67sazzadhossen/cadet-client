import { baseApi } from "@/redux/api/baseApi";
const studentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createStudent: builder.mutation({
      query: (userInfo) => ({
        method: "POST",
        url: "/users/create-student",
        body: userInfo,
      }),
    }),
    getAllStudents: builder.query({
      query: (payload) => ({
        method: "GET",
        url: `/students?page=${payload.page}&search=${payload.search}&class=${payload.class}&version=${payload.version}`,
      }),
    }),
    getLastStudent: builder.query({
      query: (payload) => ({
        method: "GET",
        url: `/students/last-student/${payload}`,
      }),
    }),
    deleteStudent: builder.mutation({
      query: (payload) => ({
        method: "DELETE",
        url: `/students/delete/${payload}`,
      }),
    }),
  }),
});

export const {
  useCreateStudentMutation,
  useGetAllStudentsQuery,
  useGetLastStudentQuery,
  useDeleteStudentMutation,
} = studentApi;

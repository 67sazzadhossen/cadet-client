import { baseApi } from "@/redux/api/baseApi";
import { toQueryString, ListQuery } from "@/lib/queryBuilder";
const studentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createStudent: builder.mutation({
      query: (userInfo) => ({
        method: "POST",
        url: "/users/create-student",
        body: userInfo,
      }),
    }),
    updateStudent: builder.mutation({
      query: (userInfo) => ({
        method: "POST",
        url: "/students/update-student",
        body: userInfo,
      }),
    }),
    getAllStudents: builder.query({
      query: (payload: ListQuery = {}) => ({
        method: "GET",
        url: `/students${toQueryString(payload)}`,
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
  useUpdateStudentMutation,
} = studentApi;

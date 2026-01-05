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
    getStudent: builder.query({
      query: () => ({
        method: "GET",
        url: "/students",
      }),
    }),
    getLastStudent: builder.query({
      query: (payload) => ({
        method: "GET",
        url: `/students/last-student/${payload}`,
      }),
    }),
  }),
});

export const {
  useCreateStudentMutation,
  useGetStudentQuery,
  useGetLastStudentQuery,
} = studentApi;

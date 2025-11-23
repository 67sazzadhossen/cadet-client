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
  }),
});

export const { useCreateStudentMutation, useGetStudentQuery } = studentApi;

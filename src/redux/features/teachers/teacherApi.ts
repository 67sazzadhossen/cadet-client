import { baseApi } from "@/redux/api/baseApi";
const teacherApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTeacher: builder.mutation({
      query: (teacherInfo: FormData) => ({
        method: "POST",
        url: "/users/create-teacher",
        body: teacherInfo,
      }),
    }),
    getTeachers: builder.query({
      query: () => ({
        method: "GET",
        url: "/teachers",
      }),
    }),
    deleteTeacherById: builder.mutation({
      query: (id) => ({
        method: "DELETE",
        url: `/teachers/${id}`,
      }),
    }),
    getSingleTeacherForPublic: builder.query({
      query: (id) => ({
        method: "GET",
        url: `/teachers/public/${id}`,
      }),
    }),
  }),
});

export const {
  useCreateTeacherMutation,
  useGetTeachersQuery,
  useDeleteTeacherByIdMutation,
  useGetSingleTeacherForPublicQuery,
} = teacherApi;

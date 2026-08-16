import { baseApi } from "@/redux/api/baseApi";
const teacherApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTeacher: builder.mutation({
      query: (teacherInfo) => ({
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
    getDeletedTeachers: builder.query({
      query: () => ({ method: "GET", url: "/teachers/recycle-bin" }),
    }),
    updateTeacher: builder.mutation({
      query: ({ id, ...body }) => ({ method: "PATCH", url: `/teachers/${id}`, body }),
    }),
    deleteTeacherById: builder.mutation({
      query: (id) => ({
        method: "DELETE",
        url: `/teachers/${id}`,
      }),
    }),
    restoreTeacher: builder.mutation({
      query: (id) => ({ method: "PATCH", url: `/teachers/${id}/restore` }),
    }),
    permanentlyDeleteTeacher: builder.mutation({
      query: (id) => ({ method: "DELETE", url: `/teachers/${id}/permanent` }),
    }),
    resetTeacherPassword: builder.mutation({
      query: (id) => ({ method: "POST", url: `/teachers/${id}/reset-password` }),
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
  useGetDeletedTeachersQuery,
  useUpdateTeacherMutation,
  useDeleteTeacherByIdMutation,
  useRestoreTeacherMutation,
  usePermanentlyDeleteTeacherMutation,
  useResetTeacherPasswordMutation,
  useGetSingleTeacherForPublicQuery,
} = teacherApi;

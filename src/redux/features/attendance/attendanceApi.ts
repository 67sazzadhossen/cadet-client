import { baseApi } from "@/redux/api/baseApi";
const attendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyAttendance: builder.query({
      query: (payload) => ({
        method: "GET",
        url: `/attendance/get-my-attendance?date=${payload.date}&month=${payload.month}`,
      }),
    }),

    getTeachersAttendance: builder.query({
      query: () => ({
        method: "GET",
        url: `/attendance/teachers-attendance`,
      }),
    }),
  }),
});

export const { useGetMyAttendanceQuery, useGetTeachersAttendanceQuery } =
  attendanceApi;

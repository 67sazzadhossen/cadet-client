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
      query: ({ month, year }) => ({
        url: `/attendance/teachers-attendance`,
        method: "GET",
        params: {
          month,
          year,
        },
      }),
    }),
  }),
});

export const { useGetMyAttendanceQuery, useGetTeachersAttendanceQuery } =
  attendanceApi;

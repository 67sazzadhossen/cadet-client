import { baseApi } from "@/redux/api/baseApi";
const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query({
      query: () => ({
        method: "GET",
        url: "/users/me",
      }),
    }),
    getPublicUser: builder.query({
      query: (id: string) => ({
        method: "GET",
        url: `/users/${id}`,
      }),
    }),
  }),
});

export const { useGetMeQuery, useGetPublicUserQuery } = userApi;

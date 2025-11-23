import { baseApi } from "@/redux/api/baseApi";
const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userInfo) => ({
        method: "POST",
        url: "/auth/login",
        body: userInfo,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        method: "POST",
        url: "/auth/logout",
      }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation } = authApi;

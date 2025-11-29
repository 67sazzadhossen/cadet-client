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
    changeYourPassword: builder.mutation({
      query: (payload) => ({
        method: "POST",
        url: "/auth/change-password",
        body: payload,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useChangeYourPasswordMutation,
} = authApi;

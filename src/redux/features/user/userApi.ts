import { baseApi } from "@/redux/api/baseApi";
import { TUpdateProfile } from "@/types/index.type";
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
    updateMe: builder.mutation({
      query: (payload: TUpdateProfile) => ({
        method: "PATCH",
        url: `/users/update-me`,
        body: payload,
      }),
    }),
  }),
});

export const { useGetMeQuery, useGetPublicUserQuery, useUpdateMeMutation } =
  userApi;

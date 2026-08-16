import { baseApi } from "@/redux/api/baseApi";
import { TAdmin } from "@/types/index.type";
const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAdmin: builder.mutation({
      query: (adminInfo: TAdmin) => ({
        method: "POST",
        url: "/users/create-admin",
        body: adminInfo,
      }),
    }),
    getAllAdmis: builder.query({
      query: () => ({
        method: "GET",
        url: "/admins",
      }),
    }),
  }),
});

export const { useCreateAdminMutation, useGetAllAdmisQuery } = adminApi;

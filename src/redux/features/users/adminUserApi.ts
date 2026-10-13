import { baseApi } from "@/redux/api/baseApi";

const adminUserApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAdminUser: builder.mutation({
      query: (body) => ({ method: "POST", url: "/users/admin", body }),
    }),
    getAdminUsers: builder.query({
      query: (includeDeleted = false) => ({ method: "GET", url: `/users/admin/all?includeDeleted=${includeDeleted}` }),
    }),
    updateAdminUser: builder.mutation({
      query: ({ targetId, ...body }) => ({ method: "PATCH", url: `/users/admin/${targetId}`, body }),
    }),
    deleteAdminUser: builder.mutation({ query: (id) => ({ method: "DELETE", url: `/users/admin/${id}` }) }),
    restoreAdminUser: builder.mutation({ query: (id) => ({ method: "PATCH", url: `/users/admin/${id}/restore` }) }),
    permanentlyDeleteAdminUser: builder.mutation({ query: (id) => ({ method: "DELETE", url: `/users/admin/${id}/permanent` }) }),
    resetAdminUserPassword: builder.mutation({ query: (id) => ({ method: "POST", url: `/users/admin/${id}/reset-password` }) }),
  }),
});

export const {
  useCreateAdminUserMutation,
  useGetAdminUsersQuery,
  useUpdateAdminUserMutation,
  useDeleteAdminUserMutation,
  useRestoreAdminUserMutation,
  usePermanentlyDeleteAdminUserMutation,
  useResetAdminUserPasswordMutation,
} = adminUserApi;

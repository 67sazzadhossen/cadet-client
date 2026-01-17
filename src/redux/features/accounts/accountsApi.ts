import { baseApi } from "@/redux/api/baseApi";
const accountsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createMonthlyPaymentInfo: builder.mutation({
      query: (payload) => ({
        method: "POST",
        url: `/accounts/create-monthly-fee`,
        body: payload,
      }),
    }),
    getMonthlyPaymentInfo: builder.query({
      query: () => ({
        method: "GET",
        url: `/accounts/get-monthly-fee`,
      }),
    }),
  }),
});

export const {
  useCreateMonthlyPaymentInfoMutation,
  useGetMonthlyPaymentInfoQuery,
} = accountsApi;

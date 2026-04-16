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
    getPaymentHistory: builder.query({
      query: (params) => ({
        url: "/accounts/payment-history",
        method: "GET",
        params: params, // This will add query parameters
      }),
    }),
  }),
});

export const {
  useCreateMonthlyPaymentInfoMutation,
  useGetMonthlyPaymentInfoQuery,
  useGetPaymentHistoryQuery,
} = accountsApi;

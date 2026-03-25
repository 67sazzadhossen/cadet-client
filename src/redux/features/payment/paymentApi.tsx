import { baseApi } from "@/redux/api/baseApi";
const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentInfo: builder.query({
      query: (payload) => ({
        method: "GET",
        url: `/payment/payment-info?id=${payload.id}`,
      }),
    }),
    savePaymentInfo: builder.mutation({
      query: (payload) => ({
        method: "POST",
        url: `/payment/save-payment`,
        body: payload,
      }),
    }),
    feeReports: builder.query({
      query: (params) => ({
        method: "GET",
        url: `/payment/fee-reports`,
        params: params, // এখানে params হিসেবে সব ফিল্টার চলে যাবে
      }),
    }),
    sessionFeeReports: builder.query({
      query: (params) => ({
        method: "GET",
        url: `/payment/session-fee-reports`,
        params: params, // এখানে params হিসেবে সব ফিল্টার চলে যাবে
      }),
    }),
  }),
});

export const {
  useGetPaymentInfoQuery,
  useSavePaymentInfoMutation,
  useFeeReportsQuery,
  useSessionFeeReportsQuery,
} = paymentApi;

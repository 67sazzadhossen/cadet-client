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
    createSemesterFeeInfo: builder.mutation({
      query: (payload) => ({
        method: "POST",
        url: `/accounts/create-semester-fee`,
        body: payload,
      }),
    }),
    getMonthlyPaymentInfo: builder.query({
      query: () => ({
        method: "GET",
        url: `/accounts/get-monthly-fee`,
      }),
    }),
    getSemesterFeeInfo: builder.query({
      query: () => ({
        method: "GET",
        url: `/accounts/get-semester-fee`, // আপনার ব্যাকএন্ড রাউট অনুযায়ী প্রয়োজন হলে ইউআরএল পরিবর্তন করে নিতে পারেন
      }),
    }),
    getPaymentHistory: builder.query({
      query: (params) => ({
        url: "/accounts/payment-history",
        method: "GET",
        params: params, // This will add query parameters
      }),
    }),
    getCurrentMonthPayments: builder.mutation({
      query: (payload) => ({
        url: "/overview/current-month-collection",
        method: "POST",
        body: payload, // This will add query parameters
      }),
    }),
  }),
});

export const {
  useCreateMonthlyPaymentInfoMutation,
  useGetMonthlyPaymentInfoQuery,
  useGetPaymentHistoryQuery,
  useGetCurrentMonthPaymentsMutation,
  useCreateSemesterFeeInfoMutation,
  useGetSemesterFeeInfoQuery, // নতুন কুয়েরি হুক
} = accountsApi;

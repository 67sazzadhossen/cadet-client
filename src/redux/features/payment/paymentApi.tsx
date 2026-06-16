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
        params: params,
      }),
    }),
    // 🔄 ডাটা রিফ্রেশ ট্যাগের ব্যবস্থা করা হলো
    semesterFeeReports: builder.query({
      query: (params) => ({
        method: "GET",
        url: `/payment/semester-fee-reports`,
        params: params,
      }),
      providesTags: ["SemesterPayment"], // এই ট্যাগটি ডাটা ট্র্যাক করবে
    }),
    sessionFeeReports: builder.query({
      query: (params) => ({
        method: "GET",
        url: `/payment/session-fee-reports`,
        params: params,
      }),
    }),
    // 🌟 নতুন এন্ডপয়েন্ট: সেমিস্টার পেমেন্ট সেভ করার জন্য মিউটেশন
    saveSemesterPaymentInfo: builder.mutation({
      query: (payload) => ({
        method: "POST",
        url: `/payment/save-semester-payment`, // আপনার ব্যাকএন্ড রাউট অনুযায়ী পরিবর্তন করতে পারেন
        body: payload,
      }),
      invalidatesTags: ["SemesterPayment"], // পেমেন্ট সফল হলে টেবিল অটো রিফ্রেশ হবে
    }),
  }),
});

export const {
  useGetPaymentInfoQuery,
  useSavePaymentInfoMutation,
  useFeeReportsQuery,
  useSessionFeeReportsQuery,
  useSemesterFeeReportsQuery,
  useSaveSemesterPaymentInfoMutation, // 👈 এটি এক্সপোর্ট করা হলো
} = paymentApi;

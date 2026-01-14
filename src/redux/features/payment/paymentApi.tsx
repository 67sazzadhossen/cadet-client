import { baseApi } from "@/redux/api/baseApi";
const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentInfo: builder.query({
      query: (payload) => ({
        method: "GET",
        url: `/payment/payment-info?id=${payload.id}&paymentType=${payload.paymentType}`,
      }),
    }),
    savePaymentInfo: builder.mutation({
      query: (payload) => ({
        method: "POST",
        url: `/payment/save-payment`,
        body: payload,
      }),
    }),
  }),
});

export const { useGetPaymentInfoQuery, useSavePaymentInfoMutation } =
  paymentApi;

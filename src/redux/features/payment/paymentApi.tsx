import { baseApi } from "@/redux/api/baseApi";
const paymentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentInfo: builder.mutation({
      query: (payload) => ({
        method: "POST",
        url: `/payment/payment-info`,
        body: payload,
      }),
    }),
  }),
});

export const { useGetPaymentInfoMutation } = paymentApi;

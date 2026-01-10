import { baseApi } from "@/redux/api/baseApi";
const smsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPhoneNumber: builder.query({
      query: () => ({
        method: "GET",
        url: `/sms/get-all-numbers`,
      }),
    }),
    sendSmsToParents: builder.mutation({
      query: (payload) => ({
        method: "POST",
        url: `/sms/send-sms`,
        body: payload,
      }),
    }),
  }),
});

export const { useGetAllPhoneNumberQuery, useSendSmsToParentsMutation } =
  smsApi;

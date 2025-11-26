import {
  BaseQueryApi,
  BaseQueryFn,
  DefinitionType,
  FetchArgs,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import { RootState } from "../store";
import { logout, setUser } from "../features/auth/authSlice";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: `${backendUrl}/api/v1`,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("authorization", token);
    }
    return headers;
  },
});

const baseQueryWithRefreshtoken: BaseQueryFn<
  FetchArgs,
  BaseQueryApi,
  DefinitionType
> = async (args, api, extraOptions): Promise<any> => {
  console.log("sending refresh token");
  let result = await baseQuery(args, api, extraOptions);
  // if (result.error?.status === 404) {
  //   console.log(result.error.data.message);
  // }
  if (result?.error?.status === 401 || result?.error?.status === 500) {
    const res = await fetch(`${backendUrl}/api/v1/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
    });

    const data = await res.json();
    if (data?.data?.data?.accessToken) {
      const user = (api.getState() as RootState).auth.user;
      api.dispatch(setUser({ user, accessToken: data.data.data.accessToken }));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithRefreshtoken,
  endpoints: () => ({}),
});

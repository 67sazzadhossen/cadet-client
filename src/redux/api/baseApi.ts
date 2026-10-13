/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { verifyToken } from "@/utils/verifyToken";

const rawBackendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
const backendUrl = rawBackendUrl.replace(/\/$/, "");

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

let refreshPromise: Promise<string | null> | null = null;

const getStoredRefreshToken = (getState: () => unknown): string | null => {
  try {
    const state = getState() as RootState;
    if (state?.auth?.refreshToken) {
      return state.auth.refreshToken;
    }
  } catch {
    // ignore
  }
  if (typeof document !== "undefined") {
    const match = document.cookie.match(/(?:^|;\s*)refreshToken=([^;]*)/);
    if (match) return decodeURIComponent(match[1]);
  }
  return null;
};

const baseQueryWithRefreshtoken: BaseQueryFn<
  FetchArgs,
  BaseQueryApi,
  DefinitionType
> = async (args, api, extraOptions): Promise<any> => {
  let result = await baseQuery(args, api, extraOptions);

  const url = typeof args === "string" ? args : args.url;
  const isAuthRoute =
    url?.includes("/auth/login") ||
    url?.includes("/auth/logout") ||
    url?.includes("/auth/refresh-token");

  if (result?.error?.status === 401 && !isAuthRoute) {
    if (!refreshPromise) {
      refreshPromise = (async () => {
        try {
          const refreshToken = getStoredRefreshToken(api.getState);
          const res = await fetch(`${backendUrl}/api/v1/auth/refresh-token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ refreshToken }),
          });

          if (!res.ok) {
            return null;
          }

          const data = await res.json();
          const newAccessToken =
            data?.data?.data?.accessToken || data?.data?.accessToken;

          if (newAccessToken) {
            const user = verifyToken(newAccessToken);
            const newRefreshToken =
              data?.data?.data?.refreshToken ||
              data?.data?.refreshToken ||
              refreshToken;

            api.dispatch(
              setUser({
                user,
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
              }),
            );
            return newAccessToken;
          }
        } catch (error) {
          console.error("Refresh token error:", error);
        } finally {
          refreshPromise = null;
        }
        return null;
      })();
    }

    const newAccessToken = await refreshPromise;
    if (newAccessToken) {
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
  tagTypes: ["SemesterPayment"],
  endpoints: () => ({}),
});

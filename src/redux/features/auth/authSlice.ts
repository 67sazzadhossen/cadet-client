import { RootState } from "@/redux/store";
import { createSlice } from "@reduxjs/toolkit";

type TAuthState = {
  user: null | any;
  isLoggedIn: boolean;
  token: string | null;
  refreshToken: string | null;
};

const initialState: TAuthState = {
  user: null,
  isLoggedIn: false,
  token: null,
  refreshToken: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.isLoggedIn = true;
      state.token = accessToken;
      if (refreshToken) {
        state.refreshToken = refreshToken;
      }
    },

    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.token = null;
      state.refreshToken = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;

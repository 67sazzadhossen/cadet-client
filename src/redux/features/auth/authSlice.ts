import { RootState } from "@/redux/store";
import { createSlice } from "@reduxjs/toolkit";

type TAuthState = {
  user: null | object;
  isLoggedIn: boolean;
  token: string | null;
};

const initialState: TAuthState = {
  user: null,
  isLoggedIn: false,
  token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, accessToken, needsPasswordChanged } = action.payload;
      state.user = user;
      state.isLoggedIn = true;
      state.token = accessToken;
    },

    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.token = null;
    },
  },
});

export const { setUser, logout } = authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;

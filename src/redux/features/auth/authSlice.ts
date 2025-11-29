import { RootState } from "@/redux/store";
import { createSlice } from "@reduxjs/toolkit";

type TAuthState = {
  user: null | object;
  isLoggedIn: boolean;
  token: string | null;
  needsPasswordChanged: boolean;
};

const initialState: TAuthState = {
  user: null,
  isLoggedIn: false,
  token: null,
  needsPasswordChanged: false,
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
      state.needsPasswordChanged = needsPasswordChanged;
    },

    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.token = null;
      state.needsPasswordChanged = false;
    },
  },
});

export const { setUser, logout } = authSlice.actions;

export const selectCurrentUser = (state: RootState) => state.auth.user;
export const needsPasswordChanged = (state: RootState) =>
  state.auth.needsPasswordChanged;

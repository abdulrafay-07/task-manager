import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { AuthState, LoginPayload } from "@/types/store";

const initialState: AuthState = {
   status: false,
   userData: null,
   token: null,
};

const authSlice = createSlice({
   name: "auth",
   initialState,
   reducers: {
      login: (state, action: PayloadAction<LoginPayload>) => {
         state.status = true,
         state.userData = action.payload.userData;
         state.token = action.payload.token;
         localStorage.setItem("token", action.payload.token);
      },
      logout: (state) => {
         state.status = false;
         state.userData = null;
         state.token = null;
         localStorage.removeItem('token');
      },
   },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
import { MyDataDashboard } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  userId: number | null;
  role: number | null;
  username: string | null;
  email: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  userId: null,
  username: null,
  role: null,
  email: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        username: string;
        userId: number;
        role: number;
      }>
    ) => {
      state.userId = action.payload.userId;
      state.username = action.payload.username;
      state.role = action.payload.role;
      state.isAuthenticated = true;
    },
    updateEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    updateData: (state, action: PayloadAction<MyDataDashboard>) => {
      state.username = action.payload.username;
      state.email = action.payload.email;
    },
    logout: (state) => {
      state.userId = null;
      state.username = null;
      state.role = null;
      state.isAuthenticated = false;
    },
  },
});

export const { login, logout, updateEmail, updateData } = authSlice.actions;

export default authSlice.reducer;

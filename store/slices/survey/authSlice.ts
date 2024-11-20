import { AuthSliceProps } from "@/types/survey";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: AuthSliceProps = {
  id: null,
  username: null,
  groups: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<AuthSliceProps>) => {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.groups = action.payload.groups;
    },
    signOut: (state) => {
      state.id = null;
      state.username = null;
      state.groups = [];
    },
  },
});

export const { signIn, signOut } = authSlice.actions;
export default authSlice.reducer;

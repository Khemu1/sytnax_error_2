// Importing the necessary functions from Redux Toolkit
import { configureStore } from "@reduxjs/toolkit";

// Importing reducers
import authReducer from "./slices/authSlice"; // authSlice correctly imported
import dashboardReducer from "./slices/dashboardSlice"; // Fixing the import error
import dialogReducer from "./slices/dialogSlice"; // Adding the dialogSlice

// Configure the store with the reducers
export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    dialog: dialogReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

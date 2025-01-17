import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./features/authSlice";
import { apiSlice } from "./service/apiSlice";

export const store = configureStore({
  reducer: {
    auth: authSliceReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispath = typeof store.dispatch;

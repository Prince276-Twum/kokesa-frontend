import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./features/authSlice";
import { apiSlice } from "./service/apiSlice";
import businessSetupSlice from "./features/businessSetupSlice";

export const store = configureStore({
  reducer: {
    businessSetup: businessSetupSlice.reducer,
    auth: authSliceReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),

  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

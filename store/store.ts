import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // Defaults to localStorage
import { persistReducer, persistStore } from "redux-persist";
import businessSetupSlice from "./features/businessSetupSlice";
import authSliceReducer from "./features/authSlice";
import { apiSlice } from "./service/apiSlice";

// Redux Persist Configuration for `businessSetupSlice`
const businessPersistConfig = {
  key: "businessSetup",
  storage,
};

const persistedBusinessSetupReducer = persistReducer(
  businessPersistConfig,
  businessSetupSlice.reducer
);

export const store = configureStore({
  reducer: {
    businessSetup: persistedBusinessSetupReducer, // Persisted reducer
    auth: authSliceReducer, // Not persisted
    [apiSlice.reducerPath]: apiSlice.reducer, // Not persisted
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(apiSlice.middleware),

  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

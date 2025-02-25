import { createSlice } from "@reduxjs/toolkit";

interface initialStateProps {
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: initialStateProps = {
  isAuthenticated: true,
  isLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state) {
      state.isAuthenticated = true;
    },
    logout(state) {
      state.isAuthenticated = false;
    },
    finishInitialLoad(state) {
      state.isLoading = false;
    },
  },
});

export const { setAuth, logout, finishInitialLoad } = authSlice.actions;
export default authSlice.reducer;

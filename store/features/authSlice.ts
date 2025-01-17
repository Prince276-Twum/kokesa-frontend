import { createSlice } from "@reduxjs/toolkit";

interface initialStateProps {
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: initialStateProps = {
  isAuthenticated: false,
  isLoading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth(state) {
      console.log("wow");
      state.isAuthenticated = true;
    },
    logout(state) {
      state.isAuthenticated = false;
    },
    finishInitialLoad(state) {
      state.isLoading = true;
    },
  },
});

export const { setAuth, logout, finishInitialLoad } = authSlice.actions;
export default authSlice.reducer;

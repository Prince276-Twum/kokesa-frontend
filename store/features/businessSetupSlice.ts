import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface initialStateType {
  isSetupComplete: boolean;
  currentStep: number;
  isLoading: boolean;
}

const initialState: initialStateType = {
  isSetupComplete: false,
  currentStep: 0,
  isLoading: true,
};

const businessSetupSlice = createSlice({
  name: "businessSetup",
  initialState,
  reducers: {
    sethBusinessComplete(state, actions: PayloadAction<boolean>) {
      state.isSetupComplete = actions.payload;
    },

    setCurrentStep(state, actions: PayloadAction<number>) {
      state.currentStep = actions.payload;
    },

    sethFinishBusinessLoading(state) {
      state.isLoading = false;
    },
  },
});

export default businessSetupSlice;
export const {
  setCurrentStep,
  sethBusinessComplete,
  sethFinishBusinessLoading,
} = businessSetupSlice.actions;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface initialStateType {
  isSetupComplete: boolean;
  currentStep: number;
  isLoading: boolean;
}

const initialState: initialStateType = {
  isSetupComplete: false,
  currentStep: 1,
  isLoading: true,
};

const businessSetupSlice = createSlice({
  name: "businessSetup",
  initialState,
  reducers: {
    setBusinessComplete(state, actions: PayloadAction<boolean>) {
      state.isSetupComplete = actions.payload;
    },

    setCurrentStep(state, actions: PayloadAction<number>) {
      state.currentStep = actions.payload;
    },

    setFinishBusinessLoading(state) {
      state.isLoading = false;
    },
  },
});

export default businessSetupSlice;
export const { setCurrentStep, setBusinessComplete, setFinishBusinessLoading } =
  businessSetupSlice.actions;

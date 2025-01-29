import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BusinessDetail {
  businessName: string;
  userName: string;
  phoneNumber: string | undefined;
}

interface initialStateType {
  isSetupComplete: boolean;
  currentStep: number;
  isLoading: boolean;
  detail: BusinessDetail;
}

const initialState: initialStateType = {
  isSetupComplete: false,
  currentStep: 1,
  isLoading: true,
  detail: { businessName: "", userName: "", phoneNumber: "" },
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

    setBusinessDetail(state, actions: PayloadAction<BusinessDetail>) {
      state.detail = actions.payload;
    },
  },
});

export default businessSetupSlice;
export const {
  setCurrentStep,
  setBusinessComplete,
  setFinishBusinessLoading,
  setBusinessDetail,
} = businessSetupSlice.actions;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BusinessDetail {
  businessName: string;
  userName: string;
  phoneNumber: string | undefined;
}

interface Service {
  name: string;
  type: { value: string; label: string } | null; // Allow null for clearing
  groupLabel: string;
  duration: { hours: number; minutes: number }; // Service duration
  price: number;
}
interface initialStateType {
  isSetupComplete: boolean;
  currentStep: number;
  isLoading: boolean;
  detail: BusinessDetail;
  businessLocationOption: string;
  services: { editingIndex: null | number; service: Service[] };
}

const initialState: initialStateType = {
  isSetupComplete: false,
  currentStep: 1,
  isLoading: true,
  businessLocationOption: "",
  detail: { businessName: "", userName: "", phoneNumber: "" },
  services: { editingIndex: null, service: [] },
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

    setBusinsessLocationOption(state, actions: PayloadAction<string>) {
      state.businessLocationOption = actions.payload;
    },

    addBusinessService(state, actions: PayloadAction<Service[]>) {
      state.services.service = actions.payload;
    },

    updateBusinessService(state, actions: PayloadAction<Service>) {
      if (state.services.editingIndex === null) return;
      state.services.service[state.services.editingIndex] = actions.payload;
    },
    addServiceEditIndex(state, actions: PayloadAction<number | null>) {
      state.services.editingIndex = actions.payload;
    },
  },
});

export default businessSetupSlice;
export const {
  updateBusinessService,
  addServiceEditIndex,
  addBusinessService,
  setBusinsessLocationOption,
  setCurrentStep,
  setBusinessComplete,
  setFinishBusinessLoading,
  setBusinessDetail,
} = businessSetupSlice.actions;

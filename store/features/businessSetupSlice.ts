import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BusinessDetail {
  businessName: string;
  userName: string;
  phoneNumber: string | undefined;
  businessLocationOption?: string;
}
interface Break {
  start: string;
  end: string;
}

export interface WorkingHours {
  Monday: { enabled: boolean; start: string; end: string; breaks: Break[] };
  Tuesday: { enabled: boolean; start: string; end: string; breaks: [] };
  Wednesday: { enabled: boolean; start: string; end: string; breaks: [] };
  Thursday: { enabled: boolean; start: string; end: string; breaks: [] };
  Friday: { enabled: boolean; start: string; end: string; breaks: [] };
  Saturday: { enabled: boolean; start: string; end: string; breaks: [] };
  Sunday: { enabled: boolean; start: string; end: string; breaks: [] };
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
  businessInfo: BusinessDetail;
  services: { editingIndex: null | number; service: Service[] };
  workingHours: WorkingHours;
}

const initialState: initialStateType = {
  isSetupComplete: false,
  currentStep: 1,
  isLoading: true,
  businessInfo: {
    businessName: "",
    userName: "",
    phoneNumber: "",
    businessLocationOption: "",
  },
  services: { editingIndex: null, service: [] },
  workingHours: {
    Monday: { enabled: true, start: "09:20", end: "17:40" },
    Tuesday: { enabled: true, start: "09:00", end: "17:00" },
    Wednesday: { enabled: true, start: "09:00", end: "17:00" },
    Thursday: { enabled: true, start: "09:00", end: "17:00" },
    Friday: { enabled: true, start: "09:00", end: "17:00" },
    Saturday: { enabled: true, start: "09:00", end: "17:00" },
    Sunday: { enabled: false, start: "09:00", end: "17:00" },
  },
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
      state.businessInfo = actions.payload;
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
  setCurrentStep,
  setBusinessComplete,
  setFinishBusinessLoading,
  setBusinessDetail,
} = businessSetupSlice.actions;

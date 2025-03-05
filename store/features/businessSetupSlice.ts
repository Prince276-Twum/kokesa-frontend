import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BusinessDetail {
  businessName: string;
  userName: string;
  phoneNumber: string | undefined;
  businessLocationOption?: string;
  businessType?: string;
}

export interface BreakTime {
  start: string;
  end: string;
}

export interface UpdateWorkingHourPayload {
  day: string;
  start: string;
  end: string;
  breaks: BreakTime[];
}

export type WorkingHoursType = {
  day_of_week:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  enabled: boolean;
  start_time: string;
  end_time: string;
  breaks: BreakTime[];
};

interface Service {
  id: number | null;
  name: string;
  type: { value: string; label: string } | null; // Allow null for clearing
  groupLabel: string;
  duration: { hours: number; minutes: number }; // Service duration
  price: number;
  startAt: boolean;
}

interface BusinessAddress {
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  longitude: number | null;
  latitude: number | null;
}

interface AdditionalInformationType {
  teamSize?: string;
  activationDate?: string;
  activationOption?: string;
  isLaunched?: boolean;
}

interface travelFeeAndDistanceType {
  feeType: string;
  travelFee: number;
  distance: number;
  travelPolicy: string;
  currencyCode?: string | undefined;
}

interface initialStateType {
  businessAddress: BusinessAddress;
  isSetupComplete: boolean;
  currentStep: number;
  isLoading: boolean;
  businessInfo: BusinessDetail;
  services: { editingIndex: null | number; service: Service[] };
  workingHours: WorkingHoursType[] | null;
  additionalInformation: AdditionalInformationType | null;
  travelFeeAndDistance: travelFeeAndDistanceType | null;
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
    businessType: "",
  },
  services: { editingIndex: null, service: [] },
  businessAddress: {
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    longitude: null,
    latitude: null,
  },
  workingHours: null,
  additionalInformation: null,
  travelFeeAndDistance: null,
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
      const data = { ...state.businessInfo, ...actions.payload };
      state.businessInfo = data;
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

    setWorkingHours: (state, action: PayloadAction<WorkingHoursType[]>) => {
      state.workingHours = action.payload;
    },

    updateWorkingHour: (
      state,
      action: PayloadAction<UpdateWorkingHourPayload>
    ) => {
      if (state.workingHours === null) return;

      const { day, start, end, breaks } = action.payload;
      const workingHour = state.workingHours.find(
        (hour) => hour.day_of_week === day
      );
      if (workingHour) {
        workingHour.start_time = start;
        workingHour.end_time = end;
        workingHour.breaks = breaks;
      }
    },

    updateMultipleWorkingHours: (
      state,
      action: PayloadAction<UpdateWorkingHourPayload[]>
    ) => {
      if (state.workingHours === null) return;

      const updates = action.payload;

      updates.forEach((update) => {
        if (state.workingHours === null) return;

        const dayIndex = state.workingHours.findIndex(
          (day) => day.day_of_week === update.day
        );

        if (dayIndex !== -1 && state.workingHours[dayIndex].enabled) {
          state.workingHours[dayIndex].start_time = update.start;
          state.workingHours[dayIndex].end_time = update.end;
          state.workingHours[dayIndex].breaks = update.breaks;
        }
      });
    },

    toggleDay: (state, action: PayloadAction<string>) => {
      if (state.workingHours === null) return;

      const day = state.workingHours.find(
        (hour) => hour.day_of_week === action.payload
      );
      if (day) {
        day.enabled = !day.enabled;
      }
    },

    setBusinessAddress: (state, action: PayloadAction<BusinessAddress>) => {
      state.businessAddress = action.payload;
    },

    setAdditionalInformation: (
      state,
      action: PayloadAction<AdditionalInformationType>
    ) => {
      const data = { ...state.additionalInformation, ...action.payload };
      state.additionalInformation = data;
    },

    setTravelFeeAndDistance: (
      state,
      action: PayloadAction<travelFeeAndDistanceType>
    ) => {
      state.travelFeeAndDistance = action.payload;
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
  updateWorkingHour,
  updateMultipleWorkingHours,
  setBusinessAddress,
  toggleDay,
  setAdditionalInformation,
  setTravelFeeAndDistance,
  setWorkingHours, // Added new action
} = businessSetupSlice.actions;

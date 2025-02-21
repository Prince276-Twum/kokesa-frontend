import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface BusinessDetail {
  businessName: string;
  userName: string;
  phoneNumber: string | undefined;
  businessLocationOption?: string;
}
interface BreakTime {
  start: string;
  end: string;
}

interface UpdateWorkingHourPayload {
  day: string;
  start: string;
  end: string;
  breaks: BreakTime[];
}

type WorkingHoursType = {
  day_of_week:
    | "Monday"
    | "Tuesday"
    | "Wednesday"
    | "Thursday"
    | "Friday"
    | "Saturday"
    | "Sunday";
  enabled: boolean;
  start_time: string; // Format: "HH:mm"
  end_time: string; // Format: "HH:mm"
  breaks: BreakTime[];
};

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
  workingHours: WorkingHoursType[];
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
  workingHours: [
    {
      day_of_week: "Monday",
      enabled: true,
      start_time: "09:20",
      end_time: "17:40",
      breaks: [],
    },
    {
      day_of_week: "Tuesday",
      enabled: true,
      start_time: "09:00",
      end_time: "17:00",
      breaks: [],
    },
    {
      day_of_week: "Wednesday",
      enabled: true,
      start_time: "09:00",
      end_time: "17:00",
      breaks: [],
    },
    {
      day_of_week: "Thursday",
      enabled: true,
      start_time: "09:00",
      end_time: "17:00",
      breaks: [],
    },
    {
      day_of_week: "Friday",
      enabled: true,
      start_time: "09:00",
      end_time: "17:00",
      breaks: [],
    },
    {
      day_of_week: "Saturday",
      enabled: true,
      start_time: "09:00",
      end_time: "17:00",
      breaks: [],
    },
    {
      day_of_week: "Sunday",
      enabled: false,
      start_time: "09:00",
      end_time: "17:00",
      breaks: [],
    },
  ],
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

    updateWorkingHour: (
      state,
      action: PayloadAction<UpdateWorkingHourPayload>
    ) => {
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

    toggleDay: (state, action: PayloadAction<string>) => {
      console.log(action.payload);
      const day = state.workingHours.find(
        (hour) => hour.day_of_week === action.payload
      );
      if (day) {
        day.enabled = !day.enabled;
      }
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
  toggleDay,
} = businessSetupSlice.actions;

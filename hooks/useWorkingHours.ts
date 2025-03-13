import { useEffect } from "react";
import { useRetrieveBusinessWorkingHoursQuery } from "@/store/features/businessApiSetupSlice";
import {
  setWorkingHours,
  type WorkingHoursType as StoreWorkingHoursType,
} from "@/store/features/businessSetupSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

// Define the API working hours type
interface WorkingHourFromAPI {
  day_of_week: string;
  start_time: string;
  end_time: string;
  enabled: boolean;
  breaks: {
    start: string;
    end: string;
  }[];
}

// Define day of week type to match the store's type
type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

/**
 * Custom hook to handle working hours data fetching and processing
 * @returns {Object} Working hours data and utility functions
 */
export const useWorkingHours = () => {
  const dispatch = useAppDispatch();
  const { workingHours } = useAppSelector((store) => store.businessSetup);

  const {
    data: businessWorkingHours,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useRetrieveBusinessWorkingHoursQuery(undefined);

  // Helper function to convert time from "HH:MM:SS" to "HH:MM"
  const formatTime = (time: string): string => {
    if (time.split(":").length === 3) {
      return time.substring(0, 5);
    }
    return time;
  };

  // Helper function to validate day of week
  const validateDayOfWeek = (day: string): DayOfWeek => {
    const validDays: DayOfWeek[] = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    if (validDays.includes(day as DayOfWeek)) {
      return day as DayOfWeek;
    }

    const capitalizedDay =
      day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
    return validDays.includes(capitalizedDay as DayOfWeek)
      ? (capitalizedDay as DayOfWeek)
      : "Monday";
  };

  // Process API data and update Redux store
  useEffect(() => {
    if (
      !isLoading &&
      !isFetching &&
      businessWorkingHours &&
      businessWorkingHours.length > 0
    ) {
      // Format working hours from the API
      const formattedWorkingHours: StoreWorkingHoursType[] =
        businessWorkingHours.map((workingHour: WorkingHourFromAPI) => ({
          day_of_week: validateDayOfWeek(workingHour.day_of_week),
          start_time: formatTime(workingHour.start_time),
          end_time: formatTime(workingHour.end_time),
          enabled: workingHour.enabled,
          breaks: workingHour.breaks
            ? workingHour.breaks.map((breakItem) => ({
                start: formatTime(breakItem.start),
                end: formatTime(breakItem.end),
              }))
            : [],
        }));

      // Update Redux store
      dispatch(setWorkingHours(formattedWorkingHours));
    }
  }, [businessWorkingHours, isLoading, isFetching, dispatch]);

  return {
    workingHours,
    isLoading: isLoading || isFetching,
    isError,
    error,
    refetch,
  };
};

export default useWorkingHours;

import {
  useRetrieveBusinessWorkingHoursQuery,
  useRetrieveAdditionalInfoQuery,
  useRetrieveBusinessQuery,
  useRetrieveServiceQuery,
  useRetrieveTravelAndDistanceQuery,
} from "@/store/features/businessApiSetupSlice";
import {
  setCurrentStep,
  setBusinessComplete,
  setFinishBusinessLoading,
  setBusinessDetail,
  setBusinessAddress,
  setAdditionalInformation,
  setTravelFeeAndDistance,
  addBusinessService,
  updateMultipleWorkingHours,
  toggleDay,
  setWorkingHours,
  type WorkingHoursType,
  type BreakTime,
} from "@/store/features/businessSetupSlice";
import { useAppDispatch } from "@/store/hooks";
import { useEffect, useState, useRef } from "react";
import { type BusinessResponse } from "@/store/features/businessApiSetupSlice";
import useCurrencyInfo from "@/hooks/useCurrencyInfo";

interface VerifyResponse {
  data: BusinessResponse[];
  error: { status: string; data: { detail: string } };
  isError: boolean;
  isLoading: boolean;
}

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

function useVerifyBusinessComplete() {
  const dispatch = useAppDispatch();
  const { currencySymbol, currencyCode } = useCurrencyInfo();

  // Add a ref to track first load
  const isFirstLoad = useRef(true);

  console.log("useVerifyBusinessComplete hook running");

  const [businessProfileProcessed, setBusinessProfileProcessed] =
    useState(false);
  const [additionalInfoProcessed, setAdditionalInfoProcessed] = useState(false);
  const [travelDataProcessed, setTravelDataProcessed] = useState(false);
  const [serviceDataProcessed, setServiceDataProcessed] = useState(false);
  const [workingHoursProcessed, setWorkingHoursProcessed] = useState(false);

  const {
    data: businessProfileData,
    error: verificationError,
    isError: isVerificationError,
    isLoading: isVerificationLoading,
  } = useRetrieveBusinessQuery<VerifyResponse>();

  const {
    data: businessWorkingHours,
    isLoading: isBusinessWorkingHoursLoading,
    isFetching: isBusinessWorkingHoursFetching,
    isError: isBusinessWorkingHoursError,
    error: businessWorkingHoursError,
    refetch: refetchBusinessWorkingHours,
  } = useRetrieveBusinessWorkingHoursQuery(undefined);

  const {
    data: businessAdditionalDetails,
    error: additionalInfoError,
    isError: isAdditionalInfoError,
    isLoading: isAdditionalInfoLoading,
  } = useRetrieveAdditionalInfoQuery(undefined);

  const {
    data: serviceData,
    isError: isServiceError,
    error: serviceError,
    isLoading: isServiceLoading,
  } = useRetrieveServiceQuery(undefined);

  const {
    data: travelDistanceData,
    isError: isTravelError,
    isLoading: isTravelLoading,
  } = useRetrieveTravelAndDistanceQuery(undefined);

  useEffect(() => {
    // Skip if still loading or if already processed
    if (isVerificationLoading || businessProfileProcessed) return;

    console.log("Business profile useEffect running");

    if (businessProfileData && businessProfileData.length > 0) {
      const businessData = businessProfileData[0];
      if (businessData.is_business_complete) {
        dispatch(setBusinessComplete(true));
      } else {
        dispatch(setBusinessComplete(false));
      }

      dispatch(
        setBusinessDetail({
          businessName: businessData.business_name,
          userName: businessData.user_name,
          phoneNumber: businessData.phone_number,
          businessLocationOption: businessData.service_location,
          businessType: businessData.business_type,
        })
      );

      if (businessData.business_address.length > 0) {
        const addressData = businessData.business_address[0];
        dispatch(
          setBusinessAddress({
            address: addressData.street_address,
            city: addressData.city,
            state: addressData.state_or_region,
            country: addressData.country,
            postalCode: addressData.postal_code,
            longitude: Number(addressData.longitude),
            latitude: Number(addressData.latitude),
          })
        );
      } else {
        dispatch(
          setBusinessAddress({
            address: "",
            city: "",
            state: "",
            country: "",
            postalCode: "",
            longitude: null,
            latitude: null,
          })
        );
      }
    } else {
      dispatch(
        setBusinessDetail({
          businessName: "",
          userName: "",
          phoneNumber: "",
          businessLocationOption: "",
          businessType: "",
        })
      );
      dispatch(setBusinessComplete(false));

      dispatch(
        setBusinessAddress({
          address: "",
          city: "",
          state: "",
          country: "",
          postalCode: "",
          longitude: null,
          latitude: null,
        })
      );
    }

    if (isVerificationError) {
      console.log(verificationError);
      if (
        verificationError?.data?.detail ===
        "No BusinessProfile matches the given query."
      ) {
        dispatch(setBusinessComplete(false));
      }
    }

    setBusinessProfileProcessed(true);
  }, [
    businessProfileData,
    verificationError,
    isVerificationError,
    isVerificationLoading,
    businessProfileProcessed,
    dispatch,
  ]);

  useEffect(() => {
    if (isAdditionalInfoLoading || additionalInfoProcessed) return;

    console.log("Additional info useEffect running");

    if (businessAdditionalDetails && businessAdditionalDetails.length > 0) {
      const additionalData = businessAdditionalDetails[0];

      dispatch(
        setAdditionalInformation({
          teamSize: additionalData.team_size,
          activationDate: additionalData.activation_date,
          activationOption: additionalData.activation_option,
          isLaunched: additionalData.is_launched,
        })
      );
    } else {
      dispatch(
        setAdditionalInformation({
          teamSize: "",
          activationDate: "",
          activationOption: "",
          isLaunched: false,
        })
      );
    }

    if (isAdditionalInfoError) {
      console.log(additionalInfoError);
    }

    setAdditionalInfoProcessed(true);
  }, [
    businessAdditionalDetails,
    additionalInfoError,
    isAdditionalInfoError,
    isAdditionalInfoLoading,
    additionalInfoProcessed,
    dispatch,
  ]);

  useEffect(() => {
    if (isTravelLoading || travelDataProcessed) return;

    console.log("Travel data useEffect running");

    if (travelDistanceData && travelDistanceData.length > 0) {
      const travelData = travelDistanceData[0];

      dispatch(
        setTravelFeeAndDistance({
          distance: travelData.travel_distance,
          travelFee: travelData.travel_fee,
          travelPolicy: travelData.travel_policy,
          feeType: travelData.fee_type,
        })
      );
    } else {
      dispatch(
        setTravelFeeAndDistance({
          distance: 15,
          travelFee: 0,
          travelPolicy: "",
          feeType: "",
        })
      );
    }

    if (isTravelError) {
      console.log("Error fetching travel and distance data");
    }

    setTravelDataProcessed(true);
  }, [
    travelDistanceData,
    isTravelError,
    isTravelLoading,
    travelDataProcessed,
    dispatch,
  ]);

  useEffect(() => {
    if (isServiceLoading || serviceDataProcessed) return;

    console.log("Service data useEffect running");

    if (serviceData && serviceData.length > 0) {
      interface Service {
        id?: number;
        service_name: string;
        type: string;
        type_label: string;
        service_group: string;
        duration_hours: string;
        duration_minutes: string;
        duration: { hours: number; minutes: number };
        price: number;
        is_starting_price: boolean;
      }
      const services = serviceData.map((service: Service) => ({
        id: service.id,
        name: service.service_name,
        type: { value: service.type, label: service.type_label },
        groupLabel: service.service_group,
        duration: {
          hours: Number(service.duration_hours),
          minutes: Number(service.duration_minutes),
        },
        price: service.price,
        startAt: service.is_starting_price,
      }));

      console.log("Services formatted:", services);

      dispatch(addBusinessService(services));

      console.log("Service data loaded successfully");
    } else {
      dispatch(addBusinessService([]));

      console.log("No service data available");
    }

    if (isServiceError) {
      console.log("Error fetching service data:", serviceError);
    }

    setServiceDataProcessed(true);
  }, [
    serviceData,
    isServiceError,
    serviceError,
    isServiceLoading,
    serviceDataProcessed,
    dispatch,
  ]);

  useEffect(() => {
    if (
      isBusinessWorkingHoursLoading ||
      isBusinessWorkingHoursFetching ||
      workingHoursProcessed
    )
      return;

    console.log("Working hours useEffect running");

    if (businessWorkingHours && businessWorkingHours.length > 0) {
      // Helper function to convert time from "HH:MM:SS" to "HH:MM"
      const formatTime = (time: string): string => {
        // Check if the time includes seconds (HH:MM:SS format)
        if (time.split(":").length === 3) {
          return time.substring(0, 5); // Take only the first 5 characters (HH:MM)
        }
        return time;
      };

      // Create properly formatted working hours data from API response
      const formattedWorkingHours: WorkingHoursType[] =
        businessWorkingHours.map((workingHour: WorkingHourFromAPI) => ({
          day_of_week:
            workingHour.day_of_week as WorkingHoursType["day_of_week"],
          start_time: formatTime(workingHour.start_time),
          end_time: formatTime(workingHour.end_time),
          enabled: workingHour.enabled,
          breaks: workingHour.breaks
            ? workingHour.breaks.map((breakItem: BreakTime) => ({
                start: formatTime(breakItem.start),
                end: formatTime(breakItem.end),
              }))
            : [],
        }));

      // Use the imported action directly
      dispatch(setWorkingHours(formattedWorkingHours));

      console.log(
        "Working hours data loaded successfully:",
        formattedWorkingHours
      );
    } else {
      console.log("No working hours data available");
    }

    if (isBusinessWorkingHoursError) {
      console.log(
        "Error fetching working hours data:",
        businessWorkingHoursError
      );
    }

    setWorkingHoursProcessed(true);
  }, [
    businessWorkingHours,
    isBusinessWorkingHoursError,
    businessWorkingHoursError,
    isBusinessWorkingHoursLoading,
    isBusinessWorkingHoursFetching,
    workingHoursProcessed,
    dispatch,
  ]);

  useEffect(() => {
    if (
      businessProfileProcessed &&
      additionalInfoProcessed &&
      travelDataProcessed &&
      serviceDataProcessed &&
      workingHoursProcessed
    ) {
      dispatch(setFinishBusinessLoading());
      console.log("All business data loaded successfully");
    }
  }, [
    businessProfileProcessed,
    additionalInfoProcessed,
    travelDataProcessed,
    serviceDataProcessed,
    workingHoursProcessed,
    dispatch,
  ]);

  // Cleanup function when component unmounts
  useEffect(() => {
    return () => {
      console.log("Cleaning up useVerifyBusinessComplete");
      // Clean up logic if needed
    };
  }, []);

  return;
}

export default useVerifyBusinessComplete;

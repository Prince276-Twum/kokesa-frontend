import {
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
} from "@/store/features/businessSetupSlice";
import { useAppDispatch } from "@/store/hooks";
import { useEffect, useState } from "react";
import { type BusinessResponse } from "@/store/features/businessApiSetupSlice";
import useCurrencyInfo from "@/hooks/useCurrencyInfo";

interface VerifyResponse {
  data: BusinessResponse[];
  error: { status: string; data: { detail: string } };
  isError: boolean;
  isLoading: boolean;
}

function useVerifyBusinessComplete() {
  const dispatch = useAppDispatch();
  const { currencySymbol, currencyCode } = useCurrencyInfo();

  const [businessProfileProcessed, setBusinessProfileProcessed] =
    useState(false);
  const [additionalInfoProcessed, setAdditionalInfoProcessed] = useState(false);
  const [travelDataProcessed, setTravelDataProcessed] = useState(false);
  const [serviceDataProcessed, setServiceDataProcessed] = useState(false);

  const {
    data: businessProfileData,
    error: verificationError,
    isError: isVerificationError,
    isLoading: isVerificationLoading,
  } = useRetrieveBusinessQuery<VerifyResponse>();

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
    if (isVerificationLoading) return;

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
    dispatch,
  ]);

  useEffect(() => {
    if (isAdditionalInfoLoading) return;

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
    dispatch,
  ]);

  useEffect(() => {
    if (isTravelLoading) return;

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
  }, [travelDistanceData, isTravelError, isTravelLoading, dispatch]);

  useEffect(() => {
    if (isServiceLoading) return;

    if (serviceData && serviceData.length > 0) {
      interface Service {
        id?: number;
        service_name: string;
        type: string;
        type_label: string;
        service_group: string;
        duration_hours: string;
        duration_minutes: string;
        duration: { hours: number; minutes: number }; // Service duration
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

      console.log(services);

      dispatch(addBusinessService(services));

      console.log("Service data loaded:", services);
    } else {
      dispatch(addBusinessService([]));

      console.log("No service data available");
    }

    if (isServiceError) {
      console.log("Error fetching service data:", serviceError);
    }

    setServiceDataProcessed(true);
  }, [serviceData, isServiceError, serviceError, isServiceLoading, dispatch]);

  useEffect(() => {
    if (
      businessProfileProcessed &&
      additionalInfoProcessed &&
      travelDataProcessed &&
      serviceDataProcessed
    ) {
      dispatch(setFinishBusinessLoading());
      console.log("All business data loaded successfully");
    }
  }, [
    businessProfileProcessed,
    additionalInfoProcessed,
    travelDataProcessed,
    serviceDataProcessed,
    dispatch,
  ]);

  return;
}

export default useVerifyBusinessComplete;

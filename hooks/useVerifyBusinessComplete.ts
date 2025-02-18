import { useRetrieveBusinessQuery } from "@/store/features/businessApiSetupSlice";
import {
  setCurrentStep,
  setBusinessComplete,
  setFinishBusinessLoading,
  setBusinessDetail,
} from "@/store/features/businessSetupSlice";
import { useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";
import { type BusinessResponse } from "@/store/features/businessApiSetupSlice";

interface VerifyRespose {
  data: BusinessResponse[];
  error: { status: string; data: { detail: string } };
  isError: boolean;
  isLoading: boolean;
}

function useVerifyBusinessComplete() {
  const { data, error, isError, isLoading } =
    useRetrieveBusinessQuery<VerifyRespose>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isLoading) return;

    if (data && data.length > 0) {
      console.log(data);
      const businessData = data[0];
      if (businessData.is_business_complete) {
        dispatch(setBusinessComplete(true));
      } else if (!businessData.is_business_complete) {
        dispatch(setBusinessComplete(false));

        console.log(data);

        dispatch(
          setBusinessDetail({
            businessName: businessData.business_name,
            userName: businessData.user_name,
            phoneNumber: businessData.phone_number,
            businessLocationOption: businessData.service_location,
          })
        );
        dispatch(setCurrentStep(businessData.current_step));
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
    }

    if (isError) {
      console.log(error);
      if (
        error?.data?.detail === "No BusinessProfile matches the given query."
      ) {
        dispatch(setBusinessComplete(false));
      }
    }

    dispatch(setFinishBusinessLoading());
  }, [data, error, isError, isLoading]);

  return;
}

export default useVerifyBusinessComplete;

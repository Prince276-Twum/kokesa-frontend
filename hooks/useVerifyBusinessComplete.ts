import { useRetrieveBusinessQuery } from "@/store/features/businessApiSetupSlice";
import {
  setCurrentStep,
  setBusinessComplete,
  setFinishBusinessLoading,
  setBusinsessLocationOption,
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
        dispatch(setCurrentStep(businessData.current_step));
      }

      dispatch(setBusinsessLocationOption(businessData.service_location));
    } else {
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

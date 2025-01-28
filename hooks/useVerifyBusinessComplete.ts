import { useGetBusinessQuery } from "@/store/features/businessApiSetupSlice";
import {
  setCurrentStep,
  setBusinessComplete,
  setFinishBusinessLoading,
} from "@/store/features/businessSetupSlice";
import { useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";
import { type BusinessResponse } from "@/store/features/businessApiSetupSlice";

interface VerifyRespose {
  data: BusinessResponse;
  error: { status: string; data: { detail: string } };
  isError: boolean;
  isLoading: boolean;
}

function useVerifyBusinessComplete() {
  const { data, error, isError, isLoading } =
    useGetBusinessQuery<VerifyRespose>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isLoading) return;

    if (data) {
      if (data.is_business_complete) {
        dispatch(setBusinessComplete(true));
      } else if (!data.is_business_complete) {
        dispatch(setBusinessComplete(false));
        dispatch(setCurrentStep(data.current_step));
      }
    }

    if (isError) {
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

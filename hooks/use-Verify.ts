import React, { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { useVerifyMutation } from "@/store/features/authApiSlice";
import { finishInitialLoad, setAuth } from "@/store/features/authSlice";

function useVerify() {
  const [verify] = useVerifyMutation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    verify(undefined)
      .unwrap()
      .then(() => {
        dispatch(setAuth());
      })
      .finally(() => {
        dispatch(finishInitialLoad());
      });
  }, []);
}

export default useVerify;

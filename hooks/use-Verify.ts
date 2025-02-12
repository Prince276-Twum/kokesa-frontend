import React, { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import {
  useRefreshMutation,
  useVerifyMutation,
} from "@/store/features/authApiSlice";
import { finishInitialLoad, setAuth, logout } from "@/store/features/authSlice";

function useVerify() {
  const [verify] = useVerifyMutation();
  const [refresh] = useRefreshMutation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    verify(undefined)
      .unwrap()
      .then(() => {
        dispatch(setAuth());
      })
      .catch(() => {
        refresh(undefined)
          .unwrap()
          .then(() => {
            dispatch(setAuth());
          })
          .catch(() => {
            dispatch(logout());
          });
      })
      .finally(() => {
        dispatch(finishInitialLoad());
      });
  }, [dispatch, verify, refresh]);

  return null;
}

export default useVerify;

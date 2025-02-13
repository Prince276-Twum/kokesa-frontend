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
    const checkAuth = async () => {
      try {
        console.log("Running verification...");
        // Step 1: Attempt to verify the token
        await verify(undefined).unwrap();
        dispatch(setAuth()); // Token is valid
      } catch (verifyError) {
        console.log("Verify failed, trying refresh...");
        try {
          // Step 2: If verify fails, attempt to refresh the token
          const refreshResponse = await refresh(undefined).unwrap();
          if (refreshResponse) {
            console.log("is in");
            dispatch(setAuth()); // Token refreshed successfully
            // Step 3: Re-run verify after refreshing
          }
        } catch (refreshError) {
          console.log("Refresh failed, logging out...");
          // Step 4: If both verify and refresh fail, log out the user
          dispatch(logout());
        }
      } finally {
        dispatch(finishInitialLoad()); // Mark the initial load as finished
      }
    };

    checkAuth();
  }, [dispatch, verify, refresh]);

  return null;
}

export default useVerify;

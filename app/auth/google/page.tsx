"use client";

import { useGoogleAuthMutation } from "@/store/features/authApiSlice";
import { setAuth } from "@/store/features/authSlice";
import { useAppDispatch } from "@/store/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, Suspense } from "react";
import { toast } from "react-toastify";

function LoadingFallback() {
  return <p>Loading...</p>;
}

function GoogleAuthPage() {
  const [googleSignIn] = useGoogleAuthMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const effectRan = useRef(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");

    if (state && code && !effectRan.current) {
      googleSignIn({ state, code })
        .unwrap()
        .then(() => {
          dispatch(setAuth());
          router.push("/dashboard");
          toast.success("Logged in successfully!");
        })
        .catch((error) => {
          const status = (error as { status?: number })?.status || 500;
          if (status === 404) {
            router.push("/404");
          } else if (status === 500) {
            router.push("/500");
          } else {
            router.push("/error");
          }
          toast.error("Login failed. Please try again.");
        })
        .finally(() => {
          effectRan.current = true;
        });
    }
  }, [googleSignIn, dispatch, router, searchParams]);

  return <></>;
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <GoogleAuthPage />
    </Suspense>
  );
}

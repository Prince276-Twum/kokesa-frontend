"use client";
import { useAppSelector } from "@/store/hooks";
import { useRouter } from "next/navigation";
import React, { ReactNode, useEffect } from "react";
import { ClipLoader } from "react-spinners";

interface Props {
  children: ReactNode;
}

function RequireBusinessComplete({ children }: Props) {
  const router = useRouter();
  const { isSetupComplete, isLoading, currentStep } = useAppSelector(
    (store) => store.businessSetup
  );

  console.log(isLoading, isSetupComplete, currentStep);

  useEffect(() => {
    if (!isLoading && !isSetupComplete) {
      console.log("is ao");
      router.push("/business/onboarding/details");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-5 ">
        <ClipLoader size={50} />
      </div>
    );
  }

  if (!isSetupComplete) {
    return (
      <div className="flex justify-center py-5 ">
        <ClipLoader size={50} />
      </div>
    );
  }

  console.log("wow");
  return <>{children}</>;
}

export default RequireBusinessComplete;

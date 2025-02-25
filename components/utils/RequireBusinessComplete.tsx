"use client";
import { useAppSelector } from "@/store/hooks";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";
import { ClipLoader } from "react-spinners";

interface Props {
  children: ReactNode;
}

function RequireBusinessComplete({ children }: Props) {
  const { isSetupComplete, isLoading, currentStep } = useAppSelector(
    (store) => store.businessSetup
  );
  console.log(isLoading, isSetupComplete, currentStep);
  if (isLoading) {
    return (
      <div className="flex justify-center py-5 ">
        <ClipLoader size={50} />{" "}
      </div>
    );
  }

  if (!isSetupComplete) {
    switch (currentStep) {
      case 1:
        redirect("/business/onboarding/details");

      case 2:
        redirect("/business/onboarding/category");

      default:
        redirect("/business/onboarding/details");
    }
  }

  return <>{children}</>;
}

export default RequireBusinessComplete;

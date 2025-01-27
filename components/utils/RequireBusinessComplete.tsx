"use client";
import { useAppSelector } from "@/store/hooks";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

function RequireBusinessComplete({ children }: Props) {
  const { isSetupComplete, isLoading, currentStep } = useAppSelector(
    (store) => store.businessSetup
  );

  if (isLoading) {
    return <>spinner</>;
  }

  if (!isSetupComplete) {
    switch (currentStep) {
      case 1:
        redirect("/business-setup/details");

      case 2:
        redirect("/business-setup/confirm-number");

      default:
        redirect("business-setup/details");
    }
  }

  return <>{children}</>;
}

export default RequireBusinessComplete;

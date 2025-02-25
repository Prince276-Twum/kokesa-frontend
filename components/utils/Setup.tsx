"use client";
import useVerify from "@/hooks/use-Verify";
import React from "react";
import useVerifyBusinessComplete from "@/hooks/useVerifyBusinessComplete";

function Setup() {
  useVerify();
  useVerifyBusinessComplete();
  return <></>;
}

export default Setup;

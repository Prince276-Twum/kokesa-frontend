"use client";
import useVerify from "@/hooks/use-Verify";
import useVerifyBusinessComplete from "@/hooks/useVerifyBusinessComplete";
import React from "react";

function Setup() {
  useVerify();
  useVerifyBusinessComplete();
  return <></>;
}

export default Setup;

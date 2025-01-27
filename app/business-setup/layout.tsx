"use client";
import RequireAuth from "@/components/utils/RequireAuth";
import { useAppSelector } from "@/store/hooks";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

function Layout({ children }: { children: ReactNode }) {
  const { isSetupComplete } = useAppSelector((store) => store.businessSetup);

  if (isSetupComplete) {
    redirect("/dashboard");
  }
  return (
    <div>
      <RequireAuth>{children}</RequireAuth>
    </div>
  );
}

export default Layout;

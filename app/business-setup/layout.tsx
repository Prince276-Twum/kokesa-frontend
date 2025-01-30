"use client";
import RequireAuth from "@/components/utils/RequireAuth";
import useVerifyBusinessComplete from "@/hooks/useVerifyBusinessComplete";
import React, { ReactNode } from "react";

function Layout({ children }: { children: ReactNode }) {
  useVerifyBusinessComplete();
  return (
    <div>
      <RequireAuth>{children}</RequireAuth>
    </div>
  );
}

export default Layout;

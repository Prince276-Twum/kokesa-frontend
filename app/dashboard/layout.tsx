"use client";

import RequireAuth from "@/components/utils/RequireAuth";
import RequireBusinessComplete from "@/components/utils/RequireBusinessComplete";
import useVerifyBusinessComplete from "@/hooks/useVerifyBusinessComplete";
import React, { type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

function Layout({ children }: Props) {
  useVerifyBusinessComplete();

  return (
    <>
      <RequireAuth>
        <RequireBusinessComplete>{children}</RequireBusinessComplete>
      </RequireAuth>
    </>
  );
}

export default Layout;

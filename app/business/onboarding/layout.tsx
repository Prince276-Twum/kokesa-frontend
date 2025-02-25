"use client";
import RequireAuth from "@/components/utils/RequireAuth";
import React, { ReactNode } from "react";

function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <RequireAuth>{children}</RequireAuth>
    </div>
  );
}

export default Layout;
